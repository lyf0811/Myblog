var url = "http://127.0.0.1:5502/";
$(document).ready(function () {    //token判定登录状态
    if (localStorage.token != undefined) {
        let token = { "token": localStorage.token }
        $.get(url + 'user', token, function (result) {
            if(result.msg=='已登录'){

                $('#useraccount').val(result.userid)
                $('#username').val(result.username)
                $('#useremail').val(result.useremail)
                if(result.userhead!='0'){
                     $('#header').css('background-image','url("../articlepage/comment/headimg/'+result.userhead+'")')
                }
                if(result.usersign!='0'){
                    $('#usersign').val(result.usersign)
                }
            }
            else{
                
            }
        })
    }
})
$("#useraccount").attr("onfocus", "this.blur()");
$("#useraccount").css("background", "rgb(224, 224, 224)");
$("#useraccount").css("cursor", "not-allowed");
$('#edit').click(function(){
    $("#username,#useremail,#usersign").removeAttr("readonly")
    $("#cancel,#editheadimg,#save").css('display','block')
    $("#edit").css('display','none')
  

})
$('#save').click(function(){


    if ($('#headfile').prop('files').length >= 1){
    let headfile = document.getElementById('headfile').files[0];
    let formData = new FormData();
    formData.append("userheadimg", headfile);
    $.ajax({
        type: 'POST',
        url: url + 'userheadimg',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success:function(result){
            let postdata={
                "ishead":'1',
                "useraccount":$('#useraccount').val(),
                "username": $('#username').val(),
                "useremail": $('#useremail').val(),
                "usersign": $('#usersign').val(),
                "userhead":result.filePath,
            }
           $.post(url+'useredit',postdata,function(){

           })
        }
     })
     }
     else{
        let postdata={
            "ishead":'0',
            "useraccount":$('#useraccount').val(),
            "username": $('#username').val(),
            "useremail": $('#useremail').val(),
            "usersign": $('#usersign').val(),
        }
        $.post(url+'useredit',postdata,function(){
            location.reload()

        })

     }
    // $.post(url+'userheadimg',formData,function(result){
    //     console.log(result)
    // })
    $("#save,#cancel,#editheadimg").css('display','none')
    $("#edit").css('display','block')

})
$('#cancel').click(function(){
    $("#save,#cancel,#editheadimg").css('display','none')
    $("#edit").css('display','block')
    $("#username,#useremail,#usersign").attr("readonly",'true')
})
$('#headfile').change(function(){
    let headfile = document.getElementById('headfile').files[0];
    let reader = new FileReader();
    reader.readAsDataURL(headfile);
    reader.onload = function (reader) {
        document.getElementById('header').style.backgroundImage = 'url("' + reader.target.result + '")';
    };
})
