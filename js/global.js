(function (window) {
  var jaehyun = function (str, p) {
    if (p) return new jaehyun.prototype.a(str, p);
    else return new jaehyun.prototype.a(str);
  };
  jaehyun.prototype.a = function (str, p) {
    if (typeof str == "string") {
      var a = document.getElementById(str);
      if (a) {
      } else {
        var a = document.createElement("div");
        mkDefault();
        0;
        a.id = str;
        if (p != undefined) {
          p.appendChild(a);
        }
      }
    } else if (typeof str == "object") {
      var a = document.createElement("div");
      mkDefault();
      str.appendChild(a);
    }
    function mkDefault() {
      a.style.position = "absolute";
      a.style.top = 0 + "px";
      a.style.left = 0 + "px";
      a.style.width = 100 + "px";
      a.style.height = 50 + "px";
      //a.style.backgroundColor="gray";
    }
    a.click = function (fnc) {
      a.onclick = fnc;
    };
    a.css = function (jsn) {
      var b = this.style.cssText;
      var str = ";";
      for (var el in jsn) {
        str += getUpper(el) + ":" + jsn[el] + ";";
      }
      this.style.cssText = b + str;
    };
    function getUpper(str) {
      var chars = "abcdefghijklmnopqrstuvwxyz";
      for (var i = 0, lng = str.length; i < lng; i++) {
        if (chars.indexOf(str.charAt(i)) == -1) {
          //대문자일 경우(소문자집합인 chars랑 비교해서 겹치는 게 없으니 대문자임)
          var tp = str.split(str.charAt(i));
          tp = tp.join("-" + str.charAt(i).toLowerCase());
          return tp;
        }
      }
      return str;
    }
    return a;
  };
  //about NodeList
  var np = NodeList.prototype;
  np.trav = function (fnc) {
    for (var i = 0, lng = this.length; i < lng; i++) {
      var a = fnc(this[i], i);
      if (a) break;
    }
  };
  //about HTMLCollection
  HTMLCollection.prototype.trav = function (fnc) {
    for (var i = 0, lng = this.length; i < lng; i++) {
      var a = fnc(this[i], i);
      if (a) break;
    }
  };
  //about Array
  var ap = Array.prototype;
  ap.between = function (num, col) {
    var min = 0,
      max = this.length - 1,
      status,
      cur = parseInt((max - min) / 2) + min,
      l = this;
    if (num < this[min][col]) {
      return { min: min, max: max, status: 0 };
    }
    if (num > this[max][col]) {
      return { min: min, max: max, status: 4 };
    }
    match();
    return { min: min, max: max, status: status };
    function match() {
      if (num > l[cur][col]) {
        min = cur;
        //log("it's bigger than "+l[cur][col]);
        //log(min, max);
      } else if (num < l[cur][col]) {
        max = cur;
        //log("it's smaller than "+l[cur][col]);
        //log(min, max);
      } else if ((num = l[cur][col])) {
        min = cur;
        max = cur;
        //log("you got it ==> "+l[cur][col] + " on " + min);
        //log(min, max);
        status = 1;
        return false;
      }
      var bt = max - min;
      cur = parseInt(bt / 2) + min;
      if (bt < 2) {
        if (num == l[min][col]) {
          //log(num+":: you got it on min :: "+min);
          status = 1;
        } else if (num == l[max][col]) {
          //log(num+":: you got it on max :: "+max);
          status = 3;
        } else {
          //log("result :: " + min, max);
          status = 2;
        }
        return false;
      } else {
        match();
      }
    }
  };
  ap.rev = function () {
    var l = this;
    var arr = new Array();
    while (this.length != 0) {
      arr.push(this.pop());
    }
    arr.trav(function (d) {
      l.push(d);
    });
  };
  ap.arrSum = function () {
    var arg = arguments.length,
      sum = 0;
    var ag = arguments;
    if (arg == 0) {
      this.trav(function (d, n) {
        sum += d;
      });
    } else {
      sum = new Array();
      this.trav(function (d, n) {
        for (var i = 0; i < arg; i++) {
          if (n == 0) sum[i] = 0;
          var num;
          typeof d[ag[i]] == "string"
            ? (num = d[ag[i]].split(",").join("") * 1)
            : (num = d[ag[i]]);
          sum[i] += num;
        }
      });
    }
    return sum;
  };
  ap.cut = function (col, opt, lmt) {
    var rslt = new Array(),
      sum = 0;
    opt == "asc" ? this.asc(col) : this.desc(col);
    this.trav(function (d, n) {
      n < lmt ? rslt.push(d) : (sum += d[col]);
    });

    if (this.length < lmt) {
      while (rslt.length < lmt) {
        rslt.push([""]);
      }
    } else {
      //rslt[lmt-1]=new Array();
      //rslt[lmt-1][0]="기타";
      //rslt[lmt-1][col]=sum/(this.length-lmt);
    }
    return rslt;
  };
  ap.log = function () {
    this.trav(function (d) {
      log(d);
    });
  };
  ap.desc = function (col, opt) {
    this.sort(function (a, b) {
      if (typeof a[col] == "string") a[col] = a[col].toLowerCase();
      if (typeof b[col] == "string") b[col] = b[col].toLowerCase();
      var ac = opt ? a[col] * 1 : a[col],
        bc = opt ? b[col] * 1 : b[col];
      return ac > bc ? -1 : ac < bc ? 1 : 0;
    });
  };
  ap.asc = function (col, opt) {
    this.sort(function (a, b) {
      if (typeof a[col] == "string") a[col] = a[col].toLowerCase();
      if (typeof b[col] == "string") b[col] = b[col].toLowerCase();
      var ac = opt ? a[col] * 1 : a[col],
        bc = opt ? b[col] * 1 : b[col];
      return ac > bc ? (ac < bc ? 0 : 1) : -1;
    });
  };
  ap.getmax = function (col) {
    var max, row;
    var len = this.length;
    if (col == undefined) {
      col = 3;
    }
    for (var i = 0; i < len; i++) {
      if (this[i][col] != "void") {
        if (max == undefined) {
          row = i;
          max = this[i][col];
        } else {
          if (this[i][col] * 1 > max) {
            row = i;
            max = this[i][col];
          }
        }
      }
    }
    if (max == undefined) {
      return "void";
    }
    return { max: max * 1, row: row };
  };
  //2015.02.17 in RnT by Jae Hyun Lee
  ap.nextMax = function (col, num) {
    var max, row;
    var len = this.length;
    if (col == undefined) {
      col = 3;
    }
    for (var i = 0; i < len; i++) {
      var val = this[i][col];
      if (val != "void" && val < num) {
        if (max == undefined) {
          row = i;
          max = val;
        } else {
          if (val * 1 > max) {
            row = i;
            max = val;
          }
        }
      }
    }
    if (max == undefined) {
      return "void";
    }
    return { max: max * 1, row: row };
  };
  /////////////////////////////////////////end
  ap.getmin = function (col) {
    var min, row;
    var len = this.length;
    if (col == undefined) {
      col = 4;
    }
    for (var i = 0; i < len; i++) {
      if (this[i][col] != "void") {
        if (min == undefined) {
          row = i;
          min = this[i][col];
        } else {
          if (this[i][col] * 1 < min) {
            row = i;
            min = this[i][col];
          }
        }
      }
    }
    if (min == undefined) {
      return "void";
    }
    return { min: min * 1, row: row };
  };
  ap.getminmax = function (col) {
    var a = this.getmin(col);
    var b = this.getmax(col);
    return {
      min: {
        val: a.min,
        row: a.row,
      },
      max: {
        val: b.max,
        row: b.row,
      },
    };
  };
  ap.getClip = function (start, end) {
    var jDataEx = new Array();
    var count = 0;
    for (var i = start; i <= end; i++) {
      jDataEx[count] = this[i];
      count++;
    }
    return jDataEx;
  };
  ap.pile = function (limit, opt, str) {
    if (this.length == 0) return false;
    var a = new Array();
    var b = new Array();

    var tp = str == undefined ? "void" : str;

    this[0].trav(function (d, n) {
      b.push(tp);
    });

    if (opt == "new") {
      for (var i = 0; i < limit; i++) {
        if (i >= limit - this.length) {
          a.push(this[i - (limit - this.length)]);
        } else {
          a.push(b);
        }
      }
    } else if (opt == "old") {
      for (var i = 0; i < limit; i++) {
        if (i < this.length) {
          a.push(this[i]);
        } else {
          a.push(b);
        }
      }
    }

    return a;
  };
  ap.draw = function (jsn) {
    var ctx, clr, col, mgn, ntvl;
    var a = jsn["ctx"] ? (ctx = jsn.ctx) : false;
    if (!a) return false;
    jsn["color"] == undefined ? (clr = "#006fb9") : (clr = jsn.color);
    jsn["col"] == undefined ? (col = 5) : (col = jsn.col);

    //chart style
    jsn["interval"] == undefined
      ? (ntvl = ctx.canvas.width / this.length)
      : (ntvl = jsn.interval);

    ctx.beginPath();
    var nx = this.getminmax(col);
    (max =
      jsn.max == undefined
        ? nx.max.val + (nx.max.val - nx.min.val) / 10
        : jsn.max),
      (min =
        jsn.min == undefined
          ? nx.min.val - (nx.max.val - nx.min.val) / 10
          : jsn.min);

    if (max == min) {
      max += max / 10;
      min -= max / 10;
    }

    var margin = ((max - min) / ctx.canvas.height) * mgn;
    var ox = ntvl / 2;

    for (var i = 0, lng = this.length; i < lng; i++) {
      var y = datapositionY(ctx.canvas.height, max, min, this[i][col]);
      i == 0 ? ctx.moveTo(0 + ox, y) : ctx.lineTo(ntvl * i + ox, y);
      ctx.strokeStyle = clr;
    }
    ctx.stroke();

    ctx.fillStyle = clr;
    var lbl = new Array(),
      cnt = 0;

    while (true) {
      lbl.push(30 * cnt + 15);
      cnt++;
      if (30 * cnt + 15 >= ctx.canvas.width) break;
    }

    var size = 6,
      shape = jsn.shape == undefined ? 0 : jsn.shape;
    if (this.length != 0) {
      for (var i = 0, lng = lbl.length; i < lng; i++) {
        var x = lbl[i],
          idx = getIdx(x);
        var y = datapositionY(ctx.canvas.height, max, min, this[idx][col]);
        if (shape == 0) {
          //속찬사각형
          ctx.fillRect(
            ntvl * idx + ntvl / 2 - size / 2,
            y - size / 2,
            size,
            size
          );
        } else if (shape == 1) {
          //속찬원형
          ctx.beginPath();
          ctx.arc(ntvl * idx + ntvl / 2, y, size / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        } else if (shape == 2) {
          //속빈사각형
          ctx.beginPath();
          ctx.fillStyle = clr;
          ctx.fillRect(
            ntvl * idx + ntvl / 2 - size / 2,
            y - size / 2,
            size,
            size
          );

          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.fillRect(
            ntvl * idx + ntvl / 2 - (size - 2) / 2,
            y - (size - 2) / 2,
            size - 2,
            size - 2
          );
        } else if (shape == 3) {
          //속빈원형
          ctx.beginPath();
          ctx.fillStyle = clr;
          ctx.arc(ntvl * idx + ntvl / 2, y, size / 2, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.arc(
            ntvl * idx + ntvl / 2,
            y,
            (size - 2) / 2,
            0,
            2 * Math.PI,
            false
          );
          ctx.fill();
        } else if (shape == 4) {
          //속찬삼각형
          size = 4;
          //외접원의 반지름이 size인 정삼각형의 변의 길이
          var lng = (3 * size) / Math.sqrt(3);

          ctx.beginPath();
          ctx.moveTo(ntvl * idx + ntvl / 2, y);
          ctx.moveTo(ntvl * idx + ntvl / 2, y - size);
          ctx.lineTo(ntvl * idx + ntvl / 2 - lng / 2, y + size / 3);
          ctx.lineTo(ntvl * idx + ntvl / 2 + lng / 2, y + size / 3);
          ctx.closePath();
          ctx.fill();
        } else if (shape == 5) {
          //속찬마름모
          size = 7;
          ctx.beginPath();
          ctx.moveTo(ntvl * idx + ntvl / 2, y);
          ctx.moveTo(ntvl * idx + ntvl / 2, y - size / 2);
          ctx.lineTo(ntvl * idx + ntvl / 2 - size / 2, y);
          ctx.lineTo(ntvl * idx + ntvl / 2, y + size / 2);
          ctx.lineTo(ntvl * idx + ntvl / 2 + size / 2, y);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    function getIdx(w) {
      return parseInt(w / ntvl);
    }
  };
  ap.RW = function (jsn) {
    var x,
      y,
      w,
      h,
      p,
      lbl,
      pdT,
      x = jsn.x;
    y = jsn.y;
    w = jsn.w;
    (h = jsn.h),
      (lbl = jsn.lbl),
      (col = jsn.col),
      jsn.p ? (p = jsn.p) : (p = document.body),
      (ctx = jsn.ctx),
      (bg = jsn.bg == undefined ? "white" : jsn.bg),
      (pnt = jsn.point_opt == undefined ? 0 : jsn.point_opt),
      (pdT = jsn.paddingTop);
    var nums = this.getminmax(col);
    var max =
        jsn.max == undefined
          ? nums.max.val + (nums.max.val - nums.min.val) / 10
          : jsn.max,
      min =
        jsn.min == undefined
          ? nums.min.val - (nums.max.val - nums.min.val) / 10
          : jsn.min;

    if (max == min) {
      max += max / 10;
      min -= max / 10;
    }

    j("rw_" + p.id, p).css({
      left: x + "px",
      top: y + "px",
      width: w + "px",
      height: h + "px",
      backgroundColor: bg,
    });
    j("rw_" + p.id).innerHTML = "";

    //단위 표시
    var unit = "";
    if (jsn.unit != undefined && jsn.unit_ind == false) {
      j("rwunit_" + p.id, j("rw_" + p.id)).css({
        left: 0 + "px",
        top: -10 + "px",
        width: w + "px",
        height: 15 + "px",
        textAlign: "right",
      });
      j("rwunit_" + p.id).innerHTML = jsn.unit != undefined ? jsn.unit : "";
    } else if (jsn.unit != undefined && jsn.unit_ind == true) {
      unit = jsn.unit;
    }

    //축명 표시
    if (jsn.axisname) {
      j("rwaxisname_" + p.id, j("rw_" + p.id)).css({
        left: 0 + "px",
        top: -10 + "px",
        width: w + "px",
        height: 15 + "px",
        textAlign: "left",
        fontWeight: "bold",
      });
      j("rwaxisname_" + p.id).innerHTML =
        jsn.axisname != undefined ? jsn.axisname : "";
    }

    for (var i = 0, lng = lbl.length; i < lng; i++) {
      j("rwlbl_" + p.id + i, j("rw_" + p.id)).css({
        top: lbl[i] + (pdT - 10) + 4 + "px",
        width: w + "px",
        height: 13 + "px",
        fontSize: 11 + "px",
        color: "#444444",
        //backgroundColor:"green",
        textAlign: "left",
      });
      var strData = getdatabyposition(ctx.canvas.height, lbl[i], max, min);
      j("rwlbl_" + p.id + i).innerHTML = pt(rommify(strData, pnt)) + unit;
    }
  };
  ap.LW = function (jsn) {
    var x, y, w, h, lbl, p;
    x = jsn.x;
    y = jsn.y;
    w = jsn.w;
    (h = jsn.h),
      (lbl = jsn.lbl),
      (col = jsn.col),
      (ctx = jsn.ctx),
      (bg = jsn.bg == undefined ? "white" : jsn.bg),
      (pnt = jsn.point_opt == undefined ? 0 : jsn.point_opt),
      jsn.p ? (p = jsn.p) : (p = document.body);
    pdT = jsn.paddingTop;

    var nums = this.getminmax(col);
    (max =
      jsn.max == undefined
        ? nums.max.val + (nums.max.val - nums.min.val) / 10
        : jsn.max),
      (min =
        jsn.min == undefined
          ? nums.min.val - (nums.max.val - nums.min.val) / 10
          : jsn.min);

    if (max == min) {
      max += max / 10;
      min -= max / 10;
    }

    j("lw_" + p.id, p).css({
      left: x + "px",
      top: y + "px",
      width: w + "px",
      height: h + "px",
      textAlign: "right",
      backgroundColor: bg,
    });
    j("lw_" + p.id).innerHTML = "";

    //단위 표시
    var unit = "";
    if (jsn.unit != undefined && jsn.unit_ind == false) {
      j("lwunit_" + p.id, j("lw_" + p.id)).css({
        left: 0 + "px",
        top: -10 + "px",
        width: w + "px",
        height: 15 + "px",
        textAlign: "right",
      });
      j("lwunit_" + p.id).innerHTML = jsn.unit != undefined ? jsn.unit : "";
    } else if (jsn.unit != undefined && jsn.unit_ind == true) {
      unit = jsn.unit;
    }

    //축명 표시
    if (jsn.axisname) {
      j("lwaxisname_" + p.id, j("lw_" + p.id)).css({
        left: 0 + "px",
        top: -10 + "px",
        width: w + "px",
        height: 15 + "px",
        textAlign: "right",
        fontWeight: "bold",
      });
      j("lwaxisname_" + p.id).innerHTML =
        jsn.axisname != undefined ? jsn.axisname : "";
    }

    for (var i = 0; i < lbl.length; i++) {
      j("lwlbl_" + p.id + i, j("lw_" + p.id)).css({
        top: lbl[i] + (pdT - 10) + 4 + "px",
        width: 95 + "%",
        height: 13 + "px",
        fontSize: 11 + "px",
        color: "#444444",
        //backgroundColor:"white",
        textAlign: "right",
      });
      var strData = getdatabyposition(ctx.canvas.height, lbl[i], max, min);
      j("lwlbl_" + p.id + i).innerHTML = pt(rommify(strData, pnt)) + unit;
    }
  };
  ap.BT = function (jsn) {
    var x, y, w, h, p, lbl, pdL, col;
    x = jsn.x;
    y = jsn.y;
    w = jsn.w;
    (h = jsn.h),
      (lbl = jsn.lbl),
      (p = jsn.p),
      (pdL = jsn.paddingLeft),
      (ctx = jsn.ctx),
      (bg = jsn.bg == undefined ? "white" : jsn.bg),
      (col = jsn.col == undefined ? 0 : jsn.col);

    if (!p) p = document.body;

    j("bt_" + p.id, p).css({
      left: x + "px",
      top: y + "px",
      width: w + "px",
      height: h + "px",
      backgroundColor: bg,
    });
    j("bt_" + p.id).innerHTML = "";
    for (var i = 0; i < lbl.length; i++) {
      var posLeft = (ctx.canvas.width / this.length) * lbl[i] + pdL - 35;
      j("btm_" + p.id + i, j("bt_" + p.id)).css({
        left: posLeft + "px",
        top: 0 + "px",
        width: 50 + "px",
        height: 15 + "px",
        wordWrap: "break-word",
        padding: 2 + "px",
        textAlign: "center",
        fontSize: 11 + "px",
        color: "#444444",
      });
      if (this.length != 0) {
        if (jsn.type == "time")
          if (jsn.type_opt == "short")
            j("btm_" + p.id + i).innerHTML = timify(
              this[lbl[i]][col]
            ).substring(0, 5);
          else j("btm_" + p.id + i).innerHTML = timify(this[lbl[i]][col]);
        else j("btm_" + p.id + i).innerHTML = datify(this[lbl[i]][col]);
      }
    }
  };
  ap.BG = function (ctx) {
    for (var i = 0; i < this.length; i++) {
      lineDraw(this[i]);
    }
    function lineDraw(lc) {
      ctx.beginPath();
      ctx.fillStyle = "rgb(230,230,230)";
      ctx.fillRect(0, lc, ctx.canvas.width, 1);
    }
  };
  ap.trav = function (fnc) {
    for (var i = 0, lng = this.length; i < lng; i++) {
      var a = fnc(this[i], i);
      if (a) break;
    }
  };
  ap.ntvl = function (fnc) {
    var cnt = 0;
    var l = this;
    var tmr = setInterval(function () {
      if (cnt > l.length - 1) {
        clearInterval(tmr);
      } else {
        fnc(l[cnt], cnt);
      }
      cnt++;
    }, 50);
  };
  //2014.01 in dongbu
  ap.pieChart = function (pr) {
    /*call sample
              arr.pieChart({
                  x:10,
                  y:0,
                  width:500,
                  height:500,
                  id:"test",
                  name_col:0,
                  target_col:2,
                  color_type:0,
                  display_count:10,
                  font_size:13,
                  font_white:false
              });
          */
    var cf = new jCommon(),
      html5 = cf.html5;
    (x = pr.x),
      (y = pr.y),
      (width = pr.width),
      (height = pr.height),
      (id = pr.id),
      (name_col = pr.name_col),
      (target_col = pr.target_col),
      (color_type = pr.color_type),
      (display_count = pr.display_count),
      (font_size = pr.font_size),
      (font_white = pr.font_white),
      (setEvent = pr.setEvent),
      (tmpwidth = width > height ? height : width),
      (mainx = tmpwidth / 2),
      (mainy = mainx),
      (outradius = (tmpwidth * 6) / 7 / 2),
      (inradius = outradius / 3),
      (middleradius = (outradius - inradius) / 2 + inradius),
      (armlength = 5),
      (armmax = 15),
      (datamax = display_count),
      (rad = Math.PI / 180),
      (arrcol = [
        [
          "rgb(231,81,106)",
          "rgb(106,136,219)",
          "rgb(255,215,56)",
          "rgb(255,147,104)",
          "rgb(50,186,156)",
          "rgb(127,114,188)",
          "rgb(122,187,232)",
          "rgb(129,197,120)",
          "rgb(46,171,196)",
          "rgb(112,112,112)",
        ],
        [
          "rgb(109,164,225)",
          "rgb(101,212,221)",
          "rgb(139,152,166)",
          "rgb(203,213,222)",
          "rgb(93,93,93)",
          "rgb(255,177,50)",
          "rgb(131,149,169)",
          "rgb(106,121,153)",
          "rgb(155,181,224)",
          "rgb(85,124,166)",
          "rgb(255,222,235)",
        ],
        [
          "rgb(205,2,101)",
          "rgb(253,101,60)",
          "rgb(255,139,45)",
          "rgb(255,179,33)",
          "rgb(184,217,0)",
          "rgb(130,187,7)",
          "rgb(141,214,101)",
          "rgb(155,16,69)",
          "rgb(251,77,142)",
          "rgb(255,168,201)",
          "rgb(255,222,235)",
        ],
        ["rgb(109,164,225)", "rgb(101,212,221)"],
        ["rgb(255,177,50)", "rgb(93,93,93)"],
        ["rgb(228,112,112)", "rgb(109,164,225)", "rgb(119,119,119)"],
      ]),
      (color = arrcol[color_type]),
      (tmpsum = 0),
      (data = this),
      (names = new Array()),
      (inmove = false),
      (minlength = width >= height ? height : width);

    for (var i = 0, lng = data.length; i < lng; i++) {
      names[i] = [data[i][name_col], data[i][target_col] * 1];
      tmpsum += data[i][target_col] * 1;
    }

    //percent and accumulated percent
    for (var i = 0, lng = data.length; i < lng; i++) {
      names[i][2] = roundXL((names[i][1] / tmpsum) * 100, 2);
      if (i == 0) {
        names[i][3] = names[i][2];
      } else {
        names[i][3] = names[i - 1][3] + names[i][2];
      }
    }

    names.desc(2);

    var parent;
    if (typeof id == "string") {
      parent = document.getElementById(id);
      parent.style.position = "relative";
    } else {
      parent = id;
    }
    parent.style.height = height + "px";
    parent.style.width = width + "px";
    parent.style.overflow = "hidden";

    var chart = cf.mkAbsoluteDiv(x, y, width, height, parent);
    var context = cf.mkCanvas(chart);
    chart.id = id + "area";

    //effect용 캔버스 추가
    if (setEvent) {
      //parent.style.position="relative";
      var chrt = cf.mkAbsoluteDiv(x - 10, y - 10, width, height, parent);
      var ctx = cf.mkCanvas(chrt);
    }

    var neoarrportion = new Array();
    if (names.length > datamax) {
      for (var i = 0, lng = names.length; i < lng; i++) {
        if (i < datamax - 1) {
          var val = percenttodegree(names[i][2]),
            st = i == 0 ? 0 : neoarrportion[i - 1][4],
            ac = i == 0 ? val : val + neoarrportion[i - 1][4],
            dac = i == 0 ? names[i][2] : names[i][2] + neoarrportion[i - 1][5];

          neoarrportion[i] = [val, names[i][2], names[i][0], st, ac, dac];
        } else {
          var tmpsum = 0;
          for (var k = datamax - 1, klng = names.length; k < klng; k++) {
            tmpsum += names[k][2];
          }
          neoarrportion[i] = [
            percenttodegree(tmpsum),
            tmpsum,
            "기타",
            neoarrportion[i - 1][4],
            360,
            100,
          ];
          break;
        }
      }
    } else {
      for (var i = 0, lng = names.length; i < lng; i++) {
        var val = percenttodegree(names[i][2]),
          st = i == 0 ? 0 : neoarrportion[i - 1][4],
          ac = i == 0 ? val : val + neoarrportion[i - 1][4],
          dac = i == 0 ? names[i][2] : names[i][2] + neoarrportion[i - 1][5];
        neoarrportion[i] = [val, names[i][2], names[i][0], st, ac, dac];
      }
    }

    var count = 0,
      lng = neoarrportion.length;
    //var img=new Image(), path="";
    var imgs = new Array(),
      path = "http://211.232.93.25/solution/";
    for (var i = 0; i < 10; i++) {
      var img = new Image();
      img.src = path + "p" + i + ".png";
      imgs.push(img);
    }

    imgs[0].onload = function () {
      //donutportion(context,count,true);
      initPie();
    };

    function initPie() {
      var tmr = setInterval(function () {
        donutportion(context, count, true);
        count++;
        if (count >= lng) clearInterval(tmr);
      }, 50);
    }

    //범례생성
    mkIndex();

    //ie8 이하에서 canvas가 0되는 거 보정...
    if (!html5) {
      canvas.childNodes[0].style.height = tmpwidth + "px";
      canvas.childNodes[0].style.width = tmpwidth + "px";
    }

    //이벤트영역 생성
    var a = cf.mkAbsoluteDiv(x, y, minlength, minlength, parent);

    //툴팁 생성
    var tip = cf.mkAbsoluteDiv(0, 0, 60, 35, parent);
    tip.style.display = "none";
    //tip.style.background="url("+cf.imgPath+"3.png)";
    tip.style.backgroundColor = "white";
    var tiptext = cf.mkTextbox(0, 0, 60, 35, tip);
    tiptext.cell.style.paddingLeft = 7 + "px";
    tiptext.cell.style.fontSize = 11 + "px";

    if (setEvent)
      a.onmousemove = function (e) {
        var tx = cf.html5 ? e.pageX : event.x,
          ty = cf.html5 ? e.pageY : event.y,
          os = 8,
          xx = tx - os,
          yy = ty - os,
          dtr = cf.degreetoradian,
          rtd = cf.radiantodegree,
          hpt = cf.gethypotenuse,
          btm = xx - mainx,
          vtc = yy - mainy,
          hyp = hpt(btm, vtc);

        var rslt = cf.sintodegree(btm, vtc),
          prslt = (mvangle(rslt) / 360) * 100,
          nap = neoarrportion,
          idx;
        nap.trav(function (d, n) {
          if (d[5] >= prslt) {
            idx = n;
            return true;
          }
        });
        if (hyp < outradius && hyp > inradius) {
          inmove = true;
          moveaction(nap[idx]);
        } else {
          inmove = false;
          moveaction();
        }
        function moveaction(arr) {
          if (inmove) {
            tip.style.display = "block";
            tip.style.top = ty + 15 + "px";
            tip.style.left = tx + 5 + "px";
            var str = "";
            str += arr[2] + "<br>";
            str += cf.roundXL(arr[1], 2) + " %";
            tiptext.cell.innerHTML = str;

            context.canvas.width = context.canvas.width;
            draw(idx, 0);

            ctx.canvas.width = ctx.canvas.width;
            donutportion(ctx, idx, true);
          } else {
            context.canvas.width = context.canvas.width;
            draw(idx, 1);
            ctx.canvas.width = ctx.canvas.width;
            tip.style.display = "none";
          }
        }
        function mvangle(angle) {
          angle = angle + 90;
          if (angle > 360) {
            angle = angle - 360;
          }
          return angle;
        }
      };

    function draw(idx, opt) {
      if (opt == 0) {
        neoarrportion.trav(function (d, n) {
          if (n != idx) donutportion(context, n, true);
        });
      } else if (opt == 1) {
        neoarrportion.trav(function (d, n) {
          donutportion(context, n, true);
        });
      } else {
        donutportion(context, opt);
      }
    }
    function donutportion(ctx, idx, chk) {
      var start = neoarrportion[idx][3],
        end = neoarrportion[idx][4],
        data = neoarrportion[idx][1],
        opt = neoarrportion[idx][0] >= armmax ? false : true,
        fillcolor = color[idx];

      donutsplit(ctx, start, end, fillcolor, idx);
      if (chk)
        opt
          ? centerline(ctx, start, end, data)
          : donutsplitlabel(ctx, start, end, data);
    }
    function centerline(ctx, startangle, endangle, data) {
      var sa = offsetangle(startangle);
      var ea = offsetangle(endangle);

      if (ea == sa) return false;

      if (ea < sa) {
        var centerangle = offsetangle((endangle - startangle) / 2 + startangle);
      } else {
        var centerangle = (ea - sa) / 2 + sa;
      }

      ctx.beginPath();
      ctx.strokeStyle = "rgb(51,51,51)";
      ctx.moveTo(
        mainx + Math.cos(rad * centerangle) * outradius,
        mainy + Math.sin(rad * centerangle) * outradius
      );
      ctx.lineTo(
        mainx + Math.cos(rad * centerangle) * (outradius + armlength),
        mainy + Math.sin(rad * centerangle) * (outradius + armlength)
      );
      ctx.stroke();

      if (centerangle >= 180 && centerangle < 270) {
        var tmpwidth = 25;
        var tmpheight = 15;
        var mainpointx =
          mainx + Math.cos(rad * centerangle) * (outradius + armlength);
        var mainpointy =
          mainy + Math.sin(rad * centerangle) * (outradius + armlength);
        var labelx = mainpointx; // - tmpwidth;
        var labely = mainpointy; // - tmpheight;
      } else if (centerangle >= 90 && centerangle < 180) {
        var tmpwidth = 25;
        var tmpheight = 15;
        var mainpointx =
          mainx + Math.cos(rad * centerangle) * (outradius + armlength);
        var mainpointy =
          mainy + Math.sin(rad * centerangle) * (outradius + armlength);
        var labelx = mainpointx; // - tmpwidth;
        var labely = mainpointy;
      } else if (centerangle >= 0 && centerangle < 90) {
        var tmpwidth = 25;
        var tmpheight = 15;
        var mainpointx =
          mainx + Math.cos(rad * centerangle) * (outradius + armlength);
        var mainpointy =
          mainy + Math.sin(rad * centerangle) * (outradius + armlength);
        var labelx = mainpointx;
        var labely = mainpointy;
      } else {
        var tmpwidth = 25;
        var tmpheight = 15;
        var mainpointx =
          mainx + Math.cos(rad * centerangle) * (outradius + armlength);
        var mainpointy =
          mainy + Math.sin(rad * centerangle) * (outradius + armlength);
        var labelx = mainpointx;
        var labely = mainpointy; // - tmpheight;
      }

      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = font_size + "px Georgia";
      ctx.textAlign = "end";
      ctx.fillText(cf.roundXL(data, 1), labelx - 3, labely);
    }
    function donutsplit(ctx, startangle, endangle, fillcolor, idx) {
      if (startangle == 0 && endangle == 0) return false;
      if (startangle == 0 && endangle == 360) endangle--;
      var tmpshadowlocation = 5;
      ctx.beginPath();
      ctx.arc(
        mainx + tmpshadowlocation,
        mainy + tmpshadowlocation,
        outradius,
        rad * offsetangle(startangle),
        rad * offsetangle(endangle),
        false
      );

      ctx.arc(
        mainx + tmpshadowlocation,
        mainy + tmpshadowlocation,
        inradius,
        rad * offsetangle(endangle),
        rad * offsetangle(startangle),
        true
      );

      ctx.fillStyle = "rgba(51,51,51,0.1)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        mainx,
        mainy,
        outradius,
        rad * offsetangle(startangle),
        rad * offsetangle(endangle),
        false
      );
      ctx.arc(
        mainx,
        mainy,
        inradius,
        rad * offsetangle(endangle),
        rad * offsetangle(startangle),
        true
      );
      ctx.strokeStyle = "rgb(255,255,255)";
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = fillcolor;
      ctx.fill();

      //patter insertion
      var pat = ctx.createPattern(imgs[idx], "repeat");
      ctx.fillStyle = pat;
      ctx.fill();
    }
    function donutsplitlabel(ctx, startangle, endangle, data) {
      var sa = startangle;
      var ea = endangle;
      var centerangle = offsetangle((ea - sa) / 2 + sa);

      var tmpwidth = 50;
      var tmpheight = 20;
      var mainpointx = mainx + Math.cos(rad * centerangle) * middleradius;
      var mainpointy = mainy + Math.sin(rad * centerangle) * middleradius;

      var labelx = mainpointx; // - (tmpwidth/2);
      var labely = mainpointy; // - (tmpheight/2);

      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.font = font_size * 1.5 + "px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(cf.roundXL(data, 1), labelx, labely);
    }
    function offsetangle(angle) {
      while (angle > 360) {
        angle -= 360;
      }
      var neoangle = angle - 90;
      if (neoangle < 0) {
        neoangle = 360 + neoangle;
      }
      return neoangle;
    }
    function percenttodegree(percent) {
      var result = (360 * percent) / 100;
      return result;
    }
    function mkIndex() {
      //범례 영역 추가
      var namearea = document.createElement("div");
      chart.appendChild(namearea);
      var namex,
        namey,
        namewidth,
        nameheight,
        vertical,
        namecursorx = 0,
        namecursory = 0,
        indivnameheight = 18;

      if (width > height) {
        namewidth = width - height;
        nameheight = neoarrportion.length * indivnameheight;
        namey = height / 2 - nameheight / 2;
        namex = height;
        vertical = false;
      } else {
        namex = mainx + Math.cos(rad * 180) * outradius + 10;
        namey = width;
        namewidth = outradius * 2;
        nameheight = height - width;
        vertical = true;
      }
      namearea.style.position = "absolute";
      namearea.style.top = namey + "px";
      namearea.style.left = namex + "px";
      namearea.style.width = namewidth + "px";
      namearea.style.height = nameheight + "px";
      namearea.style.padding = 0 + "px";
      //namearea.style.display="none";
      //namearea.style.border="1px solid gray";

      if (vertical)
        for (var i = 0; i < neoarrportion.length; i++)
          setnames(color[i], neoarrportion[i][2]);
      else
        for (var i = 0; i < neoarrportion.length; i++)
          setnames(color[i], neoarrportion[i][2]);

      function setnames(color, strname) {
        var name = document.createElement("div");
        name.style.position = "absolute";
        name.style.top = namecursory + "px";
        name.style.left = namecursorx + "px";
        if (vertical) name.style.width = namewidth / 2 + "px";
        else name.style.width = namewidth + "px";
        name.style.height = 18 + "px";
        //name.style.backgroundColor="green";

        var box = document.createElement("div");
        box.style.position = "absolute";
        box.style.top = 3 + "px";
        box.style.left = 0 + "px";
        box.style.width = font_size - font_size / 3 + "px";
        box.style.height = font_size - font_size / 3 + "px";
        //box.style.border = "1px solid gray";
        box.style.backgroundColor = color;
        box.style.padding = 0 + "px";
        name.appendChild(box);

        var label = document.createElement("div");
        label.style.position = "absolute";
        label.style.top = 0 + "px";
        label.style.left = font_size + 5 + "px";
        label.style.width = 100 + "px";
        label.style.height = 10 + "px";
        label.style.fontSize = font_size + "px";
        if (font_white) label.style.color = "white";
        label.style.textAlign = "left";
        label.style.padding = 0 + "px";
        label.innerHTML = wordshortener(strname);

        name.appendChild(label);

        if (!vertical) {
          namecursory += 18;
        } else {
          if (namecursorx == namewidth / 2) {
            namecursorx = 0;
            namecursory += 18;
          } else {
            namecursorx += namewidth / 2;
          }
        }

        namearea.appendChild(name);
      }
      function wordshortener(word) {
        word = word.replace("&", "&#38;");
        var offset;
        var result = "";
        if (vertical) {
          offset = namewidth / 2 - font_size * 2;
        } else {
          offset = namewidth - font_size * 2;
        }

        if (word.length * font_size > offset) {
          if (word.length > 4) {
            result = word.substring(0, 4) + "...";
          } else {
            result = word;
          }
        } else {
          result = word;
        }
        return result;
      }
    }
  };
  ap.barChart = function (jsn) {
    var cf = new jCommon(),
      disparity = jsn.disparity ? jsn.disparity : 0,
      col = jsn.col ? jsn.col : 0,
      name_col = jsn.name_col == undefined ? 0 : jsn.name_col,
      ctx = jsn.ctx,
      color = jsn.color
        ? jsn.color
        : [
            cf.blue,
            cf.red,
            cf.yellow,
            "green",
            "orange",
            "brown",
            "gold",
            "silver",
          ],
      id = jsn.id ? jsn.id : "document.body",
      nx = this.getminmax(col),
      max =
        jsn.max == undefined
          ? nx.max.val + (nx.max.val - nx.min.val) / 10
          : jsn.max,
      min =
        jsn.min == undefined
          ? nx.min.val - (nx.max.val - nx.min.val) / 10
          : jsn.min,
      min = min < 0 ? 0 : min,
      ntvl = ctx.canvas.height / this.length,
      startpoint = ntvl / 2,
      bg = jsn.bg == undefined ? "white" : jsn.bg;

    var arr = [
      0,
      (jsn.w * 1) / 10,
      (jsn.w * 2) / 10,
      (jsn.w * 3) / 10,
      (jsn.w * 4) / 10,
      (jsn.w * 5) / 10,
      (jsn.w * 6) / 10,
      (jsn.w * 7) / 10,
      (jsn.w * 8) / 10,
      (jsn.w * 9) / 10,
      (jsn.w * 10) / 10,
    ];
    arr.trav(function (d, n) {
      j(id + "dt" + n, ctx.canvas.parentNode).css({
        left: d - 50 / 2 + "px",
        top: ctx.canvas.height + 4 + "px",
        width: 50 + "px",
        height: 25 + "px",
        fontSize: 11 + "px",
        color: "#444444",
        textAlign: "center",
        fontFamily: "Tomaho,Dotum",
      });
      var dbyp = (d * (max - min)) / ctx.canvas.width + min;

      j(id + "dt" + n).innerHTML = cf.rommify(dbyp, 1);
    });
    arr.trav(function (d, n) {
      if (n != 0 && n != arr.length - 1) {
        ctx.beginPath();
        ctx.fillStyle = "#dddddd";
        ctx.fillRect(d, 0, 1, ctx.canvas.height);
      }
    });

    var pos = new Array();
    var flg,
      thck = jsn.thick == undefined ? 20 : jsn.thick,
      th;
    this.trav(function (d, n) {
      var val = (d[col] - min) * (ctx.canvas.width / (max - min));
      th = (function () {
        if (ntvl - disparity < thck) {
          flg = true;
          return thck;
        } else {
          return ntvl - disparity;
        }
      })();

      var tp = flg ? ntvl * n : ntvl * n + disparity / 2;
      pos.push([0, tp, val, th, d[name_col] + "", d[col]]);
    });

    pos.trav(function (d, n) {
      ctx.beginPath();
      ctx.fillStyle = color[n];
      ctx.fillRect(d[0], d[1], d[2], d[3]);
      j(id + "label" + n, ctx.canvas.parentNode).css({
        left: -105 + "px",
        top: d[1] + th / 2 - 4 + "px",
        width: 100 + "px",
        height: 13 + "px",
        fontSize: 11 + "px",
        color: "#444444",
        textAlign: "right",
        fontFamily: "Tomaho,Dotum",
      });
      j(id + "label" + n).innerHTML = d[4].substring(0, 12);
    });

    pos.trav(function (d, n) {
      var xx, align, tc;
      if (d[2] < 30) {
        xx = d[2] + 5;
        align = "left";
        tc = "black";
      } else {
        xx = d[2] - 30 - 5;
        align = "right";
        tc = "white";
      }

      j(id + "cont" + n, ctx.canvas.parentNode).css({
        left: xx + "px",
        top: d[1] + 5 + "px",
        width: 30 + "px",
        height: 15 + "px",
        fontSize: 11 + "px",
        textAlign: align,
        //backgroundColor:"red",
        color: tc,
      });
      j(id + "cont" + n).innerHTML =
        d[5] < 1 ? "" : jsn.cont ? parseInt(d[5]) : cf.rommify(d[5], 1);
    });
  };
  ap.barChartV = function (jsn) {
    var cf = new jCommon(),
      disparity = jsn.disparity ? jsn.disparity : 0,
      col = jsn.col ? jsn.col : 0,
      ctx = jsn.ctx,
      color = jsn.color
        ? jsn.color
        : [
            cf.blue,
            cf.red,
            cf.yellow,
            "green",
            "orange",
            "brown",
            "gold",
            "silver",
          ],
      id = jsn.id ? jsn.id : "document.body";

    (nx = this.getminmax(col)),
      (max =
        jsn.max == undefined
          ? nx.max.val + (nx.max.val - nx.min.val) / 10
          : jsn.max),
      (min =
        jsn.min == undefined
          ? nx.min.val - (nx.max.val - nx.min.val) / 10
          : jsn.min),
      (ntvl = ctx.canvas.width / this.length),
      (startpoint = ntvl / 2);
    if (max == min) max > 0 ? (min = 0) : max < 0 ? (max = 0) : (max = 100);
    var mean = (function () {
        if (jsn.mean != undefined) {
          if (jsn.mean > max) {
            max = jsn.mean;
            return max;
          } else if (jsn.mean < min) {
            min = jsn.mean;
            return min;
          } else {
            return jsn.mean;
          }
        } else {
          return jsn.mean;
        }
      })(),
      //jsn.mean!=undefined?(jsn.mean>max||jsn.mean<min?undefined:jsn.mean):jsn.mean,
      meanh =
        mean != undefined
          ? cf.datapositionY(ctx.canvas.height, max, min, mean)
          : cf.datapositionY(
              ctx.canvas.height,
              max,
              min,
              cf.getdatabyposition(
                ctx.canvas.height,
                ctx.canvas.height / 2,
                max,
                min
              )
            );

    var dten = cf.datapositionY(ctx.canvas.height, max, min, mean + 10);
    dten = Math.abs(meanh - dten);

    var h = ctx.canvas.height,
      arr = (function () {
        var a = new Array();
        if (mean == undefined) {
          a = [0, h / 4, h / 2, (h * 3) / 4, h - 1];
        } else {
          var go = true,
            cnt = 0,
            up = true,
            down = true;
          while (go) {
            var b;
            if (up) {
              b = meanh + dten * cnt;
              if (b <= ctx.canvas.height) a.push(b);
              else up = false;
            }
            if (down) {
              b = meanh + dten * -cnt;
              if (b >= 0) a.push(b);
              else down = false;
            }
            if (!up && !down) break;
            cnt++;
          }
        }
        return a;
      })();
    arr.BG(ctx);

    arr.trav(function (d, n) {
      var lb2 = id + "dt" + n;
      j(lb2, ctx.canvas.parentNode).css({
        left: -50 - 4 - 5 + "px",
        top: d - 15 / 2 + "px",
        width: 50 + "px",
        height: 25 + "px",
        fontSize: 11 + "px",
        textAlign: "right",
      });
      var dbyp = cf.getdatabyposition(ctx.canvas.height, d, max, min);
      j(lb2).innerHTML = cf.rommify(dbyp, 0);
    });

    var pos = new Array();
    this.trav(function (d, n) {
      var val = cf.datapositionY(ctx.canvas.height, max, min, d[col]);
      if (meanh - val > 0) {
        pos.push([
          ntvl * n + disparity / 2,
          val,
          ntvl - disparity,
          meanh - val,
          d[0],
          "up",
        ]);
      } else {
        pos.push([
          ntvl * n + disparity / 2,
          meanh,
          ntvl - disparity,
          val - meanh,
          d[0],
          "down",
        ]);
      }
    });
    var clr = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "violet",
      "purple",
      cf.red,
      cf.yellow,
      cf.blue,
    ];
    pos.trav(function (d, n) {
      ctx.beginPath();

      //log(d[0],d[1],d[2],d[3]);
      d[5] == "up" ? (ctx.fillStyle = color[0]) : (ctx.fillStyle = color[1]);

      ctx.fillRect(d[0], d[1], d[2], d[3]);
      var lb = id + "label" + n;
      j(lb, ctx.canvas.parentNode).css({
        left: d[0] - ntvl + 10 + "px",
        top:
          ctx.canvas.height +
          15 * (n % 2) +
          jsn.padding.top +
          jsn.padding.bottom +
          "px",
        width: ntvl * 2 + "px",
        height: 11 + "px",
        fontSize: 11 + "px",
        textAlign: "center",
      });
      j(lb).innerHTML = d[4].length > 7 ? d[4].substring(0, 7) + ".." : d[4];
    });
    return pos;
  };
  ap.barChartG = function (jsn) {
    var ctx = jsn.ctx,
      tw = ctx.canvas.width - jsn.padding.left - jsn.padding.right,
      w = tw / this.length,
      ox = jsn.disparity / 2;

    var nx = this.getminmax(jsn.col),
      max =
        jsn.max == undefined
          ? nx.max.val + (nx.max.val - nx.min.val) / 10
          : jsn.max,
      min =
        jsn.min == undefined
          ? nx.min.val - (nx.max.val - nx.min.val) / 10
          : jsn.min;
    min = min < 0 ? 0 : min;

    this.trav(function (d, n) {
      ctx.beginPath();
      typeof jsn.color != "object"
        ? (ctx.fillStyle = jsn.color)
        : (ctx.fillStyle = jsn.color[n]);
      var a = datapositionY(ctx.canvas.height, max, min, d[jsn.col]);
      ctx.fillRect(w * n + ox, a, w - ox * 2, ctx.canvas.height - a);
    });
  };
  ap.clsChar = function (col, str) {
    var num = str.charCodeAt(0);
    var rslt = 0;
    this.trav(function (d, n) {
      var a = d[col].charCodeAt(0);
      if (a == num) {
        rslt = n;
        return true;
      }
    });
    return rslt;
  };
  ap.event = function (jsn) {
    var cf = new jCommon();
    var l = this;
    var ctx = jsn.ctx,
      h = ctx.canvas.height + jsn.padding.bottom + jsn.padding.top,
      y = -jsn.padding.top,
      lng = ctx.canvas.width / this.length,
      col = jsn.col == undefined ? 0 : jsn.col,
      col_opt = jsn.col_opt == undefined ? false : jsn.col_opt,
      chartId = ctx.canvas.parentNode.parentNode.id;

    var d = cf.mkAbsoluteDiv(0, y, 1, h, ctx.canvas.parentNode);
    d.id = "vline_" + chartId;
    var bt = cf.mkAbsoluteDiv(
      0,
      ctx.canvas.height + jsn.padding.bottom,
      60,
      15,
      ctx.canvas.parentNode
    );
    bt.id = "vlabel_" + chartId;
    bt.style.zIndex = 1;
    bt.style.paddingTop = 3 + "px";
    bt.style.border = "1px solid gray";
    bt.style.textAlign = "center";
    bt.style.backgroundColor = "white";
    bt.style.fontSize = 11 + "px";
    bt.style.display = "none";

    var eventObj = jsn.eventObj
      ? jsn.eventObj
      : ctx.canvas.parentNode.parentNode;

    eventObj.onmousemove = function (e) {
      var a = cf.getEventPos(e, this),
        jsny = jsn.y == undefined ? 0 : jsn.y,
        ax = a.x,
        ay = a.y - jsny;
      if (ax > jsn.padding.left && ay > jsn.padding.top) {
        if (
          ax < jsn.padding.left + ctx.canvas.width &&
          ay < jsn.padding.top + ctx.canvas.height
        ) {
          gadgets(ax - jsn.padding.left - 1, ay);
          if (jsn.yTip && typeof jsn.yTip_col == "number")
            yTip(ax - jsn.padding.left - 1, ay);
          else if (jsn.yTip && typeof jsn.yTip_col == "object")
            yTips(ax - jsn.padding.left - 1, ay);
        }
      }
    };
    eventObj.onmouseout = function (e) {
      dpnone(d);
      dpnone(bt);
      if (jsn.yTip && typeof jsn.yTip_col == "number")
        dpnone(j("dv_" + jsn.id));
      else if (jsn.yTip && typeof jsn.yTip_col == "object")
        for (var i = 0; i < jsn.yTip_col.length; i++)
          dpnone(j("dv_" + jsn.id + "_" + i));

      var a = cf.getEventPos(e, this),
        jsny = jsn.y == undefined ? 0 : jsn.y,
        ax = a.x,
        ay = a.y;
      if (jsn.out) jsn.out(ax, ay);
    };
    eventObj.onclick = function (e) {
      var a = cf.getEventPos(e, this),
        jsny = jsn.y == undefined ? 0 : jsn.y,
        ax = a.x,
        ay = a.y - jsny;
      jsn.click(parseInt(ax / lng));
    };

    function dpnone(el) {
      el.style.display = "none";
    }
    function dp(el) {
      el.style.display = "block";
    }
    var cssjsn = {
      backgroundColor: "white",
      top: 0 + "px",
      left: 0 + "px",
      width: 50 + "px",
      height: 13 + "px",
      display: "none",
      textAlign: "center",
      fontSize: 11 + "px",
      border: "1px solid gray",
    };
    var ap = j("cover_" + jsn.id);
    if (jsn.yTip && typeof jsn.yTip_col == "number") {
      j("dv_" + jsn.id, ap).css(cssjsn);
    } else if (jsn.yTip && typeof jsn.yTip_col == "object") {
      for (var i = 0; i < jsn.yTip_col.length; i++) {
        j("dv_" + jsn.id + "_" + i, ap).css(cssjsn);
      }
    }
    function yTips(x, y) {
      for (var i = 0; i < jsn.yTip_col.length; i++) {
        dp(j("dv_" + jsn.id + "_" + i));
      }
      var a = ctx.canvas.width / l.length;
      var idx = parseInt(x / lng);
      //var max=jsn.max, min=jsn.min;
      if (jsn.yTip_opt) gadgets(idx * a + a / 2, y);

      for (var i = 0; i < jsn.yTip_col.length; i++) {
        var nx = l.getminmax(jsn.yTip_col[i]),
          max =
            jsn.max == undefined
              ? nx.max.val + (nx.max.val - nx.min.val) / 10
              : jsn.max,
          min =
            jsn.min == undefined
              ? nx.min.val - (nx.max.val - nx.min.val) / 10
              : jsn.min;

        var value = l[idx][jsn.yTip_col[i]];
        var vl = cf.datapositionY(ctx.canvas.height, max, min, value);
        movingTip(
          idx * a + a / 2 - 50 / 2,
          vl + jsn.padding.top - 5 - 15,
          j("dv_" + jsn.id + "_" + i),
          rommify(value, 1)
        );
      }
    }
    function yTip(x, y) {
      dp(j("dv_" + jsn.id));
      var a = ctx.canvas.width / l.length;
      var idx = parseInt(x / lng);
      if (jsn.yTip_opt) gadgets(idx * a + a / 2, y);

      var nx = l.getminmax(jsn.yTip_col),
        max =
          jsn.max == undefined
            ? nx.max.val + (nx.max.val - nx.min.val) / 10
            : jsn.max,
        min =
          jsn.min == undefined
            ? nx.min.val - (nx.max.val - nx.min.val) / 10
            : jsn.min;

      var value = l[idx][jsn.yTip_col];
      var vl = cf.datapositionY(ctx.canvas.height, max, min, value);
      movingTip(
        idx * a + a / 2 - 50 / 2,
        vl + jsn.padding.top - 5 - 15,
        j("dv_" + jsn.id),
        rommify(value, 1)
      );
    }
    function movingTip(x, y, p, str) {
      p.css({
        top: y + "px",
        left: x + "px",
      });
      p.innerHTML = str;
    }
    function gadgets(x, y) {
      if (!jsn.no_gadget) {
        dp(d);
        dp(bt);
        d.style.backgroundColor = "gray";
        d.style.left = x + "px";
        bt.style.left = x - 30 + "px";
      }
      if (l[parseInt(x / lng)]) {
        if (!jsn.no_gadget) {
          if (col_opt) {
            bt.innerHTML = l[parseInt(x / lng)][col].substring(0, 6);
          } else {
            if (jsn.col_unit == "date")
              bt.innerHTML = datify(l[parseInt(x / lng)][col]);
            else bt.innerHTML = timify(l[parseInt(x / lng)][col]);
          }
        }
        jsn.fnc({
          x: x,
          y: y,
          ctx: ctx,
          arr: l,
          idx: parseInt(x / lng),
          padding: jsn.padding,
        });
      }
    }
  };
  ap.pixel = function (x, y, r, g, b, a) {
    if (y >= 367) return undefined;
    if (x >= 330) return undefined;
    this[y][x][0] = r;
    this[y][x][1] = g;
    this[y][x][2] = b;
    this[y][x][3] = a;
  };
  //2015.02.17 in RnT by Jae Hyun Lee
  ap.topN = function (col, n) {
    if (this.length <= n) return this;
    var idc = [];
    var res = [];
    var x = this.getmax(col);
    idc.push(x.row);
    var pre = x.max;
    for (var i = 0; i < n - 1; i++) {
      var val = this.nextMax(col, pre);
      pre = val.max;
      idc.push(val.row);
    }
    idc.sort();
    for (var i = 0, len = idc.length; i < len; i++) {
      res.push(this[idc[i]]);
    }
    return res;
  };
  ap.overVal = function (col, val) {
    var idc = [],
      res = [];
    for (var i = 0, len = this.length; i < len; i++) {
      var v = this[i][col];
      if (v > val) idc.push(i);
    }
    for (var i = 0, len = idc.length; i < len; i++) {
      res.push(this[idc[i]]);
    }
    return res;
  };
  ap.belowVal = function (col, val) {
    var idc = [],
      res = [];
    for (var i = 0, len = this.length; i < len; i++) {
      var v = this[i][col];
      if (v < val) idc.push(i);
    }
    for (var i = 0, len = idc.length; i < len; i++) {
      res.push(this[idc[i]]);
    }
    return res;
  };
  ap.avr = function (col) {
    var sum = this.arrSum(col);
    return sum / this.length;
  };
  //2015.02.22 in RnT by Jae Hyun Lee
  ap.distinct = function (col) {
    /*
          var arr=[];
          for(var i=0, lng=this.length;i<lng;i++){
              var val=this[i][col]*1;
              if(isNaN(val)) val=this[i][col];
              if(i==0){
                  arr.push(val);
              }else{ 
                  if(chk(val)) arr.push(val);
              }
          }
          function chk(val){
              for(var i=0, lng=arr.length;i<lng;i++){
                  if(arr[i]==val) return false;
              }
              return true;
          };
          */
    var obj = {};
    var arr = [];
    for (var i = 0, lng = this.length; i < lng; i++) {
      var val = this[i][col];
      if (obj[val] == undefined) {
        obj[val] = i;
        arr.push(val);
      }
    }

    return arr;
  };
  //2015.02.23 in RnT by Jae Hyun Lee
  /* ap.filter = function (col, con) {
    var arr = this;
    var res = [];
    for (var i = 0, lng = this.length; i < lng; i++) {
      var chk = true;
      con.trav(function (d, k) {
        if (arr[i][col] == d) {
          chk = false;
          return true;
        }
      });
      if (chk) res.push(arr[i]);
    }
    return res;
  }; */
  //2015.02.24 in RnT by Jae Hyun Lee
  ap.comp = function (col, val, opt) {
    var res = [];
    for (var i = 0, lng = this.length; i < lng; i++) {
      var value = this[i][col];
      if (opt == 0 && val == value) res.push(this[i]);
      if (opt == 1 && val != value) res.push(this[i]);
      if (opt == 2 && value > val) res.push(this[i]);
      if (opt == 3 && value >= val) res.push(this[i]);
      if (opt == 4 && value < val) res.push(this[i]);
      if (opt == 5 && value <= val) res.push(this[i]);
    }
    return res;
  };
  ap.textcomp = function (col, val, opt) {
    var res = [];
    var ln = val.length;
    for (var i = 0, lng = this.length; i < lng; i++) {
      var value = this[i][col];
      if (opt == 2 && value.substring(0, ln) == val) res.push(this[i]);
      if (opt == 3 && value.substring(value.length - ln, value.length) == val)
        res.push(this[i]);
      if (opt == 4 && value.indexOf(val) != -1) res.push(this[i]);
      if (opt == 5 && value.indexOf(val) == -1) res.push(this[i]);
    }
    return res;
  };
  ap.getType = function (col) {
    for (var i = 0, lng = this.length; i < lng; i++) {
      if (typeof this[i][col] != "number") return "string";
    }
    return "number";
  };
  //2015.03.23 in RnT by Jae Hyun Lee
  ap.rowParse = function (str) {
    //step0. where 절이 ()안에 들어 있을 때,
    //()를 제거해 주는 절차
    if (cf.getHead(str, 1) == "(" && cf.getTail(str, 1) == ")") {
      str = cf.cutHead(str, 1);
      str = cf.cutTail(str, 1);
    }
    //str을 받아,
    //(), and, or로 이루어진 where 절을
    //parse 한다
    var l = this;
    if (str.indexOf(" or ") == -1 && str.indexOf(" and ") == -1) {
      this.push(str);
      return;
    }
    //그룹핑 하는 부분/////////////////
    //step1. 최상위 그룹핑
    var opn = [],
      group = [];
    var conRow = str;
    conRow.trav(function (d, i) {
      if (d == "(") opn.push(i);
      if (d == ")") {
        if (opn.length == 1) group.push([opn.pop(), i]);
        else opn.pop();
      }
    });
    //step2. 그룹핑 치환
    var rplc = conRow;
    group.trav(function (d, i) {
      var tmp = conRow.substring(d[0], d[1] + 1);
      rplc = rplc.replace(tmp, "A");
    });
    //step3. 그룹핑 원복
    var tp = rplc.jSplit("and", "or");
    var cnt = 0;
    tp.trav(function (d, i) {
      if (d == "A") {
        tp[i] = conRow.substring(group[cnt][0] + 1, group[cnt][1]).trimFB();
        cnt++;
      }
    });
    //step4. 연산자 후위 배치
    var idc = [];
    tp.trav(function (d, i) {
      if (d == "and") idc.push([d, i]);
    });
    idc.trav(function (d, i) {
      tp.splice(d[1], 1);
      tp.splice(d[1] + 1, 0, d[0]);
    });
    idc = [];
    tp.trav(function (d, i) {
      if (d == "or") idc.push([d, i]);
    });
    var cnt = 0;
    idc.trav(function (d, i) {
      tp.splice(d[1] - cnt, 1);
      cnt++;
    });
    while (idc.length != 0) tp.push(idc.pop()[0]);
    tp.trav(function (d, i) {
      if (d != "and" && d != "or") l.rowParse(d);
      else l.push(d);
    });
  };
  //2015.04.14 in RnT by Jae Hyun Lee
  ap.revSort = function () {
    this.sort(function (a, b) {
      if (a > b) return -1;
      if (b > a) return 1;
      return 0;
    });
  };
  //2015.05.21 in RnT by Jae Hyun Lee
  ap.mkTable = function (pr) {
    if (!pr.r) pr.r = [];
    if (!pr.c) pr.c = [];
    if (!pr.mode) pr.mode = false;

    var l = this;
    var rlng = this.length,
      clng = this[0].length;
    var tds = new Array(rlng);
    var t = cf.mkTag("table", pr.p);
    tds.trav(function (d, i) {
      tds[i] = new Array(clng);
    });
    //t.border=1;
    t.style.borderCollapse = "collapse";
    cf.setCss(t, {
      width: 100 + "%",
      //height:100+"%",
      textAlign: "center",
    });
    around(rlng, function (i) {
      var tr = cf.mkTag("tr", t);
      around(clng, function (j) {
        var chk = false;
        chk = cJudge(i, j, pr.c);
        if (!chk) chk = rJudge(i, j, pr.r);
        if (!chk) chk = qJudge(i, j, pr);
        if (!chk) {
          var td = cf.mkTag("td", tr);
          //colspan
          pr.c.trav(function (d) {
            var x = d.x,
              y = d.y,
              hm = d.howmany;
            if (i == y && j == x) td.colSpan = hm;
          });
          //rowspan
          pr.r.trav(function (d) {
            var x = d.x,
              y = d.y,
              hm = d.howmany;
            if (i == y && j == x) td.rowSpan = hm;
          });
          td.i = i;
          td.j = j;
          td.innerHTML = l[i][j];
          //td.innerHTML="("+i+","+j+")";
          tds[i][j] = td;
          if (pr.mode) {
            td.onmousemove = function () {
              this.innerHTML = "(" + this.i + "," + this.j + ")";
            };
            td.onmouseout = function () {
              this.innerHTML = l[this.i][this.j];
            };
          }
        }
      });
    });
    function cJudge(i, j, ar) {
      //about colspan
      var chk;
      ar.trav(function (d) {
        var x = d.x,
          y = d.y,
          hm = d.howmany;
        if (i == y)
          if (j > x && j < x + hm) {
            chk = true;
          }
      });
      return chk;
    }
    function rJudge(i, j, ar) {
      //about rowspan
      var chk;
      ar.trav(function (d) {
        var x = d.x,
          y = d.y,
          hm = d.howmany;
        if (j == x)
          if (i > y && i < y + hm) {
            chk = true;
          }
      });
      return chk;
    }
    function qJudge(i, j, obj) {
      //about rowspan
      var r = obj.r,
        c = obj.c;
      var chk;
      r.trav(function (row) {
        c.trav(function (col) {
          if (row.x == col.x && row.y == col.y) {
            numcheck(row.x, row.y, row.howmany, col.howmany);
          }
        });
      });

      function numcheck(x, y, rhm, chm) {
        if (j > x && j < x + chm) {
          if (i > y && i < y + rhm) {
            chk = true;
          }
        }
      }

      return chk;
    }

    return tds;
  };
  ap.getRandom = function () {
    var rn = getRandom(0, this.length - 1);
    log(0, this.length - 1, rn);
    return this[rn];
  };
  ap.lastOne = function () {
    return this[this.length - 1];
  };
  ap.dtrav = function (fnc) {
    this.trav(function (row, i) {
      row.trav(function (col, j) {
        fnc(row, col, i, j);
      });
    });
  };

  //about String
  var sp = String.prototype;
  sp.xmlparse = function () {
    if (window.DOMParser) {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(this, "text/xml");
    } else {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(this);
    }
    return xmlDoc;
  };
  sp.mkArr = function () {
    var ag = arguments;
    if (ag.length == 0) {
      var arr = new Array();
      var tmp = this.toString().split("|&");
      for (var i = 0; i < tmp.length - 1; i++) {
        arr[i] = tmp[i].split("|");
      }
    } else {
      var arr = new Array();
      var tmp = this.toString().split(ag[0]);
      for (var i = 0; i < tmp.length - 1; i++) {
        arr[i] = tmp[i].split(ag[1]);
      }
    }
    return arr;
  };
  sp.mkRarr = function () {
    var arr = new Array();
    var tmp = this.toString().split("|&");
    for (var i = tmp.length - 2; i >= 0; i--) {
      arr.push(tmp[i].split("|"));
    }
    return arr;
  };
  sp.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s+$/, "");
  };
  sp.jsonparse = function () {
    return JSON.parse(this);
  };
  sp.trav = function (fnc) {
    for (var i = 0; i < this.length; i++) {
      fnc(this[i], i);
    }
  };
  //2015.03.23 in RnT by Jae Hyun Lee
  sp.jSplit = function () {
    var args = [];
    for (var el in arguments) {
      args.push(arguments[el]);
    }

    var l = this;
    var res = [];
    args.trav(function (d, i) {
      var num = 0;
      while (true) {
        var a = l.substring(num).indexOf(d);
        if (a == -1) break;
        res.push([d, num + a]);
        num += a + d.length;
      }
    });
    res.asc(1);
    var num = 0;
    var result = [];
    res.trav(function (d, i) {
      result.push(l.substring(num, d[1]).trimFB());
      result.push(d[0]);
      num = d[1] + d[0].length;
    });
    result.push(
      l
        .substring(res[res.length - 1][1] + res[res.length - 1][0].length)
        .trimFB()
    );

    return result;
  };
  sp.trimFB = function (num) {
    if (!num) {
      //trim spaces of front and back of a string
      return this.replace(/(^\s*)|(\s*$)/gi, "");
    } else {
      return this.substring(num, this.length - num);
    }
  };
  //2015.03.23 in RnT by Jae Hyun Lee
  sp.has = function (str) {
    var res = false;
    if (this.indexOf(str) != -1) {
      res = true;
    }
    return res;
  };
  //2015.04.09 in RnT by Jae Hyun Lee
  sp.getWords = function (lmt) {
    var str = this;
    var words = [];
    var st, en;
    around(str.length, function (k) {
      if (st == undefined && str[k] != " ") st = k;
      if (st != undefined && (str[k] == " " || k == str.length - 1)) {
        en = k;
        var ad = 0;
        if (k == str.length - 1) ad = 1;
        words.push(str.substring(st, en + ad));
        if (lmt && words.length == lmt) return true;
        st = undefined;
      }
    });
    return words;
  };
  //2015.04.10 in RnT by Jae Hyun Lee
  sp.substitute = function (start, end, str) {
    var tmp = this.substring(start, end + 1);
    return this.replace(tmp, str);
  };
  //2016.04.29 in home by Jae Hyun Lee
  sp.gt = function (num) {
    //get tail
    return this.substring(this.length - num, this.length);
  };
  //2016.04.29 in home by Jae Hyun Lee
  sp.gh = function (num) {
    //get head
    return this.substring(0, num);
  };
  //2016.04.29 in home by Jae Hyun Lee
  sp.ct = function (num) {
    //get tail
    return this.substring(0, this.length - num);
  };
  //2016.04.29 in home by Jae Hyun Lee
  sp.ch = function (num) {
    //cut head
    return this.substring(num, this.length);
  };
  sp.howmany = function (str) {
    let num = this.match(new RegExp(str, "g"));
    if (!num) num = 0;
    else num = num.length;
    return num;
  };

  //about HTMLElement
  var op = HTMLElement.prototype;
  op.bimg = function () {
    //2013.8.9
    //element의 배경 이미지를 채워주는 함수
    var a = arguments[0];
    if (arguments.length == 1) {
      this.style.background = "url(" + a + ") no-repeat";
    } else {
      this.style.background =
        "url(" + a + ") " + arguments[1] + "px " + arguments[2] + "px";
    }
  };
  op.bg = function (clr) {
    //2013.8.9
    //element의 배경색을 칠해주는 함수
    this.style.backgroundColor = clr ? clr : "rgba(0,0,0,0.7)";
  };
  op.ins = function (el, num) {
    //2013.8.9
    //지정한 번호 앞에 element를 삽입해주는 함수, 자기가 지정한 번호의 노드가 됨.
    this.insertBefore(el, this.childNodes[num]);
  };
  op.write = function (str) {
    this.innerHTML = str;
  };
  var ip = ImageData.prototype;
  ip.xy = function (x, y) {
    var a = this.data;
    var n = (y * this.width + x) * 4,
      nr = n,
      ng = n + 1,
      nb = n + 2,
      na = n + 3;
    var b = {
      r: a[nr],
      g: a[ng],
      b: a[nb],
      a: a[na],
      str:
        "rgba(" + a[nr] + "," + a[ng] + "," + a[nb] + "," + a[na] / 255 + ")",
    };
    return b;
  };
  ip.transparent = function (x, y) {
    var w = this.width;
    var r = (y * w + x) * 4,
      g = (y * w + x) * 4 + 1,
      b = (y * w + x) * 4 + 2,
      a = (y * w + x) * 4 + 3;

    var rng = 20;
    for (var i = 0; i < rng; i++) {
      for (var k = 0; k < rng; k++) {
        this.data[((y + i) * w + (x + k)) * 4 + 3] = 0;
      }
    }
  };
  ip.trav = function (fnc) {
    for (var i = 0, lng = this.data.length; i < lng; i += 4) {
      fnc(this.data[i], i);
    }
  };
  ip.getClr = function (x, y, w) {
    var n = this.getNum(x, y, 0, w);
    var r = this.data[n],
      g = this.data[n + 1],
      b = this.data[n + 2],
      a = this.data[n + 3];
    return [r, g, b, a];
  };
  ip.setClr = function (x, y, w, clr) {
    if (x < 0 || x >= w) return undefined;
    var n = this.getNum(x, y, 0, w),
      r = clr[0],
      g = clr[1],
      b = clr[2],
      a = clr[3];

    //log(x,y,n,r,g,b,a);

    this.data[n] = r;
    this.data[n + 1] = g;
    this.data[n + 2] = b;
    this.data[n + 3] = a;
  };
  ip.getNum = function (x, y, th, w) {
    if (x < 0 || x >= w) return undefined;
    var rslt = 4 * (x + y * w) + th;
    return rslt;
  };
  ip.getXYTh = function (num, w) {
    var a = parseInt(num / 4);
    var x = a % w,
      y = parseInt(a / w),
      th = num % 4;
    return { x: x, y: y, th: th };
  };
  ip.clrCompensate = function (cords, w) {
    //이것은 전반적인 보간 절차이며,
    //특정 픽셀에 대한 보간 절차가 따로 있어야 함.
    var vd = new Array(),
      c = this;
    cords.trav(function (t, m) {
      var nx = c.getNum(t[1] - 1, t[2], 0, w);
      if (c.data[nx + 3] != 0 && c.data[nx + 3] != undefined) {
        for (var i = 0; i < 4; i++) c.data[t[0] + i] = c.data[nx + i];
      } else {
        nx = c.getNum(t[1], t[2] - 1, 0, w);
        vd.push([t[0], nx]);
      }
    });
    vd.trav(function (t, m) {
      c.data[t[0]] = c.data[t[1]];
      c.data[t[0] + 1] = c.data[t[1] + 1];
      c.data[t[0] + 2] = c.data[t[1] + 2];
      c.data[t[0] + 3] = c.data[t[1] + 3];
    });
  };
  var cp = CanvasRenderingContext2D.prototype;
  cp.test = function () {
    this.moveTo(0, 0);
    this.lineTo(100, 100);
    this.stroke();
  };
  cp.clr = function () {
    this.canvas.width = this.canvas.width;
  };
  cp.img = function () {
    var img = new Image();
    img.src = arguments[0];
    var args = arguments;
    var l = this,
      x = 0,
      y = 0;
    if (arguments.length != 1) {
      (x = arguments[1]), (y = arguments[2]);
    }
    img.onload = function () {
      var w = img.width,
        h = img.height;
      if (args.length > 3) {
        (w = args[3]), (h = args[4]);
      }
      setTimeout(function () {
        l.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
      }, 10);
    };
  };
  cp.toXY = function (id, w, h) {
    var arr = new Array();
    for (var i = 0; i < h; i++) {
      arr[i] = new Array();
      for (var k = 0; k < w; k++) {
        arr[i][k] = new Array();
        for (var m = 0; m < 4; m++) {
          arr[i][k][m] = id.data[i * w * 4 + k * 4 + m];
        }
      }
    }
    return arr;
  };
  cp.toX = function (id, ar, sh, eh, sw, ew) {
    var w = ar[0].length;
    for (var i = sh; i < eh; i++) {
      if (i >= ar.length) return false;
      for (var k = 0; k < ew; k++) {
        if (k >= ar[0].length) break;
        for (var m = 0; m < 4; m++) {
          id.data[i * w * 4 + k * 4 + m] = ar[i][k][m];
        }
      }
    }
  };
  cp.eraseLine = function (ad, num) {
    if (num >= ad.length) return false;
    var w = ad[0].length;
    if (num < 0) return false;
    for (var i = 0; i < w; i++) {
      ad[num][i][3] = 0;
    }
  };
  cp.eraseColumn = function (ad, num) {
    if (num >= ad[0].length) return false;
    var h = ad.length;
    if (num < 0) return false;
    for (var i = 0; i < h; i++) {
      ad[i][num][3] = 0;
    }
  };
  cp.wipeout = function (opt, fnc) {
    var cnt = 0,
      weight = 10,
      l = this,
      w = 330,
      h = 367;
    var a = l.getImageData(0, 0, w, h),
      d = a.data;
    var ad = l.toXY(a, w, h);
    var c = l.createImageData(a);
    l.clr();
    l.toX(c, ad, 0, h, 0, w);
    l.putImageData(c, 0, 0);
    var tmr = setInterval(function () {
      effect(cnt, opt);
      cnt += weight;
      if (cnt >= h) {
        clearInterval(tmr);
        revive();
      }
    }, 20);

    function effect(cnt, opt) {
      if (opt == 0) {
        updown(cnt, true);
      } else if (opt == 1) {
        updown(cnt, false);
      } else if (opt == 2) {
        leftright(cnt, true);
      } else if (opt == 3) {
        leftright(cnt, false);
      }
    }
    function revive() {
      setTimeout(function () {
        l.putImageData(a, 0, 0);
        fnc();
      }, 500);
    }
    function updown(cnt, op) {
      for (var i = 0; i < weight; i++)
        l.eraseLine(ad, op ? cnt + i : h - cnt - i);
      l.toX(c, ad, 0, h, 0, w);
      l.putImageData(c, 0, 0);
    }
    function leftright(cnt, op) {
      for (var i = 0; i < weight; i++)
        l.eraseColumn(ad, op ? cnt + i : h - cnt - i);
      l.toX(c, ad, 0, h, 0, w);
      l.putImageData(c, 0, 0);
    }
  };
  cp.rgbLine = function (ad, num, str) {
    var l = this;
    if (num >= ad.length) return false;
    var w = ad[0].length;
    if (num < 0) return false;
    for (var i = 0; i < w; i++) {
      filtering(i, str);
    }
    function filtering(n, str) {
      for (var i = 0; i < 3; i++)
        if (str[i] == 0) ad[num][n][i] = 0;
        else ad[num][n][i] = ado[num][n][i];
    }
  };
  cp.rgbFilter = function (str, fnc) {
    var cnt = 0,
      weight = 10,
      l = this,
      w = 330,
      h = 367;
    var a = l.getImageData(0, 0, w, h),
      d = a.data;
    var ad = l.toXY(a, w, h);

    var c = l.createImageData(a);
    l.clr();
    l.toX(c, ad, 0, h, 0, w);
    l.putImageData(c, 0, 0);

    var tmr = setInterval(function () {
      filter(cnt, str);
      cnt += weight;
      if (cnt >= h) {
        clearInterval(tmr);
        revive();
      }
    }, 20);

    function filter(cnt, str) {
      for (var i = 0; i < weight; i++) l.rgbLine(ad, cnt + i, str);
      l.toX(c, ad, 0, h, 0, w);
      l.putImageData(c, 0, 0);
    }
    function revive() {
      setTimeout(function () {
        //l.putImageData(a,0,0);
        fnc();
      }, 500);
    }
  };
  cp.operating = function (w, h) {
    var l = this;
    var a = l.getImageData(0, 0, w, h),
      d = a.data;
    var ad = l.toXY(a, w, h);
    var where;

    var c = l.createImageData(a);
    l.clr();

    var gs = [1.8, 3, 2, 1.9, 2.4, 4, 1.5];
    var cnt1 = 0;
    var tmr1 = setInterval(function () {
      var k = getRandom(0, 7),
        i = getRandom(0, 7);
      var ob = new obj(50 * k, 50 * i, 50, 50);
      ob.g = gs[i] + 3;
      ob.go();
      cnt1++;
    }, 2000);

    var cnt = 1,
      v = 0,
      v1 = 0,
      tmr = setInterval(function () {
        l.toX(c, ad, 0, h, 0, w);
        l.putImageData(c, 0, 0);
        cnt++;
        if (cnt > 1000) clearInterval(tmr);
      }, 40);

    function obj(x, y, w, h) {
      (this.w = w), (this.h = h);
      this.or = [x, y, w, h];
      this.fr = [x, y, w, h];
      this.to;
      this.g = 1.5;
      this.orarea = areacopy(this.or);
      this.frarea = areacopy(this.fr);
      this.goTo = function (x, y) {
        //step1: 목적지를 정한다.
        this.to = [x, y, this.w, this.h];
        //step2: 현재 상태를 이전 상태로 돌린다.
        if (y < this.or[1] + 50) {
          areapaste(
            this.frarea,
            this.fr[0],
            this.fr[1],
            this.fr[2],
            this.fr[3]
          );
          areablank(this.or[0], this.or[1]);
        } else {
          areapaste(
            this.frarea,
            this.fr[0],
            this.fr[1],
            this.fr[2],
            this.fr[3]
          );
        }
        //step3: 이전 상태를 갱신한다.
        this.fr = [x, y, this.w, this.h];
        this.frarea = areacopy(this.to[0], this.to[1], this.to[2], this.to[3]);
        //step4: 목적지로 이동한다.
        areapaste(this.orarea, this.to[0], this.to[1], this.to[2], this.to[3]);
      };
      this.go = function () {
        var cnt = 0,
          l = this,
          v = 1,
          tmr = setInterval(function () {
            l.goTo(l.or[0], l.or[1] + v);
            cnt++;
            v = v + parseInt(v * l.g);
            if (cnt > 100) {
              clearInterval(tmr);
            }
          }, 100);
      };
    }
    function areacopy() {
      if (arguments.length == 1) {
        var x = arguments[0][0],
          y = arguments[0][1],
          w = arguments[0][2],
          h = arguments[0][3];
      } else {
        var x = arguments[0],
          y = arguments[1],
          w = arguments[2],
          h = arguments[3];
      }
      //obj의 영역뿐아니라, obj가 갈 곳의 영역도 copy->초기화를 위해
      var arr = new Array();
      for (var i = y, lng = y + h; i < lng; i++) {
        if (i >= 367) break;
        arr[i - y] = new Array();
        for (var k = x, kng = x + w; k < kng; k++) {
          if (k >= 330) break;
          arr[i - y][k - x] = ad[i][k].join(",");
        }
      }
      return arr;
    }
    function areablank(fr, to) {
      for (var i = to; i < to + 50; i++) {
        for (var k = fr; k < fr + 50; k++) {
          ad.pixel(k, i, 255, 255, 255, 255);
        }
      }
    }
    function areapaste(arr, x, y, w, h) {
      for (var i = y; i < y + h; i++) {
        if (i >= 367) break;
        for (var k = x; k < x + w; k++) {
          if (k >= 330) break;
          ad[i][k] = arr[i - y][k - x].split(",");
        }
      }
    }
  };
  cp.operating1 = function (weight, fnc) {
    this.canvas.parentNode.style.overflow = "hidden";
    var width = weight;
    var imgdata = this.getImageData(0, 0, 330, 367),
      ctx = this;
    var objs = new Array();
    for (var i = 0; i < 376 / width; i++) {
      for (var k = 0; k < 330 / width; k++) {
        var x = width * k,
          y = width * i,
          a = cf.mkCanvas(
            cf.mkAbsoluteDiv(x, y, width, width, this.canvas.parentNode)
          ),
          b = this.getImageData(x, y, width, width);
        objs.push(new obj(a, b));
      }
    }
    this.clr();
    objs.trav(function (d, n) {
      objs[n].go();
    });

    function obj(ctx, id) {
      ctx.putImageData(id, 0, 0);
      ctx.rotate((20 * Math.PI) / 180);
      this.div = ctx.canvas.parentNode;
      this.xywh = cf.getxywhfromdiv(this.div);
      this.go = function () {
        var cnt = 0,
          v = 0,
          l = this,
          g = cf.getRandom(1, 6),
          tmr = setInterval(function () {
            if (l.xywh.y + v < 400) {
              l.div.style.top = l.xywh.y + v + "px";
            } else {
              l.div.style.top = l.xywh.y + v + "px";
              clearInterval(tmr);
              stp++;
              chkstop();
            }
            l.div.style.zIndex = 1;
            v = v + (cnt / 2) * g;
            cnt++;
          }, 20);
      };
    }

    var stp = 0;
    function chkstop() {
      var a = 376 / width;
      if (a > parseInt(a)) a = parseInt(a) + 1;
      else a = parseInt(a);
      var b = 330 / width;
      if (b > parseInt(b)) b = parseInt(b) + 1;
      else b = parseInt(b);

      if (stp == a * b) {
        objs.trav(function (d, n) {
          cf.killTag(d.div);
        });
        objs = undefined;
        setTimeout(function () {
          ctx.putImageData(imgdata, 0, 0);
          fnc();
        }, 1000);
      }
    }
  };
  cp.rot = function () {
    var cnt = 0,
      l = this,
      id = this.getImageData(0, 0, 330, 367);
    var tmr = setInterval(function () {
      l.clr();
      l.rotate((cnt * Math.PI) / 180);
      l.putImageData(id, 0, 0);
      cnt++;
    }, 20);
  };
  cp.trimg = function (str) {
    var img = new Image(),
      l = this;
    img.src = str;
    img.onload = function () {
      l.drawImage(img, 0, 0);
      (imgdata = l.getImageData(0, 0, 330, 367)),
        (ado = l.toXY(imgdata, 330, 367));
    };
    function trans(x, y, agl) {
      var gx = 165,
        gy = 183;
      var ox = x,
        oy = y;
      x = cos(agl) * (ox - gx) - sin(agl) * (oy - gy) + gx;
      y = sin(agl) * (ox - gx) + cos(agl) * (oy - gy) + gy;
      (x = pi(x)), (y = pi(y));
      return { x: x, y: y };
    }
    function pi(num) {
      return parseInt(num);
    }
    function br(num) {
      var a = parseInt(num / 4),
        w = l.canvas.width;
      var x = a % w,
        y = parseInt(a / w),
        th = num % 4;
      return { x: x, y: y, th: th };
    }
    function cn(br) {
      var w = l.canvas.width,
        rslt = 4 * (br.x + br.y * w) + br.th;
      return rslt;
    }
    function cnbr(num) {
      return cn(br(num));
    }
    function ope(a, c, w, h, agl) {
      var arr = new Array();
      var xn = new Array();
      for (var i = 0; i < h; i++) {
        for (var k = 0; k < w; k++) {
          //step 1: 원래 위치에 있는 rgba정보 취득
          var da = a.getClr(k, i, w);
          //step 2: 그 정보가 어디로 가야하는지 캐치(displacement 시행)
          var tp = trans(k, i, agl);
          arr.push(tp);

          if (tp.y >= 0 && tp.y < h) {
            if (tp.x >= 0 && tp.x < w) {
              //step 3: receiver의 그 위치에 rgba정보 입력
              c.setClr(tp.x, tp.y, w, da);

              if (xn[tp.y] == undefined) {
                xn[tp.y] = [tp.x, tp.x];
              } else {
                if (tp.x > xn[tp.y][1]) {
                  xn[tp.y][1] = tp.x;
                } else if (tp.x < xn[tp.y][0]) {
                  xn[tp.y][0] = tp.x;
                }
              }
            }
          }
        }
      }

      var cords = new Array(),
        startNum;
      xn.trav(function (d, n) {
        if (d != undefined) {
          if (startNum == undefined) startNum = n;
          for (var i = d[0]; i <= d[1]; i++) {
            var num = c.getNum(i, n, 0, w);
            if (c.data[num + 3] == 0) {
              cords.push([num, i, n]);
            }
          }
        } else {
          if (n >= startNum) {
            for (var i = 0; i <= w - 1; i++) {
              var num = c.getNum(i, n, 0, w);
              if (c.data[num + 3] == 0) {
                cords.push([num, i, n]);
              }
            }
          }
        }
      });
      c.clrCompensate(cords, w);
    }
  };
  function gethypotenuse(bottom, vertical) {
    var a;
    a = bottom * bottom + vertical * vertical;
    return Math.sqrt(a);
  }
  function tan(dg) {
    return roundXL(Math.tan(dg * (Math.PI / 180)), 10);
  }
  function sin(dg) {
    return roundXL(Math.sin(dg * (Math.PI / 180)), 10);
  }
  function cos(dg) {
    return roundXL(Math.cos(dg * (Math.PI / 180)), 10);
  }
  function pt(str) {
    var a = str.split(".")[1];
    if (a == undefined) {
      if (pnt > 0) str += ".";
      a = "";
    }
    var b = pnt - a.length;
    for (var i = 0; i < b; i++) {
      str += "0";
    }
    return str;
  }
  function datapositionY(chartHeight, max, min, data) {
    var result = chartHeight * (data - min);
    result = result / (max - min);
    result = chartHeight - result;
    return result;
  }
  function getdatabyposition(chartHeight, datapositionY, max, min) {
    var result = chartHeight - datapositionY;
    result = result * (max - min);
    result = result / chartHeight;
    result = result + min;

    return result;
  }
  function commify(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;
    n += "";
    while (reg.test(n)) n = n.replace(reg, "$1" + "," + "$2");

    return n;
  }
  function roundXL(n, digits) {
    if (n == "void") return false;
    if (digits >= 0) return parseFloat(n.toFixed(digits)); // 소수부 반올림
    digits = Math.pow(10, digits); // 정수부 반올림
    var t = Math.round(n * digits) / digits;
    return parseFloat(t.toFixed(0));
  }
  function rommify(n, num) {
    n = n * 1;
    return commify(roundXL(n, num));
  }
  function datify(n, opt) {
    n += "";
    var len = n.length;
    var y = "";
    var m = "";
    var d = "";
    if (len == 8) {
      if (opt) y = n.substring(0, 4);
      else y = n.substring(2, 4);
      m = n.substring(4, 6);
      d = n.substring(6);
    } else if (len == 6) {
      y = n.substring(0, 2);
      m = n.substring(2, 4);
      d = n.substring(4);
    }
    return y + "." + m + "." + d;
  }
  function timify(n) {
    n += "";
    var len = n.length;
    var y = "";
    var m = "";
    var d = "";
    if (len == 8) {
      y = n.substring(0, 4);
      m = n.substring(4, 6);
      d = n.substring(6);
    } else if (len == 6) {
      y = n.substring(0, 2);
      m = n.substring(2, 4);
      d = n.substring(4);
    }
    return y + ":" + m + ":" + d;
  }

  function increase_brightness(rgbcode, percent) {
    var r = parseInt(rgbcode.slice(1, 3), 16),
      g = parseInt(rgbcode.slice(3, 5), 16),
      b = parseInt(rgbcode.slice(5, 7), 16),
      HSL = rgbToHsl(r, g, b),
      newBrightness = HSL[2] + HSL[2] * (percent / 100),
      RGB;

    RGB = hslToRgb(HSL[0], HSL[1], newBrightness);
    rgbcode =
      "#" +
      convertToTwoDigitHexCodeFromDecimal(RGB[0]) +
      convertToTwoDigitHexCodeFromDecimal(RGB[1]) +
      convertToTwoDigitHexCodeFromDecimal(RGB[2]);

    return rgbcode;
  }
  function convertToTwoDigitHexCodeFromDecimal(decimal) {
    var code = Math.round(decimal).toString(16);

    code.length > 1 || (code = "0" + code);
    return code;
  }
  function rgbToHsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }
  function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  }
  function getRandom(start, end) {
    var amount = end - start,
      rslt = Math.floor(Math.random() * (amount + 1) + start);
    return rslt;
  }

  window.log = console.log;
  window.dir = console.dir;
  window.doc = document;
  window.trav = function (obj, fnc) {
    fnc(obj);
    for (var i = 0; i < obj.childNodes.length; i++) {
      trav(obj.childNodes[i], fnc);
    }
  };
  window.j = jaehyun;
  //2015.04.08 added by Jae Hyun Lee
  window.around = function (lmt, fnc) {
    for (var i = 0; i < lmt; i++) {
      var a = fnc(i);
      if (a) break;
    }
  };
  //////////////////////////////////////////
  window.ielog = function () {
    if (!document.getElementById("ielog")) {
      var a = document.createElement("div");
      a.style.position = "fixed";
      a.style.top = 0 + "px";
      a.style.left = 0 + "px";
      a.style.width = 100 + "px";
      a.style.height = 100 + "px";
      a.style.backgroundColor = "red";
      a.id = "ielog";
      document.body.appendChild(a);
    } else {
      var a = document.getElementById("ielog");
    }
    var str = "";
    for (var i = 0, lng = arguments.length; i < lng; i++) {
      str += arguments[i] + " ";
    }
    a.innerHTML = str;
  };
})(window);
function WS(addr, callback) {
  var addr = "ws://www.jaehyunlee.co.kr:8001",
    self = this,
    request_id = 0,
    wsCallbacks = {}, //해당 리퀘스트의 콜백함수를 저장한다.
    wsBroadcast = {
      report: wsReport,
      focused: wsFocused,
      notify: function (obj) {
        log(obj.message);
      },
      setGame: wsSetGame,
      gameStatusChanged: wsGameStatusChanged,
      gameFinished: wsGameFinished,
      newConnection: wsNewConnection,
      newGame: wsNewGame,
      gameDetail: wsGameDetail,
    },
    wsRequest = {
      getGameNumber: wsGetGameNumber,
      getClientInfo: wsGetClientInfo,
      letClientToGame: wsLetClientToGame,
      letClientOffGame: wsLetClientOffGame,
    },
    ws = new WebSocket(addr);

  ws.onopen = onopen;
  ws.onmessage = onmessage;
  ws.onclose = onclose;

  this.call = function (obj, fnc) {
    obj.__id = request_id++;
    wsCallbacks[obj.__id] = fnc;
    var str = JSON.stringify(obj);
    ws.send(str);
  };
  this.opened = function () {};
  this.closed = function () {};

  if (callback) this.opened = callback;

  function onopen() {
    log("socket server opened!!");
    self.opened();
  }
  function onmessage(res) {
    var obj = JSON.parse(res.data);
    if (obj.__type == "broadcast") {
      wsBroadcast[obj.__command](obj);
    } else if (obj.__type == "serverRequest") {
      wsRequest[obj.__server_command](obj);
    } else {
      wsCallbacks[obj.__id](obj);
    }
  }
  function onclose() {
    log("socket server closed!!");
  }

  function wsGetGameNumber(obj) {
    obj.response = {
      gameNumber: sessionStorage.getItem("game_number"),
    };
    send(obj);
  }
  function wsGetClientInfo(obj) {
    obj.response = {
      gameNumber: sessionStorage.getItem("game_number"),
      sessionNumber: sessionStorage.getItem("session_number"),
      currentPage: location.href,
    };
    send(obj);
  }
  function wsLetClientToGame(obj) {
    log("letClientToGame");
    var mode = obj.userInfo.gameMode;
    location.href = mode + ".html";
  }
  function wsLetClientOffGame(obj) {
    log("letClientOffGame");
    alert("게임이 취소되었습니다.");
    location.href = "mode.html";
  }

  function wsGameDetail(obj) {
    if (elGameNumber.innerHTML == obj.response.gameNumber)
      mkGameDetail(obj.response);
    if (!obj.response.onGame) getAllGameInfo();
  }
  function wsNewGame(obj) {
    makeGameProcess(obj.response);
  }
  function wsNewConnection(obj) {
    mkUserStatus(obj.response);
  }
  function wsGameFinished(obj) {
    gameFinished(obj);
  }
  function wsGameStatusChanged(obj) {
    gameDecision(obj);
  }
  function wsSetGame(obj) {
    sessionStorage.setItem("game_number", obj.game_number);
    location.href = obj.game_type + ".html";
  }
  function wsReport(obj) {
    var sn = sessionStorage.getItem("session_number"),
      param = {
        __command: "report",
        __session_number: sn,
      };
    ws.call(param);
  }
  function wsFocused(obj) {
    alert(11);
    var sn = sessionStorage.getItem("session_number"),
      param = {
        __command: "focused",
        __session_number: sn,
      };
    ws.call(param);
  }
  function wsSend(obj) {
    obj.__command = "clientResponse";
    ws.call(obj, function (data) {
      //dir(data);
    });
  }
  function send(obj) {
    obj.__command = "clientResponse";
    self.call(obj, function (resp) {
      //dir(resp);
    });
  }
}

function gr(num) {
  return getRandom(0, num);
}
function getRandom(start, end) {
  var amount = end - start,
    rslt = Math.random() * (amount + 1) + start;
  return parseInt(rslt);
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
function jFile(addr, param, callback) {
  var a = new ajaxcallforgeneral();
  a.file(addr, param);
  a.ajaxcallback = callback;
}
function post(addr, param, header, callback, error) {
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
  if (error) a.ajaxerror = error;
}
function MAPPER(a, b, x) {
  var A = a,
    B = b,
    X = x,
    rX = {},
    xleft = [],
    xright = [];

  procX();

  this.getA = function () {
    return copy(A);
  };
  this.getB = function () {
    return copy(B);
  };
  this.setObject = function (obj) {
    for (var el in obj) {
      this.setValue(el, obj[el]);
    }
  };
  this.setValue = function (str, val) {
    //step1: find X
    var lr;
    xleft.trav(function (d, i) {
      if (d == str) {
        lr = true;
        return true;
      }
    });
    xright.trav(function (d, i) {
      if (d == str) {
        lr = false;
        return true;
      }
    });
    if (lr == undefined) {
      if (A[str] != undefined) A[str] = val;

      if (B[str] != undefined) B[str] = val;
    } else {
      var ttr = lr ? X[str] : rX[str];
      if (A[str] != undefined) A[str] = val;
      if (A[ttr] != undefined) A[ttr] = val;
      if (B[str] != undefined) B[str] = val;
      if (B[ttr] != undefined) B[ttr] = val;
    }
  };
  function copy(obj) {
    var ob = {};
    for (var el in obj) {
      ob[el] = obj[el];
    }
    return obj;
  }
  function procX() {
    for (var el in X) {
      xleft.push(el);
      xright.push(X[el]);
      rX[X[el]] = el;
    }
  }
}
function ASYNCmANAGER() {
  var Q = [],
    ing = false,
    active = false;
  this.get = function (url, callback) {
    Q.push({ method: "get", url: url, callback: callback });
    if (!active) activate(); //통신이 잠자고 있으면 깨운다.
  };
  this.post = function (url, param, callback) {
    Q.push({ method: "post", url: url, param: param, callback: callback });
    if (!active) activate(); //통신이 잠자고 있으면 깨운다.
  };
  this.file = function (url, param, callback) {
    Q.push({
      method: "file",
      url: url,
      param: mkFileParam(param),
      callback: callback,
    });
    if (!active) activate(); //통신이 잠자고 있으면 깨운다.
  };
  function activate() {
    active = true; //active 모드를 활성화하면, 큐를 순회하면서 통신을 하고 있다는 뜻이다.
    var t = setInterval(function () {
      if (ing) return;
      if (Q.length > 0) {
        var tr = Q.shift();
        ing = true;
        if (tr.method == "post")
          post(tr.url, tr.param, function (res) {
            ing = false;
            tr.callback(res);
          });
        else if (tr.method == "get")
          get(tr.url, function (res) {
            ing = false;
            tr.callback(res);
          });
        else if (tr.method == "file")
          jFile(tr.url, tr.param, function (res) {
            ing = false;
            tr.callback(res);
          });
      } else {
        clearInterval(t);
        active = false; //큐에 통신할 것이 남아있지 않으면 인터벌을 중지한다.
      }
    }, 10);
  }

  function mkFileParam(obj) {
    var fd = new FormData();
    trav(obj, function (el, val, i) {
      fd.append(el, val);
    });
    return fd;
  }
}

var layerPopPriority = 1001,
  layerPopStack = 0;

function layerpop(opt) {
  if (!opt) {
    if (layerPopStack > 0) layerPopPriority--;
  } else {
    if (layerPopStack > 0) layerPopPriority++;
  }

  var div = cf.mkTag("div", document.body);
  div.style.cssText =
    "position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:" +
    layerPopPriority +
    ";";

  var cells = [[""]].mkTable({ p: div });
  cells[0][0].parentNode.parentNode.style.cssText = "width:100%;height:100%;";

  var con = cf.mkTag("div", cells[0][0]);
  con.style.cssText = "width:70%;margin:auto;background-color:white;";

  layerPopStack++;

  function close() {
    cf.killTag(div);
    layerPopStack--;
    if (layerPopStack == 0) layerPopPriority = 1001;
  }

  return { back: div, content: con, close: close };
}
function layerAlert(str, fnc, opt) {
  if (!str) str = "알림";
  var pop = layerpop(opt),
    header = cf.mkTag("div", pop.content),
    body = cf.mkTag("div", pop.content),
    foot = cf.mkTag("div", pop.content),
    hdrCells = [[str]].mkTable({ p: header }),
    bodyCells = [[""]].mkTable({ p: body }),
    btnOk = cf.mkTag("button", foot);
  header.style.cssText = "height:40px;";

  hdrCells[0][0].parentNode.parentNode.style.cssText =
    "height:100%;width:100%;";
  hdrCells[0][0].style.cssText =
    "text-align:center;background-color:purple;color:white;font-weight:bold;";

  bodyCells[0][0].parentNode.parentNode.style.cssText =
    "height:100%;width:100%;";
  bodyCells[0][0].style.cssText =
    "padding:10px;text-align:center;background-color:white;font-weight:bold;";

  foot.style.cssText = "text-align:center;padding:10px;";
  btnOk.style.cssText = "font-size:15px;";

  btnOk.innerHTML = "확인";

  btnOk.onclick = function () {
    pop.close();
    if (fnc) fnc(str);
  };

  return bodyCells[0][0];
}
function layerPrompt(str, round, def, fnc) {
  var pop = layerpop(),
    header = cf.mkTag("div", pop.content),
    body = cf.mkTag("div", pop.content),
    foot = cf.mkTag("div", pop.content),
    hdrCells = [[round + "라운드"]].mkTable({ p: header }),
    bodyCells = [["<div>" + str + "</div>"], [""]].mkTable({ p: body }),
    btnOk = cf.mkTag("button", foot);

  header.style.cssText = "height:40px;";

  hdrCells[0][0].parentNode.parentNode.style.cssText =
    "height:100%;width:100%;";
  hdrCells[0][0].style.cssText =
    "text-align:center;background-color:purple;color:white;font-weight:bold;";

  bodyCells[0][0].parentNode.parentNode.style.cssText =
    "height:100%;width:100%;";
  bodyCells[0][0].style.cssText =
    "padding:10px;text-align:center;background-color:white;font-weight:bold;";

  bodyCells[1][0].style.cssText =
    "padding:10px;text-align:center;background-color:white;font-weight:bold;";

  var ipt = cf.mkTag("input", bodyCells[1][0]);
  ipt.style.cssText = "text-align:center;font-size:25px;width:100%;";
  ipt.value = def;
  ipt.select();

  foot.style.cssText = "text-align:center;padding:10px;";
  btnOk.style.cssText = "font-size:15px;";

  btnOk.innerHTML = "보내기";

  btnOk.onclick = function () {
    pop.close();
    if (fnc) fnc(ipt.value);
  };
}
function getGameDetail(ob) {
  var num = ob.gameNumber,
    story = ob.history,
    res = [
      [
        "라운드",
        "투자액",
        "전달액",
        "분배액",
        "투자자<br>배당액(율)",
        "투자자<br>이익액(율)",
        "분배자<br>이익액(율)",
        "투자자<br>잔고",
        "분배자<br>잔고",
      ],
    ];

  var sumInv = 0,
    sumSaveInv = 0,
    sumDiv = 0,
    sumProfitRateInv = 0,
    sumProfitRateDiv = 0;

  story.trav(function (ar, i) {
    ar[0] *= 1;
    ar[1] *= 1;

    sumInv += ar[0] * 1;
    sumSaveInv += conf.invest_limit * 1 - ar[0];
    sumDiv += ar[1] * 1;

    var saveInv = conf.invest_limit * 1 - ar[0],
      balanceInv = (i + 1) * conf.invest_limit - sumInv + sumDiv,
      balanceDiv = sumInv * 3 - sumDiv,
      profitRateInv = ar[1] / ar[0] - 1,
      profitRateSaveInv = (ar[1] + saveInv) / ar[0] - 1,
      profitRateDiv = (ar[0] * 3 - ar[1]) / ar[0];

    sumProfitRateInv += ar[1] - ar[0];
    sumProfitRateDiv += ar[0] * 3 - ar[1];

    res.push([
      i + 1, //라운드
      ar[0], //투자액
      ar[0] * 3, //전달액
      ar[1], //분배액
      ar[1] - ar[0] + "(" + cf.rommify(profitRateInv, 2) + ")", //투자자<br>이익액(율)
      ar[1] - ar[0] + saveInv + "(" + cf.rommify(profitRateSaveInv, 2) + ")", //투자자<br>이익액(율)
      ar[0] * 3 - ar[1] + "(" + cf.rommify(profitRateDiv, 2) + ")", //분배자<br>이익액(율)
      balanceInv, //투자자<br>잔고
      balanceDiv, //분배자<br>잔고
    ]);
  });
  //합계 삽입
  res.push([
    "합계", //라운드
    sumInv, //투자액
    sumInv * 3, //전달액
    sumDiv, //분배액
    sumProfitRateInv + "(" + cf.rommify(sumDiv / sumInv - 1, 2) + ")", //투자자<br>이익액(율)
    sumProfitRateInv +
      sumSaveInv +
      "(" +
      cf.rommify((sumDiv + sumSaveInv) / sumInv - 1, 2) +
      ")", //투자자<br>이익액(율)
    sumProfitRateDiv +
      "(" +
      cf.rommify((sumInv * 3 - sumDiv) / sumInv, 2) +
      ")", //분배자<br>이익액(율)
    "-", //투자자<br>잔고
    "-", //분배자<br>잔고
  ]);
  return res;
}
function mkGameDetail(ob, p) {
  if (p) var elGameDetail = p;
  elGameDetail.innerHTML = "";
  var num = ob.gameNumber,
    story = ob.history,
    res = [
      [
        "라운드",
        "투자액",
        "전달액",
        "분배액",
        "투자자<br>배당액(율)",
        "투자자<br>이익액(율)",
        "분배자<br>이익액(율)",
        "투자자<br>잔고",
        "분배자<br>잔고",
      ],
    ];

  if (window["elGameNumber"]) elGameNumber.innerHTML = ob.gameNumber;

  var sumInv = 0,
    sumSaveInv = 0,
    sumDiv = 0,
    sumProfitRateInv = 0,
    sumProfitRateDiv = 0;

  story.trav(function (ar, i) {
    ar[0] *= 1;
    ar[1] *= 1;

    sumInv += ar[0] * 1;
    sumSaveInv += conf.invest_limit * 1 - ar[0];
    sumDiv += ar[1] * 1;

    var saveInv = conf.invest_limit * 1 - ar[0],
      balanceInv = (i + 1) * conf.invest_limit - sumInv + sumDiv,
      balanceDiv = sumInv * 3 - sumDiv,
      profitRateInv = ar[1] / ar[0] - 1,
      profitRateSaveInv = (ar[1] + saveInv) / ar[0] - 1,
      profitRateDiv = (ar[0] * 3 - ar[1]) / ar[0];

    sumProfitRateInv += ar[1] - ar[0];
    sumProfitRateDiv += ar[0] * 3 - ar[1];

    res.push([
      i + 1, //라운드
      ar[0], //투자액
      ar[0] * 3, //전달액
      ar[1], //분배액
      ar[1] - ar[0] + "(" + cf.rommify(profitRateInv, 2) + ")", //투자자<br>이익액(율)
      ar[1] - ar[0] + saveInv + "(" + cf.rommify(profitRateSaveInv, 2) + ")", //투자자<br>이익액(율)
      ar[0] * 3 - ar[1] + "(" + cf.rommify(profitRateDiv, 2) + ")", //분배자<br>이익액(율)
      balanceInv, //투자자<br>잔고
      balanceDiv, //분배자<br>잔고
    ]);
  });
  //합계 삽입
  res.push([
    "합계", //라운드
    sumInv, //투자액
    sumInv * 3, //전달액
    sumDiv, //분배액
    sumProfitRateInv + "(" + cf.rommify(sumDiv / sumInv - 1, 2) + ")", //투자자<br>이익액(율)
    sumProfitRateInv +
      sumSaveInv +
      "(" +
      cf.rommify((sumDiv + sumSaveInv) / sumInv - 1, 2) +
      ")", //투자자<br>이익액(율)
    sumProfitRateDiv +
      "(" +
      cf.rommify((sumInv * 3 - sumDiv) / sumInv, 2) +
      ")", //분배자<br>이익액(율)
    "-", //투자자<br>잔고
    "-", //분배자<br>잔고
  ]);

  var cells = res.mkTable({
    p: elGameDetail,
    r: [],
    c: [],
    mode: false,
  });
  cells.dtrav(function (r, c, i, j) {
    if (i == 0)
      c.css(
        "background-color:#aaa;font-size:13px;padding:5px;font-weight:bold;"
      );
    else c.css("border-bottom:1px solid #ddd;font-size:13px;");
    c.css("padding:5px;");
    if (i != 0 && (j == 1 || j == 3)) c.css("font-weight:bold");
    if (i != 0 && (j == 4 || j == 5 || j == 6)) c.css("color:red;");
    if (i != 0 && (j == 7 || j == 8)) c.css("color:blue;");
    if (i == cells.length - 1)
      c.css(
        "background-color:#aaa;font-size:13px;padding:5px;font-weight:bold;"
      );
    if (i == cells.length - 2 && j > 6)
      c.css("font-weight:bold;background-color:#aaa;");

    if (c.innerHTML == "undefined") c.innerHTML = "";
    if (c.innerHTML == "NaN") c.innerHTML = "-";
    if (c.innerHTML == "NaN(NaN)") c.innerHTML = "-";
    if (c.innerHTML == "0(NaN)") c.innerHTML = "-";
  });

  if (window["elInvestorDetail"])
    mkParticipantDetail(ob.investor_detail, ob.trustee_detail);

  function mkParticipantDetail(investor, trustee) {
    elInvestorDetail.innerHTML = "";
    elTrusteeDetail.innerHTML = "";

    var inv = cf.mkTag("div", elInvestorDetail),
      tru = cf.mkTag("div", elTrusteeDetail);

    inv.css("padding-left:50px;padding-top:10px;");
    tru.css("padding-left:50px;padding-top:10px;");

    inv.innerHTML =
      "이름: <b>" +
      investor.userName +
      "</b><br>이메일: <b>" +
      investor.userEmail +
      "</b>";
    tru.innerHTML =
      "이름: <b>" +
      trustee.userName +
      "</b><br>이메일: <b>" +
      trustee.userEmail +
      "</b>";
  }
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
String.prototype.inparen = function (opt) {
  const regex = /.+?\((.+)\)/;
  const str = this.toString();
  const result = [];
  const org = regex.exec(str)[1];
  if (opt) {
    let ar = [];
    let flg = false;
    Array.from(org).forEach((chr) => {
      if (chr == "'") {
        flg = !flg;
      } else if (chr == ",") {
        if (flg) {
          ar.push(chr);
        } else {
          result.push(ar.join(""));
          ar = [];
        }
      } else {
        ar.push(chr);
      }
    });
    if (ar.length > 0) {
      result.push(ar.join(""));
      ar = [];
    }
  } else {
    org
      .split("'")
      .join("")
      .split(",")
      .forEach((str) => {
        result.push(str.trim());
      });
  }
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
String.prototype.fillzero = function (sep) {
  const ar = this.split(sep);
  const result = [];
  ar.forEach((el) => {
    result.push(el.addzero());
  });

  return result.join("");
};
String.prototype.jp = function () {
  return JSON.parse(this);
};
String.prototype.regex = function (re) {
  return re.exec(this);
};
String.prototype.gup = function () {
  /*get url param*/
  const param = {};
  this.split("?")[1]
    .split("&")
    .forEach((str) => {
      const [key, val] = str.split("=");
      param[key] = val;
    });
  return param;
};
HTMLElement.prototype.css = function (str) {
  this.style.cssText += str;
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
  if (str) return (this.innerHTML = str);
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
