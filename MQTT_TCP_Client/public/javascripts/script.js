clientId = prompt("client id");
  fetch("client/connect", {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: clientId })
  }).then(res => res.text()).then(text => {
    console.log(text)

    ws = new WebSocket(`ws://${window.location.host.split(":")[0]+":5000"}/client_ws`);
    ws.addEventListener('open', function (event) {
      ws.send(clientId);
      console.log("ws opened")
    });
    ws.addEventListener('message',function(event){
      rec_mes.innerHTML = event.data
    })
  })


  function subscribe_click() {
    fetch("client/subscribe", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientId,
        topic: subscribe_topic.value,
        qos: parseInt(subscribe_qos.value)
      })
    }).then(res => res.text()).then(console.log)

  }
  function publish_click() {
    fetch("client/publish", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientId,
        message: publish_mes.value,
        topic: publish_topic.value,
        qos: parseInt(publish_qos.value)
      })
    }).then(res => res.text()).then(console.log)
  }