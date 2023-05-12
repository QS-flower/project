const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
app.use(express.static('public'));
var map=new Map();
map.set('小明',123);
map.set('小黄',123);
map.set('小红',123);
map.set('小郑','ok');
map.set('小薛',123);
var User_on = new Map()
var Friend=new Map();
Friend.set('小明',['小黄','小红','小郑','小薛']);
Friend.set('小黄',['小明','小红','小郑','小薛']);
Friend.set('小郑',['小黄','小红','小明','小薛']);
Friend.set('小薛',['小黄','小红','小郑','小明']);
Friend.set('小红',['小黄','小薛','小郑','小明']);

/* var Msg=new Map();
var Ming=new Map();
var Hong=new Map();
var Huang=new Map();
var Xue=new Map();
var Zheng=new Map();
Ming.set('小红',['hello','nice','yes','ok']);
Hong.set('小红',['hello','nice','yes','ok']);
Xue.set('小红',['hello','nice','yes','ok']);
Zheng.set('小红',['hello','nice','yes','ok']);

Hong.set('小明',['hello','nice','yes','ok']);
Huang.set('小明',['hello','nice','yes','ok']);
Xue.set('小明',['hello','nice','yes','ok']);
Zheng.set('小明',['hello','nice','yes','ok']);

Ming.set('小黄',['hello','nice','yes','ok']);
Hong.set('小黄',['hello','nice','yes','ok']);
Xue.set('小黄',['hello','nice','yes','ok']);
Zheng.set('小黄',['hello','nice','yes','ok']);

Ming.set('小薛',['hello','nice','yes','ok']);
Hong.set('小薛',['hello','nice','yes','ok']);
Huang.set('小薛',['hello','nice','yes','ok']);
Zheng.set('小薛',['hello','nice','yes','ok']);

Ming.set('小郑',['hello','nice','yes','ok']);
Hong.set('小郑',['hello','nice','yes','ok']);
Huang.set('小郑',['hello','nice','yes','ok']);
Xue.set('小郑',['hello','nice','yes','ok']); */


server.listen(3000, () => {
    console.log('服务器运行在http://localhost:3000');
  });

app.get('/', (req, res) => {
  res.redirect('index1.html');
});
const io = new Server(server);
io.on('connection', (socket) => {
    var from,to;
    console.log('用户连接');
  socket.on('login',data=>{
    console.log(data);
    if(!map.has(data.username)){
        socket.emit('error1',{message:'此用户未注册！'});
    }else if(map.get(data.username)!=data.password){
        socket.emit('error1',{message:'密码错误！'});
    }else{
        User_on.set(data.username,socket);
        socket.emit('success',{username:data.username});
        console.log(data.username+'在线');
        socket.broadcast.emit("in", data.username);
        socket.emit('friend-in',Friend.get(data.username).filter(item=>{
            return User_on.has(item);
        }));
        socket.emit('friend-out',Friend.get(data.username).filter(item=>{
            return !User_on.has(item);
        }));
    }
  })
  socket.on('msg',data=>{
    from=data.from;
    to=data.to;
    console.log(from);
    console.log(to);
  })
  socket.on('send_msg',function(data){
    console.log(data);
    User_on.get(to).emit('recive',data);
  })
  socket.on('disconnect',(data)=>{
    console.log(data);
    console.log(User_on);
    User_on.forEach((value,elem)=>{
        if(value===socket){
          socket.broadcast.emit("out", elem);
          User_on.delete(elem);
        } 
    })
    console.log(User_on);
    console.log('连接已经断开');
  })
});