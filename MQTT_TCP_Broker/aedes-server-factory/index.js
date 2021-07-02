const fs = require('fs')
const aedes = require('aedes')();
const serverFactory = require('aedes-server-factory');

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

tls_server.listen(1885)
