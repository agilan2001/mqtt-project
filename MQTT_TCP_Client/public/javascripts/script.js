
var subs = {};

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
    subs[subscribe_topic.value] = parseInt(subscribe_qos.value)

  }
  function publish_click() {
    fetch("client/publish", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientId,
        message: publish_mes.value,
        topic: publish_topic.value,
        qos: parseInt(publish_qos.value),
        retain: publish_retain.checked
      })
    }).then(res => res.text()).then(console.log)
  }

  function unsubscribe_click() {
    fetch("client/unsubscribe", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientId,
        topic: subscribe_topic.value,
      })
    }).then(res => res.text()).then(console.log)

    subs[subscribe_topic.value] = undefined

  }

  function disconnect_click() {
    fetch("client/disconnect", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: clientId,
      })
    }).then(res => res.text()).then(console.log)

  }

  
  function show_subs_click(){
    var ih = "<ul>"
    for (i in subs){
      if(subs[i]!=undefined)
        ih += `<li>${i} : ${subs[i]}</li>`
    }
    ih+="</ul>"
    subs_cont.innerHTML = ih
  }