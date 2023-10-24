const httpHeader = { "Content-Type": "application/json" };
let monitorHeader = "https://dev.mnemosyne.co.kr/monitor";
const cf = new jCommon();
const log = console.log;
let clublist;
let mapClublist;

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
  "http://192.168.0.10:8080",
  "http://192.168.0.10:8081",
  "http://192.168.0.10:8082",
  "http://192.168.0.10:8083",
  "http://192.168.0.10:8084",
  "http://192.168.0.10:8085",
  "http://192.168.0.10:8086",
  "http://192.168.0.10:8087",
  "http://192.168.0.10:8088",
  "http://192.168.0.10:8089",
  "http://post.ttpick.com:8080",
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
const windowsList = [
  "rockgarden",
  "dyhills",
  "leaders",
  "ariji",
  "science_daeduk",
];
// date search monitor

async function main() {
  clublist = await "getGolfClubList".api();
  mapClublist = clublist.getmap("id");

  btnExecDateSearch.click();
  setTimeout(() => {
    location.href = location.href;
  }, 1000 * 60 * 5);
}

// date search monitor
btnExecDateSearch.onclick = async function () {
  const rawlist = await "getClubPass".api();
  const exclusives = [];
  const list = [];
  rawlist.forEach((club) => {
    if (exclusives.length > 0) {
      if (exclusives.indexOf(club.eng_id) == -1) return;
    }
    list.push(club);
  });
  log("total> ", list.length);
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

  const { back, content, close } = layerpop();
  popupclose = close;
  content.style.width = "90%";
  content.style.padding = "10px";
  content.style.fontSize = "10px";
  tmDateSearch.get(content);

  searchTimeStamp = new Date().getTime();
  for (let i = 0, lmt = urls.length; i < lmt; i++) {
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
      if (windowsList.indexOf(club.eng_id) != -1) {
        availables.unshift(search);
        neolist.push(club);
        continue;
      }
      search.start(club);
    }
    //
    if (reportCount == 0 || reportCount % (2 * 2) == 0) procLog();
    //
    if (neolist.length + countIsWorking() == 0) clearInterval(tReport);
    //
    if (neolist.length + countIsWorking() == 0) {
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
  availables.push(search);
}
function whenend(search, param) {
  const { result, club } = param;
  const { club: eng_id, club_id, jsonstr, message } = result;
  const span = search.element.children[1].lc();

  if (jsonstr) whensuccess(span, eng_id, jsonstr, search);
  else whenfail(club, span, message, search);
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
  //search가 로컬이면 로컬용 클럽을 먼저 수행한다.
  if (search.id == 20) {
    let index;
    for (let i = 0, lmt = neolist.length; i < lmt; i++) {
      const club = neolist[i];
      if (windowsList.indexOf(club.eng_id) != -1) {
        index = i;
        break;
      }
    }
    if (index == undefined) {
      availables.push(search);
    } else {
      const [club] = neolist.splice(index, 1);
      search.start(club);
    }
  } else {
    availables.push(search);
  }
}
function whenfail(club, span, message, search) {
  failCount++;
  // span.parentNode.removeChild(span);
  neolist.push(club);
  availables.push(search);
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
