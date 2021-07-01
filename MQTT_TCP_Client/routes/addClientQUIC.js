var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addClientQUIC', { title: 'MQTT Over QUIC' });
});

module.exports = router;