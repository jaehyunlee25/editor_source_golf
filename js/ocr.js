const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const cf = new jCommon();
let letters = [];
const hLines = [];
const vLines = {};
main();
function main() {}
function display() {
  letters.forEach((ob) => {
    const { width: w, height: h, min } = ob.vertices.vnx();
    const { x, y } = min;
    const div = reprod.mkbox({ x, y, w, h });
    div.style.fontSize = 10 + "px";
    div.str(ob.text);
  });
}
function mining() {
  display();
  const minmax = letters.minmax();
  const param = {
    x: minmax.min.x,
    y: minmax.min.y,
    w: minmax.width,
    h: minmax.height,
  };
  cover.mkbox(param, "yellow");
  guess();
}
function guess(param) {
  guessHorizontal(() => {
    guessVertical(() => {
      log("end");
    });
  });
}
function guessVertical(callback) {
  let prev;
  hLines.forEach((obj, idxLine) => {
    //if (idxLine > 1) return;
    const minmax = letters.minmax();
    const param = {
      x: minmax.min.x,
      y: minmax.min.y,
      w: minmax.width,
      h: minmax.height,
    };
    let probe = reprod.vline(param, "red");
    const originX = param.x;
    const num = param.w;
    //timerAround(num, (i) => {
    around(num, (i) => {
      //if (i > 1) return;
      param.x = originX + i;
      probe = reprod.vline(param, "red", probe);
      //라인과 라인 사이의 영역이 글자가 위치한 영역이다.
      let minY; //라인의 시작점
      let maxY; //라인의 끝점
      if (prev == undefined) {
        minY = -1;
        maxY = obj.middle;
      } else {
        minY = prev.middle;
        maxY = obj.middle;
      }
      if (letters.vcatch(param.x, minY, maxY).length == 0) {
        param.y = minY;
        param.h = maxY - minY;

        guessVLine(param, param.x, idxLine);
      }
      if (i == num - 1) {
        dpVLines(idxLine);
        callback();
      }
    });
    prev = obj;
  });
}
function guessHorizontal(callback) {
  const minmax = letters.minmax();
  const param = {
    x: minmax.min.x,
    y: minmax.min.y,
    w: minmax.width,
    h: minmax.height,
  };

  let probe = reprod.hline(param, "red");
  const originY = param.y;
  const num = param.h;
  around(num, (i) => {
    param.y = originY + i;
    probe = reprod.hline(param, "red", probe);
    if (letters.catch(param.y).length == 0) guessHLine(param, param.y);
    if (i == num - 1) {
      dpHLines();
      callback();
    }
  });
}
function dpVLines(line) {
  vLines[line].forEach((ob) => {
    if (ob.weight < 6) return;
    const param = {
      x: ob.middle,
      y: ob.startY,
      w: 1,
      h: ob.endY,
    };
    reprod.vline(param, "brown");
  });
  //log(vLines);
}
function dpHLines() {
  hLines.forEach((ob) => {
    const param = {
      x: ob.startX,
      y: ob.middle,
      w: ob.endX,
      h: 1,
    };
    reprod.hline(param, "blue");
  });
}
function guessVLine(param, i, line) {
  //백지영역의 범위를 넓히는 함수
  vLines[line] ??= [];
  const startY = param.y;
  const endY = param.h; // 라인의 높이를 나타내기 때문에 좌표를 지정하면 안 된다(길이만 지정한다).

  let flg = true;
  vLines[line].forEach((ob) => {
    if (i == ob.min - 1) {
      ob.min = i;
      ob.weight++;
      ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
      flg = false;
    } else if (i == ob.max + 1) {
      ob.max = i;
      ob.weight++;
      ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
      flg = false;
    }
  });
  if (flg) {
    vLines[line].push({ min: i, max: i, weight: 1, middle: i, startY, endY });
  }
}
function guessHLine(param, i) {
  //백지영역의 범위를 넓히는 함수
  const startX = param.x;
  const endX = param.x + param.w;
  let flg = true;
  hLines.forEach((ob) => {
    if (i == ob.min - 1) {
      ob.min = i;
      ob.weight++;
      ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
      flg = false;
    } else if (i == ob.max + 1) {
      ob.max = i;
      ob.weight++;
      ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
      flg = false;
    }
  });
  if (flg) hLines.push({ min: i, max: i, weight: 1, middle: i, startX, endX });
}
function timerAround(num, callback) {
  let i = 0;
  const t = setInterval(() => {
    if (i == num) return;
    callback(i);
    i++;
  }, 10);
}
Array.prototype.mkstr = function () {
  const str = [];
  this.forEach(({ text }) => {
    str.push(text);
  });
  return str.join("");
};
Array.prototype.catch = function (y) {
  const res = [];
  this.forEach(({ text, vertices }) => {
    const minmax = vertices.vnx();
    if (y >= minmax.min.y && y <= minmax.max.y) res.push({ text, vertices });
  });
  res.sort((a, b) => a.vertices[0].x - b.vertices[0].x);
  return res;
};
Array.prototype.vcatch = function (x, yMin, yMax) {
  //log(yMin, yMax);
  const res = [];
  this.forEach(({ text, vertices }) => {
    const minmax = vertices.vnx();
    //우선 라인의 y 조건에 맞지 않는 객체들은 제외한다.
    if (minmax.min.y <= yMin || minmax.min.y >= yMax) return;

    if (x >= minmax.min.x && x <= minmax.max.x) res.push({ text, vertices });
  });
  res.sort((a, b) => a.vertices[0].y - b.vertices[0].y);
  return res;
};
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
  res.width = res.max.x - res.min.x;
  res.height = res.max.y - res.min.y;
  return res;
};
Array.prototype.minmax = function () {
  let res = {
    max: { x: null, y: null },
    min: { x: null, y: null },
  };
  this.forEach(({ vertices }, i) => {
    vertices.forEach(({ x, y }, j) => {
      if (i == 0 && j == 0) {
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
  });
  res.width = res.max.x - res.min.x;
  res.height = res.max.y - res.min.y;
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
HTMLElement.prototype.hline = function (size, color, prev) {
  if (prev) this.removeChild(prev);
  const div = this.add("div");
  div.className = "box";
  div.style.left = size.x + "px";
  div.style.top = size.y + "px";
  div.style.width = size.w + "px";
  div.style.height = 1 + "px";
  if (color) div.style.borderTop = "1px solid " + color;
  return div;
};
HTMLElement.prototype.vline = function (size, color, prev) {
  if (prev) this.removeChild(prev);
  const div = this.add("div");
  div.className = "box";
  div.style.left = size.x + "px";
  div.style.top = size.y + "px";
  div.style.width = 1 + "px";
  div.style.height = size.h + "px";
  if (color) div.style.borderLeft = "1px solid " + color;
  return div;
};
function gravity(a, b, r) {
  if (r == 0) return a;
  return (a * b) / Math.pow(r, 2);
}
btnGo.onclick = function () {
  letters = [];
  const param = new FormData();
  param.append("data", 1);
  param.append("file", iptFile.files[0]);
  jFile(urlHeader + "/fileUploadTest", param, (resp) => {
    const { data, files, fullTextAnnotation: fta } = resp.jp();
    const { text, pages } = fta;
    const [page] = pages;
    const { blocks, confidence, height, width, property } = page;
    const { detectedBreak, detectedLanguages } = property;
    ta.value = text;
    //log(confidence, height, width);
    detectedLanguages.forEach(({ languageCode, confidence }) => {
      //log(languageCode, confidence);
    });
    blocks.forEach((ob) => {
      const { blockType, confidence, property, boundingBox, paragraphs } = ob;
      const { vertices } = boundingBox;
      /* log(blockType, confidence, property);
      log(boundingBox);
      mkBox(vertices);
      log(paragraphs); */

      paragraphs.forEach(({ words, boundingBox, confidence, property }) => {
        const { vertices } = boundingBox;
        //mkBox(vertices, "blue");
        words.forEach((ob) => {
          const { boundingBox, confidence, property, symbols } = ob;
          const { vertices } = boundingBox;
          //mkBox(vertices, "green");
          symbols.forEach((ob) => {
            const { boundingBox, confidence, property, text } = ob;
            const { vertices } = boundingBox;
            letters.push({ text, vertices });
            //mkBox(vertices, "blue");
          });
        });
      });
    });
    mining();
  });
};
iptFile.onchange = function () {
  const reader = new FileReader();
  reader.readAsDataURL(iptFile.files[0]);
  reader.onload = function () {
    img.src = reader.result;
  };
};
function exec() {}
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
