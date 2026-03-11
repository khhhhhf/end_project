const pool = require('../db/index.js');
const { generatePoetryPrompt, getPoemRelatedResponse } = require('../api/kimiapi.js');

// 导出一个名为aicrete的函数，接收req和res两个参数
function aicrete(req, res) {
  const queryParam = req.query.prompt; // 获取查询参数
  generatePoetryPrompt(queryParam).then(data => {
    res.cc(data, 0);
  })
}

//分类查询
async function category(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM themes');
    if (rows.length > 0)
      return res.cc(rows, 0);
    else return res.cc('没有查询到数据', 1);
  } catch (error) {
    console.error(error);
    res.cc('服务器内部错误');
  }
}

async function getPoems(req, res) {
  try {
    // 执行 SQL 查询
    const [rows] = await pool.execute(`
       SELECT 
         poem_id,
         title, 
         content, 
         author
         FROM poems 
         WHERE user_id IS NULL and theme_id = ? 
     ` , [req.query.theme_id]);
    // 处理查询结果
    if (rows.length > 0) {
      return res.cc(rows, 0);
    } else {
      return res.cc('没有查询到管理员收录的诗篇', 1);
    }
  } catch (error) {
    console.error('获取管理员诗篇失败:', error);
    return res.cc('服务器内部错误', 500); // 建议明确返回 500 状态码
  }
}
async function getrecom(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.cc('user_id 是必需的参数', 400);
    }

    // 获取当前星期（0 - 6，0 表示星期日）
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const [rowss] = await pool.execute(`select * from themes `);
    // 根据星期设定 theme_id
    let theme_id = rowss[dayOfWeek].theme_id;
    // 执行 SQL 查询，增加评论数统计、诗篇 id 以及作者信息
    const [rows] = await pool.execute(`
        SELECT 
            p.poem_id,
            p.title, 
            p.content, 
            p.theme_id, 
            p.likes_count, 
            p.author,
            u.nickname,
            u.avatar_url,
            CASE WHEN l.poem_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_liked,
            (SELECT COUNT(*) FROM comments c WHERE c.poem_id = p.poem_id) AS comments_count
        FROM (
            SELECT *
            FROM poems
            WHERE theme_id = ? AND user_id IS NOT NULL
            ORDER BY likes_count DESC
            LIMIT 3
        ) p
        LEFT JOIN likes l ON p.poem_id = l.poem_id AND l.user_id = ?
        LEFT JOIN users u ON p.user_id = u.user_id;
    `, [theme_id, user_id]);
    // 处理查询结果
    if (rows.length > 0) {
      return res.cc(rows, 0);
    } else {
      return res.cc('没有查询到符合条件的诗篇', 1);
    }
  } catch (error) {
    console.error('获取诗篇信息失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}
//诗篇点赞
async function toggleLike(req, res) {
  const { user_id, poem_id } = req.body;

  if (!user_id || !poem_id) {
    return res.cc('user_id 和 poem_id 是必需参数', 400);
  }

  try {
    // 检查用户是否已经点赞
    const [checkRows] = await pool.execute('SELECT * FROM likes WHERE user_id = ? AND poem_id = ?', [user_id, poem_id]);

    if (checkRows.length > 0) {
      // 已点赞，执行取消点赞操作
      await pool.execute('DELETE FROM likes WHERE user_id = ? AND poem_id = ?', [user_id, poem_id]);
      await pool.execute('UPDATE poems SET likes_count = GREATEST(likes_count - 1, 0) WHERE poem_id = ?', [poem_id]);
      return res.cc('取消点赞成功', 0);
    } else {
      // 未点赞，执行点赞操作
      const [result] = await pool.execute('INSERT INTO likes (user_id, poem_id) VALUES (?, ?)', [user_id, poem_id]);
      await pool.execute('UPDATE poems SET likes_count = likes_count + 1 WHERE poem_id = ?', [poem_id]);
      return res.cc({
        message: '点赞成功',
        like_id: result.insertId
      }, 0);
    }
  } catch (error) {
    console.error('点赞/取消点赞操作失败:', error);
    res.cc('服务器内部错误', 2000);
  }
}

async function postPoem(req, res) {
  try {
    const { user_id, title, theme_id, content, author } = req.body;

    // 简单的输入验证
    if (!title || !content || theme_id === '999') {
      return res.cc('请填写完整信息', 400);
    }

    const connection = await pool.getConnection();
    const insertQuery = `
        INSERT INTO poems (user_id, title, content, theme_id, author)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [user_id, title, content, theme_id, author];

    const [result] = await connection.execute(insertQuery, values);
    connection.release();

    if (result.affectedRows === 1) {
      return res.cc('提交成功', 200);
    } else {
      return res.cc('提交失败，请稍后重试', 500);
    }
  } catch (error) {
    console.error('提交诗篇时出错:', error);
    return res.cc(error, 500);
  }
}
// 获取某分类下的诗篇（分页）
async function getpoemsall(req, res) {
  try {
    let { theme_id, currentPage4 = 1, pageSize4 = 10 } = req.query;

    // 转数字
    const themeIdNum = Number(theme_id);
    const pageNum = Number(currentPage4);
    const pageSizeNum = Number(pageSize4);
    const offsetNum = (pageNum - 1) * pageSizeNum;

    // 参数校验
    if (!themeIdNum) return res.cc('缺少有效 theme_id', 1);
    if (isNaN(pageNum) || isNaN(pageSizeNum)) return res.cc('分页参数必须为数字', 1);

    // 查询该分类下所有诗篇总数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total_count FROM poems WHERE theme_id = ? AND user_id IS NOT NULL`,
      [themeIdNum]
    );
    const totalCount = countRows[0].total_count;

    // 查询当前页数据
    const [rows] = await pool.execute(
      `
      SELECT 
          p.poem_id,
          p.title,
          p.likes_count,
          p.content,
          p.created_at,
          COUNT(c.comment_id) AS comment_count,
          u.nickname
      FROM poems p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN comments c ON p.poem_id = c.poem_id
      WHERE p.theme_id = ? AND p.user_id IS NOT NULL
      GROUP BY p.poem_id
      ORDER BY p.created_at DESC
      LIMIT ${pageSizeNum} OFFSET ${offsetNum};
      `,
      [themeIdNum] // 只绑定 theme_id
    );

    // 返回分页数据 + 分类总数
    return res.cc({
      list: rows,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total: rows.length,       // 当前页数量
        totalCount: totalCount    // 该分类下所有诗篇数量
      }
    }, 0);

  } catch (err) {
    console.error('获取诗篇信息失败:', err);
    return res.cc('获取诗篇信息失败', 1);
  }
}





/* async function getpoemsall(req, res) {
  try {
    // 先查询所有的 theme_id
    const [themes] = await pool.execute('SELECT theme_id FROM themes');
    const themeIds = themes.map(theme => theme.theme_id);

    const [rows] = await pool.execute(`
        SELECT 
            t.theme_id,
            p.poem_id,
            p.title,
            p.likes_count,
            p.content,
            p.created_at,
            COUNT(c.comment_id) AS comment_count,
            u.nickname
        FROM 
            themes t
        JOIN 
            poems p ON t.theme_id = p.theme_id AND p.user_id IS NOT NULL
        JOIN 
            users u ON p.user_id = u.user_id
        LEFT JOIN 
            comments c ON p.poem_id = c.poem_id
        GROUP BY 
            t.theme_id, p.poem_id
        ORDER BY 
            t.theme_id, p.created_at DESC;
    `);

    // 按 theme_id 分组
    const result = {};
    // 初始化所有 theme_id 对应的值为空数组
    themeIds.forEach(themeId => {
      result[themeId] = [];
    });
    rows.forEach(row => {
      const themeId = row.theme_id;
      result[themeId].push({
        poem_id: row.poem_id,
        title: row.title,
        likes_count: row.likes_count,
        content: row.content,
        created_at: row.created_at,
        comment_count: row.comment_count,
        nickname: row.nickname
      });
    });
    return res.cc(result, 0);
  } catch (error) {
    console.error('获取诗篇信息失败:', error);
    throw error;
  }
} */

//模糊查询
async function getPoemsid(req, res) {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ message: '请提供查询关键词' });
  }

  try {
    const query = `
          SELECT poem_id, title
          FROM poems
          WHERE content LIKE ? OR title LIKE ?
      `;
    const searchTerm = `%${keyword}%`;
    const [results] = await pool.execute(query, [searchTerm, searchTerm]);

    return res.cc(results, 0);
  } catch (error) {
    console.error('查询诗篇时出错:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}

//评论区渲染
async function getPoemss(req, res) {
  try {
    const { user_id, poem_id } = req.query;
    // 执行 SQL 查询，增加点赞数统计和用户是否点赞的状态
    const [rows] = await pool.execute(`
          SELECT 
              p.title, 
              p.content, 
              p.author,
              (SELECT COUNT(*) FROM likes WHERE poem_id = p.poem_id) AS likes_count,
              CASE WHEN l.poem_id IS NOT NULL THEN 1 ELSE 0 END AS is_liked
          FROM poems p
          LEFT JOIN likes l ON p.poem_id = l.poem_id AND l.user_id =?
          WHERE p.poem_id =? 
      `, [user_id, poem_id]);
    // 处理查询结果
    if (rows.length > 0) {
      return res.cc(rows, 0);
    } else {
      return res.cc('没有查询到管理员收录的诗篇', 1);
    }
  } catch (error) {
    console.error('获取管理员诗篇失败:', error);
    return res.cc('服务器内部错误', 500); // 建议明确返回 500 状态码
  }
}


//渲染评论
async function getPoempl(req, res) {
  try {
    // 执行 SQL 查询
    const [rows] = await pool.execute(`
       SELECT 
    c.comment_id,
    c.content,
    c.parent_comment_id,
    DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    u.avatar_url,
    u.nickname
FROM 
    comments c
JOIN 
    users u ON c.user_id = u.user_id
WHERE 
    c.poem_id = ?;
     ` , [req.query.poem_id]);

    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as comment_count
      FROM comments
      WHERE poem_id = ?;
    `, [req.query.poem_id]);

    const commentCount = countResult[0].comment_count;

      const responseData = {
        comments: rows,
        commentCount: commentCount
      };
      return res.cc(responseData, 0);
  } catch (error) {
    console.error('获取管理员诗篇失败:', error);
    return res.cc('服务器内部错误', 500); // 建议明确返回 500 状态码
  }
}

//提交评论

async function addComment(req, res) {
  try {
    const { poem_id, user_id, content } = req.body;

    // 插入评论数据
    const [insertResult] = await pool.execute(
      'INSERT INTO comments (poem_id, user_id, content) VALUES (?,?,?)',
      [poem_id, user_id, content]
    );

    return res.cc('评论添加成功', 0);
  } catch (error) {
    console.error('添加评论失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}

async function readdComment(req, res) {
  try {
    const { poem_id, user_id, content, parent_comment_id } = req.body;

    // 插入评论数据
    const [insertResult] = await pool.execute(
      'INSERT INTO comments (poem_id, user_id, content, parent_comment_id) VALUES (?,?,?,?)',
      [poem_id, user_id, content, parent_comment_id]
    );

    return res.cc('评论添加成功', 0);
  } catch (error) {
    console.error('添加评论失败:', error);
    return res.cc('服务器内部错误', 500);
  }
}

async function getPoemRelated(req, res) {
  const { content, promt } = req.query;
  const aa = await getPoemRelatedResponse(content, promt)
  return res.cc(aa, 0);
}




module.exports = {
  aicrete,
  category,
  getPoems,
  getrecom,
  toggleLike,
  postPoem,
  getpoemsall,
  getPoemsid,
  getPoemss,
  getPoempl,
  addComment,
  readdComment,
  getPoemRelated
};