const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "http://dev.mnemosyne.co.kr:1009";
const apiHeader = "https://dev.mnemosyne.co.kr/api/reservation";
const dictClub = {};
const cf = new jCommon();
let startNumber;
let endNumber;
const boxes = [];
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
  doc.gcn("cover")[0].innerHTML = "";
  clubs.forEach((club, i) => {
    const golfclub = objGolfClubs[club];
    const box = doc.gcn("cover")[0].add("div");
    box.className = "box";
    box.number = i;
    box.club = golfclub;
    box.str(i + 1 + ". " + golfclub.eng_id + "<br>" + golfclub.name);
    box.onclick = boxclick;
    box.onselect = () => {
      return false;
    };
    box.onmousedown = () => {
      return false;
    };
    boxes.push(box);
  });
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
  const clubs = [];
  boxes.forEach((box) => {
    box.style.display = "inline-block";
    if (
      box.club.eng_id.indexOf(str) == -1 &&
      box.club.name.indexOf(str) == -1
    ) {
    } else {
      clubs.push(box.club.eng_id);
    }
  });
  setBoxes(clubs);
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
