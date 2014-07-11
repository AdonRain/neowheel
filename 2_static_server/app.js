var http=require('http');
var fs=require('fs');
var formidable=require('formidable');
var sys=require('sys');

http.createServer(function (req,res){
    if(req.url==='/favicon.ico')return;

    var pathToFile=('./www'+req.url+'/').replace(/\/\//g,'/');
    console.log(pathToFile);

    fs.exists(pathToFile,function (exists){
        if(!exists){
            res.writeHead(404,{"Content-Type":"text/plain"});
            res.end('err 404'); 
        }else{
            var idx=req.url.indexOf('.');

            if(idx===-1){
                if(req.method.toLowerCase()==='post'){
                    var form=new formidable.IncomingForm();

                    form.uploadDir="./tmp";
                    form.parse(req,function (err,fields,files){
                        fs.rename(files.upload.path,pathToFile+files.upload.name,function (){
                            ls();
                        });
                    });
                }else{
                    ls();
                }

                function ls(){
                    fs.readdir(pathToFile,function (err,files){
                        res.writeHead(200,{"Content-Type":"text/html"});
                        for(var i in files){
                            res.write('<a href="'+req.url+files[i]+'">'+files[i]+'</a><br>');
                        }
                        res.end('<form method="post" action="" enctype="multipart/form-data">' +
                                '<input type="file" name="upload" />' +
                                '<input type="submit" />' +
                                '</form>');
                    });
                }
            }else{
                var ext=req.url.slice(idx+1);
                var mime={
                    "html": "text/html",
                    "js": "text/javascript",
                    "css": "text/css",
                    "xml": "text/xml",
                    "txt": "text/plain",
                    "ico": "image/x-icon",
                    "svg": "image/svg+xml",
                    "gif": "image/gif",
                    "png": "image/png",
                    "jpg": "image/jpeg",
                    "jpeg": "image/jpeg",
                    "tiff": "image/tiff",
                    "json": "application/json",
                    "pdf": "application/pdf",
                    "swf": "application/x-shockwave-flash",
                    "wav": "audio/x-wav",
                    "wma": "audio/x-ms-wma",
                    "wmv": "video/x-ms-wmv"
                };

                fs.readFile(pathToFile,function (err,data){
                    res.writeHead(200,{"Content-Type":mime[ext]||"text/plain"});
                    res.write(data);
                    res.end();
                });
            }
        }
    });
}).listen(3000,function (){
    console.log('port 3000');
});

