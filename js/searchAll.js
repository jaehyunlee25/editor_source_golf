const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "http://mnemosynesolutions.co.kr:8080";
const dictClub = {};
const cf = new jCommon();
let startNumber;
let endNumber;
const boxes = [];

post(urlHeader + "/clubs", {}, httpHeader, (data) => {
  clubs = JSON.parse(data).clubs;
  clubs.sort();
  setBoxes(clubs);
});

function setBoxes(clubs) {
  clubs.forEach((club, i) => {
    const box = doc.gcn("cover")[0].add("div");
    box.className = "box";
    box.number = i;
    box.club = club;
    box.str(i + 1 + ". " + club);
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
    unselectBoxes();
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
elMqtt.onclick = function () {
  const param = {
    club: "",
    club_id: "",
    clubs: getSelectedClubs(),
    command: "searchAll",
  };
  log(param);
  log("device", selDevice.value);
  if (param.clubs.length == 0) return;
  socket.send(
    JSON.stringify({
      command: "publish",
      topic: selDevice.value,
      message: JSON.stringify(param),
    })
  );
};
