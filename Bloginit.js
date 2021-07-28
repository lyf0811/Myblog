const http = require('http')
const mysql = require('mysql');
const querystring = require('querystring');
const util = require('util');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const jwt = require("jsonwebtoken")


const { request } = require('https');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '20000811l',
  port: '3306',
  database: 'myblog'
});





/*

        跨域处理


*/

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  //这段仅仅为了方便返回json而已
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == 'OPTIONS') {
    //让options请求快速返回
    res.sendStatus(200);
  } else {
    next();
  }
});

/*
    背景图片存储
 */
const backgroundimgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('articlepage/img'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


// 文章图片存储
const articleimgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('articlepage/articleimg'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));

  }
});
//用户头像存储
const userheadimgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('articlepage/comment/headimg'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));

  }
});

const backgroundimgupload = multer({ storage: backgroundimgstorage });
const articleimgupload = multer({ storage: articleimgstorage });
const userheadimgupload = multer({ storage: userheadimgstorage });

app.post('/backgroundimg', backgroundimgupload.single('backgroundimg'), function (req, res, next) {
  res.send({
    err: null,
    filePath: path.basename(req.file.path)   //   xxxx.jpg/ xxx.png……
  });
});
app.post('/userheadimg', userheadimgupload.single('userheadimg'), function (req, res, next) {
  console.log(1)
  res.send({
    err: null,
    filePath: path.basename(req.file.path)   //   xxxx.jpg/ xxx.png……
  });
});
app.post('/articleimg', articleimgupload.array('articleimg', 1000), function (req, res, next) {
  let articleimgfilepath = []
  for (let i = 0; i < req.files.length; i++) {
    articleimgfilepath.push('./articlepage/articleimg/' + path.basename(req.files[i].path))
  }
  res.send({
    err: null,
    filePath: articleimgfilepath       //图片存储地址
  });
  console.log(articleimgfilepath)
});


app.get('/init', function (req, res, next) {
  Mainpageinit(req, res);
})
app.post('/login', function (req, res, next) {
  login(req, res);
})
app.post('/register', function (req, res, next) {
  register(req, res);
})
app.get('/verifyregister', function (req, res, next) {
  verifyregister(req, res);
})
app.get('/user', function (req, res, next) {
  verifyuser(req, res);
})
app.post('/useredit', function (req, res, next) {
  useredit(req, res);
})
app.post('/articleserver', function (req, res, next) {
  articleserver(req, res);
})
app.post('/makecomment', function (req, res, next) {
  makecomment(req, res);
})

app.post('/readincrease', function (req, res, next) {
  increaseread(req, res);
})
http.createServer(app).listen(5502)




function login(req, res) {              //验证登录
  let post = '';
  req.setEncoding('utf-8');
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = querystring.parse(decodeURIComponent(post));  //处理传递的数据    post={ useraccount , userpwd }


    let sql = 'SELECT * FROM user WHERE useraccount=? AND userpwd=?';
    let param = [post.useraccount, post.userpwd]
    connection.query(sql, param, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }
      else {
        if (result.length == 0) {
          res.send({
            msg: "用户登录失败",
            reason: '账号或密码错误'
          })
          res.end()
        }
        else {
          let token = jwt.sign({
            useraccount: post.useraccount,
            // username: result[0].username,
            userpwd: post.userpwd,
            // useremail: result[0].useremail,
            // userhead:result[0].userhead,
          }, 'secretkey')

          res.send({
            msg: "用户登录成功",
            token
          })
          res.end()

        }

      }
    })
  })
}

function register(req, res) {                           //用户注册
  let post = '';
  req.setEncoding('utf-8');
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = querystring.parse(decodeURIComponent(post));  //处理传递的数据   post={ registername, registeraccount, registerpwd, registeremail }


    let modSql = 'INSERT INTO user VALUES(?,?,?,?,0,0)';
    let modparam = [post.registername, post.registeraccount, post.registerpwd, post.registeremail]
    connection.query(modSql, modparam, function (err, result) {
      if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
      }
      else {
        let token = jwt.sign({
          useraccount: post.registeraccount,
          // username: post.registername,
          userpwd: post.registerpwd,
          // useremail: post.registeremail,
          // userhead:"0",
        }, 'secretkey')

        res.send({
          msg: "用户注册成功！",
          token
        })

        res.end()
      }
    })



  })
}



function verifyregister(req, res) {             //注册信息验证是否重复
  let verifyname = req.query.verifyname || req.body.verifyname || req.headers.verifyname
  let data = req.query.data || req.body.data || req.headers.data
  let Sql = 'SELECT * FROM user WHERE ' + verifyname + ' =?';
  let param = data
  connection.query(Sql, param, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    else {
      if (result.length > 0) {
        let message = {}
        switch (verifyname) {
          case 'useraccount':
            message.msg = '账号已存在'
            break;
          case 'username':
            message.msg = '用户昵称已存在'
            break;
          case 'useremail':
            message.msg = '用户邮箱已注册'
            break;
          default:
            message.msg = '未知错误'
        }
        res.send(message)
        res.end()
      }
      else {
        res.send({
          msg:
            '符合条件'
        })
        res.end()
      }





    }
  })
}


function verifyuser(req, res) {            //用户登录状态判断，是否处于登录状态
  let token = req.query.token || req.body.token || req.headers.token
  jwt.verify(token, "secretkey", (err, decode) => {       //decode={ username, useraccount, userpwd, useremail }
    if (decode != undefined) {
      console.log(decode)
      let sql = 'SELECT * FROM user WHERE useraccount=? AND userpwd=?';
      let param = [decode.useraccount, decode.userpwd]
      connection.query(sql, param, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          return;
        }
        else {
          if (decode.useraccount == 'lyf0811003' && decode.userpwd == '20000811l') {        //博主账号
            res.send({
              isadmin: '1',
              msg: "已登录",
              userid: decode.useraccount,
              username: result[0].username,
              useremail: result[0].useremail,
              userhead: result[0].userhead,
              usersign:result[0].usersign,
            })
            res.end()
          }
          else {
            if (result.length >= 1) {
              res.send({
                isadmin: '0',
                msg: '已登录',
                userid: decode.useraccount,
                username: result[0].username,
                useremail: result[0].useremail,
                userhead: result[0].userhead,
                usersign:result[0].usersign,
              })
              res.end()
            }
            else {
              res.send({
                isadmin: '0',
                msg: '登录状态验证失败'
              })
              res.end()
            }
          }
        }

      })


    }
    else {
      res.send({
        isadmin: '0',
        msg: '登录状态验证失败'
      })
      res.end()

    }
  })


}

function useredit(req,res){
  let post = '';
  req.setEncoding('utf-8');
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {
    post = querystring.parse(decodeURIComponent(post));
    if(post.ishead=='1'){
    let modSql = 'UPDATE user SET username=?,useremail=?,usersign=?,userhead=? where useraccount=?';
    let modparam = [post.username, post.useremail, post.usersign, post.userhead,post.useraccount]
    connection.query(modSql, modparam, function (err, result) {
      if (err) {
        console.log('[UPDATE ERROR] - ', err.message);
        return;
      }
      else {
      }
    })
    }
    else{
      let modSql = 'UPDATE user SET username=?,useremail=?,usersign=?  where useraccount=?';
      let modparam = [post.username, post.useremail, post.usersign,post.useraccount]
      connection.query(modSql, modparam, function (err, result) {
        if (err) {
          console.log('[UPDATE ERROR] - ', err.message);
          return;
        }
        else {
        }
    })
  }
  res.send({
    msg:"success"
  })
  res.end()
  })
}



//文章处理

function articleserver(req, res) {     //create a sever
  var post = '';
  req.setEncoding('utf-8');
  // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
  req.on('data', function (chunk) {
    post += chunk;
  });

  // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
  req.on('end', function () {
    post = querystring.parse(decodeURIComponent(post));  //处理传递的数据


    if (post.isdelete == "1") {             //删除文章操作
      let modSql = 'DELETE FROM article WHERE textsrc=?';
      connection.query(modSql, post.saveurl, function (err, result) {
        if (err) {
          console.log('[DELETE ERROR] - ', err.message);
          return;
        }

      })

      fs.unlink("./articlepage/txt/" + post.saveurl + '.txt', err => {  //删除文章对应的txt文件
        if (err) {
          console.log(err);
        }
      })
      fs.unlink("./articlepage/comment/content/" + post.saveurl + '.json', err => {  //删除文章对应的txt文件
        if (err) {
          console.log(err);
        }
      })
      if (post.imgurl != 'girl.jpg') {         //删除文章对应的背景图片，默认的背景图片不删除
        fs.unlink('./articlepage/img/' + post.imgurl, err => {
          if (err) {
            console.log(err);
          }
        })


      }
    }


    else {
      if (post.isnewarticle == "0") {                     //对已有文章处理
        fs.writeFile('./articlepage/txt/' + post.saveurl + '.txt', post.text, error => {
          if (error) return console.log("写入文件失败,原因是" + error.message);
          console.log("写入成功");
        });
        //数据库处理
        let modSql = 'UPDATE article SET title = ?, imgsrc = ?, summary = ? WHERE textsrc=?';
        var modparam = [post.title, post.imgurl, post.summary, post.saveurl]
        connection.query(modSql, modparam, function (err, result) {
          if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return;
          }
          console.log('--------------------------UPDATE----------------------------');
          console.log('UPDATE affectedRows', result.affectedRows);
          console.log('-----------------------------------------------------------------\n\n');
        });

      }
      else {                                        //新文章
        let modsql = 'SELECT Max(textsrc) AS count FROM article';
        connection.query(modsql, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
          }
          else {
            let articlenum = JSON.parse(JSON.stringify(result))[0].count + 1
            let saveurl = "./articlepage/txt/" + articlenum.toString() + '.txt'
            fs.writeFile(saveurl, post.text, error => {
              if (error) return console.log("写入文件失败,原因是" + error.message);
              console.log("写入成功");

            });

            let modSql = 'INSERT INTO article VALUES(?,?,?,0,0,0,?,?)';
            var modparam = [post.title, post.summary, post.date, post.imgurl, articlenum]
            connection.query(modSql, modparam, function (err, result) {
              if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
              }
              else {
                res.statusCode = 200;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.write(articlenum.toString())
                res.end()
              }
            });
          }
        })
      }
    }

  });
}

function Mainpageinit(request, response) {
  var sql = 'SELECT * FROM article order by createtime desc';
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    else {
      response.statusCode = 200;
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader('content-type', 'application/json');
      response.write(JSON.stringify(result));
      response.end()

    }
  })
}


function increaseread(req, res) {
  var increasesql = 'UPDATE article SET `read` = `read`+1 WHERE textsrc=?';
  var post = '';
  req.setEncoding('utf-8');
  req.on('data', function (chunk) {
    post += chunk;
  });
  req.on('end', function () {

    post = querystring.parse(decodeURIComponent(post));
    let textsrc = post.textsrc
    connection.query(increasesql, textsrc, function (err, result) {
      if (err) {
        console.log('[UPDATE ERROR] - ', err.message);
        return;
      }
      console.log('--------------------------UPDATE read++----------------------------');
      res.end()
    });


  })
}


function makecomment(req, res) {
  var post = '';
  req.setEncoding('utf-8');
  req.on('data', function (chunk) {
    post += chunk;
  });

  req.on('end', function () {
    post = querystring.parse(decodeURIComponent(post));
    console.log(post)

    fs.writeFile('./articlepage/comment/content/' + post.commentjsonsrc + '.json', post.comment, err => {
      if (err) {
        console.log('write file error!');
      } else {
        res.end()
        console.log('add note successfully!')
      }
    })

  });
}