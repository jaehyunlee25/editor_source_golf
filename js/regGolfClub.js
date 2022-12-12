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
    tr.onclick = trclick;
    tr.item = clubs[id];
    tr.css("border-bottom: 1px solid #eee;");
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
      tds[i].textContent = con;
      tds[i].css("overflow-wrap: break-word;text-align:left;");
    });
    tbl.appendChild(row);
  });
}
function trclick() {
  setDetail(this.item);
}
function setDetail(row) {
  let opt = false;
  if (row) opt = true;
  const { back, content, close } = layerpop();
  const div = content.add("div");
  div.css("margin:auto;width: 80%;padding-bottom: 20px;");
  const tmplt = doc.querySelector("#tplDetail");
  const dtl = doc.importNode(tmplt.content, true);
  div.appendChild(dtl);
  /* const trs = div.querySelectorAll("tr");
  trs.forEach((tr) => {
    tr.css("background-color: white;");
  }); */
  btnConfirm.opt = opt;
  btnConfirm.content = content;
  btnConfirm.onclick = confirmClick;

  if (!opt) return;
  Object.keys(row).forEach((key) => {
    if (!window["el_" + key]) return;
    window["el_" + key].value = row[key];
  });
}
btnNew.onclick = function () {
  setDetail();
};
function confirmClick() {
  log(this.opt);
  log(this.content);
}
