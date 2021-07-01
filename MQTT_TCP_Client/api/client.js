var express = require('express');

var router = express.Router();

var mqtt = require('mqtt');

var clients = {};

router.post('/connect', function (req, res, next) {
    console.log(req.body)
    clientId = req.body.clientId
    var options = {clientId: clientId, keepalive: req.body.keep_alive, rejectUnauthorized: false }
    if(req.body.last_will_topic)
        options["will"] = {
            topic:req.body.last_will_topic,
            payload:req.body.last_will_mes,
            qos:req.body.last_will_qos,
            retain:req.body.last_will_retain
        }
        
    var client = mqtt.connect("mqtts://localhost:1885", options)
    client.on('connect', function () {
        clients[clientId] = {}
        clients[clientId].client = client
        res.end("client connected")
    })
});

router.post('/subscribe', function (req, res, next) {
    var { clientId, topic, qos } = req.body;
    var client = clients[clientId].client
    client.subscribe(topic, { qos: qos }, function (err) {
        if (!err) {
            res.end(`Subscribed ${clientId} to ${topic} with QOS ${qos}`)
        }
    })
});

router.post('/publish', function (req, res, next) {
    var { clientId, topic, qos, message, retain } = req.body;
    var client = clients[clientId].client
    client.publish(topic, message, { qos: qos, retain: retain }, function (err) {
        if (!err) {
            res.end(`Published to ${topic} with QOS ${qos}`)
        }
    })
});

router.post('/unsubscribe', function (req, res, next) {
    var { clientId, topic } = req.body;
    var client = clients[clientId].client
    client.unsubscribe(topic, function(event){
        res.end(`Unsubscribed ${clientId} from ${topic}`)
    })
});

router.post('/disconnect', function (req, res, next) {
    var { clientId } = req.body;
    var client = clients[clientId].client
    client.end()
});




var appWs = express()
var expressWs = require('express-ws')(appWs);

appWs.ws("/client_ws", function (ws, req) {
    ws.on("message", function (mes) {
        clients[mes].socket = ws

        ws.on("close", function (event) {
            console.log("disconnect ")
            clients[mes].client.options.keepalive = clients[mes].client.options.keepalive * 10
            clients[mes].client.options.reconnectPeriod = 0
            clients[mes] = undefined
        });
        
        clients[mes].client.on("message", function (topic, message) {
            

            ws.send(JSON.stringify({ topic: topic, message: message.toString() }))

            
        })

    })


})
appWs.listen(5000)

module.exports = router;
