const str = window.location.href;
const url = new URL(str);
const urlOrderId = url.search;

document.getElementById('orderId').innerHTML = urlOrderId.substring(1);