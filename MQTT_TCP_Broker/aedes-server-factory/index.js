const aedes = require('aedes')();
const server = require('aedes-server-factory').createServer(aedes, { quic: true, });

server.listen()

// const server = require('aedes-server-factory').createServer(aedes);


// server.listen({
//     port:1883
// });