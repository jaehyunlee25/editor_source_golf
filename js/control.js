const CLUBS = {};
const ADDR_HEADER = "https://dev.mnemosyne.co.kr/api/reservation";
const WS_HEADER = "wss://dev.mnemosyne.co.kr/wss";
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
  console.dir(event);
  log("socket server cloded!", event.code, event.reason);
}
function wserror(e) {
  console.dir(e);
  log(e.message);
}
function wsmessage(event) {
  let json;
  let message;
  try {
    json = JSON.parse(event.data);
    try {
      message = JSON.parse(json.message);
    } catch (e) {
      log(e);
      log("mqtt parse error 2 ", json.message);
      return;
    }
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

    try {
      if (POP) POP.close();
    } catch (e) {
      log("no popup");
    }
    const engname = (
      objGolfClubs[row.golf_club_id] || objGCUUID[row.golf_club_id]
    ).eng_id;
    if (!LOG[row.device_id]) LOG[row.device_id] = {};
    if (!LOG[row.device_id][engname]) LOG[row.device_id][engname] = [];
    LOG[row.device_id][engname].push(row);
    //tabLog.onclick();
    deviceDiv[row.device_id].onclick();
    clubAnchor[engname].onclick();
  } catch (e) {
    // log(e);
    log("mqtt parse error 1 ", event.data);
    return;
  }
}
