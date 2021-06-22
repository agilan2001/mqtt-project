var express = require('express');

var router = express.Router();

var mqtt = require('mqtt')

var clients = {};

router.post('/connect', function(req, res, next) {
    var clientId = req.body.clientId
    var client = mqtt.connect("mqtt://localhost", {clientId:clientId})
    client.on('connect',function(){
        clients[clientId] = {}
        clients[clientId].client = client
        res.end("client connected")
    })
});

router.post('/subscribe', function(req, res, next) {
    var {clientId,topic,qos} = req.body;
    var client = clients[clientId].client
    client.subscribe(topic,{qos:qos}, function(err){
        if(!err){
            res.end(`Subscribed ${clientId} to ${topic} with QOS ${qos}`)
        }
    })
});

router.post('/publish', function(req, res, next) {
    var {clientId,topic,qos, message, retain} = req.body;
    var client = clients[clientId].client
    client.publish(topic, message,{qos:qos, retain: retain}, function(err){
        if(!err){
            res.end(`Published to ${topic} with QOS ${qos}`)
        }
    })
});



var appWs = express()
var expressWs = require('express-ws')(appWs);

appWs.ws("/client_ws", function(ws,req){
  ws.on("message",function(mes){
      clients[mes].socket = ws
      clients[mes].client.on("message", function(topic, message){
          ws.send(JSON.stringify({topic:topic, message: message.toString()}))
      })

  })
})
appWs.listen(5000)

module.exports = router;
