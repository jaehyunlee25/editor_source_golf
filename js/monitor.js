const httpHeader = { "Content-Type": "application/json" };
let monitorHeader = "https://dev.mnemosyne.co.kr/monitor";
const cf = new jCommon();
const log = console.log;
let clublist;
let mapClublist;
let FLAG = true;
let timer;
let keyStack = [];
let history;
let mapHistory = {};
let round;
let roundList;
let roundHistory;
let mapRoundHistory;
String.prototype.api = function (param) {
  param ??= {};
  const api = this.toString();
  const prom = new Promise((res, rej) => {
    try {
      post(monitorHeader + "/" + api, param, httpHeader, (resp) => {
        const json = resp.jp();
        res(json);
      });
    } catch (e) {
      rej(e.toString());
    }
  });
  return prom;
};

get(".env", {}, httpHeader, (resp) => {
  let { monitorHeader: url } = resp.jp();
  monitorHeader = url;
  main();
});

async function main() {
  clublist = await "getGolfClubList".api();
  mapClublist = clublist.getmap("id");
  roundList = await "getRoundList".api();
  history = await "getHistory".api();
  history.forEach((obj) => {
    const { clubId, engId, name, type, average_diff } = obj;
    mapHistory[clubId] ??= { engId, name, main: -1, login: -1, search: -1 };
    mapHistory[clubId][type] = average_diff;
  });
  await getRound();
  mkHistory();
}
async function getRound() {
  roundList.forEach(({ round }, i) => {
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
    let main = -1;
    let login = -1;
    let search = -1;
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
      if (val == -1) td.style.backgroundColor = "pink";
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
    let main = -1;
    let login = -1;
    let search = -1;
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
      if (val == -1) td.style.backgroundColor = "pink";
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
  popClubId.str("(" + res[0].id + ")");
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
  list.forEach((obj) => {
    const tr = popList.add("tr");
    tr.history = obj;
    tr.onmousemove = historymousemove;
    tr.onmouseout = historymouseout;
    tr.onclick = popuphistoryclick;

    const { created_at, url, start, end, diff } = obj;
    [created_at, url, start, end, diff].forEach((val, i) => {
      const td = tr.add("td");
      if (i == 0 || i == 2 || i == 3) {
        td.str(val.timestamp().full);
      } else {
        td.str(val);
      }
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
  const { id } = elSelectedClub.club;
  const resp = await conHomepage(id);
  elResult.str(JSON.stringify(resp, null, 4));
};
btnConLoginpage.onclick = async function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  const resp = await "connect".api({ clubId, round, type: "login" });
  elResult.str(JSON.stringify(resp, null, 4));
};
btnConSearchpage.onclick = async function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  const resp = await "connect".api({ clubId, round, type: "search" });
  elResult.str(JSON.stringify(resp, null, 4));
};
btnExecLogin.onclick = function () {
  elResult.str("");
  alert("구현중입니다.");
};
btnExecDateSearch.onclick = function () {
  elResult.str("");
  alert("구현중입니다.");
};
allStart.onclick = function () {
  elProgress.str("전체 골프장 연결테스트를 진행중입니다...");
  if (this.str() == "시작") {
    round = new Date().getTime();
    keyStack = Object.keys(mapClublist);
  }
  this.disabled = true;
  let timercount = 0;
  timer = setInterval(async () => {
    timercount++;
    log(timercount);
    if (timercount > 20) {
      timercount = 0;
      FLAG = true;
      log("timeout");
      return;
    }
    if (!FLAG) {
      return;
    }
    FLAG = false;
    const clubId = keyStack.shift();
    if (!clubId) {
      log("the end of all work!");
      clearInterval(timer);
      return;
    }
    log(clubId);
    const lng = Object.keys(mapClublist).length;
    const nth = lng - keyStack.length;
    elProgress.str(`${nth}/${lng} 진행중입니다.`);
    clubselect(clubId);
    // const resHomepage = await conHomepage(clubId);
    const resHomepage = await "connect".api({ clubId, round, type: "main" });
    elResult.str(JSON.stringify(resHomepage, null, 4));
    timercount = 0;
    // await delay(5000);
    const resLogin = await "connect".api({ clubId, round, type: "login" });
    elResult.str(JSON.stringify(resLogin, null, 4));
    timercount = 0;
    // await delay(5000);
    const resSearch = await "connect".api({ clubId, round, type: "search" });
    elResult.str(JSON.stringify(resSearch, null, 4));
    // await delay(5000);
    FLAG = true;
    timercount = 0;
  }, 1000);
};
allStop.onclick = function () {
  clearInterval(timer);
  elProgress.str("전체 골프장 연결테스트를 잠시 멈추었습니다...");
  allStart.str("계속");
  allStart.disabled = false;
};
allReset.onclick = function () {
  elProgress.str("전체 골프장 연결테스트를 끝내고 설정을 초기화하였습니다.");
  allStart.str("시작");
  allStart.disabled = false;
};
selRound.onchange = async function () {
  roundHistory = await "getRoundHistory".api({ round: selRound.value });
  mapRoundHistory = {};
  roundHistory.forEach((hist) => {
    mapRoundHistory[hist.golf_club_id] ??= {};
    if (mapRoundHistory[hist.golf_club_id][hist.type]) return;
    mapRoundHistory[hist.golf_club_id][hist.type] ??= hist;
  });
  mkRound();
};
