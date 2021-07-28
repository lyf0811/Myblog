var lastEditRange;
var personalinformation
var nowtarget
var articleimgnum = 0
var codenum;
var isinit;
var articlepicture = new FormData();
var imgfile = []
var mytext = document.getElementById('mytext');
var colorboard = document.getElementById('colorboard');
var htmlurl = location.href;
var commentjson = []
var articleurl = "http://127.0.0.1:5502/articleserver";
var backgroundurl = "http://127.0.0.1:5502/";
var nowurl="http://127.0.0.1:5500/"
/* 页面初始化
    1.加载字体格式表
    2.加载字体大小表
    3.设置指针悬停按钮时显示的功能提示
    4.设置tab键和backspace键的特殊功能，包括tab实现缩进，backspace不会将所有内容删除
    5.
*/


function pageinit() {
    lastEditRange = document.createRange();
    codenum = 0;
    isinit = false;
    document.onkeydown = function (e) {
        var ev = e || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        //获取作为判断条件的事件类型 
        var vReadOnly = obj.readOnly;
        var vDisabled = obj.disabled;
        //处理undefined值情况 
        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
        vDisabled = (vDisabled == undefined) ? true : vDisabled;
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的， 
        //并且readOnly属性为true或disabled属性为true的，则退格键失效 
        var flag1 = ev.keyCode == 9;
        var flag2 = ev.keyCode == 8 && (mytext.innerHTML == "<p><br></p>" || mytext.innerText == null);
        //var flag3 = ev.keyCode == 8 && window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.nodeName=="XMP"&&window.getSelection().getRangeAt(0).commonAncestorContainer.
        if (flag2 || flag1)
            return false;
    };
    lastEditRange.collapse(true);
    lastEditRange.setStart(mytext.firstChild.firstChild, 0);
    lastEditRange.setEnd(mytext.firstChild.firstChild, 0);
    mytext.addEventListener('keydown', function (e) {
        if (e.keyCode == 9) {
            var txt = document.createTextNode('\xa0\xa0\xa0\xa0');
            lastEditRange.insertNode(txt);
            mytext.focus();
            var range = document.createRange();
            range.setStart(txt, txt.length);
            range.setEnd(txt, txt.length);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            lastEditRange.setStart(txt, txt.length);
            lastEditRange.setEnd(txt, txt.length);
        }
    }, false);
    mytext.scrollTop = 100;
    var buttonlist = document.getElementsByClassName('menubutton');
    document.getElementById('list1').onmouseout = function () {
        document.getElementById('tips').style.visibility = 'hidden';
    };
    for (var i = 0; i < buttonlist.length; i++) {
        var offsetleft = buttonlist[i].offsetLeft;
        var tip = document.getElementById('tips');
        var tipname = document.getElementById('tipsname');
        buttonlist[i].onmouseover = function (event) {
            tip.style.visibility = 'visible';
            tipname.innerText = event.currentTarget.name;
            tip.style.fontSize = '20px';
            tip.style.left = event.currentTarget.offsetLeft + 15 - event.currentTarget.name.length * 20 / 2 + 'px';
            tip.style.top = event.currentTarget.offsetTop - 45 + 'px';
        };
    }
    mytext.onclick = function () {
        lastEditRange = window.getSelection().getRangeAt(0);
        console.log(lastEditRange);
        colorboard.style.display = 'none';
        document.getElementById('createtable').style.display = 'none';
        document.getElementById('insertcode').style.display = 'none';
    };
    $(document).ready(function () {
        $('#backgroundOpacity').val("50%");
        $.getJSON('../src/data.json', function (json) {
            for (var i = 0; i < json.fontname.length; i++) {
                var str = "<option>" + json.fontname[i] + "</option>";
                $('#fontstyle').append(str);
            }
            for (var i = 0; i < json.fontsize.length; i++) {
                var num = "<option>" + json.fontsize[i] + "</option>";
                $('#fontsize').append(num);
            }
        });
    });
    $("#musicbutton").click(function () {
        $("#musiccontent").slideToggle();
    });
    $('#wangyimusic').click(function () {
        $("#localplayer").css("display", "none");
        $("#wangyiplayer").slideToggle();
    });
    $('#localmusic').click(function () {
        $("#wangyiplayer").css("display", "none");
        $("#localplayer").slideToggle();
    });
    $("#changemusicbutton").click(function () {
        $("#changemusic").slideToggle();
    });
    $("#changeconfirm").click(function () {
        var url = "//music.163.com/outchain/player?type=2&id=" + $('#musicid').val() + "&auto=1&height=66";
        $("#changemusic").slideToggle();
        $('#wangyiyun').attr('src', url);
    });

    $('body').click(function (e) {
        if (e.currentTarget.className != 'articleimg') {
            $('.picmenu').css('display', 'none')
        }

    })

    $('.sizebtn').click(function (e) {

        e.stopPropagation()
        nowtarget.style.width = this.id
        $('.picmenu').css({ 'display': 'flex', 'left': nowtarget.offsetLeft, 'top': nowtarget.offsetTop })

    })
    $('.deletebtn').click(function (e) {
        nowtarget.parentNode.removeChild(nowtarget)
    })
    $('.smallbtn').click(function (e) {
        e.stopPropagation()
        let percent = nowtarget.style.width
        percent = percent.replace("%", "")
        percent -= 5
        if (percent <= 20) {
            return
        }
        percent += '%'
        nowtarget.style.width = percent
        $('.picmenu').css({ 'display': 'flex', 'left': nowtarget.offsetLeft, 'top': nowtarget.offsetTop })
    })
    $('.largebtn').click(function (e) {
        e.stopPropagation()
        let percent = nowtarget.style.width
        percent = percent.replace("%", "")
        percent = parseInt(percent)
        if (percent >= 100) {
            return
        }
        percent += 5
        percent += '%'
        nowtarget.style.width = percent
        $('.picmenu').css({ 'display': 'flex', 'left': nowtarget.offsetLeft, 'top': nowtarget.offsetTop })
    })
    $('.reset').click(function () {
        $('.reviewercomment').html('')
    })


}
/*

    实现所有menu中按钮功能的函数

*/
function change(name, args, args2) {
    if (args === void 0) { args = null; }
    if (args2 === void 0) { args2 = null; }
    mytext.focus();
    var space = "<p><br></p>";
    switch (name) {
        case 'code':
            document.getElementById('insertcode').style.display = 'block';
            document.getElementById('insertcode').style.left = document.body.clientWidth / 2 - 320 + "px";
            break;
        case 'insertcode':
            var a = '<div id="code' + codenum + '"></div>' + space;
            var codecontent = '<pre><code class="code"><xmp>' + args + '</xmp></code></pre>';
            var range = window.getSelection().getRangeAt(0);
            range.setStart(lastEditRange.startContainer, lastEditRange.startOffset);
            range.setEnd(lastEditRange.startContainer, lastEditRange.endOffset);
            document.execCommand('insertHTML', false, a);
            document.getElementById("code" + codenum.toString()).innerHTML = codecontent;
            document.getElementById('insertcode').style.display = 'none';
            codenum++;
            break;
        case 'hiliteColor':
            colorboard.style.display = 'block';
            colorboard.className = 'hiliteColor';
            break;
        case 'foreColor':
            colorboard.style.display = 'block';
            colorboard.className = 'foreColor';
            break;
        case 'table':
            document.getElementById('createtable').style.display = 'block';
            document.getElementById('createtable').style.left = document.getElementById('table').offsetLeft - 100 + 'px';
            break;
        case 'inserttable':
            mytext.focus();
            var tablerow = "";
            tablerow += '<tr style="background-color:gainsboro;height:50px">';
            for (var j = 0; j < args2; j++) {
                tablerow += '<td></td>';
            }
            tablerow += '</tr>';
            if (args > 1) {
                for (var i = 0; i < args - 1; i++) {
                    tablerow += '<tr style="height:50px">';
                    for (var j = 0; j < args2; j++) {
                        tablerow += '<td></td>';
                    }
                    tablerow += '</tr>';
                }
            }
            if (lastEditRange.startContainer != undefined) {
                var range = window.getSelection().getRangeAt(0);
                range.setStart(lastEditRange.startContainer, lastEditRange.startOffset);
                range.setEnd(lastEditRange.startContainer, lastEditRange.endOffset);
            }
            var tablecontent = '<table border="1" width="100%" cellpadding="0"cellspacing="0">' + tablerow
                + '</table>' + space;
            document.execCommand('insertHTML', false, tablecontent);
            document.execCommand('enableInlineTableEditing', false, 'true');
            document.getElementById('createtable').style.display = 'none';
            break;
        case 'insert': {
            var file;
            switch (args) {
                case 'picture':
                    file = document.getElementById('picturefile').files[0];
                    imgfile.push(file)
                    break;
                case 'video':
                    file = document.getElementById('videofile').files[0];
                    break;
                case 'music':
                    file = document.getElementById('musicfile').files[0];
                    break;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (reader) {
                switch (args) {
                    case 'picture':
                        var htmlcontent = '<img class="articleimg" id="' + articleimgnum + '" src="' + reader.target.result + '" alt=picture style="width:100%;">';
                        articleimgnum++
                        document.execCommand('insertHTML', false, htmlcontent);
                        imgbind()
                        break;
                    case 'video':
                        var mp4content = '<source src="' + reader.target.result + '" type="video/mp4"/>';
                        var oggcontent = '<source src="' + reader.target.result + '" type="video/ogg"/>';
                        var avicontent = '<source src="' + reader.target.result + '" type="video/avi"/>';
                        var mpegcontent = '<source src="' + reader.target.result + '" type="video/mpeg"/>';
                        var movcontent = '<source src="' + reader.target.result + '" type="video/mov"/>';
                        var htmlcontent = '<video height="50%" controls="controls"> ' + mp4content + oggcontent + avicontent + mpegcontent + movcontent + ' </video>';
                        document.execCommand('insertHTML', false, htmlcontent);
                        break;
                    case 'music':
                        document.getElementById('music').src = reader.target.result;
                        break;
                }
            };
            break;
        }
        default:
            {
                document.execCommand(name, false, args);
                mytext.focus();
            }
    }
    mytext.focus();

}






function changeBackgroundOpacity(num) {
    document.getElementById('text').style.backgroundColor = "rgba(255,255,255," + num / 100 + ")";
    document.getElementById('backgroundOpacity').value = document.getElementById('opacityRange').value + "%";
}
function changeBackgroundImg() {
    var backgroundfile = document.getElementById('backgroundfile').files[0];
    var reader = new FileReader();
    reader.readAsDataURL(backgroundfile);
    reader.onload = function (reader) {
        document.getElementById('background').style.backgroundImage = 'url("' + reader.target.result + '")';
    };
}
function pagePrint() {
    var printDataHtml = document.getElementById('text').innerHTML;
    var pageHtml = document.body.innerHTML;
    document.body.innerHTML = printDataHtml;
    window.print();
    document.body.innerHTML = pageHtml;
    //  刷新页面
}
pageinit();
$(document).ready(function () {
    var d = new Date();
    //使用正则表达式获取url中的参数
    function getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //匹配目标参数 
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    var urlData = getUrlParam('page');
    if (urlData == null) {    //新博客
        $('#background').css('background-image', 'url("./articlepage/img/girl.jpg")');
        $('#articlesave').click(function () {


            if (imgfile.length > 0) {
                for (let i = 0; i < document.querySelectorAll('.articleimg').length; i++) {
                    articlepicture.append("articleimg", imgfile[document.querySelectorAll('.articleimg')[i].id])
                }
                $.ajax({
                    type: 'POST',
                    url: backgroundurl + 'articleimg',
                    data: articlepicture,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        for (let i = 0; i < document.querySelectorAll('.articleimg').length; i++) {
                            document.querySelectorAll('.articleimg')[i].src = result.filePath[i]
                        }
                    }
                })
            }





            var txt = encodeURIComponent(document.getElementById('mytext').innerHTML)
            var title = $('p')[0].innerText;
            var summary = $('p')[1].innerText.substring(0, 40);
            var date = d.getTime()
            if ($('#backgroundfile').prop('files').length >= 1) {
                var file = document.getElementById("backgroundfile").files[0];
                var formData = new FormData();
                formData.append("backgroundimg", file);
                $.ajax({
                    type: 'POST',
                    url: backgroundurl + 'backgroundimg',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        var postdata = {
                            'isnewarticle': "1",
                            'date': date,
                            'title': title,
                            "text": txt,
                            'imgurl': result.filePath,
                            'summary': summary
                        };
                        $.ajax({
                            type: 'POST',
                            url: articleurl,
                            async: true,
                            data: postdata,
                            dataType: 'text',
                            success: function (e) {
                                $(location).attr('href', htmlurl + '?page=' + e + ',' + result.filePath);
                            }
                        });
                    }
                });
            }
            else {
                var postdata = {
                    'isnewarticle': "1",
                    'title': title,
                    'date': date,
                    "text": txt,
                    'imgurl': "girl.jpg",
                    'summary': summary
                };
                $.ajax({
                    type: 'POST',
                    url: articleurl,
                    async: true,
                    data: postdata,
                    dataType: 'text',
                    success: function (e) {
                        $(location).attr('href', htmlurl + '?page=' + e + ',' + "girl.jpg");
                    }
                });
            }
        });
    }

    else {         //已有博客
        let urldata = urlData.split(',');

        let txtdata = './articlepage/txt/' + urldata[0] + '.txt'
        let imgdata = './articlepage/img/' + urldata[1]

        $.getJSON('./articlepage/comment/content/' + urldata[0] + '.json', function (result) {

            for (let i in result) {
                commentjson.push(result[i])
                commentcreate(result[i])

            }


        })
        $('.commitcomment').click(function () {
            let insertdata = {}
            insertdata.id = $('#reviewerid').val()
            insertdata.name = $('#reviewername').val()
            insertdata.email = $('#revieweremail').val()
            if(personalinformation!=undefined){
                insertdata.head=personalinformation.userhead
            }
            else{
                insertdata.head="0"
            }
            insertdata.time = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getDate().toString() + ' ' + d.getHours().toString() + ":" + d.getMinutes().toString()
            insertdata.txt = $('.reviewercomment').html()
            commentjson.push(insertdata)
            commentjson = JSON.stringify(commentjson)

            let data = {
                "comment": commentjson,
                "commentjsonsrc": urldata[0]
            }
            $.post(backgroundurl + 'makecomment', data, function (res) {
                console.log(res)
            })

        })

        $('#mytext').load(txtdata, function () {
            imgbind()
        });
        $('#background').css('background-image', 'url("' + imgdata + '")');


        $('#articlesave').click(function () {

            if (imgfile.length > 0) {
                for (let i = 0; i < document.querySelectorAll('.articleimg').length; i++) {
                    if (document.querySelectorAll('.articleimg')[i].id != "") {
                        articlepicture.append("articleimg", imgfile[document.querySelectorAll('.articleimg')[i].id])
                    }

                }
                $.ajax({
                    type: 'POST',
                    url: backgroundurl + 'articleimg',
                    data: articlepicture,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        let filenum = 0
                        for (let i = 0; i < document.querySelectorAll('.articleimg').length; i++) {
                            if (document.querySelectorAll('.articleimg')[i].id != "") {
                                document.querySelectorAll('.articleimg')[i].src = result.filePath[filenum]
                                filenum++
                                document.querySelectorAll('.articleimg')[i].removeAttribute('id')
                            }

                        }
                    }
                })

            }


            var txt = encodeURIComponent(document.getElementById('mytext').innerHTML)
            var title = $('p')[0].innerText;
            var summary = $('p')[1].innerText.substring(0, 40);


            if ($('#backgroundfile').prop('files').length >= 1) {
                var file = document.getElementById("backgroundfile").files[0];
                var formData = new FormData();
                formData.append("backgroundimg", file);
                $.ajax({
                    type: 'POST',
                    url: backgroundurl + 'backgroundimg',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        $(location).attr('href', nowurl+'MyMarkDown.html?page=' + urldata[0] + ',' + result.filePath);
                        var postdata = {
                            'isnewarticle': "0",
                            'title': title,
                            "saveurl": urldata[0],
                            "text": txt,
                            'imgurl': result.filePath,
                            'summary': summary
                        };
                        $.post(articleurl, postdata, function () {
                        });
                    }
                });
            }
            else {
                var postdata = {
                    'isnewarticle': "0",
                    'title': title,
                    "saveurl": urldata[0],
                    "text": txt,
                    'imgurl': urldata[1],
                    'summary': summary
                };
                $.post(articleurl, postdata, function () {
                    location.reload()
                });
            }
        });

        $('#delete').click(function () {
            var postdata = {
                'isdelete': '1',
                'saveurl': urldata[0],
                'imgurl': urldata[1],
            }
            $.post(articleurl, postdata, function () {
                $(location).attr('href', './mainpage.html');
            })
        })
    }



});



$('#back').click(function () {
    $(location).attr('href', './mainpage.html');
});

$('.pannel').mouseover(function () {
    this.children[0].setAttribute('style', 'visibility:visible')
})
$('.pannel').mouseleave(function () {
    this.children[0].setAttribute('style', 'visibility:hidden')
})
function imgbind() {
    $('.articleimg').click(function (e) {
        e.stopPropagation()
        nowtarget = e.currentTarget
        $('.picmenu').css({ 'display': 'flex', 'left': e.currentTarget.offsetLeft, 'top': e.currentTarget.offsetTop })

    })
}

setInterval(function () {
    lastEditRange = window.getSelection().getRangeAt(0);
}, 50)
// setInterval(function(){
//     var txt=encodeURIComponent(document.getElementById('mytext').innerHTML)
//     console.log(txt)
// },3000)







function commentcreate(comment) {
    let containner = document.querySelector('.comment')
    let commentcell = document.createElement('div')
    commentcell.className = 'commentcell'
    let commentheader = document.createElement('div')
    commentheader.className = 'commentheader'
    let commentimg = document.createElement('div')
    commentimg.className = 'commentimg'
    let img = document.createElement('img')
    if(comment.head=='0'){
     img.src = './src/icon/默认头像.png'

    }
    else{
    img.src = './articlepage/comment/headimg/'+comment.head
    }
    let commentname = document.createElement('div')
    commentname.className = 'commentname'
    let commenttime = document.createElement('div')
    commenttime.className = 'commenttime'
    let hr = document.createElement('hr')
    let commentcontent = document.createElement('div')
    commentcontent.className = 'commentcontent'
    commentimg.appendChild(img)
    commentname.innerHTML = comment.name
    commenttime.innerHTML = comment.time
    commentcontent.innerHTML = comment.txt
    commentheader.appendChild(commentimg)
    commentheader.appendChild(commentname)
    commentheader.appendChild(commenttime)
    commentcell.appendChild(commentheader)
    commentcell.appendChild(hr)
    commentcell.appendChild(commentcontent)
    containner.appendChild(commentcell)
}




//https://api.bilibili.com/x/space/acc/info?mid=25337670



$(document).ready(function () {    //token判定登录状态
    if (localStorage.token != undefined) {
        // console.log(decode(localStorage.token))
        let token = { "token": localStorage.token }
        $.get(backgroundurl + 'user', token, function (result) {
            personalinformation=result
            if(result.msg=='已登录'){
                if (result.isadmin == '1') {
                    $('.menu').css('display', 'block')
                    $('.bottom').css('display', 'block')
                    $('.mytext').attr('contenteditable', 'true')
                }
                else{
                }
                $('#reviewerid').val(result.userid)
                $('#reviewername').val(result.username)
                $('#revieweremail').val(result.useremail)
                $('#reviewerhead').css('background-image','url("../articlepage/comment/headimg/'+result.userhead+'")')
                
            }
            else{
                
            }
        })
    }
})


