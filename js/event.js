const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const webHeader = "https://dev.mnemosyne.co.kr/html";
const dictClub = {};
const cf = new jCommon();
const STATE = {
  mode: "reg",
};
const funcs = {
  reg: regEvent,
  mod: modEvent,
};
const clubs = {};

main();
function main() {
  post(apiHeader + "/getGolfClubs", {}, httpHeader, (resp) => {
    const { golfClubs } = resp.jp();
    golfClubs.forEach((ob) => {
      clubs[ob.id] = ob;
    });
    setEventList();
  });
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
function setEventList() {
  post(urlHeader + "/getGolfClubEvent", {}, httpHeader, (resp) => {
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
    if (key == "golf_club_id") val = clubs[val].name;
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
function regEvent() {
  if (spClubId.str() == "") {
    alert("You need to select a golf club.");
    iptClub.focus();
    return;
  }
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
    golf_club_id: spClubId.str(),
    title: iptTitle.value,
    content: txtContent.value,
    link: iptLink.value,
  };
  post(urlHeader + "/newGolfClubEvent", param, httpHeader, (resp) => {
    const { data } = resp.jp();
    log(data);
  });
}
function modEvent(event_id) {
  if (spClubId.str() == "") {
    alert("You need to select a golf club.");
    iptClub.focus();
    return;
  }
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
    event_id,
    golf_club_id: spClubId.str(),
    title: iptTitle.value,
    content: txtContent.value,
    link: iptLink.value,
  };
  post(urlHeader + "/modGolfClubEvent", param, httpHeader, (resp) => {
    const { data } = resp.jp();
    setEventList();
  });
}
iptClub.onkeyup = function () {
  spList.str("");
  const { value: name } = this;
  if (name == "") return;
  const res = [];
  Object.entries(clubs).forEach(([key, val]) => {
    if (val.name.indexOf(name) != -1) res.push(val);
    if (val.eng_id.indexOf(name) != -1) res.push(val);
  });
  if (res.length == 0) {
    spList.str("NONE!");
    return;
  }
  if (res.length > 5) {
    spList.str("Too Many Clubs. Need More Specific Info.");
    return;
  }
  res.forEach((ob) => {
    const a = spList.add("a");
    a.str(ob.name);
    a.clubId = ob.id;
    a.homepage = ob.homepage;
    a.href = "javascript: ()=>{};";
    a.onclick = itemclick;
  });
};
function itemclick() {
  spClubId.str(this.clubId);
  iptClub.value = this.str();
  iptLink.value = this.homepage;
  iptClub.onkeyup();
}
