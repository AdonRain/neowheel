$('.del').css('margin-left','50px')
.on('click',function (){
    var fileName=$(this).prev().html();
    $.post(window.location.href,{toDel:fileName});
});
