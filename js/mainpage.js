var url = "http://127.0.0.1:5502/"
var url1="http://127.0.0.1:5502/readincrease"
var mouseflag = 1
var nowpagenum=0 //当前页
var perpagenum=5  //每页文章数
var isspecial=1 //背景特效是否开启
var that //选中页码的按钮
// console.log(location.href)
// function leftmove() {
//   markdown = document.querySelector('#markdown')


// }
// function rightmove() {

// }


function compareFunction(propertyName) {
  return function (src, tar) {
    //获取比较的值
    if(propertyName=='read'){
      var v1 = parseInt(src[propertyName]);
      var v2 = parseInt(tar[propertyName]);
    }

    else{
      var v1 = src[propertyName];
      var v2 = tar[propertyName];
    }
      if (v1 < v2) {
        return 1;
      }
      if (v1 > v2) {
        return -1;
      }
      return 0;
    
  };
}

function pagelistcreate(pagenum){      //生成底部选择页码栏
  for(let i=1;i<pagenum+1;i++){
    page=document.createElement('div')
    page.className='page'
    page.textContent=i
    pagelist=document.querySelector('.pagelist')
    lastpage=document.querySelector('.lastpage')
    pagelist.insertBefore(page,lastpage)
  }
}


function articlefuncbind(){      //每篇文章特效

  $('.articlehead').mouseover(function (e) {
    e.stopPropagation()
    let parent = this.parentNode.children
    parent[0].style.transform = 'scale(1.1,1.1)'
    parent[0].style.transition = '0.6s'
    parent[0].style.filter = 'blur(1px)'
    this.children[0].style.transform = 'translate(0,-50px)'
    this.children[0].style.transition = '0.6s'
    parent[2].style.visibility = 'visible'
    $(this).parent('.article').find('.articletotal').fadeIn(500)
  })
  
  
  $('.articlehead').mouseleave(function (e) {
    e.stopPropagation()
    let parent = this.parentNode.children
    parent[0].style.transform = 'scale(1,1)'
    parent[0].style.transition = '0.6s'
    parent[0].style.filter = 'none'
    this.children[0].style.transform = 'translate(0,-0px)'
    this.children[0].style.transition = '0.6s'
    $(this).parent('.article').find('.articletotal').fadeOut(500)
  
  })
  }
  
function pagelistbuttoninit(){        //底部页码栏的特效
  $('.firstpage,.lastpage,.page').mouseover(function(){
    this.style.transform='scale(1.5,1.5)'
    this.style.transition='1s'
    this.style.backgroundColor='rgb(99, 99, 185)'
   
  })
  $('.firstpage,.lastpage,.page').mouseleave(function(){
    this.style.transform='scale(1,1)'
    this.style.transition='1s'
    this.style.backgroundColor='rgb(201, 201, 201)'

  })

}

function Pageinit() {           //页面初始化
  $.ajaxSettings.async = false;
  $.getJSON(url+'init', function (result) {
    pagenum=Math.ceil(result.length/perpagenum)
    pagelistcreate(pagenum)
    pagelistbuttoninit()
    for(let i=0;i<pagenum;i++){
      document.querySelectorAll('.page')[i].addEventListener('click',function(){
        $('.content').html('')
        if(i==pagenum-1){
          for(let x=i*perpagenum;x<result.length;x++){
            articlecreate(result[x])
          }
        }
        else{
          for(let x=i*perpagenum;x<(i+1)*perpagenum;x++){
            articlecreate(result[x])
          }
        }
        articlefuncbind()
      })
    }
    for(let i=nowpagenum*perpagenum;i<(nowpagenum+1)*perpagenum;i++){
      articlecreate(result[i])
    }

    $('.firstpage').click(function(){
      if(nowpagenum>0){
        nowpagenum--
      $('.content').html('')
        for(let i=nowpagenum*perpagenum;i<(nowpagenum+1)*perpagenum;i++){
          articlecreate(result[i])
        }
        articlefuncbind()
      }
      
    })
    $('.lastpage').click(function(){
      if(nowpagenum<pagenum-1){
        nowpagenum++
        $('.content').html('')
        if(nowpagenum==pagenum-1){
          for(let i=nowpagenum*perpagenum;i<result.length;i++){
            articlecreate(result[i])
          }
          
        }
        else{
          for(let i=nowpagenum*perpagenum;i<(nowpagenum+1)*perpagenum;i++){
            articlecreate(result[i])
          }
          
        }
        articlefuncbind()
      }
      
    })
    if (result.length >= 4) {
      for (let i = 0; i < 4; i++) {
        let data = [result[i].textsrc, result[i].imgsrc]
        $('.articlename')[i].innerHTML = '<a href="./MyMarkDown.html?page=' + data + '">' + result[i].title + '</a>'
      }
    }
    else {
      for (let i = 0; i < result.length; i++) {
        let data = [result[i].textsrc, result[i].imgsrc]
        console.log(data)
        $('.articlename')[i].innerHTML = '<a href="./MyMarkDown.html?page=' + data + '">' + result[i].title + '</a>'
      }
    }



    $('#newarticle').click(function () {
      result.sort(compareFunction("createtime"));
      if (result.length >= 4) {
        for (let i = 0; i < 4; i++) {
          let data = [result[i].textsrc, result[i].imgsrc]
          $('.articlename')[i].innerHTML = '<a href="./MyMarkDown.html?page=' + data + '">' + result[i].title + '</a>'
        }
      }
      else {
        for (let i = 0; i < result.length; i++) {
          let data = [result[i].textsrc, result[i].imgsrc]
          $('.articlename')[i].innerHTML = '<a href="./MyMarkDown.html?page=' + data + '">' + result[i].title + '</a>'
        }
      }

    })


    articlefuncbind()



    $('#famousarticle').click(function () {
      result.sort(compareFunction("read"));
      console.log(result)
      if (result.length >= 4) {
        for (let i = 0; i < 4; i++) {
          let data = [result[i].textsrc, result[i].imgsrc]
          $('.articlename')[i].innerHTML = '<a href="./MyMarkDown.html?page=' + data + '">' + result[i].title + '</a>'
        }
      }
      else {
        for (let i = 0; i < result.length; i++) {
          let data = [result[i].textsrc, result[i].imgsrc]
          $('.articlename')[i].innerHTML = '<a href="./MyMarkDown.html?page=' + data + '">' + result[i].title + '</a>'
        }
      }

    })

    $('.articlelink').click(function(e){
      
      $.post(url1,{"textsrc":e.currentTarget.parentElement.lastChild.innerText})
    })
    $('#special').click(function(){
      if(isspecial==1){
      $('#sakura').css('display','none')
      $('#background').css('display','block')
      isspecial=0
      }
      else{
      $('#sakura').css('display','block')
      $('#background').css('display','none')
      isspecial=1
      }
    })


  })
}
Pageinit();





// 日历初始化
(function () {
  /*
   * 用于记录日期，显示的时候，根据dateObj中的日期的年月显示
   */
  var dateObj = (function () {
    var _date = new Date();    // 默认为当前系统时间
    return {
      getDate: function () {
        return _date;
      },
      setDate: function (date) {
        _date = date;
      }
    };
  })();

  // 设置calendar div中的html部分
  renderHtml();
  // 表格中显示日期
  showCalendarData();
  // 绑定事件
  bindEvent();

  /**
   * 渲染html结构
   */
  function renderHtml() {
    var calendar = document.getElementById("calendar");
    var titleBox = document.createElement("div");  // 标题盒子 设置上一月 下一月 标题
    var bodyBox = document.createElement("div");  // 表格区 显示数据

    // 设置标题盒子中的html
    titleBox.className = 'calendar-title-box';
    titleBox.innerHTML = "<span class='prev-month' id='prevMonth'></span>" +
      "<span class='calendar-title' id='calendarTitle'></span>" +
      "<span id='nextMonth' class='next-month'></span>";
    calendar.appendChild(titleBox);    // 添加到calendar div中

    // 设置表格区的html结构
    bodyBox.className = 'calendar-body-box';
    var _headHtml = "<tr>" +
      "<th>日</th>" +
      "<th>一</th>" +
      "<th>二</th>" +
      "<th>三</th>" +
      "<th>四</th>" +
      "<th>五</th>" +
      "<th>六</th>" +
      "</tr>";
    var _bodyHtml = "";

    // 一个月最多31天，所以一个月最多占6行表格
    for (var i = 0; i < 6; i++) {
      _bodyHtml += "<tr>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "<td></td>" +
        "</tr>";
    }
    bodyBox.innerHTML = "<table id='calendarTable' class='calendar-table'>" +
      _headHtml + _bodyHtml +
      "</table>";
    // 添加到calendar div中
    calendar.appendChild(bodyBox);
  }

  /**
   * 表格中显示数据，并设置类名
   */
  function showCalendarData() {
    var _year = dateObj.getDate().getFullYear();
    var _month = dateObj.getDate().getMonth() + 1;
    var _dateStr = getDateStr(dateObj.getDate());

    // 设置顶部标题栏中的 年、月信息
    var calendarTitle = document.getElementById("calendarTitle");
    var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4, 2) + "月";
    calendarTitle.innerText = titleStr;

    // 设置表格中的日期数据
    var _table = document.getElementById("calendarTable");
    var _tds = _table.getElementsByTagName("td");
    var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
    for (var i = 0; i < _tds.length; i++) {
      var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
      var _thisDayStr = getDateStr(_thisDay);
      _tds[i].innerText = _thisDay.getDate();
      //_tds[i].data = _thisDayStr;
      _tds[i].setAttribute('data', _thisDayStr);
      if (_thisDayStr == getDateStr(new Date())) {    // 当前天
        _tds[i].className = 'currentDay';
      } else if (_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
        _tds[i].className = 'currentMonth';  // 当前月
      } else {    // 其他月
        _tds[i].className = 'otherMonth';
      }
    }
  }

  /**
   * 绑定上个月下个月事件
   */
  function bindEvent() {
    var prevMonth = document.getElementById("prevMonth");
    var nextMonth = document.getElementById("nextMonth");
    addEvent(prevMonth, 'click', toPrevMonth);
    addEvent(nextMonth, 'click', toNextMonth);
  }

  /**
   * 绑定事件
   */
  function addEvent(dom, eType, func) {
    if (dom.addEventListener) {  // DOM 2.0
      dom.addEventListener(eType, function (e) {
        func(e);
      });
    } else if (dom.attachEvent) {  // IE5+
      dom.attachEvent('on' + eType, function (e) {
        func(e);
      });
    } else {  // DOM 0
      dom['on' + eType] = function (e) {
        func(e);
      }
    }
  }

  /**
   * 点击上个月图标触发
   */
  function toPrevMonth() {
    var date = dateObj.getDate();
    dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    showCalendarData();
  }

  /**
   * 点击下个月图标触发
   */
  function toNextMonth() {
    var date = dateObj.getDate();
    dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    showCalendarData();
  }

  /**
   * 日期转化为字符串， 4位年+2位月+2位日
   */
  function getDateStr(date) {
    var _year = date.getFullYear();
    var _month = date.getMonth() + 1;    // 月从0开始计数
    var _d = date.getDate();

    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
    return _year + _month + _d;
  }
  var table = document.getElementById("calendarTable");
  var tds = table.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    addEvent(tds[i], 'click', function (e) {
      console.log(e.target.getAttribute('data'));
    });
  }
})();


// var show = 1             //左侧隐藏栏
// $('#cover').click(function () {
//   if (show == 1) {
//     $("nav").animate({ left: '-240px' });
//     show = 0

//     $('#show').attr("src", './src/icon/right.png')
//   }
//   else {
//     $("nav").animate({ left: '0' });
//     $('#show').attr("src", './src/icon/left1.png')
//     show = 1
//   }
// });





function articlecreate(objarticle) {
  let data = [objarticle.textsrc, objarticle.imgsrc]
  let title = objarticle.title
  let summarycontent = objarticle.summary
  let createtime = set_time(objarticle.createtime).split('+')[0]
  let read = objarticle.read
  let good = objarticle.good
  let comment = objarticle.comment
  let imgsrc = './articlepage/img/'+objarticle.imgsrc
  content = document.querySelector('.content')
  let div = document.createElement('div')
  let a = document.createElement('a')
  a.className = 'articlelink'
  a.href = './MyMarkDown.html?page=' + data//
  a.textContent = title
  let span=document.createElement('span')
  span.textContent=data[0]
  span.style.display='none'
  let article = document.createElement('div')
  article.className = 'article'
  let articleimg = document.createElement('div')
  articleimg.className = 'articleimg'
  let articlehead = document.createElement('div')
  articlehead.className = 'articlehead'
  let img = document.createElement('img')
  img.src = imgsrc
  let articletotal = document.createElement('div')
  articletotal.className = 'articletotal'
  let summary = document.createElement('div')
  summary.className = 'summary'
  summary.textContent = summarycontent
  let detail = document.createElement('div')

  var x = 0
  detail.className = 'detail'
  detailnameclass = ['time', 'read', 'good', 'commt']
  detailnameurl = ["./src/icon/time.png", "./src/icon/read.png", "./src/icon/good.png", "./src/icon/comment.png"]
  detailname = [createtime, read, good, comment]
  for (i in detailnameclass) {
    let span = document.createElement('span')
    span.className = detailnameclass[i]
    let image = document.createElement('img')

    image.src = detailnameurl[x]
    span.appendChild(image)
    span.append(" " + detailname[x])
    detail.appendChild(span)
    x++
  }
  articleimg.appendChild(img)
  div.appendChild(a)
  div.appendChild(span)
  articlehead.appendChild(div)
  articletotal.appendChild(summary)
  articletotal.appendChild(detail)
  article.appendChild(articleimg)
  article.appendChild(articlehead)
  article.appendChild(articletotal)
  content.appendChild(article)

}





$('.articlebutton').click(function () {

  document.getElementById('newarticle').style.borderBottom = '0px'
  document.getElementById('famousarticle').style.borderBottom = '0px'
  document.getElementById('randomarticle').style.borderBottom = '0px'

  this.style.borderBottom = '3px solid rgb(100, 100, 216)'

})










$('.up').click(function(){
  $(window).scrollTop(0);       
})

setInterval(function(){
  let uppage=$('#uppage')
  if(window.scrollY>=1000){
    if(uppage.css('visibility')=='hidden'){
    uppage.css({'visibility':'visible','opacity': '1'})
    }
  }
  else{
   
    uppage.css({'opacity':'0'})
    if(uppage.css('visibility')=='visible'){
    setTimeout(function(){
      uppage.css({'visibility':'hidden'})
    },500)
    }
  }
},100)




function set_time(str){
  var n = parseInt(str);
  var D = new Date(n);
  var year = D.getFullYear();//四位数年份

  var month = D.getMonth()+1;//月份(0-11),0为一月份
  month = month<10?('0'+month):month;

  var day = D.getDate();//月的某一天(1-31)
  day = day<10?('0'+day):day;

  var hours = D.getHours();//小时(0-23)
  hours = hours<10?('0'+hours):hours;

  var minutes = D.getMinutes();//分钟(0-59)
  minutes = minutes<10?('0'+minutes):minutes;

  // var seconds = D.getSeconds();//秒(0-59)
  // seconds = seconds<10?('0'+seconds):seconds;
  // var week = D.getDay();//周几(0-6),0为周日
  // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];

  var now_time = year+'-'+month+'-'+day+'+'+hours+':'+minutes;
  return now_time;
}



$(document).ready(function () {    //token判定登录状态
  if (localStorage.token != undefined) {
      console.log(localStorage.token)
      let token = { "token": localStorage.token }
      $.get(url + 'user', token, function (result) {
          if (result.isadmin == '1') {
              $('#managelink').css('display', 'block')
              $('#personallink').css('display', 'block')
              $('#loginlink').css('display', 'none')
              $('#logout').css('display', 'flex')

          }
          else{
              $('#loginlink').css('display', 'none')
              $('#personallink').css('display', 'block')
              $('#logout').css('display', 'flex')
          }
      })
  }
  $('#logout').click(function(){
    localStorage.removeItem('token')
    $('#loginlink').css('display', 'block')
    $('#logout').css('display', 'none')
    $('#managelink').css('display', 'none')
    $('#personallink').css('display', 'none')
    location.reload()
    
  })
})
