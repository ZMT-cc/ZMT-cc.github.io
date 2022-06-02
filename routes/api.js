var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();

/* 链接mongodb  如果端口号是默认27017 可以省略不写 */
mongoose.connect('mongodb://localhost/local')
mongoose.connection.once('open', () => {
  console.log('数据库连接成功')
})

require('./apis/role')(router);
require('./apis/login')(router);
require('./apis/permissions')(router);
require('./apis/users')(router);


/* GET users listing. */ //set DEBUG=e-commerce-office-system:* & npm start

module.exports = router;