const express = require("express");
const cors = require('cors');
const app = express();

// 解决跨域问题
app.use(cors());


app.use('/uploads', express.static('uploads'));

// 解决解析 application/x-www-form-urlencoded 格式数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 自定义响应方法
app.use((req, res, next) => {
  res.cc = (err, code = 1) => {
    res.send({
      code,
      msg: err instanceof Error ? err.message : err
    });
  };
  next();
});

// 使用 CommonJS 语法导入路由模块
const router1 = require('./router/user.js');
const router2 = require('./router/poem.js');

// 挂载路由
app.use('/api', router1);
app.use('/api', router2);

// 错误级别中间件
app.use((err, req, res, next) => {
  res.cc(err);
});


// 启动服务器
app.listen(3000, () => {
  console.log("server is running at port 3000");
});