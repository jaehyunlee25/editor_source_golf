const CLUBS = {};
const ADDR_HEADER = "http://dev.mnemosyne.co.kr:1006";
const WS_HEADER = "ws://dev.mnemosyne.co.kr:9001";
const socket = new WebSocket(WS_HEADER);
let wsCount = 1000000;

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
  let message;
  try {
    json = JSON.parse(event.data);
    try {
      message = JSON.parse(json.message);
      const row = {
        id: wsCount++,
        type: "command",
        sub_type: message.subType,
        device_id: message.deviceId,
        device_token: "",
        ip: "",
        golf_club_id: message.golfClubId || message.clubId,
        message: message.message,
        paramater: message.parameter,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (POP) POP.close();
      const engname = (
        objGolfClubs[row.golf_club_id] || objGCUUID[row.golf_club_id]
      ).eng_id;
      if (!LOG[row.device_id]) LOG[row.device_id] = {};
      if (!LOG[row.device_id][engname]) LOG[row.device_id][engname] = [];
      LOG[row.device_id][engname].push(row);
      tabLog.onclick();
      deviceDiv[row.device_id].onclick();
      clubAnchor[engname].onclick();
    } catch (e) {
      log(e);
      log("mqtt parse error 2 ", event.data);
    }
  } catch (e) {
    // log(e);
    log("mqtt parse error 1 ", event.data);
    return;
  }
}
