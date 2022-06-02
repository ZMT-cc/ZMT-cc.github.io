var express = require('express');
var router = express.Router();
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(fs.readFileSync('../public/index.html',), { title: 'Express' });
});

module.exports = router;
