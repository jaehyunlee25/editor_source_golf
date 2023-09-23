const httpHeader = { "Content-Type": "application/json" };
let monitorHeader = "https://dev.mnemosyne.co.kr/monitor";
const cf = new jCommon();
const log = console.log;

get(".env", {}, httpHeader, (resp) => {
  let { monitorHeader: url } = resp.jp();
  monitorHeader = url;
  main();
});

async function main() {
  const list = await getGolfClubList();
  log(list);
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
