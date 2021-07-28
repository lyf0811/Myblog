var url = "http://127.0.0.1:5502/";
$('#login').click(function () {
    var logindata = {
        'useraccount': document.getElementById('name').value,
        'userpwd': document.getElementById('passwd').value
    }
    $.post(url + 'login', logindata, function (result) {
        
        if (result.msg == '用户登录成功') {
            localStorage.setItem('token', result.token)
            $(location).attr('href', './mainpage.html');
        }
        else {
            $('#logintips').css({ 'display': 'block' })
            document.getElementById('logintips').children[1].innerHTML = result.reason
        }

    })
})

$('#register').click(function () {
    if (document.getElementsByClassName('right').length >= 5) {
        var registerdata = {
            'registeraccount': $('#accountinput').val(),
            'registername': $('#nameinput').val(),
            'registerpwd': $('#passwordinput').val(),
            'registeremail': $('#emailinput').val(),
        }
        $.post(url + 'register', registerdata, function (result) {
            localStorage.setItem('token', result.token)
            $(location).attr('href', './mainpage.html');
        })
    }
    else{
        $('#registertips').css({ 'display': 'block' })
        document.getElementById('registertips').children[1].innerHTML = '请输入正确的注册信息'
    }
})

$('#registernow').click(function () {
    $('#logincontainer').css({ 'transform': 'translateX(-100vw)', 'transition': '2s' })
    $('#registercontainer').css({ 'display': 'block', 'transform': 'translateX(0px)', 'transition': '2s' })

})
$('#loginnow').click(function () {
    $('#logincontainer').css({ 'transform': 'translateX(0px)', 'transition': '2s' })
    $('#registercontainer').css({ 'display': 'block', 'transform': 'translateX(1500px)', 'transition': '2s' })

})

$('#accountinput').change(function () {

    if (this.value.length < 6) {
        $('#accountimgtip').css('display', 'block')
        $('#accountimgtip').attr('class', 'wrong')
        $('#accounttxttip').text('账号长度≥6个字符')
    }
    else {
        if (!(/^[a-zA-Z0-9]+$/.test(this.value))) {
            $('#accountimgtip').css('display', 'block')
            $('#accountimgtip').attr('class', 'wrong')
            $('#accounttxttip').text('账号格式不正确,请输入字符/数字')
        }
        else {
            let getdata = {
                'verifyname': 'useraccount',
                'data': this.value
            }
            $.get(url + 'verifyregister', getdata, function (result) {
                if (result.msg == '账号已存在') {
                    $('#accountimgtip').css('display', 'block')
                    $('#accountimgtip').attr('class', 'wrong')
                    $('#accounttxttip').text('账号已存在')
                }
                else {
                    $('#accountimgtip').attr('class', 'right')
                    $('#accounttxttip').text('')
                }
            })

        }

    }
})
$('#nameinput').change(function () {

    if (this.value.length < 2) {
        $('#nameimgtip').css('display', 'block')
        $('#nameimgtip').attr('class', 'wrong')
        $('#nametxttip').text('用户名称≥2个字符')
    }
    else {

        let getdata = {
            'verifyname': 'username',
            'data': this.value
        }
        $.get(url + 'verifyregister', getdata, function (result) {
            if (result.msg == '用户昵称已存在') {
                $('#nameimgtip').css('display', 'block')
                $('#nameimgtip').attr('class', 'wrong')
                $('#nametxttip').text('用户昵称已存在')
            }
            else {
                $('#nameimgtip').attr('class', 'right')
                $('#nametxttip').text('')
            }
        })
    }
})
$('#passwordinput').change(function () {

    if (this.value.length < 6) {
        $('#passwordimgtip').css('display', 'block')
        $('#passwordimgtip').attr('class', 'wrong')
        $('#passwordtxttip').text('密码长度≥6个字符')
    }
    else {
        if ((/^[\u4E00-\u9FFF]+$/.test(this.value))) {
            $('#passwordimgtip').css('display', 'block')
            $('#passwordimgtip').attr('class', 'wrong')
            $('#passwordtxttip').text('密码格式不正确,请输入非汉字')
        }
        else {
            $('#passwordimgtip').attr('class', 'right')
            $('#passwordtxttip').text('')
        }

    }


})
$('#repeatinput').change(function () {
    if ($('#passwordimgtip').attr('class') == 'wrong') {
        $('#repeatimgtip').css('display', 'block')
        $('#repeatimgtip').attr('class', 'wrong')
        $('#repeattxttip').text('请输入符合条件的密码')
    }
    else {
        if (this.value != $('#passwordinput').val()) {
            $('#repeatimgtip').css('display', 'block')
            $('#repeatimgtip').attr('class', 'wrong')
            $('#repeattxttip').text('前后密码不一致')
        }
        else {
            $('#repeatimgtip').attr('class', 'right')
            $('#repeattxttip').text('')


        }
    }

})
$('#emailinput').change(function () {
    if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.value))) {
        $('#emailimgtip').css('display', 'block')
        $('#emailimgtip').attr('class', 'wrong')
        $('#emailtxttip').text('邮箱格式不正确')
    }
    else {
        let getdata = {
            'verifyname': 'useremail',
            'data': this.value
        }
        $.get(url + 'verifyregister', getdata, function (result) {
            if (result.msg == '用户邮箱已注册') {
                $('#emailimgtip').css('display', 'block')
                $('#emailimgtip').attr('class', 'wrong')
                $('#emailtxttip').text('用户邮箱已注册')
            }
            else {
                $('#emailimgtip').attr('class', 'right')
                $('#emailtxttip').text('')
            }
        })



    }
})