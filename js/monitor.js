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
  history = await "getHistory".api();
  history.forEach((obj) => {
    const { clubId, engId, name, type, average_diff } = obj;
    mapHistory[clubId] ??= { engId, name, main: -1, login: -1, search: -1 };
    mapHistory[clubId][type] = average_diff;
  });
  mkHistory();
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
  Object.entries(mapHistory).forEach(
    ([clubId, { engId, name, main, login, search }]) => {
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
    }
  );
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
  const data = { main: [], login: [], search: [] };
  res.forEach((obj) => {
    data[obj.type].push(obj);
  });

  const [div, table, pre] = tmPopup.get(content).children;

  popBtnMain.onclick = function () {
    popBtnDesc.str("Main");
    pre.str(JSON.stringify(data["main"], null, 4));
  };
  popBtnLogin.onclick = function () {
    popBtnDesc.str("Login");
    pre.str(JSON.stringify(data["login"], null, 4));
  };
  popBtnSearch.onclick = function () {
    popBtnDesc.str("Search");
    pre.str(JSON.stringify(data["search"], null, 4));
  };
  popBtnMain.click();
}
function conHomepage(clubId) {
  return new Promise((res, rej) => {
    post(
      monitorHeader + "/connect",
      { clubId, type: "main" },
      httpHeader,
      (resp) => {
        const json = resp.jp();
        res(json);
      }
    );
  });
}
function conLogin(clubId, callback) {
  return new Promise((res, rej) => {
    post(
      monitorHeader + "/connect",
      { clubId, type: "login" },
      httpHeader,
      (resp) => {
        const json = resp.jp();
        res(json);
      }
    );
  });
}
function conSearch(clubId, callback) {
  return new Promise((res, rej) => {
    post(
      monitorHeader + "/connect",
      { clubId, type: "search" },
      httpHeader,
      (resp) => {
        const json = resp.jp();
        res(json);
      }
    );
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
function consecutive(clubId) {
  conHomepage(clubId, async (json) => {
    elResult.str(JSON.stringify(json, null, 4));
    await delay(1000);
    conLogin(clubId, async (json) => {
      elResult.str(JSON.stringify(json, null, 4));
      await delay(1000);
      conSearch(clubId, async (json) => {
        elResult.str(JSON.stringify(json, null, 4));
        await delay(1000);
        FLAG = true;
      });
    });
  });
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
btnConHomepage.onclick = async function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  const resp = await conHomepage(id);
  elResult.str(JSON.stringify(resp, null, 4));
};
btnConLoginpage.onclick = async function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  const resp = await conLogin(id);
  elResult.str(JSON.stringify(resp, null, 4));
};
btnConSearchpage.onclick = async function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  const resp = await conSearch(id);
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
    clubselect(clubId);
    const resHomepage = await conHomepage(clubId);
    elResult.str(JSON.stringify(resHomepage, null, 4));
    timercount = 0;
    // await delay(5000);
    const resLogin = await conLogin(clubId);
    elResult.str(JSON.stringify(resLogin, null, 4));
    timercount = 0;
    // await delay(5000);
    const resSearch = await conSearch(clubId);
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
