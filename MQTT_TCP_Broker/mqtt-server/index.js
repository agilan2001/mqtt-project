var fs = require('fs');
var mqttServer = require('mqtt-server');

var servers = mqttServer({
  mqtt: 'tcp://localhost:1883',
  mqtts: 'ssl://localhost:8883',
  mqttws: 'ws://localhost:1884',
  mqtwss: 'wss://localhost:8884'
}, {
  ssl: {
    // key: fs.readFileSync('./server.key'),
    // cert: fs.readFileSync('./server.crt')
  },
  emitEvents: true // default
}, function(client){
  client.connack({
    returnCode: 0
  });
});

servers.listen(function(){
  console.log('listening!');
});