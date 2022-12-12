const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/reservation/";
const apiHeader = "https://dev.mnemosyne.co.kr/api/crawler/";
const cf = new jCommon();
let clubs;

main();
function main() {
  post(apiHeader + "dbGetGolfClub", {}, httpHeader, (data) => {
    const { type, golfClubs } = data.jp();
    clubs = golfClubs;
    setList();
  });
}
function setList() {
  log(clubs);
  const t = doc.querySelector("#tplItem");
  const tbl = doc.querySelector("#tblList");
  Object.keys(clubs).forEach((id, j) => {
    const {
      name,
      phone,
      homepage,
      email,
      area,
      address,
      corp_reg_number,
      description,
    } = clubs[id];
    const row = doc.importNode(t.content, true);
    const tds = row.querySelectorAll("td");
    const [tr] = row.querySelectorAll("tr");
    if (j % 2 == 1) tr.css("background-color: gray;");
    [
      id,
      name,
      address,
      area,
      phone,
      email,
      homepage,
      corp_reg_number,
      description,
    ].forEach((con, i) => {
      log(con);
      tds[i].textContent = con;
    });
    log(tbl);
    tbl.appendChild(row);
  });
}
