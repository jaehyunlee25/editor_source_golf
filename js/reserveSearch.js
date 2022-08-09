const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "http://dev.mnemosyne.co.kr:1009";
const dictClub = {};
const urlName = {
  funcLogin: "login_url",
  funcReserve: "search_url",
  funcMain: "main_url",
  funcOut: "logout_url",
  funcList: "reserve_url",
  funcDiv: "div_url",
  funcTime: "time_url",
  funcExec: "exec_url",
  funcNext: "next_url",
  funcLast: "last_url",
};
let commonScript = "";
let clubs;
let clubIds;
let clubLmt;
let count = -1;
const tas = {};
const traverseFlag = false;
const cf = new jCommon();
const gg = cf.getGet();

post(urlHeader + "/clubs", {}, httpHeader, (data) => {
  clubs = JSON.parse(data).clubs;
  clubIds = JSON.parse(data).clubIds;
  setSel(clubs);
  if (traverseFlag) traverse();
  post(
    "https://dev.mnemosyne.co.kr/api/reservation/getGolfCourses",
    { golf_club_id: iptClubId.value },
    httpHeader,
    (data) => {
      const json = JSON.parse(data);
      json.golfCourses.forEach((course) => {
        const opt = doc.clm("option");
        selCourse.add(opt, null);
        opt.str(course.name);
      });
    }
  );
});

function traverse() {
  iptClub.value = clubs[count];
  iptClub.onkeyup();
}
function traverseCallback() {
  log("count", count, clubs[count]);
  btnSave.onclick();
}
function saveCallback() {
  count++;
  if (count > clubs.length - 1) return;
  if (traverseFlag) traverse();
}

let prev;
function mkScreen() {
  const param = btnSave.param;
  elDict.val = JSON.stringify(param.dict);
  elDict.onclick = divclick;

  elDC.val = JSON.stringify(param.dictCourse);
  elDC.onclick = divclick;

  elFunc.innerHTML = "";
  ta.value = "";
  Object.keys(param.funcs)
    .sort()
    .forEach((key) => {
      const div = elFunc.add("div");
      div.key = key;
      div.str(key);
      div.val = param.funcs[key];
      div.className = "select";
      div.onclick = divclick;
      if (gg && gg.func && gg.func == key) div.onclick();
    });

  function divclick() {
    ta.curTarget = this;
    if (this.curVal) ta.value = this.curVal;
    else ta.value = this.val;

    this.className = "divClick";
    if (prev) prev.className = "select";
    prev = this;
  }
  if (traverseFlag) traverseCallback();
}
function opReserveScript(club, script) {
  log(script);
  let purecode = script.split("console.clear();")[1].trim();
  purecode = purecode.split("\r\n").join("\n");
  purecode = purecode.split("\n").join("\r\n");
  const lines = purecode.split("\r\n");
  lines.pop();
  const code = lines.join("\r\n");
  const dict = getDict(code);
  const funcs = getFunc(code);
  const dictCourse = getDictCourse(code);
  const param = { club, dict, funcs, dictCourse };
  btnSave.param = param;
  mkScreen();
}
function getSplitterDate(code) {
  const lns = code.split("\r\n");
  const regex =
    /\s?const\s?fulldate\s?=\s?\[\s?year,\s?month,\sdate\s?\]\.join\("(.?)"\);/;
  let splitter = "";
  lns.every((ln) => {
    const res = regex.exec(ln);
    if (res) splitter = res[1];
    return true;
  });
  return splitter;
}
function getDictCourse(code) {
  const lns = code.split("\r\n");
  const cons = dictCourseFilter(lns);
  const result = {};

  cons.forEach((con, i) => {
    if (con == "") return;
    const [course, sign] = con.split(":");
    result[course] = sign.trim();
  });

  return result;
}
function getFunc(code) {
  code = code.split("\r\n").join("\n");
  code = code.split("\n").join("\r\n");
  let pCount = 0;
  const funcs = {};
  const resEls = [];
  let curFunc = "";
  code.split("\r\n").forEach((ln) => {
    const regex = /\s?function\s([a-zA-Z]+)\s?\(/;
    const res = regex.exec(ln);
    if (!pCount && res) {
      curFunc = res[1];
      funcs[curFunc] = [ln];

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;

      return;
    }
    if (pCount) {
      funcs[curFunc].push(ln);

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;
      return;
    }
    resEls.push(ln);
  });
  Object.keys(funcs).forEach((key) => {
    const func = funcs[key];
    funcs[key] = func.join("\r\n");
  });
  // delete funcs.funcLogin;
  commonScript = resEls.join("\r\n");
  return funcs;
}
function getDict(code) {
  const lns = code.split("\r\n");
  const cons = dictFilter(lns);
  let header;
  let headerResult = true;
  const result = [];

  cons.forEach((con, i) => {
    if (con == "") return;
    const arr = con.split(":");
    if (i == 0) {
      header = arr[0];
    } else {
      if (header != arr[0]) headerResult = false;
    }
    let name = arr.pop();
    const url = arr.join(":").trim();
    name = name.trim();
    result.push([urlName[name], url, name]);
  });
  return result;
}
function dictCourseFilter(lns) {
  let flg = 0;
  const result = [];
  lns.every((ln, i) => {
    const regex = /const\sdictCourse\s/;
    if (regex.exec(ln)) {
      flg = 1;
      if (flg == 1 && /};/.exec(ln)) {
        return false;
      }
      return true;
    }
    if (flg == 1 && /};/.exec(ln)) {
      return false;
    }

    if (flg == 1) result.push(ln.trim().rm('"').rm("\r\n"));

    return true;
  });
  return result.join("").split(",");
}
function dictFilter(lns) {
  const regex = /const\sdict\s/;
  let flg = 0;
  const result = [];
  lns.every((ln, i) => {
    if (regex.exec(ln)) {
      flg = 1;
      return true;
    }
    if (flg == 1 && /};/.exec(ln)) {
      return false;
    }

    if (flg == 1) result.push(ln.trim().rm('"').rm("\r\n"));

    return true;
  });
  return result.join("").split(",");
}
function setSel(clubs) {
  clubs.forEach((club) => {
    dictClub[club] = true;
    const opt = doc.clm("option");
    selClub.add(opt, null);
    opt.value = club;
    opt.str(club);
  });

  if (gg) selClub.value = gg.club;
  selClub.onchange();
}
btnSave.onclick = function () {
  const param = {
    club: selClub.value,
    dict: JSON.parse(elDict.val),
    dictCourse: JSON.parse(elDC.val),
    funcs: {},
  };
  Array.from(elFunc.children).forEach((el) => {
    param.funcs[el.key] = el.val;
  });

  /* Object.keys(param.funcs).forEach((key) => {
    param.funcs[key] = tas[key].value.split("\n").join("\r\n");
  }); */
  Object.keys(param.dictCourse).forEach((key) => {
    param.dictCourse[key] = param.dictCourse[key].trim();
  });

  post(urlHeader + "/setReserveSearch", param, httpHeader, (data) => {
    if (traverseFlag) saveCallback(data);
  });
};
iptClub.onkeyup = function (e) {
  const val = this.value;
  const arr = Object.keys(dictClub).filter((club) => club.indexOf(val) != -1);
  const club = dictClub[this.value];
  // log(val, arr.length, arr);
  if (arr.length != 1 && !club) return;

  this.value = club ? this.value : arr[0];
  selClub.value = club ? this.value : arr[0];
  selClub.onchange();
};
selClub.onchange = function () {
  // console.clear();
  iptClubId.value = clubIds[this.value];
  iptClub.value = this.value;
  const param = {
    club: this.value,
    year: selYear.value,
    month: selMonth.value,
    date: selDate.value,
    course: selCourse.value,
    time: [selHour.value, iptMin.value].join(""),
  };
  post(urlHeader + "/reserveSearchbot_admin", param, httpHeader, (data) => {
    const script = JSON.parse(data).script;
    opReserveScript(param.club, script);
  });
};
ta.onkeyup = function (e) {
  if (e.key == "s" && e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    this.curTarget.val = this.value.split("\n").join("\r\n");
  }
  if (this.curTarget.val != this.value.split("\n").join("\r\n"))
    this.curTarget.style.color = "orange";
  else this.curTarget.style.color = "black";

  ta.curTarget.curVal = this.value;
  return false;
};
ta.onkeydown = function (e) {
  if (e.key == "s" && e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    this.curTarget.val = this.value;
  }
};
ta.onkeypress = function (e) {
  if (e.key == "s" && e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    this.curTarget.val = this.value;
  }
};
iptClubId.onclick = function () {
  this.select();
};
iptClub.onclick = function () {
  this.select();
};
iptMin.onclick = function () {
  this.select();
};
elMqtt.onclick = function () {
  const param = {
    club: iptClub.value,
    club_id: clubIds[iptClub.value],
    year: selYear.value,
    month: selMonth.value,
    date: selDate.value,
    course: selCourse.value,
    time: [selHour.value, iptMin.value].join(""),
    command: "reserveSearch", // reserve, reserveSearch, reserveCancel, search
  };
  socket.send(
    JSON.stringify({
      command: "publish",
      topic: "95b7a543-ea1d-11ec-a93e-0242ac11000a",
      message: JSON.stringify(param),
    })
  );
};
