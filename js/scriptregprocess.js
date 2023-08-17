const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://mnemosynesolutions.co.kr/job";
const serverHeader = "https://dev.mnemosyne.co.kr/api/crawler";
/* const urlHeader = "http://localhost:8038";
const serverHeader = "http://localhost:8080"; */
const cf = new jCommon();
let letters = [];
let vertices;

main();
function main() {
  getClubDataCheck();
  getServerDataCheck();
}
function getClubDataCheck() {
  post(
    urlHeader + "/getClubDataCheck",
    { clubId: "a43a52c5-707a-11ed-9c7a-0242ac110007" },
    httpHeader,
    (resp) => {
      const json = JSON.parse(resp);
      mkList(json);
    }
  );
}
function getServerDataCheck() {
  post(
    serverHeader + "/getServerDataCheck",
    { engId: "kwangju" },
    httpHeader,
    (resp) => {
      const json = JSON.parse(resp);
      log(json);
    }
  );
}
function mkList(json) {
  Object.entries(json).forEach(([key, val], i) => {
    const tr = tblList.add("tr");
    if (val == 0) tr.className = "notr";
    const tdName = tr.add("td");
    const tdCheck = tr.add("td");
    tdName.className = "name";
    tdCheck.className = "check";
    tdName.str(key);
    tdCheck.str(val);
  });
}
