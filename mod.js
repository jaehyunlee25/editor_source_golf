<<<<<<< HEAD
javascript: (() => {
  /* test */
  const log = console.log;
  const dir = console.dir;
  const doc = document;
  const ls = localStorage;
  const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
  const logParam = {
    type: "command",
    sub_type: "",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "",
    parameter: JSON.stringify({}),
  };
  let ac = false;
  try {
    ac =
      window.AndroidController || window.webkit.messageHandlers.iosController;
    ac.message =
      ac.message || window.webkit.messageHandlers.iosController.postMessage;
  } catch (e) {
    ac = false;
  }
=======
javascript:(() => {   
  
  /* test */
const log = console.log;
const dir = console.dir;
const doc = document;
const ls = localStorage;
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const logParam = {
type: "command",
sub_type: "",
device_id: "${deviceId}",
device_token: "${deviceToken}",
golf_club_id: "${golfClubId}",
message: "",
parameter: JSON.stringify({}),
};
let ac = false; 
try {
ac = window.AndroidController || window.webkit.messageHandlers.iosController;
ac.message = ac.message || window.webkit.messageHandlers.iosController.postMessage;
} catch(e) {
ac = false;
}
>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441

  const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
  const aDDr = location.href.split(splitter)[0];
  const suffix = location.href.split(splitter)[1];
  const dictSplitter = { "#": "?", "?": "#" };
  let addr = aDDr;
  if (aDDr.indexOf(dictSplitter[splitter]) != -1)
    addr = aDDr.split(dictSplitter[splitter])[0];

  logParam.sub_type = "url";
  logParam.message = "raw addr :: " + location.href;
  TZLOG(logParam);
  logParam.message = "aDDr :: " + aDDr;
  TZLOG(logParam);
  logParam.message = "addr :: " + addr;
  TZLOG(logParam);
  log("addr", addr);

  function LSCHK(str, sec) {
    const tag = lsg(str);
    if (tag && new Date().getTime() - tag < 1000 * sec) return false;
    lss(str, new Date().getTime());
    return true;
  }
  function TZLOG(param, callback) {
    const addr = OUTER_ADDR_HEADER + "/api/reservation/newLog";
    post(addr, param, { "Content-Type": "application/json" }, (data) => {
      if (callback) callback(data);
    });
  }
  function post(addr, param, header, callback) {
    var a = new ajaxcallforgeneral(),
      str = [];
    if (header["Content-Type"] == "application/json") {
      str = JSON.stringify(param);
    } else {
      for (var el in param) str.push(el + "=" + encodeURIComponent(param[el]));
      str = str.join("&");
    }
    a.post(addr, str, header);
    a.ajaxcallback = callback;
  }
  function get(addr, param, header, callback) {
    var a = new ajaxcallforgeneral(),
      str = [];
    for (var el in param) {
      str.push(el + "=" + param[el]);
    }
    str = str.join("&");
    a.jAjax(addr + "?" + str, header);
    a.ajaxcallback = callback;
  }
  function ajaxcallforgeneral() {
    this.xmlHttp;
    var j = this;
    var HTTP = {};
    var ADDR;
    var PARAM;
    var HEADER;
    this.jAjax = function (address, header) {
      j.xmlHttp = new XMLHttpRequest();
      j.xmlHttp.onreadystatechange = on_ReadyStateChange;
      j.xmlHttp.onerror = onError;
      j.xmlHttp.open("GET", address, true);
      if (header) {
        Object.keys(header).forEach((key) => {
          var val = header[key];
          j.xmlHttp.setRequestHeader(key, val);
        });
      }
      j.xmlHttp.send(null);
    };
    this.post = function (addr, prm, header) {
      j.xmlHttp = new XMLHttpRequest();
      j.xmlHttp.onreadystatechange = on_ReadyStateChange;
      j.xmlHttp.onerror = onError;
      j.xmlHttp.open("POST", addr, true);

      if (header) {
        if (header["Content-Type"])
          Object.keys(header).forEach((key) => {
            var val = header[key];
            j.xmlHttp.setRequestHeader(key, val);
          });
        else
          j.xmlHttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
      } else {
        j.xmlHttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
      }

      ADDR = addr;
      PARAM = prm;
      HEADER = JSON.stringify(header);

      j.xmlHttp.send(prm);
    };
    this.file = function (addr, prm) {
      j.xmlHttp = new XMLHttpRequest();
      j.xmlHttp.onreadystatechange = on_ReadyStateChange;
      j.xmlHttp.open("POST", addr, true);
      j.xmlHttp.send(prm);
    };
    function onError() {}
    function on_ReadyStateChange() {
      if (j.xmlHttp.readyState == 4) {
        if (j.xmlHttp.status == 200) {
          var data = j.xmlHttp.responseText;
          j.ajaxcallback(data);
        } else {
        }
      }
    }
  }
  function lsg(str) {
    return localStorage.getItem(str);
  }
  function lss(key, val) {
    return localStorage.setItem(key, val);
  }
  function lsr(str) {
    return localStorage.removeItem(str);
  }
  function lsc() {
    return localStorage.clear();
  }
  String.prototype.gt = function (num) {
    return this.substring(this.length - num, this.length);
  };
  String.prototype.gh = function (num) {
    return this.substring(0, num);
  };
  String.prototype.ct = function (num) {
    return this.substring(0, this.length - num);
  };
  String.prototype.ch = function (num) {
    return this.substring(num, this.length);
  };
  String.prototype.addzero = function () {
    if (this.length == 1) return "0" + this;
    return this;
  };
  String.prototype.inparen = function () {
    const regex = /.+?\((.+)\)/;
    const str = this.toString();
    const result = [];
    regex
      .exec(str)[1]
      .split("'")
      .join("")
      .split(",")
      .forEach((str) => {
        result.push(str.trim());
      });
    return result;
  };
  String.prototype.datify = function (sign) {
    const str = this.toString();
    if (!sign) sign = "-";
    return [str.gh(4), str.ch(4).gh(2), str.gt(2)].join(sign);
  };
  String.prototype.getFee = function () {
    let str = this.toString();
    str = str.replace(/[^0-9]/g, "");
    return str * 1;
  };
  String.prototype.daySign = function () {
    const str = this.getFee().toString();
    const num = new Date(str.datify()).getDay();
    let sign;
    if (num == 0) sign = 3;
    else if (num == 6) sign = 2;
    else sign = 1;
    return sign.toString();
  };
  String.prototype.dayNum = function () {
    const str = this.getFee().toString();
    const num = new Date(str.datify()).getDay();
    return (num + 1).toString();
  };
  String.prototype.dayKor = function () {
    const str = this.getFee().toString();
    const num = new Date(str.datify()).getDay();
    const week = ["일", "월", "화", "수", "목", "금", "토"];

    return week[num];
  };
  String.prototype.rm = function (str) {
    return this.split(str).join("");
  };
  String.prototype.regex = function (regex) {
    return this.replace(regex, "");
  };
  String.prototype.fillzero = function (sep) {
    const ar = this.split(sep);
    const result = [];
    ar.forEach((el) => {
      result.push(el.addzero());
    });

    return result.join("");
  };
  HTMLElement.prototype.str = function () {
    return this.innerText;
  };
  HTMLElement.prototype.add = function (tag) {
    const el = document.createElement(tag);
    this.appendChild(el);
    return el;
  };
  HTMLElement.prototype.attr = function (str) {
    return this.getAttribute(str);
  };
  HTMLElement.prototype.gcn = function (str) {
    const els = this.getElementsByClassName(str);
    return Array.from(els);
  };
  HTMLElement.prototype.gtn = function (str) {
    const els = this.getElementsByTagName(str);
    return Array.from(els);
  };
  HTMLElement.prototype.str = function (str) {
    return this.innerText;
  };
  document.gcn = function (str) {
    const els = this.getElementsByClassName(str);
    return Array.from(els);
  };
  document.gtn = function (str) {
    const els = this.getElementsByTagName(str);
    return Array.from(els);
  };
  document.clm = function (str) {
    return document.createElement(str);
  };
  window.timer = function (time, callback) {
    setTimeout(callback, time);
  };
  /* 이 부분 자리 옮기지 마시오.*/
  console.clear();

  const dict = {
    "https://www.sonofelicecc.com/m.login.dp/dmparse.dm": funcLogin,
    "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm": funcReserve,
    "https://www.sonofelicecc.com/m.logout.dp/dmparse.dm": funcOut,
  };
  main();

  function funcLogin() {
    log("funcLogin");

    const chk = LSCHK("TZ_SEARCH_LOGIN", 5);
    if (!chk) {
      location.href =
        "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm";
      return;
    }

    if (doc.gcn("atag_flex")[0].str() == "로그아웃") return;
    cyberId.value = "${login_id}";
    cyberPass.value = "${login_password}";
    loginChk();

    return;
  }

  const dict = {
    "http://www.360cc.co.kr/mobile/login/login.do": funcLogin,
    "http://www.360cc.co.kr/mobile/reservation/real_reservation.do": funcReserve,
    "http://www.360cc.co.kr/mobile/user/sign/Logout.do": funcOut};   

  function funcLogin() {
    log("funcLogin");
    
    const chk = LSCHK("TZ_SEARCH_LOGIN", 5);
    if(!chk) {
      location.href = "http://www.360cc.co.kr/mobile/reservation/real_reservation.do";
      return;
    }

    usrId2.value = "${login_id}";
usrPwd2.value = "${login_password}";
fnLogin2();

  
    return;
  }
  
  /* begin blocking infinite call */
<<<<<<< HEAD
  let TZ_BOT_SAFETY = true;
  let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
  let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
  let curTimeforVisit = new Date().getTime();
  log(visitNumber, visitNumber == null);
  if (lsg("TZ_ADMIN_BLOCK_IC") != null) {
    log(1);
    if (curTimeforVisit - lastVistTime < 1000 * 15) {
      log(2);
      if (visitNumber > 9) {
        log(3);
        if (ac) ac.message("TZ_MSG_IC");
        TZ_BOT_SAFETY = false;
        /* 초기화 */
        visitNumber = 0;
        lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
        /* 로그아웃 */
        if (LOGOUT) LOGOUT();
      }
    } else {
      log(4);
      visitNumber = 0;
      lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
    }
  } else {
    log(5);
=======
let TZ_BOT_SAFETY = true;
let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
let curTimeforVisit = new Date().getTime();
log(visitNumber, visitNumber == null);
if(lsg("TZ_ADMIN_BLOCK_IC") != null) {
log(1);
if (curTimeforVisit - lastVistTime < 1000 * 15) {
  log(2);
  if (visitNumber > 9) {
    log(3);
    if(ac) ac.message("TZ_MSG_IC");
    TZ_BOT_SAFETY = false;
    /* 초기화 */
>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441
    visitNumber = 0;
    lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
  }
  visitNumber++;
  lss("TZ_ADMIN_BLOCK_IC", visitNumber);
  log(
    "TZ_ADMIN_BLOCK_IC",
    lsg("TZ_ADMIN_BLOCK_IC"),
    lsg("TZ_ADMIN_BLOCK_IC_TIME")
  );
  /* end blocking infinite call */

  /* var splitter = location.href.indexOf("?") == -1 ? "#" : "?";
var aDDr = location.href.split(splitter)[0];
var suffix = location.href.split(splitter)[1];
var dictSplitter = {"#": "?", "?": "#"};
var addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
  addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr); */

<<<<<<< HEAD
  const COMMAND = "GET_DATE";
  const clubId = "5a2e3107-cd84-11ec-a93e-0242ac11000a";
  const courses = {
    OUT: "32b3a11d-cd86-11ec-a93e-0242ac11000a",
    IN: "32b3a461-cd86-11ec-a93e-0242ac11000a",
  };
  log("step::", 1);
  const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
  const header = { "Content-Type": "application/json" };

  const now = new Date();
  const thisyear = now.getFullYear() + "";
  const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
  const thisdate = thisyear + thismonth;

  now.setDate(28);
  now.setMonth(now.getMonth() + 1);
  const nextyear = now.getFullYear() + "";
  const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
  const nextdate = nextyear + nextmonth;

  log(thisdate, nextdate);

  let dates = [];
  const result = [];
  const golf_schedule = [];
  let lmt;
  function procDate() {
    if (lmt === undefined && dates.length == 0) {
      log("예약가능한 시간이 없습니다.");
      if (ac) ac.message("NONE_OF_GET_SCHEDULE");
      return;
    }

    if (COMMAND == "GET_DATE") {
      if (dates.length > 0) {
        const golf_date = [];
        dates.forEach(([date]) => {
          logParam.sub_type = "search";
          logParam.message = date;
          logParam.parameter = JSON.stringify({
            clubId,
            date,
            type: typeof date,
          });
          TZLOG(logParam, (data) => {});
          golf_date.push(date.datify("-"));
        });
        const param = { golf_date, golf_club_id: clubId };
        post(
          OUTER_ADDR_HEADER + "/api/reservation/golfDate",
          param,
          header,
          (data) => {
            const json = JSON.parse(data);
            log(json.message);
            if (json.resultCode == 200) {
              if (ac) ac.message("SUCCESS_OF_GET_DATE");
            } else {
              if (ac) ac.message("FAIL_OF_GET_DATE");
            }
          }
        );
      } else {
        log("예약가능한 날짜가 없습니다.");
        if (ac) ac.message("NONE_OF_GET_DATE");
      }
      return;
    }

    if (COMMAND == "GET_TIME") {
      const result = [];
      dates.every((arr) => {
        const [date] = arr;
        if (date == "${TARGET_DATE}") {
          result.push(arr);
          return false;
        }
        return true;
      });
      dates = result;
    }

    if (lmt === undefined) lmt = dates.length - 1;
    const order = lmt - dates.length + 1;
    const arrDate = dates.shift();
    if (arrDate) {
      log("수집하기", order + "/" + lmt, arrDate[0]);
      log("TZ_PROGRESS," + order + "," + lmt + "," + arrDate[0]);
      const param = {
        type: "command",
        sub_type: "search",
        device_id: "${deviceId}",
        device_token: "${deviceToken}",
        golf_club_id: "${golfClubId}",
        message: "search",
        parameter: JSON.stringify({ order, total: lmt, date: arrDate[0] }),
      };
      TZLOG(param, (data) => {});
      mneCallDetail(arrDate);
    } else {
      procGolfSchedule();
    }
  }
  function procGolfSchedule() {
    golf_schedule.forEach((obj) => {
      let course_id = courses[obj.golf_course_id];
      if (!course_id && Object.keys(courses).length === 1)
        course_id = courses[Object.keys(courses)[0]];
      obj.golf_course_id = course_id;
      obj.date =
        obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
      if (obj.time.indexOf(":") == -1)
        obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
    });
    /* console.log(golf_schedule); */
    if (golf_schedule.length == 0) {
      log("예약가능한 시간이 없습니다.");
      if (ac) ac.message("NONE_OF_GET_SCHEDULE");
      return;
    }
    const param = { golf_schedule, golf_club_id: clubId };
    post(addrOuter, param, header, (data) => {
      const json = JSON.parse(data);
      log(json.message);
      if (json.resultCode == 200) {
        if (ac) ac.message("end of procGolfSchedule!");
      } else {
        if (ac) ac.message("FAIL_OF_GET_SCHEDULE");
      }
    });
  }
  function mneCall(date, callback) {
    Array.from(mabari.children).forEach((el) => {
      const date = el.children[0].getAttribute("data-date");
      const sign = el.children[1].innerText;
      if (sign != "예약") return;
      dates.push([date, ""]);
=======
const COMMAND = "GET_DATE";
const clubId = 'a7fe6b1d-f05e-11ec-a93e-0242ac11000a';
const courses = { 
'In': 'a8005001-f05e-11ec-a93e-0242ac11000a',
'Out': 'a8005112-f05e-11ec-a93e-0242ac11000a',
};
log("step::", 1);const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setDate(28);
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

log(thisdate, nextdate);

let dates = [];
const result = [];
const golf_schedule = [];
let lmt;
function procDate() {
if (lmt === undefined && dates.length == 0) {
  log("예약가능한 시간이 없습니다.");
  if (ac) ac.message("NONE_OF_GET_SCHEDULE");
  LOGOUT();
  return;
}

if (COMMAND == "GET_DATE") {
  if (dates.length > 0) {
    const golf_date = [];
    dates.forEach(([date]) => {
      logParam.sub_type = "search";
      logParam.message = date;
      logParam.parameter = JSON.stringify({
        clubId,
        date,
        type: typeof date,
      });
      TZLOG(logParam, (data) => {});
      golf_date.push(date.datify("-"));
    });
    const param = { golf_date, golf_club_id: clubId };
    post(
      OUTER_ADDR_HEADER + "/api/reservation/golfDate",
      param,
      header,
      (data) => {
        const json = JSON.parse(data);
        log(json.message);
        if (json.resultCode == 200) {
          if (ac) ac.message("SUCCESS_OF_GET_DATE");
        } else {
          if (ac) ac.message("FAIL_OF_GET_DATE");
        }
        LOGOUT();
      }
    );
  } else {
    log("예약가능한 날짜가 없습니다.");
    if (ac) ac.message("NONE_OF_GET_DATE");
    LOGOUT();
  }
  return;
}

if (COMMAND == "GET_TIME") {
  const result = [];
  dates.every((arr) => {
    const [date] = arr;
    if (date == "${TARGET_DATE}") {
      result.push(arr);
      return false;
    }
    return true;
  });
  dates = result;
}

if (lmt === undefined) lmt = dates.length - 1;
const order = lmt - dates.length + 1;
const arrDate = dates.shift();
if (arrDate) {
  log("수집하기", order + "/" + lmt, arrDate[0]);
  log("TZ_PROGRESS," + order + "," + lmt + "," + arrDate[0]);
  const param = {
    type: "command",
    sub_type: "search",
    device_id: "${deviceId}",
    device_token: "${deviceToken}",
    golf_club_id: "${golfClubId}",
    message: "search",
    parameter: JSON.stringify({ order, total: lmt, date: arrDate[0] }),
  };
  TZLOG(param, (data) => {});
  mneCallDetail(arrDate);
} else {
  procGolfSchedule();
}
}
function procGolfSchedule() {
golf_schedule.forEach((obj) => {
  let course_id = courses[obj.golf_course_id];
  if (!course_id && Object.keys(courses).length === 1)
    course_id = courses[Object.keys(courses)[0]];
  obj.golf_course_id = course_id;
  obj.date =
    obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
  if (obj.time.indexOf(":") == -1)
    obj.time = obj.time.gh(2) + ":" + obj.time.gt(2);
});
/* console.log(golf_schedule); */
if (golf_schedule.length == 0) {
  log("예약가능한 시간이 없습니다.");
  if (ac) ac.message("NONE_OF_GET_SCHEDULE");
  LOGOUT();
  return;
}
const param = { golf_schedule, golf_club_id: clubId };
post(addrOuter, param, header, (data) => {
  const json = JSON.parse(data);
  log(json.message);
  if (json.resultCode == 200) {
    if (ac) ac.message("end of procGolfSchedule!");
  } else {
    if (ac) ac.message("FAIL_OF_GET_SCHEDULE");
  }
  LOGOUT();
});
}
function mneCall(strdate, callback) {
const param = {};
const els = document.getElementsByClassName("cal_live");
Array.from(els).forEach((el) => {
  const href = el.getAttribute("href");
  if (href === "#") return;
  const date = strdate + el.innerText.addzero();
  dates.push([date, ""]);
});
callback();
}


function mneCallDetail(arrDate) {
const [date, strParam] = arrDate;
const param = {
  golfResType: "real",
  courseId: "0",
  usrMemCd: "40",
  pointDate: date,
  openYn: "1",
  dateGbn: "3",
  choiceTime: "00",
  cssncourseum: "",
  inputType: "I",
};
const courseDict = {
  IN: "In",
  OUT: "Out",
};

post("/mobile/reservation/list/ajax_real_timeinfo_list.do", param, {}, (data) => {
  const ifr = document.createElement("div");
  ifr.innerHTML = data;

  const tbl = ifr
    .getElementsByClassName("cm_time_list_tbl")[0]
    .getElementsByTagName("tbody")[0];
  const els = tbl.getElementsByTagName("tr");

  const obTeams = {};
  Array.from(els).forEach((el, i) => {
    if (i === 0) return;
    const course = courseDict[el.children[1].innerText];
    const time = el.children[2].innerText;
    const fee_discount = el.children[4].innerText.split(",").join("") * 1;
    const fee_normal = el.children[4].innerText.split(",").join("") * 1;

    golf_schedule.push({
      golf_club_id: clubId,
      golf_course_id: course,
      date,
      time,
      in_out: "",
      persons: "",
      fee_normal,
      fee_discount,
      others: "9홀",
>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441
    });

    callback();
  }

  function mneCallDetail(arrDate) {
    const [date] = arrDate;
    const param = {
      fRsvD: date,
      fJiyukCd: "60",
      fStoreCd: 2180,
    };

<<<<<<< HEAD
    post("/m.rsv.selectMobileRsvStepOne.dp/dmparse.dm", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const arrDiv = ifr.getElementsByClassName("grid-content-container");
      Array.from(arrDiv).forEach((el) => {
        const course = el.children[1].innerText.replace(/\s/g, "");
        const time = el.children[0].innerText
          .replace(/\s/g, "")
          .ct(1)
          .split("시")
          .join("");
        const fee_discount =
          el.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;
        const fee_normal =
          el.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: course,
        });
      });
      procDate();
    });
  }

  function funcLogin() {
    log("funcLogin");

    if (doc.gcn("atag_flex")[0].str() == "로그아웃")
      location.href =
        "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm";

    const chk = LSCHK("TZ_SEARCH_LOGIN", 5);
    if (!chk) {
      location.href =
        "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm";
      return;
    }

    if (doc.gcn("atag_flex")[0].str() == "로그아웃") return;
    cyberId.value = "${login_id}";
    cyberPass.value = "${login_password}";
    loginChk();

    return;
  }
  function LOGOUT() {
    log("LOGOUT");
    logout();
  }

=======
function LOGOUT() {
  log("LOGOUT");
  location.href = "/mobile/user/sign/Logout.do";
}
  
>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441
  function main() {
    log("main");

    const func = dict[addr];
    if (!func) funcOther();
    else func();
  }

  function funcList() {
    log("funcList");
<<<<<<< HEAD
    location.href = "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm";
=======
    location.href = "http://www.360cc.co.kr/mobile/reservation/real_reservation.do";
>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441
    return;
  }
  function funcMain() {
    log("funcMain");
<<<<<<< HEAD
    location.href = "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm";
=======
    location.href = "http://www.360cc.co.kr/mobile/reservation/real_reservation.do";
>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441
    return;
  }
  function funcOut() {
    log("funcOut");

    funcEnd();

    return;
  }
  function funcOther() {
    log("funcOther");

    const chk = LSCHK("TZ_SEARCH_OTHER", 5);
<<<<<<< HEAD
    if (!chk) return;

    location.href = "https://www.sonofelicecc.com/m.rsv.mainCal.dp/dmparse.dm";

    return;
  }
  function funcReserve() {
    log("funcSearch");

    mneCall(thisdate, procDate);
=======
    if(!chk) return;
      
    location.href = "http://www.360cc.co.kr/mobile/reservation/real_reservation.do";

    return;
  }    
  function funcReserve() {
    log("funcSearch");

    const chk = LSCHK("TZ_SEARCH_RESERVE", 5);
    if(!chk) return;

    
mneCall(thisdate, () => {
doc.gcn("right")[1].click();
setTimeout(() => {
  mneCall(nextdate, procDate);
}, 1000);
});

>>>>>>> 9b67df767d9f52a91c3d6be4a5e5933f858a4441

    return;
  }

  main();
})();
