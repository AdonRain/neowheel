var fs=require('fs');
//引入formidable模块
var formidable=require('formidable');
//调用我们写的isdir模块，并把它上面的dir方法赋值给变量dir
var render=require('./dir_html').render;

exports.dirit=function (req,res,pathToFile){
    //由于formidable只在请求方法为post时才使用(get直接处理url即可)，所以我们首先写一个if-else分支
    if(req.method.toLowerCase()==='post'){
        //formidable的详细用法请参考官方文档：https://www.npmjs.org/package/formidable
        //依照文档上的说明，我们将formidable.IncomingForm()实例化后的对象赋值给form
        var form=new formidable.IncomingForm();
        //formidable会将用户上传的文件暂存到一个文件夹，默认是在“C:\Windows\Temp\”下，不过我们可以自由设置
        form.uploadDir='./tmp';
        //设置后，“ajax”目录下的“tmp”就变成了缓存文件夹，之后我们只需要把其中的数据写入到目标文件夹即可
        //按照API里的指示，我们调用form.parse()方法
        form.parse(req,function (err,fields,files){
            //err是出错信息，node.js回调函数的第一个参数默认是err
            //fields是post的表单信息，files是上传的文件信息
            //首先判断post信息是删除指令还是上传指令：
            //如果是删除指令，则fields.toDel为真；
            //如果是删除指令，则files.upload为真
            if(fields.toDel){
                //在判断出事删除指令后，还要看删除的是文件夹还是文件：
                //如果是文件夹，则返回一个“禁止删除”的信息；
                //如果是文件，则直接删除
                if(fields.toDel.indexOf('.')===-1){
                    res.end('禁止删除目录');
                    //向前端返回信息，并终止ajax通信，没有这一句post请求会一直处于post状态并最终失败。
                }else{
                    fs.unlink(pathToFile+fields.toDel,function (){
                        res.end();
                    });
                    //fs.unlink是node.js删除文件的方法，细节可参考官方API:
                    //http://www.nodejs.org/api/fs.html#fs_fs_unlink_path_callback
                }

            }else if(files.upload){
                
                fs.rename(files.upload.path,pathToFile+files.upload.name,function (){
                //将同步形式换成异步形式，以便把返回的数据放在回掉函数里
                    res.end(
                        '<li><a href="'+(req.url+'/'+files.upload.name).replace(/\/\//g,'/')+'">'
                        +files.upload.name+'</a><a class="del" href="javascript:;">&times;</a></li>'
                    );
                    //将新插入的html以字符串形式返回给客户端
                });

                //这行代码的作用，就是将刚才缓存在tmp中的文件重命名到目标文件夹。
                //console.log(files.upload.path);
                //console.log(files.upload.name);
                //想深入研究的，可以把files.upload.path和files.upload.name输出到控制台看一下。
                //缓存在tmp中的文件没有扩展名，但实际上是可以用vim之类的编辑器正常打开的。
                //重命名完之后，我们还需要向客户端返回一个页面，所以需要把“else”里的代码复制一份过来
      
            }
        });
    }else{
        render(req,res,pathToFile); //用自定义模块替代原来的代码
    }
}
