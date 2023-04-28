function guess(arVertices) {
  //const log = logOpt ? console.log : () => {};

  // 횡분석이 끝나면
  // guessVertical 함수에 hLines 배열이 전달된다.
  // hLines는 empty horizontal line(EHL) 배열이다.

  Array.prototype.getAverageSizeWH = function () {
    let sumW = 0;
    let sumH = 0;
    this.forEach((vertices) => {
      const w = vertices[1].x - vertices[0].x + 1;
      const h = vertices[2].y - vertices[0].y + 1;
      sumW += w;
      sumH += h;
    });
    return { avgW: sumW / this.length, avgH: sumH / this.length };
  };
  Array.prototype.yCatch = function (min, max) {
    const res = [];
    this.forEach((vertices) => {
      const minmax = vertices.vnx();
      if (max == -1) {
        if (minmax.min.y >= min) res.push(vertices);
      } else {
        if (minmax.min.y >= min && minmax.min.y <= max) res.push(vertices);
      }
    });
    res.sort((a, b) => a[0].x - b[0].x);
    return res;
  };
  Array.prototype.hCatch = function (y) {
    const res = [];
    this.forEach((vertices) => {
      const minmax = vertices.vnx();
      if (y >= minmax.min.y && y <= minmax.max.y) res.push(vertices);
    });
    res.sort((a, b) => a[0].x - b[0].x);
    return res;
  };
  Array.prototype.vCatch = function (x, yMin, yMax) {
    //log(yMin, yMax);
    const res = [];
    this.forEach((vertices) => {
      const minmax = vertices.vnx();
      //우선 라인의 y 조건에 맞지 않는 객체들은 제외한다.
      if (minmax.min.y <= yMin || minmax.min.y >= yMax) return;
      if (x >= minmax.min.x && x <= minmax.max.x) res.push(vertices);
    });
    res.sort((a, b) => a[0].y - b[0].y);
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

    // minmax 정보를 바탕으로 한, 전체 박스 영역 정보를 파악한다.
    res.x = res.min.x;
    res.y = res.min.y;
    res.w = res.max.x - res.min.x + 1;
    res.h = res.max.y - res.min.y + 1;
    return res;
  };
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

  let LIMIT = 0;
  const root = {};
  recursiveGuess(arVertices, root);

  return root;

  function getAverageSize(hLines) {
    const res = {};
    let prev;
    hLines.forEach((obj, idxLine) => {
      const { middle } = obj;
      if (prev == undefined)
        res[idxLine] = arVertices.yCatch(0, middle).getAverageSizeWH();
      else
        res[idxLine] = arVertices
          .yCatch(prev.middle, middle)
          .getAverageSizeWH();
      prev = obj;
    });
    res[hLines.length] = arVertices.yCatch(prev.middle, -1).getAverageSizeWH();
    return res;
  }
  function guessVertical(hLines) {
    //첫번째부터 끝라인까지의 분석
    const vLines = {};
    let prev;
    hLines.forEach((obj, idxLine) => {
      guessLine(obj, idxLine);
      prev = obj;
    });
    // 끝라인 이후의 공간에 대한 분석
    guessLine(undefined, hLines.length);
    return vLines;

    function guessLine(obj, idxLine) {
      const param = arVertices.minmax();
      const originX = param.x;
      const num = param.w;
      around(num, (i) => {
        param.x = originX + i;
        //라인과 라인 사이의 영역이 글자가 위치한 영역이다.
        let minY; //라인의 시작점
        let maxY; //라인의 끝점
        if (prev == undefined) {
          // 첫번째 라인
          minY = arVertices.minmax().y - 1; // 컨텐츠 area y이므로 반드시 1을 빼준다.
          maxY = obj.middle;
        } else if (obj == undefined) {
          //끝라인(마지막 라인 이후의 공간)
          minY = prev.middle;
          maxY = param.y + param.h;
        } else {
          //첫번째와 끝라인 중간의 모든 라인들
          minY = prev.middle;
          maxY = obj.middle;
        }
        if (arVertices.vCatch(param.x, minY, maxY).length == 0) {
          param.y = minY;
          param.h = maxY - minY;

          guessVLine(param, idxLine);
        }
      });

      vLines[idxLine] ??= [];
      vLines[idxLine].push({
        type: "vLine",
        min: param.x + param.h - 1,
        max: param.x + param.h - 1,
        weight: 100,
        middle: param.x + param.h - 1,
        startY: param.y,
        endY: param.h,
      });
    }
    function guessVLine(param, line) {
      //백지영역의 범위를 넓히는 함수
      const i = param.x;
      const obj = {
        type: "vLine",
        min: i,
        max: i,
        weight: 1, // 사실 weight는 max - min +1 이다.
        middle: i,
        startY: param.y,
        endY: param.h, // 라인의 높이를 나타내기 때문에 좌표를 지정하면 안 된다(길이만 지정한다).
      };
      vLines[line] ??= [];
      const startY = param.y;
      const endY = param.h;

      let flg = true;
      vLines[line].forEach((ob) => {
        if (i == ob.min - 1) {
          ob.min = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        } else if (i == ob.max + 1) {
          ob.max = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        }
      });
      if (flg) {
        vLines[line].push(obj);
      }
    }
  }
  function guessHorizontal(arVertices) {
    // object들의 vertices 정보를 바탕으로 모든 object들을 포괄하는
    // 전체영역 박스 좌표를 생성한다.
    const param = arVertices.minmax();
    const hLines = [];

    //let probe = reprod.hline(param, "red");
    const originY = param.y;
    const num = param.h;
    around(num, (i) => {
      param.y = originY + i;
      //probe = reprod.hline(param, "red", probe);

      // 조건문은 object가 존재하지 않는 empty horizontal line(EHL)을 발견한 것이고,
      // guessHLine은 그게 이전의 EHL과 연속인지 파악하고, 연속이면 하나의 객체로 통합하는 과정이다.
      if (arVertices.hCatch(param.y).length == 0) guessHLine(param);
    });
    return hLines;

    function guessHLine(param) {
      //empty horizontal line(EHL)의 범위를 넓히는 함수
      const i = param.y;
      // EHL의 자료구조
      const hLine = {
        type: "hLine",
        min: i,
        max: i,
        weight: 1,
        middle: i,
        startX: param.x,
        endX: param.w,
      };
      let flg = true;

      hLines.forEach((ob) => {
        if (i == ob.min - 1) {
          ob.min = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        } else if (i == ob.max + 1) {
          ob.max = i;
          ob.weight++; // 사실 weight는 max - min +1 이다.
          ob.middle = parseInt(ob.min + (ob.max - ob.min) / 2);
          flg = false;
        }
      });
      if (flg) hLines.push(hLine);
    }
  }
  function getColsByLine(hLines, vLines, avgLines) {
    // 라인과 라인 사이, 즉 row의 영역을 구한다.
    const rows = {};
    let prev;
    hLines.forEach((line, i) => {
      if (i == 0) {
        rows[i] = {
          type: "row",
          id: i,
          min: 0,
          max: line.middle - 1,
        };
        prev = line;
        return;
      }

      rows[i] = {
        type: "row",
        id: i,
        min: prev.middle + 1,
        max: line.middle - 1,
      };

      prev = line;
    });
    rows[hLines.length] = {
      type: "row",
      id: hLines.length,
      min: prev.middle + 1,
      max: -1,
    };
    //컬럼 area를 뽑아본다.
    const obCols = {};
    Object.entries(vLines).forEach(([key, val], i) => {
      const space = avgLines[key].avgW;
      let cPrev;
      val.forEach((ob) => {
        if (ob.weight < space) return;
        obCols[key] ??= [];
        if (cPrev == undefined) {
          obCols[key].push({
            type: "col",
            min: 0,
            max: ob.middle - 1,
          });
          cPrev = ob;
          return;
        }
        obCols[key].push({
          type: "col",
          min: cPrev.middle + 1,
          max: ob.middle - 1,
        });
        cPrev = ob;
      });

      // column line 이 하나도 없을 때는
      // 전체를 하나의 column으로 해서 리턴한다.
      if (cPrev == undefined) return;

      obCols[key] ??= [];
      obCols[key].push({
        type: "col",
        min: cPrev.middle + 1,
        max: -1,
      });
    });

    // row / col 정보를 본다.
    const colsByLine = {};
    Object.entries(obCols).forEach(([key, cols], i) => {
      const { min: min_y, max: max_y } = rows[key];
      cols.forEach((col, j) => {
        const { min: min_x, max: max_x } = col;
        colsByLine[key] ??= [];
        colsByLine[key].push({
          min_x,
          min_y,
          max_x,
          max_y,
        });
      });
    });

    return { rows, colsByLine };
  }
  function getObjectsByLine(arVertices) {
    const hLines = guessHorizontal(arVertices);
    if (hLines.length == 0) return { hLines };
    const avgLines = getAverageSize(hLines);
    const vLines = guessVertical(hLines);
    const { rows, colsByLine } = getColsByLine(hLines, vLines, avgLines);
    // 라인들을 횡분석, 종분석 방법으로 찾는다.
    // 라인을 먼저 찾고,
    // 라인별로 횡분석을 실시한다.
    //const { hLines, vLines, rows, colsByLine, avgLines } = guess(arVertices);
    // 횡라인과 종라인을 표시한다.
    /* dpHLines(hLines);
    Object.entries(vLines).forEach(([key, val]) => {
      dpVLines(vLines, key, avgLines[key].avgW);
    }); */

    // 특정 row에 해당하는 object들을 구한다.
    const objectsByLine = {};
    Object.entries(rows).forEach(([, row]) => {
      arVertices.forEach((vertices) => {
        const [{ x, y }] = vertices;
        if (y >= row.min) {
          if (row.max == -1) {
            // 맨 끝행일때,
            objectsByLine[row.id] ??= [];
            objectsByLine[row.id].push(vertices);
            return;
          }
          if (y <= row.max) {
            objectsByLine[row.id] ??= [];
            objectsByLine[row.id].push(vertices);
          }
        }
      });
    });

    // 특정 col에 있는 object들을 모은다.
    const columns = [];
    Object.entries(colsByLine).forEach(([key, cols], i) => {
      cols.forEach((col, j) => {
        arVertices.forEach((vertices) => {
          const [lt, , rb] = vertices;
          if (lt.x >= col.min_x && lt.y >= col.min_y) {
            if (col.max_x == -1) {
              if (rb.y <= col.max_y) {
                columns.push({
                  row: key,
                  col: j,
                  vertices,
                });
              }
            } else {
              if (rb.x <= col.max_x) {
                if (col.max_y == -1) {
                  columns.push({
                    row: key,
                    col: j,
                    vertices,
                  });
                } else if (rb.y <= col.max_y) {
                  columns.push({
                    row: key,
                    col: j,
                    vertices,
                  });
                }
              }
            }
          }
        });
      });
    });

    const objectsByColumn = {};
    Object.entries(colsByLine).forEach(([key, cols], i) => {
      objectsByColumn[key] ??= {};
      cols.forEach((col, j) => {
        objectsByColumn[key][j] ??= [];
        arVertices.forEach((vertices) => {
          const [lt, , rb] = vertices;
          if (lt.x >= col.min_x && lt.y >= col.min_y) {
            if (col.max_x == -1) {
              if (rb.y <= col.max_y) {
                objectsByColumn[key][j].push(vertices);
              }
            } else {
              if (rb.x <= col.max_x) {
                if (col.max_y == -1) {
                  objectsByColumn[key][j].push(vertices);
                } else if (rb.y <= col.max_y) {
                  objectsByColumn[key][j].push(vertices);
                }
              }
            }
          }
        });
      });
    });
    return { objectsByLine, columns, objectsByColumn };
  }
  function recursiveGuess(param, parent) {
    const { objectsByColumn } = getObjectsByLine(param);
    Object.entries(objectsByColumn).forEach(([key, val]) => {
      parent[key] ??= {};
      Object.entries(val).forEach(([colkey, col]) => {
        parent[key][colkey] ??= { vertices: col };
        const res = getObjectsByLine(col);
        if (res.hLines) return;
        if (res.columns.length == 0) return;

        parent[key][colkey].children = {};
        recursiveGuess(col, parent[key][colkey].children);
      });
    });
  }
}
