const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const webHeader = "https://dev.mnemosyne.co.kr/html";
const dictClub = {};
const cf = new jCommon();

const clubs = {};
let selectedClub;
let selectedSearchClub;
let selectedDevice;
const deviceColor = "lightblue";

let obMacroIds = {};

main();
function main() {
  post(urlHeader + "/getMacroId", {}, httpHeader, (resp) => {
    const { type, data } = resp.jp();
    if (type == "error") return;
    data.forEach(({ macro_id }) => {
      const [device, ts] = macro_id.split("_");
      if (!obMacroIds[device]) obMacroIds[device] = [];
      obMacroIds[device].push(ts);
    });
    setMacroIds();
  });
  post(apiHeader + "/getGolfClubs", {}, httpHeader, (resp) => {
    const { golfClubs } = resp.jp();
    golfClubs.forEach((ob) => {
      clubs[ob.id] = ob;
    });
  });
}
function setMacroIds() {
  Object.keys(obMacroIds).forEach((device) => {
    const span = elDeviceList.add("div");
    span.className = "device";
    span.str(device);
    span.onmousemove = devicemousemove;
    span.onmouseout = devicemouseout;
    span.onclick = deviceclick;
    span.device_id = device;
  });
}
function deviceclick() {
  cssInit(this, elDeviceList);
  selectedDevice = this;
  const { device_id } = this;
  elClubList.str("");
  setMacroList(device_id);
}
function setMacroList(device_id) {
  obMacroIds[device_id].forEach((macroId) => {
    const span = elClubList.add("span");
    span.className = "device";
    span.str(macroId);
    span.device_id = device_id;
    span.macro_id = macroId;
    span.onmousemove = devicemousemove;
    span.onmouseout = devicemouseout;
    span.onclick = macroclick;
  });
}
function macroclick() {
  cssInit(this, elClubList);
  selectedClub = this;
  const { device_id, macro_id } = this;
  const macroId = [device_id, macro_id].join("_");
  post(urlHeader + "/getLogReport", { macroId }, httpHeader, (resp) => {
    const { type, data } = resp.jp();
    if (type == "error") return;
    setResultTable(data);
  });
}
function setResultTable(data) {
  elTable.str("");
  data.forEach((row) => {
    if (row.script_action_result == "normal") return;
    insertRow(tplSearchList, elTable, row);
  });
}
function insertRow(template, element, object) {
  log(object);
  const ROW = doc.importNode(template.content, true);
  const [TR] = ROW.querySelectorAll("tr");
  const tr = TR.children;
  let i = 0;
  Object.keys(object).forEach((key) => {
    if (key == "id") return;
    if (key == "device_id") return;
    if (key == "updated_at") return;
    let val = object[key];
    if (key == "golf_club_id") val = clubs[val].name;
    tr[i++].str(val);
  });
  element.appendChild(ROW);
}
function devicemousemove() {
  if (this == selectedDevice) return;
  if (this == selectedClub) return;
  if (this == selectedSearchClub) return;
  this.css({ "background-color": deviceColor });
}
function devicemouseout() {
  if (this == selectedDevice) return;
  if (this == selectedClub) return;
  if (this == selectedSearchClub) return;
  this.css({ "background-color": "white" });
}
function cssInit(el, cover, target) {
  Array.from(cover.children).forEach((club) => {
    club.css({ "background-color": "white" });
  });
  el.css({ "background-color": deviceColor });
}
