//ajax删除文件
$('#dir_list').on('click','.del',function (){
    var fileName=$(this).prev().html();
    var $this=$(this);
    $.post('',{toDel:fileName},function (data){
        if(data){
            alert(data);
        }else{
            $this.parent().remove();
        }
    });
});
//ajax上传文件
if(window.FormData){
//如果浏览器支持FormData，就用ajax的方法上传文件；如果不支持，就用原生的submit方法
    $('#btn').on('click',function (){
        var xhr=new XMLHttpRequest();
        var formData=new FormData();
        var action=window.location.href;

　　　　formData.append('upload',document.getElementById('upload_file').files[0]);
　　　　xhr.open('POST',action);
　　　　xhr.send(formData);

        xhr.onreadystatechange=function (){
		    if(xhr.readyState==4){
			    if(xhr.status==200){
                    $('#dir_list').append($(xhr.responseText));
			    }else{
				    alert(xhr.status);
			    }
		    }	
    	}

        return false;
        //禁用submit默认提交动作
    });
}
