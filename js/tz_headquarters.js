const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const webHeader = "https://dev.mnemosyne.co.kr/html";
const dictClub = {};
const cf = new jCommon();

let startNumber;
let endNumber;
let boxes = [];
let objGolfClubs = {};
let objGCUUID = {};
let clubs;
let clubStates;
let LOG = {};

let POP;
let deviceDiv = {};
let clubAnchor = {};

main();
function main() {
  post(apiHeader + "/getGolfClubs", {}, httpHeader, (data) => {
    golfClubs = JSON.parse(data).golfClubs;
    post(urlHeader + "/clubs", {}, httpHeader, (data) => {
      const json = JSON.parse(data);
      clubs = json.clubs;
      clubStates = json.clubStates;

      golfClubs.forEach((golfclub) => {
        objGolfClubs[golfclub.eng_id] = golfclub;
        objGCUUID[golfclub.id] = golfclub;
      });
      clubs.sort();
      tabCode.onclick();
      // getLogInfo();
    });
  });
}
function getLogInfo() {
  const param = {
    date: "2023-02-05",
    device_id: "",
    golf_club_id: "",
  };
  post(urlHeader + "/getLog", param, httpHeader, (data) => {
    log(JSON.parse(data));
    const { resultCode, message, data: rows } = JSON.parse(data);
    rows.forEach((row) => {
      const club =
        objGolfClubs[row.golf_club_id] || objGCUUID[row.golf_club_id];
      try {
        if (!LOG[row.device_id]) LOG[row.device_id] = {};
        if (!LOG[row.device_id][club.eng_id])
          LOG[row.device_id][club.eng_id] = [];
        LOG[row.device_id][club.eng_id].push(row);
      } catch (e) {
        log(data);
      }
    });
    /////////////////////////////////////////////////
    /* clubs.forEach((club, i) => {
      if (i > 5) return;
      const param = {
        club: "",
        club_id: "",
        clubs: [club],
        command: "searchAll_date",
      };
      socket.send(
        JSON.stringify({
          command: "publish",
          topic: "a3679151-1d08-11ed-a93e-0242ac11000a",
          message: JSON.stringify(param),
        })
      );
    }); */
    /* const param = {
      command: "popup",
      url: "http://dev.mnemosyne.co.kr:1010/index.html",
      message: "",
    };
    log(param);
    socket.send(
      JSON.stringify({
        command: "publish",
        topic: "1fd056e0-1f94-11ed-a93e-0242ac11000a",
        message: JSON.stringify(param),
      })
    ); */
    //////////////////////////////////////////////////
  });
}
function setLog() {
  Object.keys(LOG).forEach((device) => {
    const div = elBody.add("div");
    div.className = "box";
    div.innerHTML = device;
    div.device = LOG[device];
    div.onclick = deviceClick;
    deviceDiv[device] = div;
  });
}
function deviceClick() {
  currentDevice = this.device;
  POP = layerpop();
  POP.content.className = "popcon";
  setdevicepophead(POP);
  setdevicepopbody(POP, this.device);
}
function setBoxes() {
  elBody.innerHTML = "";
  boxes = [];
  log(clubs);
  clubs.forEach((club, i) => {
    const golfclub = objGolfClubs[club];
    const hdr = doc.gcn("cover")[1].add("div");
    const box = hdr.add("span");
    const sel = hdr.add("span");
    hdr.className = "box";
    box.style.cssText = "display:inline-block;";
    sel.style.cssText = "display:inline-block;margin-left: 15px;";
    box.number = i;
    box.club = golfclub;
    sel.club = golfclub;
    box.str(
      i +
        1 +
        ". <a href='' id='" +
        club +
        "'>" +
        golfclub.eng_id +
        "</a><br>" +
        "<a href='' id='kor_" +
        club +
        "'>" +
        golfclub.name +
        "</a>"
    );
    window[club].onclick = engClick;
    window["kor_" + club].onclick = korClick;
    box.onclick = boxclick;
    box.onselect = () => {
      return false;
    };
    box.onmousedown = () => {
      return false;
    };
    boxes.push(box);
  });
  setBoxStateSelect();
  setBoxButtons();
}
function setBoxStateSelect() {
  boxes.forEach((box) => {
    const vals = [0, 1, 2, 3, 4];
    const strs = ["normal", "sys err", "web err", "search", "login"];
    const par = box.parentNode.children[1];
    const sel = par.add("select");
    sel.club = par.club;
    strs.forEach((str, i) => {
      const opt = doc.clm("option");
      opt.value = vals[i];
      opt.innerHTML = str;
      sel.add(opt);
    });
    sel.value = clubStates[par.club.eng_id];
    sel.onchange = clubstatechange;
  });
}
function clubstatechange() {
  post(
    urlHeader + "/setGolfClubState",
    { golfClubId: this.club.id, golfClubState: this.value },
    httpHeader,
    (data) => {
      log(data);
    }
  );
}
function korClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const name = this.id.split("_")[1];
  const club = objGolfClubs[name];
  navigator.clipboard.writeText(club.id).then(() => {
    log("copied to the clipboard.");
  });
}
function engClick(e) {
  e.preventDefault();
  e.stopPropagation();
  navigator.clipboard.writeText(this.str()).then(() => {
    log("copied to the clipboard.");
  });
}
function setBoxButtons() {
  boxes.forEach((box) => {
    const div = box.parentNode.add("div");
    const strs = ["L", "Sd", "St", "rR", "rS", "rC"];
    strs.forEach((str) => {
      const btn = div.add("button");
      btn.className = "smallbtn";
      btn.str(str);
      btn.sign = str;
      btn.club = box.club;
      btn.onclick = boxbtnclick;
    });
  });
}
function boxbtnclick(e) {
  e.preventDefault();
  e.stopPropagation();

  POP = layerpop();
  POP.content.className = "popcon";
  setpophead(POP, this.club, this.sign);
  setpopbody(POP, this.club, this.sign);
}
function setpopbody({ content: con, close }, club, sign) {
  const div = con.add("div");
  div.style.cssText = "height: 100%;padding: 15px;";
  const ta = div.add("textarea");
  ta.value = "hello, world!!";
  ta.style.cssText =
    "width: 95%;height: 90%; border: 0px; background-color: black; color: white; font-size: 15px;";
  if (sign == "L")
    post(
      urlHeader + "/login_admin",
      { club: club.eng_id },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.script;
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "Sd")
    post(
      urlHeader + "/searchbots_date_admin",
      { clubs: [club.eng_id] },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.scripts[club.eng_id];
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "St")
    post(
      urlHeader + "/searchbots_time_admin",
      { clubs: [club.eng_id], date: "20220831" },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.scripts[club.eng_id];
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "rR")
    post(
      urlHeader + "/reservebot",
      {
        club: club.eng_id,
        year: "2022",
        month: "08",
        date: "26",
        course: "Challenge",
        time: "0637",
      },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.script;
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "rS")
    post(
      urlHeader + "/reserveSearchbot",
      { club: club.eng_id },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.script;
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "rC")
    post(
      urlHeader + "/reserveCancelbot",
      {
        club: club.eng_id,
        year: "2022",
        month: "08",
        date: "26",
        course: "Challenge",
        time: "0637",
      },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.script;
        ta.scrollTop = ta.scrollHeight;
      }
    );
}
function setdevicepopbody({ content: con, close }, device) {
  const div = con.add("div");
  div.style.cssText = "height: 90%;padding: 15px;overflow: auto;";
  Object.keys(device).forEach((club) => {
    const a = div.add("a");
    a.str(club);
    a.className = "club";
    a.href = "#";
    a.club = club;
    a.log = device[club];
    a.onclick = clubClick;
    clubAnchor[club] = a;
  });
  const tac = div.add("div");
  tac.style.cssText = "margin-top:10px;width:95%;height:85%;border: 0px;";
  div.tac = tac;
}
function clubClick() {
  currentClub = this.club;
  Array.from(this.parentNode.gtn("a")).forEach((a) => {
    a.style.cssText = "background-color:white;";
  });
  this.style.cssText = "background-color:#eee";
  const result = [];
  this.log.forEach((Log) => {
    try {
      const msg = JSON.parse(Log.message);
      if (msg.message) {
        try {
          const jsn = JSON.parse(msg.message);
          if (jsn.message)
            result.push(
              [new Date().getTime(), "_", Log.sub_type, "> ", jsn.message].join(
                ""
              )
            );
          else
            result.push(
              [new Date().getTime(), "_", Log.sub_type, "> ", msg.message].join(
                ""
              )
            );
        } catch (e) {
          // log("error 2", e);
          result.push(
            [new Date().getTime(), "_", Log.sub_type, "> ", msg.message].join(
              ""
            )
          );
        }
      } else {
        result.push(
          [new Date().getTime(), "_", Log.sub_type, "> ", Log.message].join("")
        );
      }
    } catch (e) {
      // log("error 1", e);
      result.push(
        [new Date().getTime(), "_", Log.sub_type, "> ", Log.message].join("")
      );
    }
  });

  this.parentNode.tac.innerHTML = "";
  const ta = this.parentNode.tac.add("textarea");
  ta.value = result.join("\r\n");
  ta.style.cssText =
    "margin-top: 10px;width: 95%;height: 95%; border: 0px; background-color: black; color: white; font-size: 15px;";
  ta.scrollTop = ta.scrollHeight;
}
function setpophead({ content: con, close }, club, sign) {
  const editorUrls = {
    L: webHeader + "/html/loginEditor.html?clubId=" + club.eng_id,
    Sd: webHeader + "/html/editor.html?club_id=" + club.id,
    St: webHeader + "/html/editor.html?club_id=" + club.id,
    rR:
      "http://mnemosynesolutions.co.kr/app/project/editor_source_golf/reserveReserve.html?club=" +
      club.eng_id,
    rS:
      "http://mnemosynesolutions.co.kr/app/project/editor_source_golf/reserveSearch.html?club=" +
      club.eng_id,
    rC:
      "http://mnemosynesolutions.co.kr/app/project/editor_source_golf/reserveCancel.html?club=" +
      club.eng_id,
  };
  const mqttCommands = {
    L: "login",
    Sd: "searchAll_date",
    St: "searchAll_time",
    rR: "reserveReserve",
    rS: "reserveSearch",
    rC: "reserveCancel",
  };
  const div = con.add("div");
  div.style.cssText = "background-color: royalblue; padding: 5px;";
  const btnEnd = div.add("button");
  btnEnd.onclick = close;
  btnEnd.innerHTML = "X";

  const btn = div.add("button");
  btn.innerHTML = "Edit";
  btn.onclick = function () {
    window.open(editorUrls[sign], "_blank");
  };

  const iptMqtt = div.add("input");
  iptMqtt.value = "f1b8ab82-1c3d-11ed-a93e-0242ac11000a";
  iptMqtt.style.cssText = "width: 300px;text-align: right;padding: 3px;";

  const btnMqtt = div.add("button");
  btnMqtt.innerHTML = "Mqtt";
  btnMqtt.onclick = function () {
    const param = {
      club: club.eng_id,
      club_id: club.id,
      clubs: [club.eng_id],
      command: mqttCommands[sign],
    };
    // log(param);
    // log("device", iptMqtt.value);
    if (param.clubs.length == 0) return;
    socket.send(
      JSON.stringify({
        command: "publish",
        topic: iptMqtt.value,
        message: JSON.stringify(param),
      })
    );
  };

  const span = div.add("span");
  span.style.cssText =
    "display: inline-block; color: white; font-weight: bold; padding-left: 10px;";
  span.str(mqttCommands[sign].toUpperCase());
}
function setdevicepophead({ content: con, close }) {
  const div = con.add("div");
  div.style.cssText = "background-color: royalblue; padding: 5px;";
  const btnEnd = div.add("button");
  btnEnd.onclick = close;
  btnEnd.innerHTML = "X";
}
function boxclick(e) {
  e.preventDefault();
  if (e.shiftKey) {
    endNumber = this.number;
    selectBoxes();
  } else {
    startNumber = this.number;
    endNumber = this.number;
    unselectBoxes();
    selectBoxes();
  }
}
function unselectBoxes() {
  boxes.forEach((box) => {
    box.style.backgroundColor = "";
  });
}
function selectBoxes() {
  if (endNumber >= startNumber) {
    let count = 0;
    for (let i = startNumber; i <= endNumber; i++) {
      boxes[i].style.backgroundColor = "royalblue";
      count++;
      if (count > 20) break;
    }
  } else {
    let count = 0;
    for (let i = startNumber; i >= endNumber; i--) {
      boxes[i].style.backgroundColor = "royalblue";
      count++;
      if (count > 20) break;
    }
  }
}
function getSelectedClubs() {
  const result = [];
  boxes.forEach((box) => {
    if (box.style.backgroundColor == "royalblue") result.push(box.club);
  });
  return result;
}
tabCode.onclick = function () {
  elBody.innerHTML = "";
  tabLog.parentNode.style.cssText = "background-color:white;";
  tabLog.style.cssText = "color:black;";
  this.parentNode.style.cssText = "background-color:royalblue;";
  this.style.cssText = "color:white;";
  setBoxes();
};
tabLog.onclick = function () {
  elBody.innerHTML = "";
  tabCode.parentNode.style.cssText = "background-color:white;";
  tabCode.style.cssText = "color:black;";
  this.parentNode.style.cssText = "background-color:royalblue;";
  this.style.cssText = "color:white;";
  setLog();
};
btnSelect.onclick = function () {
  const str = iptSelect.value;
  const selClubs = [];
  clubs.forEach((club) => {
    club = objGolfClubs[club];
    if (club.eng_id.indexOf(str) == -1 && club.name.indexOf(str) == -1) {
    } else {
      selClubs.push(club.eng_id);
    }
  });
  // log("clubs", selClubs.length);
  setBoxes(selClubs);
};
iptSelect.onkeyup = function () {
  btnSelect.onclick();
};
