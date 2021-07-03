const fs = require('fs')
const aedes = require('aedes')();
const serverFactory = require('aedes-server-factory');

const log = fs.createWriteStream('tls_log.txt', { flags: 'a' });

const quic_server = require('aedes-server-factory').createServer(aedes,
    {
        quic: {
            key: fs.readFileSync('./key.pem'),
            cert: fs.readFileSync('./cert.pem'),
            //port: 8885
        }
    });
quic_server.listen({
    idleTimeout: 0 //disable timeout
});

const tls_server = serverFactory.createServer(aedes, {
    tls: {
        cert: fs.readFileSync('./cert.pem'),
        key: fs.readFileSync('./key.pem'),
        rejectUnauthorized: false,
        minVersion: 'TLSv1.3'
    }
})

// tls_server.on('keylog', (line) => log.write(line))
// quic_server.on('session',(req)=>{
//     req.on('keylog',(line)=>log.write(line))
// })

tls_server.listen(1885)
