
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
  }).then(res => res.text()).then(show_info)
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
  }).then(res => res.text()).then(show_info)
}

function unsubscribe_click() {
  fetch("client/unsubscribe", {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: clientId,
      topic: subscribe_topic.value,
    })
  }).then(res => res.text()).then(show_info)

  subs[subscribe_topic.value] = undefined

}

function disconnect_click() {
  fetch("client/disconnect", {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: clientId,
    })
  }).then(res => res.text()).then(show_info)

}


function show_subs_click() {
  var ih = "<ul>"
  for (i in subs) {
    if (subs[i] != undefined)
      ih += `<li>${i} : ${subs[i]}</li>`
  }
  ih += "</ul>"
  subs_cont.innerHTML = ih
}

var show_info = (res) => {
  var toast_container = document.getElementById("mes_cont")
  var toast_el = toast_container.querySelector(".toast").cloneNode(true)
  toast_el.classList.remove('bg-info');
  toast_el.classList.add('bg-danger');
  toast_el.querySelector(".mes_topic").innerHTML = ":INFO:"
  toast_el.querySelector(".mes_body").innerHTML = res

  toast_container.appendChild(toast_el)

  var bs_toast = new bootstrap.Toast(toast_el, { delay: 20000 })
  bs_toast.show()

  toast_el.addEventListener('hidden.bs.toast', function () {
    toast_container.removeChild(toast_el)
  })
}


