const express = require("express");
const router = express.Router();

// 使用 CommonJS 语法导入模块
const { aicrete, getPoems, category, getrecom, getPoemRelated, readdComment, addComment, getPoemsid, postPoem, toggleLike, getpoemsall, getPoemss, getPoempl, getAllUserPoems, deletePoem, postClassicPoem } = require('../router_handler/poem.js');

router.get('/aicrete', aicrete);
router.get('/category', category);
router.get('/getPoems', getPoems);
router.get('/getrecom', getrecom);
router.post('/toggleLike', toggleLike);
router.post('/postPoem', postPoem);
router.get('/getpoemsall', getpoemsall);
router.get('/getPoemsid', getPoemsid);
router.get('/getPoemss', getPoemss);
router.get('/getPoempl', getPoempl);
router.post('/addComment', addComment);
router.post('/readdComment', readdComment);
router.get('/getPoemRelated', getPoemRelated);

// 管理员接口
router.get('/getAllUserPoems', getAllUserPoems);
router.post('/deletePoem', deletePoem);
router.post('/postClassicPoem', postClassicPoem);


// 导出路由
module.exports = router;
