const httpHeader = { "Content-Type": "application/json" };
let urlHeader = "https://mnemosynesolutions.co.kr/job";
const cf = new jCommon();
const obWeek = {
  "09월02주": "2023-09-10~2023-09-16",
  "09월01주": "2023-09-03~2023-09-09",
  "08월04주": "2023-08-27~2023-09-02",
  "08월03주": "2023-08-20~2023-08-26",
  "08월02주": "2023-08-13~2023-08-19",
  "08월01주": "2023-08-06~2023-08-12",
  "07월04주": "2023-07-31~2023-08-05",
  "07월03주": "2023-07-24~2023-07-30",
};
let checkedDayButton;
let currentList;
let members = {};
const strSetting = localStorage.getItem("mnemosyne_job_setting");
const setting = strSetting ? strSetting.jp() : {};

if (!setting.user) {
  location.href = "whoareyou.html";
}

get(".env", {}, httpHeader, (resp) => {
  let { urlHeader: url } = resp.jp();
  urlHeader = url;
  post(urlHeader + "/getMember", {}, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    json.forEach((member) => {
      members[member.id] = member;
    });
    init();
  });
});

function init() {
  setWeek();
  setPart();
  setTag();
  setProcDay();
  setMember();
  // setDayButton();
  main();
}
function main() {
  getUnsolved();
}
function setMember() {
  Object.entries(members).forEach(([id, member], i) => {
    const option = doc.createElement("option");
    option.value = id;
    option.str(member.name + "(" + member.comId + ")");
    iptWriter.appendChild(option);
  });
  if (setting.user) iptWriter.value = setting.user;
}
function setPart() {
  const param = {};
  post(urlHeader + "/getPart", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    json.forEach((row) => {
      const { part } = row;
      const opt = doc.createElement("option");
      selPart.appendChild(opt);
      opt.str(part);
    });
    if (setting.part) selPart.value = setting.part;
  });
}
function setProcDay() {
  if (setting.procDay) selProcDay.value = setting.procDay;
}
function setTag() {
  const param = {};
  post(urlHeader + "/getTag", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    json.forEach((row) => {
      const { tag } = row;
      const opt = doc.createElement("option");
      selTag.appendChild(opt);
      opt.str(tag);
    });
    if (setting.tag) selTag.value = setting.tag;
  });
}
function getJobsByWeek(callback) {
  const param = {
    startDate: iptStart.value,
    endDate: addDay(iptEnd.value, 1),
    option: selProcDay.value,
  };
  post(urlHeader + "/getJobsByWeek", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    currentList = json;
    mkTable(json);
    if (callback) callback();
  });
}
function getJobsByWeekEx(start, end, callback) {
  const param = {
    startDate: start,
    endDate: end,
    option: selProcDay.value,
  };
  post(urlHeader + "/getJobsByWeek", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    currentList = json;
    mkTable(json);
    if (callback) callback();
  });
}
function getUnsolved(callback) {
  post(urlHeader + "/getUnsolved", {}, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    mkUnsolvedTable(json);
    if (callback) callback();
  });
}
function mkUnsolvedTable(json) {
  unSolvedList.str("");
  json.forEach((obj) => {
    const tmpElem = jobElement.content;
    const trFrag = document.importNode(tmpElem, true);
    const tr = trFrag.children[0];
    const tds = tr.children;
    unSolvedList.appendChild(tr);
    [
      obj.id,
      obj.project,
      obj.name,
      obj.area,
      obj.progress,
      obj.status,
      obj.created_at,
      obj.updated_at,
    ].forEach((str, i) => {
      if (i == 6 || i == 7) {
        str = mkDate(str);
      }
      tds[i].str(str);
    });
  });
}
function addDay(dateString, addNumber) {
  // Date 객체 생성
  const date = new Date(dateString);
  // 하루를 밀리초로 계산 (24시간 * 60분 * 60초 * 1000밀리초)
  const addDay = 24 * 60 * 60 * 1000 * addNumber;
  // 주어진 날짜에 하루를 더합니다.
  date.setTime(date.getTime() + addDay);
  // 년, 월, 일을 각각 가져옵니다.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1을 합니다.
  const day = String(date.getDate()).padStart(2, "0");
  // yyyy-mm-dd 형식의 문자열로 반환
  return `${year}-${month}-${day}`;
}
function setDayButton() {
  const week = selWeek.value;
  const firstDay = week.split("~")[0];
  const btns = doc.gcn("daybutton");
  btns.forEach((button, i) => {
    if (i == 0) {
      button.firstDay = firstDay;
      button.endDay = addDay(firstDay, 6);
    } else {
      button.firstDay = addDay(firstDay, i - 1);
      button.endDay = addDay(button.firstDay, 1);
    }
    button.index = i;
    button.onclick = daybuttonclick;
  });
  if (setting.day != null) btns[setting.day].click();
}
function daybuttonclick() {
  saveSetting("day", this.index);
  const btns = doc.gcn("daybutton");
  btns.forEach((button) => {
    button.className = "daybutton";
  });
  this.className = "daybutton checked";

  getJobsByWeekEx(this.firstDay, this.endDay);
  checkedDayButton = this;
}
function setWeek() {
  Object.entries(obWeek).forEach(([key, val], i) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.str(key);
    selWeek.appendChild(opt);
  });
  selWeek.onchange = function () {
    saveSetting("week", this.value);
    const [start, end] = this.value.split("~");
    iptStart.value = start;
    iptEnd.value = end;
    setDayButton();
  };
  if (setting.week) selWeek.value = setting.week;
  selWeek.onchange();
}
function saveSetting(key, val) {
  setting[key] = val;
  localStorage.setItem("mnemosyne_job_setting", JSON.stringify(setting));
}
function mkTable(json) {
  jobList.str("");
  json.forEach((obj) => {
    if (selPart.value != "전체") {
      if (obj.area != selPart.value) return;
    }
    if (selTag.value != "전체") {
      if (!obj.name.has("[" + selTag.value + "]")) return;
    }
    if (selProcDay.value != "all") {
      const btns = doc.gcn("daybutton");
      let start = iptStart.value;
      let end = addDay(iptEnd.value, 1);
      if (setting.day) {
        start = btns[setting.day].firstDay;
        end = btns[setting.day].endDay;
      }
      if (selProcDay.value == "create") {
        if (obj.created_at >= start && obj.created_at < end) {
        } else {
          return;
        }
      } else if (selProcDay.value == "update") {
        if (obj.updated_at >= start && obj.updated_at < end) {
        } else {
          return;
        }
      }
    }
    const tmpElem = jobElement.content;
    const trFrag = document.importNode(tmpElem, true);
    const tr = trFrag.children[0];
    const tds = tr.children;
    jobList.appendChild(tr);
    [
      obj.id,
      obj.project,
      obj.name,
      obj.area,
      obj.progress,
      obj.status,
      obj.writer,
      obj.created_at,
      obj.updated_at,
    ].forEach((str, i) => {
      if (i == 2) {
        const pre = tds[i].add("pre");
        pre.str(str);
      } else {
        if (i == 6) {
          const member = members[str];
          str = member.name;
          tds[i].member = member;
        } else if (i == 7 || i == 8) {
          str = mkDate(str);
        } else if (i == 0) {
          tds[i].jobId = str;
          str = str.gh(8) + "...";
        }
        tds[i].str(str);
      }

      tds[i].rawStr = str;
    });
    tr.onmousemove = mousemove;
    tr.onmouseout = mouseout;
    tr.onclick = elementclick;
    tr.obj = obj;
  });
}
function elementclick(e) {
  clear();
  this.style.backgroundColor = "lightblue";
  this.selected = true;

  const rawCon = this.children[2].rawStr;

  elId.str(this.children[0].jobId);
  elProject.str(this.children[1].str());
  elName.str(this.children[2].str());
  elArea.str(this.children[3].str());
  elProgress.str(this.children[4].str());
  elStatus.str(this.children[5].str());
  elWriter.str(this.children[6].str());
  elDate.str(this.children[7].str());
  elDateProc.str(this.children[8].str());
  [elProject, elName, elArea, elProgress, elStatus].forEach((el, i) => {
    const str = el.str();
    el.str("");
    const ipt = i == 1 ? el.add("textarea") : el.add("input");
    ipt.style.width = 97 + "%";
    if (i == 1) ipt.style.height = 70 + "px";

    if (i == 1) ipt.value = rawCon;
    else ipt.value = str;
  });

  elWriter.str("");
  const curMem = this.children[6].member;
  const sel = elWriter.add("select");
  sel.style.padding = "3px";
  Object.entries(members).forEach(([id, mem], i) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.str(mem.name + "(" + mem.comId + ")");
    sel.appendChild(opt);
  });
  sel.value = curMem.id;

  btnModReal.tr = this;
  btnDelReal.tr = this;
}
function mousemove(e) {
  if (this.selected) return;
  this.style.backgroundColor = "#eee";
}
function mouseout(e) {
  if (this.selected) return;
  this.style.backgroundColor = "transparent";
}
function clear() {
  Array.from(jobList.children).forEach((line) => {
    line.style.backgroundColor = "transparent";
    line.selected = false;
  });
}
function mkDate(str) {
  const date = new Date(str);
  const formatted = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return formatted;
}
selProcDay.onchange = function () {
  saveSetting("procDay", this.value);
  mkTable(currentList);
};
selPart.onchange = function () {
  saveSetting("part", this.value);
  mkTable(currentList);
};
selTag.onchange = function () {
  saveSetting("tag", this.value);
  mkTable(currentList);
};
btnAddReal.onclick = function () {
  const param = {
    project: iptProject.value,
    name: iptName.value,
    area: iptArea.value,
    progress: iptProgress.value,
    status: iptStatus.value,
    writer: iptWriter.value,
  };

  post(urlHeader + "/addJob", param, httpHeader, (resp) => {
    // getJobsByWeek();
    if (checkedDayButton) checkedDayButton.click();
  });
};
btnModReal.onclick = function () {
  const param = this.tr.obj;
  if (param.writer == "7aa5633c-52b3-11ee-a1bf-f220af5e408d") {
  } else {
    if (setting.user != param.writer) {
      alert("작성자가 아니면 수정할 수 없습니다.");
      return;
    }
  }
  param.project = elProject.children[0].value;
  param.name = elName.children[0].value;
  param.area = elArea.children[0].value;
  param.progress = elProgress.children[0].value;
  param.status = elStatus.children[0].value;
  param.writer = elWriter.children[0].value;

  post(urlHeader + "/modJob", param, httpHeader, (resp) => {
    if (checkedDayButton) {
      getJobsByWeekEx(
        checkedDayButton.firstDay,
        checkedDayButton.endDay,
        () => {
          Array.from(jobList.children).forEach((tr) => {
            if (tr.children[0].str() == param.id) tr.click();
          });
        }
      );
    } else {
      getJobsByWeek(() => {
        Array.from(jobList.children).forEach((tr) => {
          if (tr.children[0].str() == param.id) tr.click();
        });
      });
    }
  });
};
btnDelReal.onclick = function () {
  const param = this.tr.obj;
  if (members[setting.user] != param.id) {
    alert("작성자가 아니면 삭제할 수 없습니다.");
    return;
  }
  post(urlHeader + "/delJob", param, httpHeader, (resp) => {
    if (checkedDayButton) checkedDayButton.click();
  });
};
btnAdd.onclick = function () {
  if (this.open) {
    doc.gcn("leftWing")[0].style.display = "none";
    this.open = false;
  } else {
    doc.gcn("rightWing")[0].style.display = "none";
    btnMod.open = false;

    doc.gcn("leftWing")[0].style.display = "block";
    this.open = true;
  }
};
btnMod.onclick = function () {
  if (this.open) {
    doc.gcn("rightWing")[0].style.display = "none";
    this.open = false;
  } else {
    doc.gcn("leftWing")[0].style.display = "none";
    btnAdd.open = false;

    doc.gcn("rightWing")[0].style.display = "block";
    this.open = true;
  }
};
