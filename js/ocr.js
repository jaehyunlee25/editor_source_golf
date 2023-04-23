const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const cf = new jCommon();
let letters = [];
main();
function main() {}
function mining() {
  const minmax = letters.minmax();
  const param = {
    x: minmax.min.x,
    y: minmax.min.y,
    w: minmax.width,
    h: minmax.height,
  };
  cover.mkbox(param, "yellow");
  cover.hline(param, "red");
  let line;
  let lng;
  let lines = [];
  for (let i = 0; i < param.h; i++) {
    const res = letters.catch(i);
    lng ??= res.length;
    if (res.length > lng) {
      lng = res.length;
      line = i;
    }
    if (line > 0 && res.length == 0) {
      lines.push(line);
      lng = undefined;
      line = undefined;
    }
  }
  lines.forEach((line) => {
    const obs = letters.catch(line);
    const str = obs.mkstr();
    let prev;
    const diffs = [];
    obs.forEach((ob, i) => {
      prev ??= ob;
      if (i == 0) return;
      diffs.push(ob.vertices[0].x - prev.vertices[1].x);
      prev = ob;
    });
    const sum = diffs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
    const average = parseInt(sum / diffs.length);
    // log(average);
    prev = undefined;
    let word = [];
    const words = [];
    obs.forEach((ob, i) => {
      if (i == 0) {
        word.push(ob);
        prev = ob;
        return;
      }
      const diff = ob.vertices[0].x - prev.vertices[1].x;
      //log(ob.text, diff, average);
      if (diff > 7) {
        words.push(word);
        word = [];
      }
      word.push(ob);
      prev = ob;
    });
    if (word.length > 0) words.push(word);
    log(words);
  });
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
};
HTMLElement.prototype.hline = function (size, color) {
  const div = this.add("div");
  div.className = "box";
  div.style.left = size.x + "px";
  div.style.top = size.y + "px";
  div.style.width = size.w + "px";
  div.style.height = 1 + "px";
  if (color) div.style.borderTop = "1px solid " + color;
};
function gravity(a, b, r) {
  if (r == 0) return a;
  return (a * b) / Math.pow(r, 2);
}
iptFile.onchange = function () {
  letters = [];
  const reader = new FileReader();
  reader.readAsDataURL(iptFile.files[0]);
  reader.onload = function () {
    img.src = reader.result;
  };

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
