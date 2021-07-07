var express = require('express');
var mqtt = require('mqtt')

var appWs = express()
var expressWs = require('express-ws')(appWs);

appWs.ws("/lab_ws", function (ws, req) {

    ws.on("message", function (mes) {
        var val = JSON.parse(mes)
        if (val.param == 'bomb') {
            bomb_test(ws, val);
        }

        if (val.param == 'rtt') {
            round_trip(ws, val);
        }

        if (val.param == 'rit') {
            reincarnate_time(ws, val)
        }
    })
})
appWs.listen(5500);


function bomb_test(ws, val) {

    var TCP_sent_cnt = 0;
    var TCP_rec_cnt = 0;
    var QUIC_sent_cnt = 0;
    var QUIC_rec_cnt = 0;
    var inter_cnt = 0

    //************ Clinet TCP SEND
    var client_TCP_send = mqtt.connect(`mqtts://${val.broker}:1885`,
        { rejectUnauthorized: false, keepalive: 60 })

    client_TCP_send.on('connect',
        () => {
            var bomb_publish = () => {
                TCP_sent_cnt++;
                client_TCP_send.publish('bomb', 'bomb', { qos: 1 }, () => setImmediate(bomb_publish))
            }
            bomb_publish();

        }
    )

    //************ Clinet QUIC SEND
    var client_QUIC_send = mqtt.connect(`quic://${val.broker}:8885`,
        { rejectUnauthorized: false, keepalive: 60 })
    client_QUIC_send.on('connect',
        () => {
            var bomb_publish = () => {
                QUIC_sent_cnt++;
                client_QUIC_send.publish('bomb', 'bomb', { qos: 1 }, () => setImmediate(bomb_publish))
            }
            bomb_publish();
        }
    )

    //************ Client TCP RECIEVE
    var client_TCP_rec = mqtt.connect(`mqtts://${val.broker}:1885`,
        { rejectUnauthorized: false, keepalive: 60 },

    )

    client_TCP_rec.on('connect',
        () => {
            // ws.send('client_rec_connected');
            client_TCP_rec.subscribe('bomb', () => {
                client_TCP_rec.on('message', () => {
                    TCP_rec_cnt++;
                })
            });

        }
    )

    //************ Client QUIC RECIEVE
    var client_QUIC_rec = mqtt.connect(`quic://${val.broker}:8885`,
        { rejectUnauthorized: false, keepalive: 60 },

    )

    client_QUIC_rec.on('connect',
        () => {
            // ws.send('client_rec_connected');
            client_QUIC_rec.subscribe('bomb', () => {
                client_QUIC_rec.on('message', () => {
                    QUIC_rec_cnt++;
                })
            });

        }
    )

    var bomb_inter = setInterval(() => {
        ws.send(JSON.stringify({ TCP_sent_cnt, QUIC_sent_cnt, TCP_rec_cnt, QUIC_rec_cnt }))
        TCP_sent_cnt = 0; QUIC_sent_cnt = 0; TCP_rec_cnt = 0; QUIC_rec_cnt = 0;

        inter_cnt++;
        if (inter_cnt == val.inter_cnt) {
            console.log('bomb_end');
            client_TCP_send.end(); client_TCP_rec.end(); client_QUIC_send.end(); client_QUIC_rec.end();
            clearInterval(bomb_inter);
            ws.close();
        }


    }, 1000 * val.upd_inter)

}

function round_trip(ws, val) {

    var TCP_pub_time;
    var TCP_rec_time;
    var QUIC_pub_time;
    var QUIC_rec_time;

    var TCP_trial_cnt = 0;
    var QUIC_trial_cnt = 0;


    //************ Client TCP 
    var TCP_client = mqtt.connect(`mqtts://${val.broker}:1885`,
        { rejectUnauthorized: false, keepalive: 60 })

    TCP_client.on('connect', () => {
        TCP_client.subscribe('rtt_test', () => {

            TCP_client.on('message', () => {
                TCP_rec_time = Date.now();
                ws.send(JSON.stringify({ TCP_RTT: TCP_rec_time - TCP_pub_time }))

                TCP_trial_cnt++;
                if (TCP_trial_cnt < val.trial_cnt) {

                    setTimeout(() => {
                        TCP_client.publish('rtt_test', 'rtt', () => {
                            TCP_pub_time = Date.now();
                        })
                    }, 2000)

                } else {
                    TCP_client.end();
                    console.log('rtt_tcp_end');
                    if (QUIC_trial_cnt == val.trial_cnt) {
                        ws.close()
                    }
                }
            })

            TCP_client.publish('rtt_test', 'rtt', () => {
                TCP_pub_time = Date.now();
            })
        })
    })

    //************ Client QUIC 
    var QUIC_client = mqtt.connect(`quic://${val.broker}:8885`,
        { rejectUnauthorized: false, keepalive: 60 })

    QUIC_client.on('connect', () => {
        QUIC_client.subscribe('rtt_quic', () => {

            QUIC_client.on('message', () => {
                QUIC_rec_time = Date.now();
                ws.send(JSON.stringify({ QUIC_RTT: QUIC_rec_time - QUIC_pub_time }))

                QUIC_trial_cnt++;
                if (QUIC_trial_cnt < val.trial_cnt) {
                    setTimeout(() => {
                        QUIC_client.publish('rtt_quic', 'rtt', () => {
                            QUIC_pub_time = Date.now();
                        })
                    }, 2000)
                } else {
                    QUIC_client.end();
                    console.log('rtt_quic_end');
                    if (TCP_trial_cnt == val.trial_cnt) {
                        ws.close()
                    }
                }
            })

            QUIC_client.publish('rtt_quic', 'rtt', () => {
                QUIC_pub_time = Date.now();
            })
        })
    })

    // ws.on('close', () => {
    //     console.log('rtt_end');
    //     QUIC_client.end(); TCP_client.end()
    //     clearTimeout(tcp_rtt_timeout);
    //     clearTimeout(quic_rtt_timeout);
    // })

}


function reincarnate_time(ws, val) {

    var TCP_cnct_time;
    var TCP_cnak_time;
    var QUIC_cnct_time;
    var QUIC_cnak_time;

    var TCP_trial_cnt = 0;
    var QUIC_trial_cnt = 0;

    //************ Client TCP 
    TCP_cnct_time = Date.now();
    var TCP_client = mqtt.connect(`mqtts://${val.broker}:1885`,
        { rejectUnauthorized: false, keepalive: 60 })

    TCP_client.on('connect', () => {

        TCP_cnak_time = Date.now();
        ws.send(JSON.stringify({ TCP_RIT: TCP_cnak_time - TCP_cnct_time }))
        TCP_client.end();

        TCP_trial_cnt++;
        if (TCP_trial_cnt < val.trial_cnt) {
            setTimeout(() => {
                TCP_cnct_time = Date.now();
                TCP_client.reconnect()
            }, 2000)
        } else {
            console.log('TCP_rit_end')
            if (QUIC_trial_cnt == val.trial_cnt) {
                ws.close()
            }
        }
    })

    //************ Client QUIC 
    QUIC_cnct_time = Date.now();
    var QUIC_client = mqtt.connect(`quic://${val.broker}:8885`,
        { rejectUnauthorized: false, keepalive: 60 })

    QUIC_client.on('connect', () => {

        QUIC_cnak_time = Date.now();
        ws.send(JSON.stringify({ QUIC_RIT: QUIC_cnak_time - QUIC_cnct_time }))
        QUIC_client.end();

        QUIC_trial_cnt++;
        if (QUIC_trial_cnt < val.trial_cnt) {
            setTimeout(() => {
                QUIC_cnct_time = Date.now();
                QUIC_client.reconnect()
            }, 2000)
        } else {
            console.log('QUIC_rit_end');
            if (TCP_trial_cnt == val.trial_cnt) {
                ws.close();
            }
        }
    })

    // ws.on('close', () => {
    //     console.log('rit_end');
    //     console.log(tcp_rit_timeout)
    //     clearTimeout(tcp_rit_timeout);
    //     clearTimeout(quic_rit_timeout);
    //     QUIC_client.end(); TCP_client.end();
    // })

}