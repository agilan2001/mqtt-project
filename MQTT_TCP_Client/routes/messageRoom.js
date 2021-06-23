var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body)
  res.render("messageRoom", {
      title:"MQTT Over TCP",
      clientId: req.body.client_id || ("Client"+parseInt(Math.random()*899+100)), 
      keep_alive: req.body.keep_alive,
      clean_session: req.body.clean_session?true:false,
      last_will_topic: req.body.last_will_topic,
      last_will_mes: req.body.last_will_mes,
      last_will_qos: req.body.last_will_qos,
      last_will_retain: req.body.last_will_retain?true:false,
    })
});

module.exports = router;
