const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const webHeader = "https://dev.mnemosyne.co.kr/html";
const dictClub = {};
const cf = new jCommon();

const clubs = {};
let selectedClub;
let selectedSearchClub;
let selectedDevice;
const deviceColor = "lightblue";

main();
function main() {
  iptYear.value = new Date().getFullYear();
  iptMonth.value = (new Date().getMonth() + 1 + "").addzero();
  iptDate.value = (new Date().getDate() + "").addzero();
  [iptYear, iptMonth, iptDate].forEach((ipt) => {
    ipt.onfocus = iptonfocus;
    ipt.onkeyup = iptonkeyup;
  });
  post(apiHeader + "/getGolfClubs", {}, httpHeader, (resp) => {
    const { golfClubs } = resp.jp();
    golfClubs.forEach((ob) => {
      clubs[ob.id] = ob;
    });
  });
  iptClub.onkeyup = clubsearchkeyup;
  iptClub.onfocus = function () {
    this.select();
  };
}
function clubsearchkeyup() {
  clearData();
  const word = this.value;
  if (word.trim() == "") return;
  const res = [];
  Object.keys(clubs).forEach((id) => {
    const club = clubs[id];
    if (club.name.has(word)) res.push(club);
    if (club.eng_id.has(word)) res.push(club);
  });
  res.forEach((club) => {
    const span = elSearchClubList.add("span");
    span.className = "searchClub";
    span.str(club.name);
    span.onmousemove = devicemousemove;
    span.onmouseout = devicemouseout;
    span.onclick = function () {
      cssInit(this, elSearchClubList);
      selectedSearchClub = this;
      iptClub.value = club.eng_id;
      elSearchClubList.str("");
    };
  });
}
function setDeviceList(list) {
  list.forEach(({ device_id }, i) => {
    const span = elDeviceList.add("span");
    span.className = "device";
    span.str(i);
    span.device_id = device_id;
    span.onmousemove = devicemousemove;
    span.onmouseout = devicemouseout;
    span.onclick = deviceclick;
  });
}
function setClubList(device_id, list) {
  list.forEach(({ golf_club_id }, i) => {
    const club = clubs[golf_club_id];
    if (!club) return;
    const span = elClubList.add("span");
    span.className = "device";
    span.str(club.eng_id);
    span.device_id = device_id;
    span.golf_club_id = golf_club_id;
    span.onmousemove = devicemousemove;
    span.onmouseout = devicemouseout;
    span.onclick = clubclick;
  });
}
function setClubLog(list) {
  let pTS;
  const gLog = [];
  let logs = [];
  list.forEach((loglet, i) => {
    const { created_at, message } = loglet;
    const timestamp = new Date(created_at).getTime();
    if (i == 0) {
      pTS = timestamp;
      return;
    }
    if (timestamp - pTS > 5000) {
      gLog.push(logs);
      logs = [];
    }
    logs.push(loglet);
    if (message.indexOf("app_result") != -1) {
      gLog.push(logs);
      logs = [];
    }
    pTS = timestamp;
  });
  if (logs.length > 0) gLog.push(logs);
  gLog.forEach((logs, i) => {
    const divGroup = elClubLog.add("div");
    if (i > 0) divGroup.css({ "margin-top": 200 + "px" });
    logs.forEach((log) => {
      const div = divGroup.add("div");
      div.css({ "margin-top": 5 + "px", "font-size": 12 + "px" });
      const head = div.add("div");
      const { ip, type, sub_type, message, parameter, created_at } = log;
      head.str([ip, type, sub_type].join(" "));
      const body = div.add("div");
      const taMsg = body.add("textarea");
      taMsg.value = message;
      const taParam = body.add("textarea");
      taParam.value = parameter;
      const foot = div.add("div");
      const nt = new Date(new Date(created_at).getTime());
      foot.str([nt, nt.getTime()].join(" "));
    });
  });
}
function clubclick() {
  cssInit(this, elClubList);
  selectedClub = this;

  const { device_id, golf_club_id } = this;
  const date = (iptYear.value + iptMonth.value + iptDate.value).datify("-");

  elClubLog.str("");
  post(
    urlHeader + "/getLog",
    { date, device_id, golf_club_id },
    httpHeader,
    (resp) => {
      const { data } = resp.jp();
      setClubLog(data);
    }
  );
}
function iptonfocus() {
  this.select();
}
function iptonkeyup(e) {
  if (e.keyCode == 38) {
    // keyup
    const num = this.value * 1;
    const str = (num + 1 + "").addzero();
    this.value = str;
    this.select();
  }
  if (e.keyCode == 40) {
    // keydown
    let num = this.value * 1;
    if (num < 2) num = 2;
    const str = (num - 1 + "").addzero();
    this.value = str;
    this.select();
  }
}
function deviceclick() {
  cssInit(this, elDeviceList);
  selectedDevice = this;
  const { device_id } = this;
  elClubList.str("");
  const date = iptYear.value + iptMonth.value + iptDate.value;
  post(
    urlHeader + "/getLogClubList",
    { date, device_id },
    httpHeader,
    (resp) => {
      const { data } = resp.jp();
      setClubList(device_id, data);
    }
  );
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
function clearData() {
  elDeviceList.str("");
  elClubList.str("");
  elClubLog.str("");
  elSearchClubList.str("");
}
btnSearch.onclick = function () {
  const date = (iptYear.value + iptMonth.value + iptDate.value).datify();
  let res = Object.entries(clubs).filter(
    ([, ob]) => ob.eng_id == iptClub.value
  );
  if (res.length == 0) res = [["", { eng_id: "acro" }]]; //acro는 별의미가 없다.
  [[clubId, { eng_id: club }]] = res;
  post(
    urlHeader + "/getLogDeviceList",
    { date, club, clubId },
    httpHeader,
    (resp) => {
      const { data } = resp.jp();
      clearData();
      if (!data) return;
      setDeviceList(data);
    }
  );
};
