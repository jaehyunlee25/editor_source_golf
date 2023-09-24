const httpHeader = { "Content-Type": "application/json" };
let monitorHeader = "https://dev.mnemosyne.co.kr/monitor";
const cf = new jCommon();
const log = console.log;
let clublist;
let mapClublist;

get(".env", {}, httpHeader, (resp) => {
  let { monitorHeader: url } = resp.jp();
  monitorHeader = url;
  main();
});

async function main() {
  clublist = await getGolfClubList();
  mapClublist = clublist.getmap("id");
  log(clublist);
  return;
  const clubId = "126fd385-ee24-11ec-a93e-0242ac11000a";

  conHomepage(clubId, (json) => {
    log(json);
    conLogin(clubId, (json) => {
      log(json);
      conSearch(clubId, (json) => {
        log(json);
      });
    });
  });
}
function getGolfClubList() {
  const prom = new Promise((res, rej) => {
    try {
      post(monitorHeader + "/getGolfClubList", {}, httpHeader, (resp) => {
        const json = resp.jp();
        res(json);
      });
    } catch (e) {
      rej(e.toString());
    }
  });
  return prom;
}
function conHomepage(clubId, callback) {
  post(
    monitorHeader + "/connect",
    { clubId, type: "main" },
    httpHeader,
    (resp) => {
      const json = resp.jp();
      if (callback) callback(json);
    }
  );
}
function conLogin(clubId, callback) {
  post(
    monitorHeader + "/connect",
    { clubId, type: "login" },
    httpHeader,
    (resp) => {
      const json = resp.jp();
      if (callback) callback(json);
    }
  );
}
function conSearch(clubId, callback) {
  post(
    monitorHeader + "/connect",
    { clubId, type: "search" },
    httpHeader,
    (resp) => {
      const json = resp.jp();
      if (callback) callback(json);
    }
  );
}
iptClubSearch.onkeyup = function () {
  elSelect.str("");
  elDesc.str("");
  elResult.str("");
  const str = this.value;
  if (str == "") return;
  const res = [];
  clublist.forEach((club) => {
    if (!club.name.has(str) && !club.eng.has(str)) return;
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
function clubselect(clubId) {
  iptClubSearch.value = "";
  iptClubSearch.onkeyup();
  const club = mapClublist[clubId];
  log(club);
  elSelectedClub.str(club.name);
  elSelectedClub.club = club;
  elDesc.str(JSON.stringify(club, null, 4));
}
btnConHomepage.onclick = function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  conHomepage(id, (resp) => {
    elResult.str(JSON.stringify(resp, null, 4));
  });
};
btnConLoginpage.onclick = function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  conLogin(id, (resp) => {
    elResult.str(JSON.stringify(resp, null, 4));
  });
};
btnConSearchpage.onclick = function () {
  elResult.str("");
  const { id } = elSelectedClub.club;
  conSearch(id, (resp) => {
    elResult.str(JSON.stringify(resp, null, 4));
  });
};
btnExecLogin.onclick = function () {
  elResult.str("");
  alert("구현중입니다.");
};
btnExecDateSearch.onclick = function () {
  elResult.str("");
  alert("구현중입니다.");
};
