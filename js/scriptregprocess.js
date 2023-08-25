const httpHeader = { "Content-Type": "application/json" };
/* const urlHeader = "https://mnemosynesolutions.co.kr/job";
const serverHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8038";
const serverHeader = "http://localhost:8080"; */
const cf = new jCommon();
let letters = [];
let vertices;
const lsObj = {
  UUID: iptUUID,
  engId: iptEngId,
  urlHeader: selUrlHeader,
  serverHeader: selServerHeader,
};

Object.entries(lsObj).forEach(([key, el], i) => {
  el.value = localStorage.getItem(key);
});

main();
btnSearch.onclick = main;
selMembership.onchange = detailchange;
selGrade.onchange = detailchange;
selPrestige.onchange = detailchange;
selLoginWall.onchange = detailchange;

function main() {
  getClubDataCheck();
  getServerDataCheck();
  getClubDetail();
}
selUrlHeader.onchange = function () {
  localStorage.setItem("urlHeader", this.value);
};
selServerHeader.onchange = function () {
  localStorage.setItem("serverHeader", this.value);
};
function detailchange() {
  if (iptUUID.value == "") return;
  post(
    selServerHeader.value + "/modGolfClubDetail",
    {
      golfClubId: iptUUID.value,
      isMembership: selMembership.value * 1,
      grade: selGrade.value * 1,
      isPrestige: selPrestige.value * 1,
      isLoginWall: selLoginWall.value * 1,
    },
    httpHeader,
    (resp) => {
      const { type, data } = JSON.parse(resp);
      log(type);
    }
  );
}
function getClubDetail() {
  if (iptUUID.value == "") return;
  post(
    selServerHeader.value + "/getGolfClubDetail",
    { golfClubId: iptUUID.value },
    httpHeader,
    (resp) => {
      const { type, data } = JSON.parse(resp);
      if (type == "error") return;
      const [json] = data;
      mkClubDetail(json);
    }
  );
}
function getClubDataCheck() {
  if (iptUUID.value == "") return;
  localStorage.setItem("UUID", iptUUID.value);
  post(
    selUrlHeader.value + "/getClubDataCheck",
    { clubId: iptUUID.value },
    httpHeader,
    (resp) => {
      const json = JSON.parse(resp);
      mkList(json);
    }
  );
}
function getServerDataCheck() {
  if (iptEngId.value == "") return;
  localStorage.setItem("engId", iptEngId.value);
  post(
    selServerHeader.value + "/getServerDataCheck",
    { engId: iptEngId.value },
    httpHeader,
    (resp) => {
      const json = JSON.parse(resp);
      mkServerFileList(json);
    }
  );
}
function mkClubDetail(json) {
  if (json.isMemberShip == 0) {
    selMembership.value = 0;
  } else {
    selMembership.value = 1;
  }
  selGrade.value = json.grade + "";
  if (json.isPrestige == 0) {
    selPrestige.value = 0;
  } else {
    selPrestige.value = 1;
  }
  if (json.isLoginWall == 0) {
    selLoginWall.value = 0;
  } else {
    selLoginWall.value = 1;
  }
}
function mkServerFileList(json) {
  tblServerList.str("");
  Object.entries(json).forEach(([key, val], i) => {
    const tr = tblServerList.add("tr");
    if (val == 0) tr.className = "notr";
    const tdName = tr.add("td");
    const tdCheck = tr.add("td");
    tdName.className = "name";
    tdCheck.className = "check";
    tdName.str(key);
    tdCheck.str(val);
  });
}
function mkList(json) {
  tblList.str("");
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
