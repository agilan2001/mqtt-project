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


function bomb_click() {


    var cnt = 1;

    var ws = new WebSocket(`ws://${window.location.host.split(":")[0] + ":5500"}/lab_ws`);
    ws.addEventListener("open", () => {
        ws.send(JSON.stringify({
            param: 'bomb',
            broker: broker_url_txt.value,
            TCP_port: parseInt(tcp_broker_port_txt.value),
            QUIC_port: parseInt(quic_broker_port_txt),
            upd_inter: parseInt(upd_inter_txt.value)
        }))
    })

    ws.addEventListener('message', (event) => {
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
}