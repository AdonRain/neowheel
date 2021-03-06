var http=require('http');
var fs=require('fs');
var dirit=require('./isdir').dirit;

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
                dirit(req,res,pathToFile);
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

