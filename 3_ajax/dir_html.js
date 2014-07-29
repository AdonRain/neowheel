var fs=require('fs');

exports.render=function (req,res,pathToFile){
    fs.readdir(pathToFile,function (err,files){
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.write('<ul id="dir_list">');
        for(var i in files){
            res.write('<li><a href="'+
                (req.url+'/'+files[i]).replace(/\/\//g,'/')+
                '">'+files[i]+'</a><a class="del" href="javascript:;">&times;</a></li>');
        }
        res.write('</ul>');
        res.end(
            '<form id="file_form" method="post" action="" enctype="multipart/form-data">' +
            '<input id="upload_file" type="file" multiple="multiple" name="upload" />' +
            '<input id="btn" type="submit" value="提交" />' +
            '</form>' +
            '<script src="js/jquery.js"></script>' +
            '<script src="js/ajax.js"></script>'
        );
    });
}
