const mysql = require('mysql2/promise');

// 1. 创建连接池（初始化10个连接待命）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', // 请替换为你的数据库密码
  database: 'qw',
  connectionLimit: 10,      // 最大连接数
  waitForConnections: true, // 无空闲连接时排队等待
  idleTimeout: 60000,       // 空闲连接60秒后自动释放
});

module.exports = pool;