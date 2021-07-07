var bomb_send_chart = new Chart(document.getElementById('bomb_send_chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'TCP',
                data: [],
                borderColor: "red",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: 'QUIC',
                data: [],
                borderColor: "blue",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Intervals',
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Messages / Interval',
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Bombing Send Frequency'
            }
        }
    },
})

var bomb_rec_chart = new Chart(document.getElementById('bomb_rec_chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'TCP',
                data: [],
                borderColor: "red",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: 'QUIC',
                data: [],
                borderColor: "blue",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Intervals',
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Messages / Interval',
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Bombing Receive Frequency'
            }
        }
    },
})


var rtt_chart = new Chart(document.getElementById('rtt_chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'TCP',
                data: [],
                borderColor: "red",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: 'QUIC',
                data: [],
                borderColor: "blue",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Trials',
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Time',
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Round Trip Time'
            }
        }
    },
})


var rit_chart = new Chart(document.getElementById('rit_chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'TCP',
                data: [],
                borderColor: "red",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
            {
                label: 'QUIC',
                data: [],
                borderColor: "blue",
                //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Trials',
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Time',
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Reincarnation Time'
            }
        }
    },
})


var ws_bomb;

function bomb_click() {

    // if (btn_bomb.innerHTML == "BOMB") {
    //     btn_bomb.innerHTML = "STOP";
    //     btn_bomb.classList.remove('btn-primary');
    //     btn_bomb.classList.add('btn-danger');

    btn_bomb.classList.add('disabled')

    var cnt = 1;
    bomb_send_chart.data.labels = [];
    bomb_send_chart.data.datasets[0].data = [];
    bomb_send_chart.data.datasets[1].data = [];
    bomb_send_chart.update()

    bomb_rec_chart.data.labels = [];
    bomb_rec_chart.data.datasets[0].data = [];
    bomb_rec_chart.data.datasets[1].data = [];
    bomb_rec_chart.update()

    ws_bomb = new WebSocket(`ws://${window.location.host.split(":")[0] + ":5500"}/lab_ws`);
    ws_bomb.addEventListener("open", () => {
        ws_bomb.send(JSON.stringify({
            param: 'bomb',
            broker: broker_url_txt.value,
            TCP_port: parseInt(tcp_broker_port_txt.value),
            QUIC_port: parseInt(quic_broker_port_txt.value),
            upd_inter: parseInt(upd_inter_txt.value),
            inter_cnt: parseInt(inter_cnt_txt.value)
        }))
    })

    ws_bomb.addEventListener('message', (event) => {
        var val = JSON.parse(event.data);

        bomb_send_chart.data.labels.push(cnt);
        bomb_send_chart.data.datasets[0].data.push(val.TCP_sent_cnt)
        bomb_send_chart.data.datasets[1].data.push(val.QUIC_sent_cnt)
        bomb_send_chart.update()

        bomb_rec_chart.data.labels.push(cnt);
        bomb_rec_chart.data.datasets[0].data.push(val.TCP_rec_cnt)
        bomb_rec_chart.data.datasets[1].data.push(val.QUIC_rec_cnt)
        bomb_rec_chart.update()

        cnt++;

    })

    ws_bomb.addEventListener('close', () => {
        console.log('bomb_done');
        btn_bomb.classList.remove('disabled');
    })

    // } else {
    //     btn_bomb.innerHTML = "BOMB";
    //     btn_bomb.classList.remove('btn-danger');
    //     btn_bomb.classList.add('btn-primary');
    //     ws_bomb.close()
    // }
}

var ws_rtt;

function rtt_click() {

    // if (btn_rtt.innerHTML == "START") {
    //     btn_rtt.innerHTML = "STOP";
    //     btn_rtt.classList.remove('btn-primary');
    //     btn_rtt.classList.add('btn-danger');

    btn_rtt.classList.add('disabled');

    rtt_chart.data.labels = [];
    rtt_chart.data.datasets[0].data = [];
    rtt_chart.data.datasets[1].data = [];
    rtt_chart.update()

    ws_rtt = new WebSocket(`ws://${window.location.host.split(":")[0] + ":5500"}/lab_ws`);
    ws_rtt.addEventListener("open", () => {
        ws_rtt.send(JSON.stringify({
            param: 'rtt',
            broker: rtt_broker_url_txt.value,
            TCP_port: parseInt(rtt_tcp_broker_port_txt.value),
            QUIC_port: parseInt(rtt_quic_broker_port_txt.value),
            trial_cnt: parseInt(rtt_trial_cnt.value)
        }))
    })

    ws_rtt.addEventListener('message', (event) => {
        var val = JSON.parse(event.data);

        if ('TCP_RTT' in val) {
            // console.log(val.TCP_RTT)
            rtt_chart.data.datasets[0].data.push(val.TCP_RTT)
        } else {
            rtt_chart.data.datasets[1].data.push(val.QUIC_RTT)
        }


        rtt_chart.data.labels = [...Array(Math.max(rtt_chart.data.datasets[0].data.length, rtt_chart.data.datasets[1].data.length) + 1).keys()].slice(1)
        // console.log(rtt_chart.data.labels)
        rtt_chart.update()
    })

    ws_rtt.addEventListener('close', () => {
        console.log('rtt_done');
        btn_rtt.classList.remove('disabled');
    })
    
    // } else {
    //     btn_rtt.innerHTML = "START";
    //     btn_rtt.classList.remove('btn-danger');
    //     btn_rtt.classList.add('btn-primary');
    //     ws_rtt.close()
    // }
}


var ws_rit;

function rit_click() {

    // if (btn_rit.innerHTML == "START") {
    //     btn_rit.innerHTML = "STOP";
    //     btn_rit.classList.remove('btn-primary');
    //     btn_rit.classList.add('btn-danger');

    btn_rit.classList.add('disabled');

    rit_chart.data.labels = [];
    rit_chart.data.datasets[0].data = [];
    rit_chart.data.datasets[1].data = [];
    rit_chart.update()

    ws_rit = new WebSocket(`ws://${window.location.host.split(":")[0] + ":5500"}/lab_ws`);
    ws_rit.addEventListener("open", () => {
        ws_rit.send(JSON.stringify({
            param: 'rit',
            broker: rit_broker_url_txt.value,
            TCP_port: parseInt(rit_tcp_broker_port_txt.value),
            QUIC_port: parseInt(rit_quic_broker_port_txt),
            trial_cnt: parseInt(rit_trial_cnt.value)
        }))
    })

    ws_rit.addEventListener('message', (event) => {
        var val = JSON.parse(event.data);

        if ('TCP_RIT' in val) {
            rit_chart.data.datasets[0].data.push(val.TCP_RIT)
        } else {
            rit_chart.data.datasets[1].data.push(val.QUIC_RIT)
        }


        rit_chart.data.labels = [...Array(Math.max(rit_chart.data.datasets[0].data.length, rit_chart.data.datasets[1].data.length) + 1).keys()].slice(1)
        // console.log(rtt_chart.data.labels)
        rit_chart.update()
    })

    ws_rit.addEventListener('close',()=>{
        console.log('rit_done');
        btn_rit.classList.remove('disabled')
    })
    // } else {
    //     btn_rit.innerHTML = "START";
    //     btn_rit.classList.remove('btn-danger');
    //     btn_rit.classList.add('btn-primary');
    //     ws_rit.close()
    // }
}