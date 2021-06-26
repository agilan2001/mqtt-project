const { createQuicSocket } = require('net')
const { readFileSync } = require('fs')
const key = readFileSync('./key.pem')
const cert = readFileSync('./cert.pem')
const alpn = 'echo'
const server = createQuicSocket({
  // Bind to local UDP port 5678
  endpoint: { port: 8883 },
  // Create the default configuration for new
  // QuicServerSession instances
  server: {
    key: key,
    cert: cert,
    alpn: alpn
  }
})
server.listen()
server.on('ready', () => {
  // console.log(`QUIC server is listening on ${server.address.port}`)
})
server.on('session', (session) => {
  session.on('stream', (stream) => {
    // Echo server!
    // console.log(1)

    // stream.pipe(stream)

    stream.on('data', (chunk) => { 
      console.log(chunk) 
      stream.write(Buffer.from("20020000","hex"))
      // session.destroy()
    })

    // console.log(stream)
  })

  // const stream = session.openStream()
  // stream.write('hello from the server')
})