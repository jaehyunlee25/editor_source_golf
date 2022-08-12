const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "http://dev.mnemosyne.co.kr:1009";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const dictClub = {};
const cf = new jCommon();
let startNumber;
let endNumber;
let boxes = [];
let objGolfClubs = {};
let clubs;

post(apiHeader + "/getGolfClubs", {}, httpHeader, (data) => {
  golfClubs = JSON.parse(data).golfClubs;
  post(urlHeader + "/clubs", {}, httpHeader, (data) => {
    clubs = JSON.parse(data).clubs;
    golfClubs.forEach((golfclub) => {
      objGolfClubs[golfclub.eng_id] = golfclub;
    });
    clubs.sort();
    setBoxes(clubs);
  });
});

function setBoxes(clubs) {
  doc.gcn("cover")[1].innerHTML = "";
  boxes = [];
  clubs.forEach((club, i) => {
    const golfclub = objGolfClubs[club];
    const box = doc.gcn("cover")[1].add("div");
    box.className = "box";
    box.number = i;
    box.club = golfclub;
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
  setBoxButtons();
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
    const div = box.add("div");
    const strs = ["L", "S", "rR", "rS", "rC"];
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

  const pop = layerpop();
  pop.content.className = "popcon";
  setpophead(pop, this.club, this.sign);
  setpopbody(pop, this.club, this.sign);
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
      "http://dev.mnemosyne.co.kr:1009/" + club.eng_id,
      {},
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.script;
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "S")
    post(
      "http://dev.mnemosyne.co.kr:1009/searchbot",
      { club: club.eng_id },
      httpHeader,
      (data) => {
        const json = JSON.parse(data);
        ta.value = json.script;
        ta.scrollTop = ta.scrollHeight;
      }
    );
  if (sign == "rR")
    post(
      "http://dev.mnemosyne.co.kr:1009/reservebot",
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
      "http://dev.mnemosyne.co.kr:1009/reserveSearchbot",
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
      "http://dev.mnemosyne.co.kr:1009/reserveCancelbot",
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
function setpophead({ content: con, close }, club, sign) {
  const div = con.add("div");
  div.style.cssText = "background-color: royalblue; padding: 5px;";
  const btnEnd = div.add("button");
  btnEnd.onclick = close;
  btnEnd.innerHTML = "X";
  if (sign == "L") {
    const btn = div.add("button");
    btn.innerHTML = "Edit";
    btn.onclick = function () {
      window.open(
        "http://dev.mnemosyne.co.kr:1007/html/loginEditor.html?clubId=" +
          club.eng_id,
        "_blank"
      );
    };
  } else if (sign == "S") {
    const btn = div.add("button");
    btn.innerHTML = "Edit";
    btn.onclick = function () {
      window.open(
        "http://dev.mnemosyne.co.kr:1007/html/editor.html?club_id=" + club.id,
        "_blank"
      );
    };
  } else if (sign == "rR") {
    const btn = div.add("button");
    btn.innerHTML = "Edit";
    btn.onclick = function () {
      window.open(
        "http://mnemosynesolutions.co.kr/app/project/editor_source_golf/reserveReserve.html?club=" +
          club.eng_id,
        "_blank"
      );
    };
  } else if (sign == "rS") {
    const btn = div.add("button");
    btn.innerHTML = "Edit";
    btn.onclick = function () {
      window.open(
        "http://mnemosynesolutions.co.kr/app/project/editor_source_golf/reserveSearch.html?club=" +
          club.eng_id,
        "_blank"
      );
    };
  } else if (sign == "rC") {
    const btn = div.add("button");
    btn.innerHTML = "Edit";
    btn.onclick = function () {
      window.open(
        "http://mnemosynesolutions.co.kr/app/project/editor_source_golf/reserveCancel.html?club=" +
          club.eng_id,
        "_blank"
      );
    };
  }
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
  log("clubs", selClubs.length);
  setBoxes(selClubs);
};
iptSelect.onkeyup = function () {
  btnSelect.onclick();
};
elMqtt.onclick = function () {
  const param = {
    club: "",
    club_id: "",
    clubs: getSelectedClubs(),
    command: "searchAll",
  };
  log(param);
  log("device", iptDevice.value);
  if (param.clubs.length == 0) return;
  socket.send(
    JSON.stringify({
      command: "publish",
      topic: iptDevice.value,
      message: JSON.stringify(param),
    })
  );
};