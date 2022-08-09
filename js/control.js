const CLUBS = {};
const ADDR_HEADER = "http://dev.mnemosyne.co.kr:1006";
const WS_HEADER = "ws://dev.mnemosyne.co.kr:9001";
const socket = new WebSocket(WS_HEADER);
socket.onopen = wsopen;
socket.onmessage = wsmessage;
socket.onclose = wsclose;
socket.onerror = wserror;

function wsopen() {
  console.log("socket server opened!");
  socket.send(
    JSON.stringify({
      command: "subscribe",
      topic: "TZLOG",
    })
  );
  socket.send(
    JSON.stringify({
      command: "subscribe",
      topic: "TZ_ANDROID_LOG",
    })
  );
  socket.send(
    JSON.stringify({
      command: "subscribe",
      topic: "TZ_APPLE_LOG",
    })
  );
}
function wsclose(event) {
  console.log("socket server cloded!", event.code, event.reason);
}
function wserror(e) {
  console.log(e.message);
}
function wsmessage(event) {
  let json;
  try {
    json = JSON.parse(event.data);
    log("mqtt", json.topic, json.message);
  } catch (e) {
    log("mqtt", event.data);
    return;
  }
}
