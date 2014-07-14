$('.del').css('margin-left','50px')
.on('click',function (){
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
