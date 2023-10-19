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
let isRoundFinished = false;
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
  isRoundFinished = false;
  const rawlist = await "getClubPass".api();
  const list = [];
  rawlist.forEach((club) => {
    if (
      club.eng_id == "rockgarden" ||
      club.eng_id == "dyhills" ||
      club.eng_id == "leaders" ||
      club.eng_id == "ariji" ||
      club.eng_id == "science_daeduk"
    )
      return;
    list.push(club);
  });
  log("total> ", list.length);
  datesearch(list);
};
async function datesearch(list) {
  searches = [];
  allerrors = [];
  const { back, content, close } = layerpop();
  popupclose = close;
  content.style.width = "100%";
  content.style.height = "100%";
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
  searches.forEach((search, i) => {
    const club = neolist.shift();
    if (club) search.start(club);
  });

  /* const neolist = list.shuffle().cutto(10); */
  /* neolist.forEach((ar, i) => {
    const search = new SEARCH(i, ar, urls[i]);
    searches.push(search);
    search.onprogress = onsearchprogress;
    search.onfinish = onsearchfinish;
    search.setElement(dsList.add("div"));
    search.start();
  }); */

  /* const param = { clubId: club.id };
  const body = await club.proc.api(param, urls[2]);
  log(body); */

  /* logfile.push(club.id + "::" + club.eng_id);
  const param = { clubId: club.id };
  if (club.proc) proc = club.proc;
  const body = await proc.api(param);

  logfile.push(JSON.stringify(body));
  await datesearch(list); */
}
function whenstart(search, eng_id) {
  const span = search.element.children[1].add("span");
  span.className = "dsSpan";
  span.style.backgroundColor = "yellow";
  span.str(eng_id);
}
function whencancel(search) {
  const span = search.element.children[1].lc();
  span.parentNode.removeChild(span);
  whencommon(search);
}
function whenend(search, param) {
  if (isRoundFinished) return;
  const { result, club } = param;
  const { club: eng_id, club_id, jsonstr, message } = result;
  const span = search.element.children[1].lc();

  if (jsonstr) whensuccess(span, club_id);
  else whenfail(club, span, message);

  whencommon(search);
}
function whencommon(search) {
  // 공통
  availables.push(search);
  const newclub = neolist.shift();
  if (newclub) availables.shift().start(newclub);
  if (neolist.length > 0) return;

  // 대기상태의 search가 있을 때는 워킹중인 클럽을 찾는다.
  searches.forEach((srch) => {
    if (availables.length == 0) return;
    if (srch.isWorking && !workings[srch.club.id]) {
      availables.shift().start(srch.club);
      workings[srch.club.id] = true;
    }
  });
}
function whensuccess(span, clubId) {
  if (isRoundFinished) return;
  span.style.backgroundColor = "green";
  // 결과대기중인 곳을 찾아가 작업을 취소한다.
  searches.forEach((instance) => {
    instance.checkStop(clubId);
  });
  if (neolist.length + countIsWorking() == 0) {
    isRoundFinished = true;
    log("elapsed> ", new Date().getTime() - searchTimeStamp);
    popupclose();
  }
}
function whenfail(club, span, message) {
  log(message);
  span.parentNode.removeChild(span);
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
