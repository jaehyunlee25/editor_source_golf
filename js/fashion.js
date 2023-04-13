const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const webHeader = "https://dev.mnemosyne.co.kr/html";
const fileHeader = "https://mnemosynesolutions.co.kr/boardFile";
const dictClub = {};
const cf = new jCommon();
const STATE = {
  mode: "reg",
};
const funcs = {
  reg: regFashion,
  mod: modFashion,
};
const clubs = {};

main();
function main() {
  /* post(apiHeader + "/getGolfClubs", {}, httpHeader, (resp) => {
    const { golfClubs } = resp.jp();
    golfClubs.forEach((ob) => {
      clubs[ob.id] = ob;
    });
  }); */
  setEventList();
}

regMod.onclick = function () {
  funcs[STATE.mode](this.eventId);
};
delMod.onclick = function () {
  const { eventId } = this;
  const param = {
    eventId,
  };
  post(urlHeader + "/delGolfClubEvent", param, httpHeader, (resp) => {
    const { data } = resp.jp();
    log(data);
    alert("삭제되었습니다.");
    location.href = location.href;
  });
};
regNew.onclick = function () {
  STATE.mode = "reg";
  h4Mode.str("등록모드");
  regMod.str("등록");
  delMod.style.display = "none";

  iptClub.value = "";
  spClubId.str("");
  spList.str("");
  iptTitle.value = "";
  txtContent.value = "";
  this.style.display = "none";
};
iptThumbnail.onchange = function (e) {
  const [file] = e.target.files;
  const { name, size } = file;
  const ext = name.split(".").lo();
  const allowedExt = ["jpg", "png", "jpeg", "gif"];
  if (allowedExt.indexOf(ext) == -1) {
    alert("다음과 같은 확장자만 등록 가능합니다:\n" + allowedExt);
    e.target.value = "";
    return;
  }
  if (size > 1048576) {
    alert("1MB 이하 파일만 등록 가능합니다.\n현재 파일용량: " + size);
    e.target.value = "";
    return;
  }
};
function setEventList() {
  post(urlHeader + "/getGolfFashion", {}, httpHeader, (resp) => {
    const { data } = resp.jp();
    elList.str("");
    data.forEach((row) => {
      if (row.script_action_result == "normal") return;
      insertRow(tpListItem, elList, row);
    });
  });
}
function insertRow(template, element, object) {
  const ROW = doc.importNode(template.content, true);
  const [TR] = ROW.querySelectorAll("tr");
  const tr = TR.children;
  let i = 0;
  Object.entries(object).forEach(([key, val]) => {
    if (key == "content") return;
    if (key == "isDel") return;
    tr[i++].str(val);
  });
  TR.nm(0, 6, 0).objEvent = object;
  TR.nm(0, 6, 0).onclick = changemode;
  element.appendChild(ROW);
}
function changemode() {
  STATE.mode = "mod";
  h4Mode.str("수정모드");
  regMod.str("수정");
  delMod.style.display = "inline-block";
  const { objEvent } = this;
  const { title, content, id, link } = objEvent;
  const club = clubs[objEvent.golf_club_id];
  iptClub.value = club.name;
  iptClub.onkeyup();
  spList.children[0].click();
  iptTitle.value = title;
  txtContent.value = content;
  regMod.eventId = id;
  delMod.eventId = id;
  iptLink.value = link;
  regNew.style.display = "inline-block";
}
function regFashion() {
  if (iptTitle.value == "") {
    alert("You need to write the title.");
    iptTitle.focus();
    return;
  }
  if (txtContent.value == "") {
    alert("You need to write the content.");
    txtContent.focus();
    return;
  }
  if (iptThumbnail.files.length == 0) {
    alert("썸네일은 반드시 등록해야 합니다.");
    return;
  }

  const [file] = iptThumbnail.files;
  const fd = new FormData();
  fd.append("target", "fashion");
  fd.append("file", file);
  jFile(fileHeader, fd, (data) => {
    const json = data.jp();
    const param = {
      title: iptTitle.value,
      content: txtContent.value,
      thumbnail: json.filename,
    };
    post(urlHeader + "/newGolfFashion", param, httpHeader, (resp) => {
      const { data } = resp.jp();
      log(data);
    });
  });
}
function modFashion(fashion_id) {
  log("mod");
  return;
  if (iptTitle.value == "") {
    alert("You need to write the title.");
    iptTitle.focus();
    return;
  }
  if (txtContent.value == "") {
    alert("You need to write the content.");
    txtContent.focus();
    return;
  }
  const param = {
    fashion_id,
    golf_club_id: spClubId.str(),
    title: iptTitle.value,
    content: txtContent.value,
    link: iptLink.value,
  };
  post(urlHeader + "/modGolfFashion", param, httpHeader, (resp) => {
    const { data } = resp.jp();
    setEventList();
  });
}
function itemclick() {
  spClubId.str(this.clubId);
  iptClub.value = this.str();
  iptLink.value = this.homepage;
  iptClub.onkeyup();
}
