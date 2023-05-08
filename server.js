const http=require('http');
const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = http.createServer(app);
app.use('/html', express.static('html'));
const hostname = '127.0.0.1'; // 这里填入你的 IP 地址
const port = 3000; // 这里填入你想要监听的端口号
// 创建WebSocket服务器

// 使用BodyParser中间件以解析POST请求主体
app.use(express.urlencoded({ extended: false }));

// 处理登录请求
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // 在这里进行用户名和密码的验证
  if (username === 'your_username' && password === 'your_password') {
    // 验证成功，将用户重定向到/main页面
    res.redirect('/main');
  } else {
    // 验证失败，将用户重定向回登录页面
    res.redirect('/');
  }
});

// 显示主页面
app.get('/main', (req, res) => {
  res.sendFile( __dirname + "/" + "html/index.html" );
});
app.get('/', (req, res) => {
  res.sendFile( __dirname + "/" + "html/login1.html" );5
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
// 启动HTTP服务器
const wss = new WebSocket.Server({server});

// 存储所有连接的客户端
const clients = new Map();

// 建立连接时的回调函数
wss.on('connection', function connection(ws) {
  // 发送欢迎消息
  ws.send(`Welcome!`);
  console.log('Client connected');
  // 监听来自客户端的消息
  var Id;
  ws.on('message', function incoming(message) {
    const msg=JSON.parse(message);
    if (msg.type === 'welcome') {
      // 解析消息中的目标客户端ID和内容
      Id = msg.clientId;
      console.log(Id);
      // 将客户端添加到clients列表中
      clients.set(Id, ws);
    } else if (msg.type === 'message') {
  
      // 获取目标客户端
      const targetClient = clients.get(msg.targetClientId);
      console.log(msg.content);
      // 如果目标客户端存在，则向其发送消息
      if (targetClient) {
        targetClient.send(msg.content);
      }
    }
  });
  ws.on('close', function close() {
    // 从clients列表中移除客户端
    clients.delete(Id);
    console.log(Id);
    console.log('Client disconnected');
  });
});