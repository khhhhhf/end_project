const pool = require('../db/index.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { judgeFlyingFlowerWord } = require('../api/kimiapi.js');

//注册
async function register(req, res) {
  const { username, password } = req.body;
  let connection;
  try {
    // 从连接池获取连接
    connection = await pool.getConnection();
    const sql = 'SELECT username FROM users WHERE username = ?';
    const [results] = await connection.execute(sql, [username]);
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！', 1);
    } else {
      // 使用 bcrypt 对密码进行加密处理
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const sql2 = 'INSERT INTO users (username, password_hash, avatar_url) VALUES (?, ?, ?)'
      const [results2] = await connection.execute(sql2, [username, hashedPassword, "/uploads/default_avatar.png"]);
      res.cc('注册成功！', 0);
    }
  } catch (err) {
    console.error('数据库查询出错:', err);
    return res.cc(err, 1);
  } finally {
    if (connection) {
      // 释放连接回连接池
      connection.release();
    }
  }
}


// 假设这是你的 JWT 密钥，实际应用中应妥善保管
const secretKey = 'kh6666afdafsd';

// 登录
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.cc('用户名和密码是必需的');
  }
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.cc('用户名或密码错误');
    }
    const user = rows[0];
    console.log('Login attempt for user:', username);
    console.log('Stored hash:', user.password_hash);
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      return res.cc('用户名或密码错误');
    }
    // 生成 JWT 令牌
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, secretKey, { expiresIn: '1h' });
    const obj = {
      token,
      username,
      user_id: user.user_id,
      avatar_url: user.avatar_url,
      role: user.role
    }
    return res.cc(obj, 0);
  } catch (error) {
    console.error(error);
    res.cc('服务器内部错误');
  }
}
//活跃排行用户
async function activeUser(req, res) {
  try {
    const sql = `
        SELECT 
            @rank := @rank + 1 AS ranking,
            u.user_description,
            u.avatar_url,
            u.nickname,
            poem_count
        FROM 
            (
                SELECT 
                    user_id,
                    COUNT(*) AS poem_count
                FROM 
                    poems
                WHERE 
                    user_id IS NOT NULL
                GROUP BY 
                    user_id
                ORDER BY 
                    poem_count DESC
                LIMIT 3
            ) AS poem_counts
        JOIN 
            users u ON poem_counts.user_id = u.user_id
        CROSS JOIN 
            (SELECT @rank := 0) AS init_ranking;
    `;
    const [rows] = await pool.execute(sql);

    if (rows.length === 0) {
      return res.cc('未找到相关活跃用户信息', 1);
    }

    return res.cc(rows, 0);
  } catch (error) {
    console.error('获取活跃用户信息失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}

// 渲染个人主页
async function renderProfile(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.cc('user_id 是必需参数', 400);
  }

  try {
    const sql = `
        SELECT 
            u.*,
            COALESCE(SUM(p.likes_count), 0) AS total_poem_likes
        FROM 
            users u
        LEFT JOIN 
            poems p ON u.user_id = p.user_id
        WHERE 
            u.user_id = ?
        GROUP BY 
            u.user_id;
    `;
    const [rows] = await pool.execute(sql, [user_id]);

    if (rows.length === 0) {
      return res.cc('未找到该用户信息', 404);
    }

    return res.cc(rows[0], 0);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}
//修改用户信息
const path = require('path')
const fs = require('fs')

// 更新用户信息的函数
async function updateUser(req, res) {
  try {
    const { user_id, user_description, nickname } = req.body;
    let avatar_url = null;

    // 处理文件上传
    if (req.file) {
      if (req.file.size === 0) {
        return res.cc('上传的文件为空，请选择有效的文件', 400);
      }
      avatar_url = `/uploads/${req.file.filename}`;
    }

    // 检查 user_id 是否存在
    if (!user_id) {
      return res.cc('user_id 是必需参数', 400);
    }

    const connection = await pool.getConnection();
    let updateQuery = 'UPDATE users SET ';
    const values = [];
    let conditions = [];

    // 构建更新字段
    if (nickname) {
      updateQuery += 'nickname = ?, ';
      values.push(nickname);
    }
    if (user_description) {
      updateQuery += 'user_description = ?, ';
      values.push(user_description);
    }
    if (avatar_url) {
      updateQuery += 'avatar_url = ?, ';
      values.push(avatar_url);
    }

    // 移除最后一个逗号和空格
    if (values.length > 0) {
      updateQuery = updateQuery.slice(0, -2);
    } else {
      return res.cc('没有需要更新的字段', 400);
    }

    // 添加条件
    conditions.push('user_id = ?');
    values.push(user_id);

    // 拼接完整的 SQL 查询语句
    updateQuery += ' WHERE ' + conditions.join(' AND ');

    // 执行 SQL 查询
    const [result] = await connection.execute(updateQuery, values);
    connection.release();

    // 检查是否有受影响的行
    if (result.affectedRows === 0) {
      return res.cc('未找到对应的用户信息', 404);
    }

    // 返回更新后的头像 URL（如果有更新的话）
    return res.cc(avatar_url || null, 0);
  } catch (error) {
    console.error('更新用户信息时出错:', error);
    return res.cc('更新用户信息时发生错误', 500);
  }
}
//我的喜欢
async function getLikedPoemsByUserId(req, res) {
  const { user_id } = req.query;
  try {
    const [rows] = await pool.execute(`
      SELECT 
    l.like_id,
    p.poem_id,
    p.title,
    p.content,
    p.created_at AS like_time,
    COALESCE(u.nickname, p.author) AS nickname,
    p.user_id 
FROM 
    likes l
JOIN 
    poems p ON l.poem_id = p.poem_id
LEFT JOIN 
    users u ON p.user_id = u.user_id
WHERE 
    l.user_id = ?;`, [user_id]);

    return res.cc(rows, 0);
  } catch (error) {
    console.error('获取点赞诗篇信息失败:', error);
    throw error;
  }
}
//我的创作
async function renderCreate(req, res) {
  try {
    const { user_id } = req.query;

    // 检查 user_id 是否存在
    if (!user_id) {
      return res.cc('user_id 是必需参数', 400);
    }

    // 执行 SQL 查询
    const [rows] = await pool.execute(`
          SELECT 
              p.poem_id,
              p.likes_count,
              p.content,
              p.title,
              p.created_at,
              COUNT(c.comment_id) AS comment_count
          FROM 
              poems p
          LEFT JOIN 
              comments c ON p.poem_id = c.poem_id
          WHERE 
              p.user_id = ?
          GROUP BY 
              p.poem_id
          ORDER BY 
              p.poem_id;
      `, [user_id]);

    // 处理查询结果
    if (rows.length > 0) {
      return res.cc(rows, 0);
    } else {
      return res.cc('没有查询到该用户创作的诗篇信息', 1);
    }
  } catch (error) {
    console.error('获取诗篇信息失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}
//取消点赞
async function deleteLikeById(req, res) {
  const { like_id } = req.query;
  try {
    const [result] = await pool.execute('DELETE FROM likes WHERE like_id = ?', [like_id]);
    if (result.affectedRows > 0) {
      return res.cc('删除成功', 0);
    } else {
      return res.cc('未找到该记录', 404);
    }
  } catch (error) {
    return res.cc('删除记录时出错', 500);
  }
}

//编辑作品
async function eidtPoem(req, res) {
  try {
    const { poem_id } = req.query;
    console.log(poem_id);


    // 执行 SQL 查询
    const [rows] = await pool.execute(`
          SELECT title, content 
          FROM poems 
          WHERE poem_id = ?;
      `, [poem_id]);

    // 处理查询结果
    if (rows.length > 0) {
      return res.cc(rows, 0);
    } else {
      return res.cc('没有查询到该用户创作的诗篇信息', 1);
    }
  } catch (error) {
    console.error('获取诗篇信息失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}

//飞花令
async function searchfhl(req, res) {
  const { keyword, content } = req.query;
  try {
    const rr = await judgeFlyingFlowerWord(keyword, content);
    return res.cc(rr, 0);
  } catch (error) {
    console.error('获取飞花令信息失败:', error);
    throw error;
  }
}

//删除作品
async function deletecrete(req, res) {
  const { poem_id } = req.query;
  try {
    const [rows] = await pool.execute(`
      DELETE FROM poems WHERE poem_id = ?;
  `, [poem_id]);
    if (rows.affectedRows === 0) {
      return res.cc('未找到该记录', 404);
    }
    return res.cc('删除成功', 0);
  } catch (error) {
    console.error('搜索信息失败:', error);
    throw error;
  }
}

//更新作品
async function updatePoem(req, res) {
  const { poem_id, title, content } = req.body;
  try {
    const [rows] = await pool.execute(`
      UPDATE poems SET title = ?, content = ? WHERE poem_id = ?;
  `, [title, content, poem_id]);
    if (rows.affectedRows === 0) {
      return res.cc('未找到该记录', 404);
    }
    return res.cc('更新成功', 0);
  } catch (error) {
    console.error('搜索信息失败:', error);
    throw error;
  }
}

module.exports = {
  register,
  login,
  activeUser,
  renderProfile,
  updateUser,
  getLikedPoemsByUserId,
  renderCreate,
  deleteLikeById,
  searchfhl,
  deletecrete,
  eidtPoem,
  searchfhl,
  updatePoem
};
