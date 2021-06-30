const net = require('net');
const server = net.createServer((c) => {
  c.pipe(c);
});
server.listen(8080);


const { readFileSync } = require('fs')
const key = readFileSync('./key.pem')
const cert = readFileSync('./cert.pem')

const q_server = net.createQuicSocket({
  endpoint: { port: 9090 },
  server: {
    key: key,
    cert: cert,
    alpn: "echo"
  }
})
q_server.listen()

q_server.on('session', (session) => {
  session.on('stream', (stream) => {
    stream.pipe(stream)
  })
})