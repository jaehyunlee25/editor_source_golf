const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://mnemosynesolutions.co.kr/job";
// const urlHeader = "http://localhost:8038";
const cf = new jCommon();
const obWeek = {
  "09월01주": "2023-09-03~2023-09-09",
  "08월04주": "2023-08-27~2023-09-02",
  "08월03주": "2023-08-20~2023-08-26",
  "08월02주": "2023-08-13~2023-08-19",
  "08월01주": "2023-08-06~2023-08-12",
  "07월04주": "2023-07-31~2023-08-05",
  "07월03주": "2023-07-24~2023-07-30",
};
let checkedDayButton;

setWeek();
setDayButton();
main();
function main() {
  getJobsByWeek();
  getUnsolved();
}
function getJobsByWeek(callback) {
  const param = {
    startDate: iptStart.value,
    endDate: addDay(iptEnd.value, 1),
  };
  post(urlHeader + "/getJobsByWeek", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    mkTable(json);
    if (callback) callback();
  });
}
function getJobsByWeekEx(start, end, callback) {
  const param = {
    startDate: start,
    endDate: end,
  };
  post(urlHeader + "/getJobsByWeek", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
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
      obj.name,
      obj.area,
      obj.progress,
      obj.status,
      obj.created_at,
      obj.updated_at,
    ].forEach((str, i) => {
      if (i == 5 || i == 6) {
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
    button.onclick = daybuttonclick;
  });
  btns[0].click();
}
function daybuttonclick() {
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
    const [start, end] = this.value.split("~");
    iptStart.value = start;
    iptEnd.value = end;
    getJobsByWeek();
  };
  selWeek.onchange();
}
function mkTable(json) {
  jobList.str("");
  json.forEach((obj) => {
    const tmpElem = jobElement.content;
    const trFrag = document.importNode(tmpElem, true);
    const tr = trFrag.children[0];
    const tds = tr.children;
    jobList.appendChild(tr);
    [
      obj.id,
      obj.name,
      obj.area,
      obj.progress,
      obj.status,
      obj.created_at,
      obj.updated_at,
    ].forEach((str, i) => {
      if (i == 5 || i == 6) {
        str = mkDate(str);
      }

      if (i == 1) {
        const pre = tds[i].add("pre");
        pre.str(str);
      } else {
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

  const rawCon = this.children[1].rawStr;

  elId.str(this.children[0].str());
  elName.str(this.children[1].str());
  elArea.str(this.children[2].str());
  elProgress.str(this.children[3].str());
  elStatus.str(this.children[4].str());
  elDate.str(this.children[5].str());
  elDateProc.str(this.children[6].str());
  [elName, elArea, elProgress, elStatus].forEach((el, i) => {
    const str = el.str();
    el.str("");
    const ipt = i == 0 ? el.add("textarea") : el.add("input");
    ipt.style.width = 97 + "%";
    if (i == 0) ipt.style.height = 70 + "px";

    if (i == 0) ipt.value = rawCon;
    else ipt.value = str;
  });

  btnModReal.tr = this;
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
btnAddReal.onclick = function () {
  const param = {
    name: iptName.value,
    area: iptArea.value,
    progress: iptProgress.value,
    status: iptStatus.value,
  };

  post(urlHeader + "/addJob", param, httpHeader, (resp) => {
    // getJobsByWeek();
    if (checkedDayButton) checkedDayButton.click();
  });
};
btnModReal.onclick = function () {
  const param = this.tr.obj;
  param.name = elName.children[0].value;
  param.area = elArea.children[0].value;
  param.progress = elProgress.children[0].value;
  param.status = elStatus.children[0].value;

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
btnDel.onclick = function () {
  if (this.open) {
    doc.gcn("rightWing")[0].style.display = "none";
    this.open = false;
  } else {
    doc.gcn("rightWing")[0].style.display = "block";
    this.open = true;
  }
};
