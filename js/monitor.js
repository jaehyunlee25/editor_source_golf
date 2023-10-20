const httpHeader = { "Content-Type": "application/json" };
let monitorHeader = "https://dev.mnemosyne.co.kr/monitor";
const cf = new jCommon();
const log = console.log;
let clublist;
let mapClublist;
let mapAsCell;

let keyStack = [];
let history;
let mapHistory = {};
let round = new Date().getTime();
let roundList;
let mapRoundList;
let roundHistory;
let mapRoundHistory;
let timers = [];
let logfile = [];
// let serverDomain = "https://dev.mnemosyne.co.kr";
const urls = [
  "https://monitor.mnemosyne.co.kr/monitor/1",
  "https://monitor.mnemosyne.co.kr/monitor/2",
  "https://dev.mnemosyne.co.kr/monitor/1",
  "https://monitor.mnemosyne.co.kr/monitor/3",
  "https://monitor.mnemosyne.co.kr/monitor/4",
  "https://dev.mnemosyne.co.kr/monitor/2",
  "https://monitor.mnemosyne.co.kr/monitor/5",
  "https://monitor.mnemosyne.co.kr/monitor/6",
  "https://dev.mnemosyne.co.kr/monitor/3",
  "https://monitor.mnemosyne.co.kr/monitor/7",
  "https://monitor.mnemosyne.co.kr/monitor/8",
  "https://dev.mnemosyne.co.kr/monitor/4",
  "https://monitor.mnemosyne.co.kr/monitor/9",
  "https://monitor.mnemosyne.co.kr/monitor/10",
  "https://dev.mnemosyne.co.kr/monitor/5",
  "https://dev.mnemosyne.co.kr/monitor/6",
  "https://dev.mnemosyne.co.kr/monitor/7",
  "https://dev.mnemosyne.co.kr/monitor/8",
  "https://dev.mnemosyne.co.kr/monitor/9",
  "https://dev.mnemosyne.co.kr/monitor/10",
];

String.prototype.api = function (param, serverUrl) {
  param ??= {};
  const api = this.toString();
  let url = monitorHeader;
  if (serverUrl) url = serverUrl;
  const prom = new Promise((res, rej) => {
    try {
      post(
        url + "/" + api,
        param,
        httpHeader,
        (resp) => {
          const json = resp.jp();
          res(json);
        },
        (readyState, status) => {
          rej(readyState, status);
        }
      );
    } catch (e) {
      rej(e.toString());
    }
  });
  return prom;
};

get(".env", {}, httpHeader, (resp) => {
  let { monitorHeader: url, domain, port } = resp.jp();
  monitorHeader = url;
  // serverDomain = domain;
  main();
});

// date search monitor
let searches = [];
let allerrors = [];
let popupclose;
let neolist;
let availables = [];
let searchTimeStamp;
let workings = {};
let startCount = 0;
let successCount = 0;
let failCount = 0;
let resultChecker = {};
let totalCount = 0;
// date search monitor

async function main() {
  clublist = await "getGolfClubList".api();
  mapClublist = clublist.getmap("id");
  roundList = await "getRoundList".api();
  mapRoundList = roundList.getmap("round");
  history = await "getHistory".api();
  history.forEach((obj) => {
    const { clubId, engId, name, type, average_diff } = obj;
    mapHistory[clubId] ??= { engId, name, main: -1, login: -1, search: -1 };
    mapHistory[clubId][type] = average_diff;
  });
  await getRound();
  mkHistory();
  /* btnExecDateSearch.click();
  setTimeout(() => {
    location.href = location.href;
  }, 1000 * 60 * 5); */
}

// date search monitor
btnExecDateSearch.onclick = async function () {
  elResult.str("");
  logfile = [];
  const rawlist = await "getClubPass".api();
  const list = [];
  rawlist.forEach((club) => {
    if (
      club.eng_id == "rockgarden" ||
      club.eng_id == "dyhills" ||
      club.eng_id == "leaders" ||
      club.eng_id == "ariji" ||
      club.eng_id == "science_daeduk" // ||
      //
      // club.eng_id == "muan"
    )
      return;
    list.push(club);
  });
  log("total> ", list.length);
  totalCount = list.length;
  datesearch(list);
};
async function datesearch(list) {
  //초기화
  searches = [];
  allerrors = [];
  neolist;
  availables = [];
  workings = {};
  startCount = 0;
  successCount = 0;
  failCount = 0;
  resultChecker = {};
  totalCount = 0;

  const { back, content, close } = layerpop();
  popupclose = close;
  content.style.width = "90%";
  content.style.padding = "10px";
  content.style.fontSize = "10px";
  tmDateSearch.get(content);

  searchTimeStamp = new Date().getTime();
  for (let i = 0; i < 20; i++) {
    const search = new SEARCH(i, urls[i]);
    searches.push(search);
    search.onprogress = onsearchprogress;
    search.setElement(dsList.add("div"));
  }
  neolist = list.shuffle();
  neolist.forEach((club) => {
    resultChecker[club.eng_id] = false;
  });
  searches.forEach((search, i) => {
    availables.push(search);
  });

  let reportCount = 0;
  const tReport = setInterval(() => {
    reportCount++;
    //
    while (ablecheck()) {
      const search = availables.shift();
      const club = neolist.shift();
      search.start(club);
    }
    //
    if (reportCount == 0 || reportCount % (2 * 2) == 0) procLog();
    //
    if (successCount == totalCount) clearInterval(tReport);
    //
    if (successCount == totalCount) {
      procLog();
      setTimeout(popupclose, 2000);
    }
  }, 500);
}
function procLog() {
  console.clear();
  log("report> neolist::", neolist.length);
  log("report> working::", countIsWorking());
  log("report> avaiilable::", availables.length);
  log("report> remains::", neolist.length + countIsWorking());
  log("report> start::", startCount);
  log("report> success::", successCount);
  log("report> fail::", failCount);
  log("elapsed> ", new Date().getTime() - searchTimeStamp);
}
function ablecheck() {
  if (availables.length > 0 && neolist.length > 0) return true;
  return false;
}
function whenstart(search, eng_id) {
  startCount++;
  const span = search.element.children[1].add("span");
  span.className = "dsSpan";
  span.style.backgroundColor = "yellow";
  span.str(eng_id);
  span.onclick = function () {
    neolist.push(search.club);
    search.isWorking = false;
    availables.push(search);
  };
}
function whencancel(search) {
  const span = search.element.children[1].lc();
  span.parentNode.removeChild(span);
  whencommon(search);
}
function whenend(search, param) {
  const { result, club } = param;
  const { club: eng_id, club_id, jsonstr, message } = result;
  const span = search.element.children[1].lc();

  if (jsonstr) whensuccess(span, eng_id, jsonstr, search);
  else whenfail(club, span, message);

  whencommon(search);
}
function whencommon(search) {
  // 공통
  availables.push(search);
}
function whensuccess(span, eng_id, jsonstr, search) {
  successCount++;
  resultChecker[eng_id] = jsonstr;
  span.style.backgroundColor = "green";
  // 결과대기중인 곳을 찾아가 작업을 취소한다.
  searches.forEach((instance) => {
    const spans = instance.element.children[1].children;
    Array.from(spans).forEach((span, i) => {
      if (i == spans.length - 1 && instance == search) return;
      if (span.str() == eng_id) {
        if (span.style.backgroundColor == "yellow") {
          span.parentNode.removeChild(span);
        }
        if (i == spans.length - 1) {
          if (instance.isWorking) {
            instance.isWorking = false;
            availables.push(instance);
          }
        }
      }
    });
  });
}
function whenfail(club, span, message) {
  failCount++;
  // span.parentNode.removeChild(span);
  neolist.push(club);
}
function onsearchprogress(param) {
  const { type } = param;
  const { url, club } = param;
  const { eng_id } = club;
  if (type == "start") whenstart(this, eng_id);
  else if (type == "cancel") whencancel(this);
  else if (type == "end") whenend(this, param);
}
function countIsWorking() {
  let count = 0;
  searches.forEach((search) => {
    if (search.isWorking) count++;
  });
  return count;
}
// date search monitor
async function getRound() {
  roundList.forEach((obj, i) => {
    const { round } = obj;
    const opt = document.createElement("option");
    opt.value = round;
    if (round <= 200) {
      opt.str(round);
    } else {
      opt.str(round.timestamp().full);
    }
    selRound.appendChild(opt);
  });
  await selRound.onchange();
}
function mkRound() {
  elRound.str("");
  const table = elRound.add("table");
  table.style.minWidth = "50%";
  table.border = 1;
  const thead = table.add("thead");
  const htr1 = thead.add("tr");
  const htr2 = thead.add("tr");
  ["클럽아이디", "클럽영문", "클럽이름"].forEach((str) => {
    const htd = htr1.add("td");
    htd.rowSpan = 2;
    htd.str(str);
    htd.className = "head";
  });
  const htd1 = htr1.add("td");
  htd1.colSpan = 3;
  htd1.str("반응속도(ms)");
  htd1.className = "head";
  ["main", "login", "search"].forEach((str) => {
    const htd = htr2.add("td");
    htd.str(str);
    htd.className = "head";
  });

  const tbody = table.add("tbody");
  //Object.entries(mapHistory).forEach(
  Object.entries(mapClublist).forEach(([clubId, club]) => {
    let { eng_id: engId, name } = club;
    let main = "no data";
    let login = "no data";
    let search = "no data";
    if (mapRoundHistory[clubId]) {
      const hist = mapRoundHistory[clubId];
      main = hist.main && hist.main.diff;
      login = hist.login && hist.login.diff;
      search = hist.search && hist.search.diff;
    }
    if (!engId.has(iptRoundClub.value) && !name.has(iptRoundClub.value)) return;
    const tr = tbody.add("tr");
    tr.clubId = clubId;
    tr.onmousemove = historymousemove;
    tr.onmouseout = historymouseout;
    tr.onclick = historyclick;
    [clubId, engId, name, main, login, search].forEach((val, i) => {
      const td = tr.add("td");
      td.str(val);
      if (i > 2) td.style.textAlign = "right";
      if (val == -1) td.style.backgroundColor = "lightgray";
      if (val == "no data") td.style.backgroundColor = "lightskyblue";
      if (val == -2) td.style.backgroundColor = "pink";
    });
  });
}
function mkHistory() {
  elHistory.str("");
  const table = elHistory.add("table");
  table.style.minWidth = "50%";
  table.border = 1;
  const thead = table.add("thead");
  const htr1 = thead.add("tr");
  const htr2 = thead.add("tr");
  ["클럽아이디", "클럽영문", "클럽이름"].forEach((str) => {
    const htd = htr1.add("td");
    htd.rowSpan = 2;
    htd.str(str);
    htd.className = "head";
  });
  const htd1 = htr1.add("td");
  htd1.colSpan = 3;
  htd1.str("반응속도(ms)");
  htd1.className = "head";
  ["main", "login", "search"].forEach((str) => {
    const htd = htr2.add("td");
    htd.str(str);
    htd.className = "head";
  });

  const tbody = table.add("tbody");
  //Object.entries(mapHistory).forEach(
  Object.entries(mapClublist).forEach(([clubId, club]) => {
    let { eng_id: engId, name } = club;
    let main = "no data";
    let login = "no data";
    let search = "no data";
    if (mapHistory[clubId]) {
      main = mapHistory[clubId].main;
      login = mapHistory[clubId].login;
      search = mapHistory[clubId].search;
    }
    if (!engId.has(iptHistoryClub.value) && !name.has(iptHistoryClub.value))
      return;
    const tr = tbody.add("tr");
    tr.clubId = clubId;
    tr.onmousemove = historymousemove;
    tr.onmouseout = historymouseout;
    tr.onclick = historyclick;
    [clubId, engId, name, main, login, search].forEach((val, i) => {
      const td = tr.add("td");
      td.str(val);
      if (i > 2) td.style.textAlign = "right";
      if (val == -1) td.style.backgroundColor = "lightgray";
      if (val == "no data") td.style.backgroundColor = "lightskyblue";
      if (val == -2) td.style.backgroundColor = "pink";
    });
  });
}
function historymousemove() {
  this.style.backgroundColor = "lightskyblue";
}
function historymouseout() {
  this.style.backgroundColor = "white";
}
async function historyclick() {
  const { back, content, close } = layerpop();
  const { clubId } = this;
  const res = await "getHistoryByClub".api({ clubId });
  if (res.length == 0) {
    alert("log 기록이 없습니다.");
    close();
    return;
  }
  const data = { main: [], login: [], search: [] };
  res.forEach((obj) => {
    data[obj.type].push(obj);
  });

  const [div, btns, table, pre] = tmPopup.get(content).children;
  popClubName.str(res[0].name);
  popEngId.str(res[0].eng_id);
  popClubId.str("(" + res[0].golf_club_id + ")");
  popEx.onclick = close;

  popBtnMain.onclick = function () {
    popBtnDesc.str("Main");
    mkPopList(data["main"]);
    // pre.str(JSON.stringify(data["main"], null, 4));
  };
  popBtnLogin.onclick = function () {
    popBtnDesc.str("Login");
    mkPopList(data["login"]);
    // pre.str(JSON.stringify(data["login"], null, 4));
  };
  popBtnSearch.onclick = function () {
    popBtnDesc.str("Search");
    mkPopList(data["search"]);
    // pre.str(JSON.stringify(data["search"], null, 4));
  };
  popBtnMain.click();
}
function popuphistoryclick() {
  const consolelog = this.history.log.ch(2).ct(2).split('","');
  const dialog = this.history.dialog.ch(2).ct(2).split('","');

  popLog.str(JSON.stringify(consolelog, null, 4));
  popDialog.str(JSON.stringify(dialog, null, 4));
}
function mkPopList(list) {
  popList.str("");
  const mapList = {};
  // 단독으로 검사한 내용은 round 번호를 부여한다.
  list.forEach((obj, i) => {
    let { round } = obj;
    if (round == 0) round = 200 + i + 1;
    obj.round = round;
    mapList[round] = obj;
  });
  // 빠진 round 정보를 채운다.
  roundList.forEach(({ round }) => {
    const { date, time, full } = round.timestamp();
    const rstr = date + "t" + time + "z";
    mapList[round] ??= {
      round,
      url: "",
      start: 0,
      end: 0,
      diff: 0,
      created_at: round > 10000 ? rstr : "",
    };
  });
  // 새롭게 list를 구성한다.
  const res = [];
  Object.entries(mapList).forEach(([round, obj]) => {
    res.push(obj);
  });
  res.desc("created_at");
  log(res);
  res.forEach((obj) => {
    const tr = popList.add("tr");
    tr.history = obj;
    tr.onmousemove = historymousemove;
    tr.onmouseout = historymouseout;
    tr.onclick = popuphistoryclick;

    const { round, url, start, end, diff } = obj;
    [round, url, start, end, diff].forEach((val, i) => {
      const td = tr.add("td");
      td.str(val);
      if (i == 0 || i == 2 || i == 3) {
        if (val > 10000) td.str(val.timestamp().full);
      }
      if (val == 0 || val == -1) td.str("");
      if (i > 1) td.style.textAlign = "right";
    });
  });
}
function clubselect(clubId) {
  iptClubSearch.value = "";
  iptClubSearch.onkeyup();
  const club = mapClublist[clubId];
  elSelectedClub.str(club.name);
  elSelectedClub.club = club;
  elDesc.str(JSON.stringify(club, null, 4));
}
function delay(milliseconds) {
  return new Promise((res, rej) => {
    setTimeout(res, milliseconds); // return 할 게 없으니, 따로 reject을 설정하지 않는다.
  });
}
iptClubSearch.onkeyup = function () {
  elSelect.str("");
  elDesc.str("");
  elResult.str("");
  const str = this.value;
  if (str == "") return;
  const res = [];
  clublist.forEach((club) => {
    if (!club.name.has(str) && !club.eng_id.has(str)) return;
    res.push(club);
  });

  res.asc("name");
  res.forEach((club) => {
    const a = elSelect.add("a");
    a.str(club.name);
    a.href = "javascript:clubselect('" + club.id + "')";
    a.club = club;
  });
};
iptHistoryClub.onkeyup = function () {
  mkHistory();
};
iptRoundClub.onkeyup = function () {
  mkRound();
};
btnConHomepage.onclick = async function () {
  elResult.str("");
  const { id: clubId } = elSelectedClub.club;
  const cntServer = selServerCount.value;
  const resp = await "connect".api({
    clubId,
    round: 0,
    cntServer,
    type: "main",
  });
  elResult.str(JSON.stringify(resp, null, 4));
};
btnConLoginpage.onclick = async function () {
  elResult.str("");
  const { id: clubId } = elSelectedClub.club;
  const cntServer = selServerCount.value;
  const resp = await "connect".api({
    clubId,
    round: 0,
    cntServer,
    type: "login",
  });
  elResult.str(JSON.stringify(resp, null, 4));
};
btnConSearchpage.onclick = async function () {
  elResult.str("");
  const { id: clubId } = elSelectedClub.club;
  const cntServer = selServerCount.value;
  const resp = await "connect".api({
    clubId,
    round: 0,
    cntServer,
    type: "search",
  });
  elResult.str(JSON.stringify(resp, null, 4));
};
btnExecLogin.onclick = function () {
  elResult.str("");
  alert("구현중입니다.");
};
selServerCount.onchange = function () {
  const servercount = selServerCount.value * 1 - 1;
  timers = [];
  servercount.shuffle().forEach((i) => {
    const url = urls[i];
    timers.push(new TIMER(url, timerMessageCallback));
  });
};
function timerMessageCallback(type, json) {
  if (type == "club") {
    const { url, clubId } = json;
    log(url, clubId);
    clubselect(clubId);
  } else if (type == "start") {
    mapAsCell[json.clubId].setStart(json);
  } else if (type == "result") {
    elResult.str(JSON.stringify(json, null, 4));
    mapAsCell[json.clubId].setResult(json);
  } else if (type == "timeout") {
    mapAsCell[json.clubId].setTimeout(json);
  } else if (type == "status") {
    const { nth, lng } = json;
    elProgress.str(`${nth}/${lng} 진행중입니다.`);
  } else if (type == "end") {
    const { msg } = json;
    elProgress.str(msg);
    allStart.disabled = false;
  }
}
allStart.onclick = function () {
  elProgress.str("전체 골프장 연결테스트를 진행중입니다...");
  const { back, content, close } = layerpop();
  content.style.width = "90%";
  tmAllStart.get(content);
  btnAsClose.onclick = close;
  asList.str("");
  mapAsCell = {};
  clublist.forEach((club, i) => {
    let tr;
    if (i % 25 == 0) {
      tr = asList.add("tr");
    } else {
      tr = asList.children[asList.children.length - 1];
    }
    const td = tmAsCell.get(tr);
    mapAsCell[club.id] = new ASCELL(i + 1, club, td);
  });

  if (this.str() == "시작") {
    round = new Date().getTime();
    keyStack = Object.keys(mapClublist).shuffle();
    cntServer = selServerCount.value * 1;
    timers.forEach((timer) => {
      timer.start(keyStack, round, cntServer, 1000);
    });
  } else {
    timers.forEach((timer) => {
      timer.continue();
    });
  }
  this.disabled = true;
};
allStop.onclick = function () {
  timers.forEach((timer) => {
    timer.stop();
  });

  elProgress.str("전체 골프장 연결테스트를 잠시 멈추었습니다...");
  allStart.str("계속");
  allStart.disabled = false;
};
allReset.onclick = function () {
  elProgress.str("전체 골프장 연결테스트를 끝내고 설정을 초기화하였습니다.");
  allStart.str("시작");

  timers.forEach((timer) => {
    timer.init();
  });

  allStart.disabled = false;
};
selRound.onchange = async function () {
  elRoundInfo.str("");
  const { round, cntServer, start, end, diff } = mapRoundList[this.value];
  [round, cntServer, start, end, diff].forEach((val, i) => {
    const td = elRoundInfo.add("td");
    if (i == 2 || i == 3) {
      const { date, time, millisec, full } = val.timestamp();
      td.str([date, time + "." + millisec].join("<br>"));
    } else if (i == 4) {
      td.str(val.sectotime());
    } else {
      td.str(val);
    }
    td.style.border = "1px solid gray";
    td.style.fontSize = "10px";
    td.style.textAlign = "center";
  });

  roundHistory = await "getRoundHistory".api({ round });
  mapRoundHistory = {};
  roundHistory.forEach((hist) => {
    mapRoundHistory[hist.golf_club_id] ??= {};
    if (mapRoundHistory[hist.golf_club_id][hist.type]) return;
    mapRoundHistory[hist.golf_club_id][hist.type] ??= hist;
  });
  mkRound();
};
