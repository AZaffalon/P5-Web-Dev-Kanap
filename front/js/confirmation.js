const searchParams = new URLSearchParams(window.location.search);
const orderId = searchParams.get('orderId');

if(orderId) {
  document.getElementById('orderId').innerHTML = orderId;
} else {
  window.location.href = './index.html';
}