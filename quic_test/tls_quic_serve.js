const tls = require('tls');
const net = require('net')

const { readFileSync } = require('fs')
const key = readFileSync('./key.pem')
const cert = readFileSync('./cert.pem')

const server = tls.createServer({
    cert: cert,
    key: key,
    rejectUnauthorized: false,
    minVersion:'TLSv1.3'
},(c) => {
  c.pipe(c);
});
server.listen(8080);


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