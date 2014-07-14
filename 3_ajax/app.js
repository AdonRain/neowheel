var http=require('http');
var fs=require('fs');
var formidable=require('formidable');

http.createServer(function (req,res){
    if(req.url==='/favicon.ico')return;
    
    var pathToFile=('./www'+req.url+'/').replace(/\/\//g,'/');
    console.log('请求：'+pathToFile);

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
                    form.multiples=true;

                    form.parse(req,function (err,fields,files){
                        if(fields.toDel){
                            if(fields.toDel.indexOf('.')===-1){
                                res.end('禁止删除目录');
                                console.log('禁止删除目录');
                            }else{
                                fs.unlink(pathToFile+fields.toDel,function (){
                                    res.end();
                                    console.log('文件删除成功');
                                });
                            }
                        }else if(files.upload){
                            if(files.upload.length){
                                for(var i=0;i<files.upload.length;i++){
                                    fs.renameSync(files.upload[i].path,pathToFile+files.upload[i].name);
                                }
                            }else{
                                fs.renameSync(files.upload.path,pathToFile+files.upload.name);
                            }
                            
                            ls();
                            console.log('文件添加成功');
                        }
                    });

                }else{
                    ls();
                }

                function ls(){
                    fs.readdir(pathToFile,function (err,files){
                        res.writeHead(200,{
                            "Content-Type":"text/html;charset=utf-8"});
                        for(var i in files){
                            res.write('<p><a href="'+(req.url+'/'+files[i]).replace(/\/\//g,'/')+
                                '">'+files[i]+'</a><a class="del" href="javascript:;">&times;</a></p>');
                        }
                        res.end('<form id="file_form" method="post" action="" enctype="multipart/form-data">' +
                                '<input type="file" multiple="multiple" name="upload" />' +
                                '<input id="btn" type="submit" value="提交" />' +
                                '</form>' +
                                '<script src="js/jquery.js"></script>' +
                                '<script src="js/ajax.js"></script>'
                                );
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

