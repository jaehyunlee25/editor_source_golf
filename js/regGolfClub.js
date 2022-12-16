const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/reservation/";
const apiHeader = "https://dev.mnemosyne.co.kr/api/crawler/";
const cf = new jCommon();
let rawClubs;
let clubs;
let groups;

main();
function main() {
  post(apiHeader + "dbGetGolfClub", {}, httpHeader, (data) => {
    const { type, golfClubs } = data.jp();
    rawClubs = golfClubs;
    clubs = ((golfclubs) => {
      const res = [];
      Object.keys(golfclubs).forEach((id) => {
        res.push(golfclubs[id]);
      });
      return res;
    })(rawClubs);
    clubs = clubs.sort((a, b) => {
      const na = new Date(a.updated_at).getTime();
      const nb = new Date(b.updated_at).getTime();
      return nb - na;
    });
    setList();
  });
}
function setList() {
  const t = doc.querySelector("#tplItem");
  const tbl = doc.querySelector("#tblList");
  clubs.forEach((club, j) => {
    const {
      id,
      name,
      phone,
      homepage,
      email,
      area,
      address,
      corp_reg_number,
      description,
    } = club;
    const row = doc.importNode(t.content, true);
    const tds = row.querySelectorAll("td");
    const [tr] = row.querySelectorAll("tr");
    tr.onclick = trclick;
    tr.item = club;
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
  if (opt) doc.gba("id", "el_eng_id")[0].disabled = "disabled";

  doc.gba("id", "el_name")[0].onkeyup = nameChange;
  doc.gba("id", "el_eng_id")[0].onkeyup = engIdChange;

  btnConfirm.opt = opt;
  btnConfirm.content = content;
  btnConfirm.row = row;
  btnConfirm.onclick = confirmClick;
  btnConfirm.close = close;

  btnCancel.onclick = close;

  if (!opt) return;
  Object.keys(row).forEach((key) => {
    if (!window["el_" + key]) return;
    window["el_" + key].value = row[key];
  });
  if (doc.gba("id", "el_course_name")[0].value != "")
    doc.gba("id", "el_course_name")[0].disabled = "disabled";
}
btnNew.onclick = function () {
  setDetail();
};
btnGroup.onclick = function () {
  post(apiHeader + "dbGetGroup", {}, httpHeader, (resp) => {
    groups = {};
    const { type, data } = resp.jp();
    Object.keys(data).forEach((id) => {
      const group = data[id];
      if (!groups[group]) groups[group] = {};
      groups[group][id] = rawClubs[id];
    });
    setGroup();
  });
};
function setGroup() {
  const { back, content, close } = layerpop();
  const div = content.add("div");
  div.css(
    "margin:auto;width: 80%;min-height: 500px;padding-bottom: 20px;padding:10px;"
  );
  const tabs = div.add("div");
  const names = div.add("div");
  const foot = div.add("div");

  //TAB
  tabs.css("border-bottom:1px solid gray;padding-bottom: 5px;");
  foot.css("text-align:center;border-top:1px solid gray;padding-top: 5px;");
  names.css("font-size: 15px;min-height: 400px;");
  Object.keys(groups).forEach((group) => {
    const tab = tabs.add("span");
    tab.css(
      "display:inline-block;border:1px solid lightskyblue;padding:5px;font-size: 12px;margin-right:3px;"
    );
    tab.str(group);
    tab.clubs = groups[group];
    tab.area = names;
    tab.onclick = grouptabclick;
  });
  const tab = tabs.add("span");
  tab.area = names;
  tab.css({
    display: "inline-block",
    border: "1px solid lightgray",
    padding: "5px",
    "font-size": "12px",
    "margin-right": "3px",
    "background-color": "#eee",
  });
  tab.str("그룹추가");
  tab.onclick = groupaddclick;
  // FOOT
  const btnClose = foot.add("button");
  btnClose.str("취소");
  btnClose.onclick = close;
}
function groupaddclick() {
  Array.from(this.parentNode.children).forEach((tab) => {
    tab.css("background-color:white;color:black;");
  });
  this.css("background-color:lightgray;color:white;");
  const { area } = this;
  area.css({ "padding-top": "5px" });
  area.str("");
  const tmplt = doc.querySelector("#tplGroup");
  const dtl = doc.importNode(tmplt.content, true);
  area.appendChild(dtl);
  const [ipt] = area.gba("id", "iptGroupSearch");
  ipt.area = area;
  ipt.onkeyup = clubsearchkeyup;
}
function clubsearchkeyup() {
  const str = this.value;
  if (str.replace(/\s/g, "") == "") return;

  // 검색
  const strs = str.split(",");
  const res = [];
  const chk = {};
  Object.keys(clubs).forEach((key) => {
    const ob = clubs[key];
    Object.keys(ob).forEach((name) => {
      const val = ob[name];
      strs.forEach((str) => {
        str = str.trim();
        if (str == "") return;
        if (val.indexOf(str) != -1 && !chk[key]) {
          res.push(ob);
          chk[key] = true;
        }
      });
    });
  });

  // 표시
  const { area } = this;
  const [tbl] = doc.gba("id", "tblSearchList");
  tbl.str("");
  const [tpl] = area.gba("id", "tplSearchList");
  res.forEach((ob) => {
    const { id, name, eng_id, homepage } = ob;
    const row = doc.importNode(tpl.content, true);
    const [tr] = row.querySelectorAll("tr");
    ["", id, name, eng_id, homepage].forEach((val, i) => {
      if (i == 0) return;
      tr.children[i].str(val);
    });
    tbl.appendChild(row);
  });
}
function grouptabclick() {
  Array.from(this.parentNode.children).forEach((tab) => {
    tab.css("background-color:white;color:black;");
  });
  this.css("background-color:lightskyblue;color:white;");
  const { clubs, area } = this;
  area.str("");
  Object.keys(clubs).forEach((id) => {
    const { name, eng_id } = clubs[id];
    const el = area.add("div");
    el.str([name, eng_id, id].join(" "));
  });
}
function nameChange() {
  const span = doc.gba("id", "nameDesc")[0];
  span.css("display:inline-block;width:45%;height:15px;overflow:auto;");
  span.str("");
  if (this.value == "") return;
  post(
    apiHeader + "dbCheckGolfClubName",
    { name: this.value },
    httpHeader,
    (resp) => {
      const { type, data } = resp.jp();
      const names = data.map((ob) => ob.name);
      if (type == "okay") span.str(names.join(", "));
      else span.str("eng change fail");
    }
  );
}
function engIdChange() {
  const span = doc.gba("id", "engDesc")[0];
  span.css("display:inline-block;width:45%;height:15px;overflow:auto;");
  span.str("");
  if (this.value == "") return;
  post(
    apiHeader + "dbCheckGolfClubEngName",
    { eng_id: this.value },
    httpHeader,
    (resp) => {
      const { type, data } = resp.jp();
      const names = data.map((ob) => ob.eng_id);
      if (type == "okay") span.str(names.join(", "));
      else span.str("eng change fail");
    }
  );
}
function confirmClick() {
  if (this.opt) {
    // 수정
    clubModify(this.row);
  } else {
    // 등록
    clubRegister();
  }
  this.close();
}
function clubRegister() {
  const els = doc.body.gba("id", "el_", true);
  const param = {};
  els.forEach((el) => {
    param[el.id.ch(3)] = el.value;
  });
  if (param.name.replace(/\s/g, "") == "") {
    alert("이름은 필수 입력입니다.");
    window["el_name"].focus();
    return;
  }
  if (param.eng_id.replace(/\s/g, "") == "") {
    alert("영문이름은 필수 입력입니다.");
    window["el_eng_id"].focus();
    return;
  }
  if (param.course_name.replace(/\s/g, "") == "") {
    alert("코스는 필수 입력입니다.");
    window["el_course_name"].focus();
    return;
  }
  post(apiHeader + "dbNewGolfClub", param, httpHeader, (resp) => {
    const { type, data } = resp.jp();
    let obNew;
    log(data);
    if (type == "okay") {
      log("successfully inserted :: " + param.name + " " + param.id);
      Object.keys(data).some((id) => {
        const ob = data[id];
        if (ob.name == param.name && ob.address == param.address) {
          obNew = ob;
          return true;
        }
      });
      newClubEng(obNew, param);
      newClubCourse(obNew, param);
    } else {
      log("something wrong :: " + param.name + " " + param.id);
    }
  });
}
function clubModify(param) {
  Object.keys(param).forEach((key) => {
    if (!window["el_" + key]) return;
    param[key] = window["el_" + key].value.replace(/"/g, "'");
  });
  post(apiHeader + "dbSetGolfClub", param, httpHeader, (resp) => {
    const { type, data } = resp.jp();
    if (type == "okay") {
      log("successfully updated :: " + param.name + " " + param.id);
    } else {
      log("something wrong :: " + param.name + " " + param.id);
    }
  });
  const [a, b] = [
    doc.gba("id", "el_course_name")[0].disabled,
    doc.gba("id", "el_course_name")[0].value == "",
  ];
  if (!a && !b) newClubCourse(param, param);
}
function newClubEng(obNew, param) {
  param.id = obNew.id;
  post(apiHeader + "dbNewGolfClubEng", param, httpHeader, (resp) => {
    const { type, data } = resp.jp();
    if (type == "okay") {
      log("eng_name successfully inserted :: " + param.name + " " + param.id);
    } else {
      log("eng_name something wrong :: " + param.name + " " + param.id);
    }
  });
}
function newClubCourse(obNew, param) {
  param.id = obNew.id;
  post(apiHeader + "dbNewGolfCourse", param, httpHeader, (resp) => {
    const { type, data } = resp.jp();
    if (type == "okay") {
      log("courses successfully inserted :: " + param.name + " " + param.id);
    } else {
      log("courses something wrong :: " + param.name + " " + param.id);
    }
  });
}
