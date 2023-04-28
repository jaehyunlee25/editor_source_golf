const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const cf = new jCommon();
let letters = [];
let vertices;

main();
function main() {}
function display() {
  letters.forEach((ob) => {
    const param = ob.vertices.vnx();
    const div = reprod.mkbox(param);
    div.style.fontSize = 10 + "px";
    div.style.border = "1px solid yellow";
    div.str(ob.text);
  });
}
function mining() {
  arVertices = letters.getVerticesArray();
  letters.giveId();
  const texts = (() => {
    const res = {};
    letters.forEach((letter) => {
      const key = JSON.stringify(letter.vertices);
      res[key] = letter.text;
    });
    return res;
  })();
  // 특정 영역의 라인을 찾아서 object로 만들어 주는 함수이다.
  // 라인은 오브젝트들이 점유하고 있지 않은 공간의 평균선이다.

  // 글자들을 영역에 표시한다.
  // 분석을 시각적으로 확인하기 위한 절차이다.
  // 알고리즘에는 영향을 미치지 않는다.
  display();

  const res = guess(arVertices);
  Object.entries(res).forEach(([key, cols]) => {
    const tr = result.add("tr");
    Object.entries(cols).forEach(([colkey, col]) => {
      if (col.vertices.length == 0) return;
      const td = result.add("td");
      if (col.children) return;
      td.str(verticesToText(col.vertices));
    });
  });
  function verticesToText(ar) {
    const str = [];
    ar.trav((vertices) => {
      const key = JSON.stringify(vertices);
      str.push(texts[key]);
    });
    return str.join("");
  }
}

let cnt = 0;

function dpVLines(vLines, line, space) {
  vLines[line].forEach((ob) => {
    if (ob.weight < space) return;
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
function dpHLines(hLines) {
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
function timerAround(num, callback) {
  let i = 0;
  const t = setInterval(() => {
    if (i == num) return;
    callback(i);
    i++;
  }, 10);
}
function normalDistribution(x, mu, sigma) {
  const sqrt2Pi = Math.sqrt(2 * Math.PI);
  const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
  return (1 / (sigma * sqrt2Pi)) * Math.exp(exponent);
}
Array.prototype.minmax = function () {
  let res = {
    max: { x: null, y: null },
    min: { x: null, y: null },
  };
  this.forEach((vertices, i) => {
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
  // minmax 정보를 바탕으로 한, 전체 박스 영역 정보를 파악한다.
  res.x = res.min.x;
  res.y = res.min.y;
  res.w = res.max.x - res.min.x + 1;
  res.h = res.max.y - res.min.y + 1;
  return res;
};
Array.prototype.MU = function () {
  return this.reduce((sum, value) => sum + value, 0) / this.length;
};
Array.prototype.SD = function (mean) {
  // Calculate the mean (average)
  if (mean == undefined)
    mean = this.reduce((sum, value) => sum + value, 0) / this.length;

  // Calculate the squared differences
  const squaredDifferences = this.map((value) => (value - mean) ** 2);

  // Calculate the mean of the squared differences
  const meanSquaredDifferences =
    squaredDifferences.reduce((sum, value) => sum + value, 0) /
    squaredDifferences.length;

  // Calculate the standard deviation (sigma) by taking the square root of the mean of the squared differences
  const sigma = Math.sqrt(meanSquaredDifferences);

  return sigma;
};
Array.prototype.getArea = function () {
  const [lt, rt, rb, lb] = this;
  const w = rt.x - lt.x + 1;
  const h = lb.y - lt.y + 1;
  return w * h;
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

  // minmax 정보를 바탕으로 한, 전체 박스 영역 정보를 파악한다.
  res.x = res.min.x;
  res.y = res.min.y;
  res.w = res.max.x - res.min.x + 1;
  res.h = res.max.y - res.min.y + 1;
  return res;
};
Array.prototype.giveId = function () {
  this.forEach((ob, i) => (ob.id = i));
};
Array.prototype.getVerticesArray = function () {
  const res = [];
  this.forEach(({ vertices }) => res.push(vertices));
  return res;
};
Array.prototype.mkstr = function () {
  const str = [];
  this.forEach(({ text }) => {
    str.push(text);
  });
  return str.join("");
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
