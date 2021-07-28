var backgroundurl = "http://127.0.0.1:5502/";
var formData = new FormData();
var files=[]
function f(){
var file =document.getElementById('picturefile').files[0];
files.push(file)
formData.append("avatar", file);
// formData.append("avatar", file);
//     $.ajax({
//         type: 'POST',   
//         url: backgroundurl + 'articleimg',
//         data: formData,
//         async: false,
//         cache: false,
//         contentType: false,
//         processData: false,
//         success: function (result) {
            
//         console.log(result.filePath)
//         var htmlcontent = '<img src="' + result.filePath + '" alt=picture style="height:50%;">';
//         $('text').html(htmlcontent)
//         document.execCommand('insertHTML', false, htmlcontent);
//         newimg=document.querySelectorAll('.newimg')
//         newimg[0].src=result.filePath
           
//         }
//     });
console.log(files)
}


function g(){
 
    $.ajax({
        type: 'POST',   
        url: backgroundurl + 'articleimg',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (result) {
            
       
        var htmlcontent = '<img src="' + result.filePath + '" alt=picture style="height:50%;">';
        $('text').html(htmlcontent)
        document.execCommand('insertHTML', false, htmlcontent);

        newimg=document.querySelectorAll('.newimg')
        newimg[0].src=result.filePath[0]
        newimg[1].src=result.filePath[1]
           
        }
    });
}

$('.sizebtn').click(function(){
    this.parentElement.parentElement.style.width=this.id
})

$('.pannel').mouseover(function(){
    this.children[0].setAttribute('style','visibility:visible')
})
$('.pannel').mouseleave(function(){
    this.children[0].setAttribute('style','visibility:hidden')
})