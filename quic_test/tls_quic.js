var net = require('net')
var tls = require('tls')
var fs = require('fs');
const log = fs.createWriteStream('tls_log.txt', { flags: 'a' });

var host = "10.137.89.22"
// var host = "localhost"

var mes = new Array(100).fill("Viasat").reduce((a, e, i) => a + i + e + " ", "")
// 0Viasat 1Viasat 2Viasat 3Viasat 4Viasat .... 99Viasat

console.log("Message Size ", Buffer.byteLength(mes))

var tcp_connect_start_time = Date.now()
var tcp_connection_time
var tcp_chunks = 0;
var tcp_fin = false;

var socket = tls.connect(8080, host,
    {
        rejectUnauthorized: false,
        minVersion:'TLSv1.3'
    })

socket.on('keylog', (line) => log.write(line));


socket.on('secureConnect', () => {
    tcp_connection_time = Date.now() - tcp_connect_start_time;
    console.log("TCP: Connected in ", tcp_connection_time, " ms...")
    console.log(socket.localPort)
    socket.write(mes, () => {
        tcp_sent_time = Date.now()
        console.log("hi TCP sent at ", tcp_sent_time)
    })

    socket.end()
})

var tcp_sent_time;
var tcp_del_time;


socket.on("data", data => {
    var tcp_rec_time = Date.now()
    tcp_del_time = tcp_rec_time - tcp_sent_time
    var str = data.toString();
    console.log(str.slice(0, 10) + "..." + str.slice(str.length - 10), " TCP received at ", tcp_rec_time)

    console.log("TCP Send-Receive Delay = ", tcp_del_time, " ms")
    tcp_chunks++;

    if (str.slice(str.length - 10) == mes.slice(mes.length - 10)) {
        tcp_fin = true;
        display_stat()
    }

})


const q_socket = net.createQuicSocket({
    client: {
        alpn: "echo",
    }
})


var quic_connect_start_time = Date.now()
var quic_connection_time;
var quic_del_time;
var quic_chunks = 0;
var quic_fin = false

const req = q_socket.connect({
    address: host,
    port: 9090
})


req.on('keylog', (line) => log.write(line));


req.on('secure', () => {

    quic_connection_time = Date.now() - quic_connect_start_time;
    console.log("QUIC: Connected in ", quic_connection_time, " ms...")

    const streamP = req.openStream()

    var quic_sent_time = Date.now()
    console.log("hi QUIC sent at ", quic_sent_time)
    streamP.on('data', (chunk) => {
        var quic_rec_time = Date.now()

        quic_del_time = quic_rec_time - quic_sent_time;
        var str = chunk.toString();

        console.log(str.slice(0, 10) + "..." + str.slice(str.length - 10), " : QUIC received at ", quic_rec_time)
        console.log("QUIC Send-Receive Delay = ", quic_del_time, " ms")
        quic_chunks++

        if (str.slice(str.length - 10) == mes.slice(mes.length - 10)) {
            quic_fin = true;
            req.close()
            display_stat()
        }
    })

    streamP.write(mes)
    req.close()
})


display_stat = () => {
    if (quic_fin && tcp_fin)
        console.table({
            "Chunks": {
                "TCP": tcp_chunks,
                "QUIC": quic_chunks
            },
            "Connection Time": {
                "TCP": tcp_connection_time,
                "QUIC": quic_connection_time,
            },

            "Send-Receive Delay": {
                "TCP": tcp_del_time,
                "QUIC": quic_del_time
            },
            "------------------":{
                
            },
            "TOTAL": {
                "TCP": tcp_connection_time + tcp_del_time,
                "QUIC": quic_connection_time + quic_del_time
            }
        })
}
