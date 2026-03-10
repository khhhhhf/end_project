const express = require("express");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

// 使用 CommonJS 语法导入模块
const { login, register, activeUser, deletecrete,updatePoem, renderProfile, updateUser, getLikedPoemsByUserId, renderCreate, deleteLikeById, searchfhl, eidtPoem } = require('../router_handler/user.js');

// 配置 multer 存储引擎
// 清理文件名函数
const cleanFileName = (fileName) => {
  return fileName
    .replace(/[^\w\u4e00-\u9fa5.-]/gi, '-')  // 保留中文字符、英文、数字、点(.)和短横线(-)
    .replace(/-+/g, '-')
    .trim();
};

// 配置multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const cleanedName = cleanFileName(baseName) + ext;
    const uniqueName = Date.now() + '-' + cleanedName;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });
router.post('/register', register);
router.post('/login', login);
router.get('/activeUser', activeUser);
router.get('/renderProfile', renderProfile);
router.post('/updateUser', upload.single('file'), updateUser);
router.get('/getLikedPoemsByUserId', getLikedPoemsByUserId);
router.get('/renderCreate', renderCreate);
router.delete('/deleteLikeById', deleteLikeById);
router.get('/searchfhl', searchfhl);
router.delete('/deletecrete', deletecrete);
router.get('/eidtPoem', eidtPoem);
router.post('/updatePoem', updatePoem);


// 使用 CommonJS 方式导出路由
module.exports = router;
