const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const cf = new jCommon();
let vertices;
let letters;
let checksum;

main();
function main() {}
function display() {
  letters.forEach((ob) => {
    const param = ob.vertices.vnx();
    const div = reprod.mkbox(param);
    div.style.fontSize = 10 + "px";
    div.style.border = "1px solid yellow";
    div.str(ob.text);
    div.letter = ob;
    div.onclick = letterclick;
  });
}
function letterclick() {
  if (this.clicked) {
    this.style.backgroundColor = "rgba(0,0,0,0)";
    this.clicked = false;
  } else {
    this.style.backgroundColor = "rgba(0,0,0,0.5)";
    this.clicked = true;
  }
}
btnDel.onclick = function () {
  Array.from(reprod.children).forEach((child) => {
    if (child.clicked) letters.splice(child.letter, 1);
  });

  post(urlHeader + "/feedback", { checksum, letters }, httpHeader, (resp) => {
    taResult.value = JSON.stringify(resp.jp());
  });
};
function timerAround(num, callback) {
  let i = 0;
  const t = setInterval(() => {
    if (i == num) return;
    callback(i);
    i++;
  }, 10);
}
Array.prototype.vnx = function () {
  let res = {
    max: { x: null, y: null },
    min: { x: null, y: null },
  };
  this.forEach(({ x, y }, j) => {
    if (j == 0) {
      res = {
        max: { x, y },
        min: { x, y },
      };
      return;
    }
    if (x > res.max.x) res.max.x = x;
    if (x < res.min.x) res.min.x = x;

    if (y > res.max.y) res.max.y = y;
    if (y < res.min.y) res.min.y = y;
  });

  // minmax 정보를 바탕으로 한, 전체 박스 영역 정보를 파악한다.
  res.x = res.min.x;
  res.y = res.min.y;
  res.w = res.max.x - res.min.x + 1;
  res.h = res.max.y - res.min.y + 1;
  return res;
};
HTMLElement.prototype.mkbox = function (size, color) {
  const div = this.add("div");
  div.className = "box";
  div.style.left = size.x + "px";
  div.style.top = size.y + "px";
  div.style.width = size.w + "px";
  div.style.height = size.h + "px";
  if (color) div.style.border = "1px solid " + color;
  return div;
};
btnGo.onclick = function () {
  const param = new FormData();
  param.append("data", 1);
  param.append("file", iptFile.files[0]);
  jFile(urlHeader + "/detect", param, (resp) => {
    taResult.value = JSON.stringify(resp.jp());
    const {
      detectedCells,
      detectedResult,
      letters: detectedLetters,
      checksum: savedchecksum,
    } = resp.jp();

    log(detectedCells);
    const res = [];
    detectedCells.forEach(({ text }) => {
      res.push(text);
    });

    log(res.join(","));
    log(detectedResult);
    checksum = savedchecksum;
    letters = detectedLetters;
    display();
  });
};
iptFile.onchange = function () {
  const reader = new FileReader();
  reader.readAsDataURL(iptFile.files[0]);
  reader.onload = function () {
    img.src = reader.result;
  };
};
function mkBox(vertices, color) {
  const [lt, rt, rb, lb] = vertices;
  const x = lt.x;
  const y = lt.y;
  const w = rt.x - lt.x + 1;
  const h = lb.y - lt.y + 1;

  const div = cover.add("div");
  div.className = "box";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.width = w + "px";
  div.style.height = h + "px";
  if (color) div.style.border = "1px solid " + color;
}
