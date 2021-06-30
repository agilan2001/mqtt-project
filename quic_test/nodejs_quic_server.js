const { createQuicSocket } = require('net')
const { readFileSync } = require('fs')
const key = readFileSync('./key.pem')
const cert = readFileSync('./cert.pem')
const alpn = 'mqtt'
const server = createQuicSocket({
  
  endpoint: { port: 8883 },
  server: {
    key: key,
    cert: cert,
    alpn: alpn
  }
})
server.listen()

server.on('session', (session) => {
  session.on('stream', (stream) => {
    stream.on('data', (chunk) => { 
      console.log(chunk) 
    })
  })
})