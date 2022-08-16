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
  log("socket server cloded!", event.code, event.reason);
}
function wserror(e) {
  log(e.message);
}
function wsmessage(event) {
  let json;
  try {
    json = JSON.parse(event.data);
    log("mqtt", json.topic, json.message);
    let msg;
    try {
      msg = JSON.parse(json.message);
      if (
        json.topic == "TZLOG" &&
        msg.deviceId == "f1b8ab82-1c3d-11ed-a93e-0242ac11000a"
      ) {
        if (msg.parameter) {
          const prm = JSON.parse(msg.parameter);
          if (prm.clubId) {
            const club = objGCUUID[prm.clubId];
            log("TZLOG>", msg.subType, club.eng_id, msg.message);
          } else {
            log("TZLOG>", msg.subType, msg.parameter, msg.message);
          }
        } else {
          log("TZLOG>", msg.subType, msg.message);
        }
      }
    } catch (e) {
      log(e);
      //log("<<", json.message);
    }
  } catch (e) {
    log("mqtt", event.data);
    return;
  }
}
