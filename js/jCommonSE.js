function ajaxcallforgeneral() {
  this.xmlHttp;
  var j = this;
  var HTTP = {};
  this.jAjax = function (address, header) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open("GET", address, true);
    if (header) {
      Object.keys(header).trav((key) => {
        var val = header[key];
        j.xmlHttp.setRequestHeader(key, val);
      });
    }
    j.xmlHttp.send(null);
  };
  this.post = function (addr, prm, header) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open("POST", addr, true);
    j.xmlHttp.onerror = function (e) {
      log("error> ", e.toString());
      if (j.ajaxerror) j.ajaxerror(e);
    };
    // header :: cors에 결정적
    // j.xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    if (header) {
      if (header["Content-Type"])
        Object.keys(header).trav((key) => {
          var val = header[key];
          j.xmlHttp.setRequestHeader(key, val);
        });
      else
        j.xmlHttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
    } else {
      j.xmlHttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    }
    try {
      j.xmlHttp.send(prm);
    } catch (e) {
      if (j.ajaxerror) {
        j.ajaxerror(j.xmlHttp.readyState, j.xmlHttp.status);
        log(e.toString());
      }
    }
  };
  this.file = function (addr, prm) {
    j.xmlHttp = new XMLHttpRequest();
    j.xmlHttp.onreadystatechange = on_ReadyStateChange;
    j.xmlHttp.open("POST", addr, true);
    j.xmlHttp.send(prm);
  };
  function on_ReadyStateChange() {
    if (j.xmlHttp.readyState == 4) {
      if (j.xmlHttp.status == 200) {
        var data = j.xmlHttp.responseText;
        j.ajaxcallback(data);
      } else if (j.xmlHttp.status == 504) {
        if (j.ajaxerror) j.ajaxerror(j.xmlHttp.readyState, j.xmlHttp.status);
      } else {
        if (j.ajaxerror) j.ajaxerror(j.xmlHttp.readyState, j.xmlHttp.status);
      }
    }
  }
}
function jCommon() {
  this.html5;
  this.tmpBrowser = navigator.appName;
  this.tmpVersion = navigator.appVersion;
  this.tmpKit;

  if (this.tmpVersion.indexOf("iPad") != -1) this.tmpKit = "iPad";
  if (this.tmpVersion.indexOf("iPhone") != -1) this.tmpKit = "iPhone";
  if (this.tmpVersion.indexOf("Android") != -1) this.tmpKit = "Android";
  if (this.tmpVersion.indexOf("Linux x86_64") != -1) this.tmpKit = "Android"; //회사 갤럭시탭

  if (this.tmpKit) {
    if (this.tmpKit != "Android") this.os = "iOS";
    else this.os = "Android";
  } else {
    this.tmpKit = "web";
  }
  if (this.tmpBrowserName == "IE") {
    this.workareawidth = document.documentElement.clientWidth;
    this.workareaheight = document.documentElement.clientHeight;
  } else {
    this.workareawidth = window.innerWidth;
    this.workareaheight = window.innerHeight;
  }

  this.ieversion;
  if (this.tmpBrowser == "Opera" || this.tmpBrowser == "Netscape") {
    if (this.tmpVersion.indexOf("Safari") != -1) {
      if (this.tmpVersion.indexOf("Chrome") != -1) {
        this.tmpBrowserName = "Chrome";
      } else {
        this.tmpBrowserName = "Safari";
      }
    } else if (this.tmpBrowser.indexOf("Opera") != -1) {
      this.tmpBrowserName = "Opera";
    } else {
      this.tmpBrowserName = "Firefox";
    }
    this.html5 = true;
  } else if (this.tmpBrowser == "Microsoft Internet Explorer") {
    if (this.tmpVersion.indexOf("MSIE 6.0") != -1) {
      this.ieversion = 6;
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 7.0") != -1) {
      this.ieversion = 7;
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 8.0") != -1) {
      this.ieversion = 8;
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 9.0") != -1) {
      this.ieversion = 9;
      this.html5 = true;
    } else if (this.tmpVersion.indexOf("MSIE 5.0") != -1) {
      this.ieversion = 5;
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 4.0") != -1) {
      this.ieversion = 4;
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 3.0") != -1) {
      this.ieversion = 3;
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 2.0") != -1) {
      this.html5 = false;
    } else if (this.tmpVersion.indexOf("MSIE 1.0") != -1) {
      this.html5 = false;
    } else {
      this.html5 = true;
    }
    this.tmpBrowserName = "IE";
  }
  if (this.tmpBrowserName == "IE") {
    this.workareawidth = document.documentElement.clientWidth;
    this.workareaheight = document.documentElement.clientHeight;
  } else {
    this.workareawidth = window.innerWidth;
    this.workareaheight = window.innerHeight;
  }

  this.imgPath = "shinhanComplex/";
  this.eventP;
  window.onorientationchange = detectIPadOrientation;
  function detectIPadOrientation() {
    if (orientation == 0) {
    } else if (orientation == 90) {
    } else if (orientation == -90) {
    } else if (orientation == 180) {
    }
  }

  this.red = "rgb(228,53,53)";
  this.blue = "rgb(49,123,203)";
  this.yellow = "rgb(240,245,33)";
  this.gray = "#f9f9f9";
  this.colorset = [this.red, this.blue, this.yellow];
  this.fontFamily = "MalgunGothic, Arial";
  this.fibonacci = [
    0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597,
    2584, 4181, 6765, 10946,
  ];
  this.lcolor = [
    this.red,
    this.blue,
    "red",
    "blue",
    "orange",
    "green",
    this.yellow,
  ];
  this.alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  this.getWorkareaSize;
  this.numPeriod;
  this.commify;
  this.datify;
  this.timify;
  this.roundXL;
  this.mkTag;
  this.mkDiv;
  this.mkTable;
  this.timeChecker;
  this.killTag;
  this.mkZero;
  this.mkSelect;
  this.mkTwoButtons;
  this.mkLabelSelect;
  this.mkGrid;
  this.datapositionY;
  this.getdatabyposition;
  this.mkPan;
  this.mkVCross;
  this.mkHCross;
  this.getmax;
  this.getMax;
  this.getArrMax;
  this.getmin;
  this.getMin;
  this.getArrMin;
  this.mkStr;
  this.mkArr;
  this.mkWebGrid;
  this.mkAbsoluteDiv;
  this.mkSerialButtons;
  this.calYear;
  this.calMonth;
  this.calDay;
  this.calDate;
  this.getQuadrant;
  this.getDelpx;
  this.mkTextboxEx;
  this.mkTextbox;
  this.mkTab;
  this.getElementInArray;
  this.delElementInArray;
  this.countClock;
  this.getArr;
  this.arrAllDoThis;
  this.goldenrate;
  this.abyb;
  this.degreetoradian;
  this.radiantodegree;
  this.gethypotenuse;
  this.sintodegree;
  this.percenttodegree;
  this.getDistance;
  this.getRandom;
  this.getClip;
  this.log;
  this.getOffsetLeft;
  this.getOffsetTop;
  this.getxywhfromdiv;
  this.rommify;
  this.delElinArr;
  this.mkCanvas;
  this.swing;
  this.sin;
  this.cos;
  this.getEventPos;
  this.bectorMove;
  this.jsonTraverse;

  this.getframe;
  this.mkMenu;
  this.mkMenuOption;
  this.mkLeftMenuOne;
  this.mkLeftMenuTwo;
  this.mkLeftMenuThree;
  this.complexchartFinalAction;

  this.initBambooScroll;
}
jCommon.prototype.abyb = function (num) {
  var root = cf.roundXL(Math.sqrt(num), 0);
  var square = root * root;
  var rest = num - square;
  var p, q;
  if (square > num) {
    p = q = root;
  } else {
    if (rest < root) {
      p = root;
      if (rest == 0) q = p;
      else q = p + 1;
    } else if (rest == root) {
      p = root + 1;
      q = p - 1;
    }
  }
  return { width: p, height: q };
};
jCommon.prototype.addEvent = function (node, event, fnc) {
  if (node.addEventListener) node.addEventListener(event, fnc, false);
  else if (node.attachEvent) node.attachEvent("on" + event, fnc);
  else node["on" + event] = fnc;
};
jCommon.prototype.addzero = function (num) {
  var result = num;
  if (num < 10) result = "0" + num;
  return result;
};
jCommon.prototype.arc = function () {
  var ar = arguments;
  ar[0].beginPath();
  ar[0].arc(ar[1].x, ar[1].y, 50 * ar[1].r, 0, Math.PI * 2, false);
  ar[0].fillStyle = "white";
  ar[0].fill();
  ar[0].stroke();
};
jCommon.prototype.arrAllDoThis = function (arr, fnc) {
  for (var i = 0, lng = arr.length; i < lng; i++) {
    fnc(i);
  }
};
jCommon.prototype.arToJson = function (ar) {
  var arr = new Array();
  ar.trav(function (d, i) {
    var obj = {
      key: d[0] * 1,
      par: d[1] * 1,
      name: d[2],
      con: d[3],
    };
    arr.push(obj);
  });
  return arr;
};
jCommon.prototype.arToJson = function (ar) {
  //2015.02.04. by Jae Hyun Lee

  var arr = new Array();
  ar.trav(function (d, i) {
    var obj = {
      key: d[0] * 1,
      par: d[1] * 1,
      name: d[2],
      con: d[3],
    };
    arr.push(obj);
  });
  return arr;
};
jCommon.prototype.barEvent = function (event) {
  if (event.preventDefault) event.preventDefault();
  else event.returnValue = false;
};
jCommon.prototype.bectorMove = function (div, angle, distance, v, fnc) {
  var cnt = 0;
  var lmtCnt = Math.abs((2 * distance) / v);
  var px = 0;
  var dx;
  var oxy = cf.getxywhfromdiv(div);
  var tmr = setInterval(function () {
    cnt == 0 ? (dx = v) : (dx = -(v / lmtCnt) * cnt + v);
    px += dx;
    if (px > distance) {
      dx = 0;
      clearInterval(tmr);
      div.style.left = oxy.x + cf.cos(angle) * distance + "px";
      div.style.top = oxy.y + cf.sin(angle) * distance + "px";
      if (fnc) fnc();
    }
    dmove(div, angle, dx);
    cnt++;
  }, 20);

  function dmove(dv, agl, d) {
    //현재위치에서 angle방향으로 d만큼 움직이는 함수
    var dx = cf.cos(agl) * d;
    var dy = cf.sin(agl) * d;

    var xy = cf.getxywhfromdiv(dv);
    dv.style.left = xy.x + dx + "px";
    dv.style.top = xy.y + dy + "px";
  }
};
jCommon.prototype.bmTo = function (div, tx, ty, v, fnc) {
  var cnt = 0;
  var px = 0;
  var dx;
  var oxy = cf.getxywhfromdiv(div);
  var distance = this.gethypotenuse(tx - oxy.x, ty - oxy.y);
  var angle = this.sintodegree(tx - oxy.x, ty - oxy.y);
  var lmtCnt = Math.abs((2 * distance) / v);
  var tmr = setInterval(function () {
    cnt == 0 ? (dx = v) : (dx = -(v / lmtCnt) * cnt + v);
    px += dx;
    if (px > distance) {
      dx = 0;
      clearInterval(tmr);
      div.style.left = tx + "px";
      div.style.top = ty + "px";
      if (fnc) fnc();
    }
    dmove(div, angle, dx);
    cnt++;
  }, 20);

  function dmove(dv, agl, d) {
    var dx = cf.cos(agl) * d;
    var dy = cf.sin(agl) * d;
    var xy = cf.getxywhfromdiv(dv);
    dv.style.left = xy.x + dx + "px";
    dv.style.top = xy.y + dy + "px";
  }
};
jCommon.prototype.calDate = function (str, opt, int) {
  var sl = str.length;
  var type;
  var y, m, d;
  var tmpDate;

  switch (sl) {
    case 10:
      type = false;
      break;
    case 8:
      type = true;
      break;
  }

  tmpDate = strBreakingIntoNumber(str);
  y = tmpDate.y;
  m = tmpDate.m;
  d = tmpDate.d;

  switch (opt) {
    case "Y":
      y = this.calYear(y, int);
      m = m - 1;
      break;
    case "M":
      var t = this.calMonth(y, m - 1, int);
      y = this.calYear(y, t.b);
      m = t.a;
      break;
    case "D":
      var t = this.calDay(y, m - 1, d, int);
      var s = this.calMonth(y, m - 1, t.b);
      var y = this.calYear(y, s.b);
      var m = s.a;
      var d = t.a;
      break;
  }

  var result = "";
  if (type) {
    result = y + "" + addZero(m + 1) + "" + addZero(d);
  } else {
    result = y + "-" + addZero(m + 1) + "-" + addZero(d);
  }

  return { a: result, y: y, m: m, d: d };

  function strBreakingIntoNumber(str) {
    var y, m, d;
    if (type) {
      y = str.substring(0, 4) * 1;
      m = str.substring(4, 6) * 1;
      d = str.substring(6) * 1;
    } else {
      y = str.substring(0, 4) * 1;
      m = str.substring(5, 7) * 1;
      d = str.substring(8) * 1;
    }
    return { y: y, m: m, d: d };
  }
  function addZero(num) {
    var result = num;
    if (num < 10) result = "0" + num;

    return result;
  }
};
jCommon.prototype.calDay = function (year, month, day, int) {
  var days;
  var monthIncrease = 0;
  var a = Math.abs(int);
  var realday;
  var tmpyear = year;
  var tmpmonth = month;

  if (int < 0) {
    if (a < day) {
      realday = day + int;
    } else {
      a -= day;
      monthIncrease--;
      while (true) {
        var tmon = this.calMonth(tmpyear, tmpmonth, -1);
        tmpyear -= tmon.b;
        tmpmonth = tmon.a;
        days = getdaysofthemonth(tmpyear, tmpmonth);
        if (a >= days) {
          a -= days;
          monthIncrease--;
        } else {
          realday = days - a;
          break;
        }
      }
    }
  } else {
    days = getdaysofthemonth(year, month);
    realday = day + a;
    if (realday > days) {
      while (true) {
        monthIncrease++;
        var tmon = this.calMonth(tmpyear, tmpmonth, 1);
        tmpyear += tmon.b;
        tmpmonth = tmon.a;
        realday -= days;
        days = getdaysofthemonth(tmpyear, tmpmonth);
        if (realday <= days) {
          break;
        }
      }
    }
  }
  return { a: realday, b: monthIncrease };

  function getdaysofthemonth(year, month) {
    var count = 1;
    var d = new Date();
    d.setFullYear(year);
    d.setMonth(month);
    d.setDate(count);
    while (d.getDate(count) * 1 == count) {
      count++;
      d.setDate(count);
    }
    return count - 1;
  }
};
jCommon.prototype.calMonth = function (year, month, int) {
  var tmpmonth = month + int;
  var yearIncrease = 0;
  var realmonth = tmpmonth;

  if (tmpmonth > 11) {
    realmonth = tmpmonth % 12;
    yearIncrease = parseInt(tmpmonth / 12);
  } else if (tmpmonth < 0) {
    var tmp = Math.abs(tmpmonth);
    yearIncrease--;
    while (true) {
      if (tmp > 12) {
        tmp -= 12;
        realmonth = 12 - tmp;
        yearIncrease--;
      } else {
        realmonth = 12 - tmp;
        break;
      }
    }
  } else if (tmpmonth == 0) {
    realmonth == 0;
  }

  var year = this.calYear(year, yearIncrease);

  return { a: realmonth, b: yearIncrease, c: year };
};
jCommon.prototype.calYear = function (year, int) {
  return year + int;
};
jCommon.prototype.chgImg = function (el, str) {
  //2013.8.9
  var url = el.style.background;
  var a = url.split("("),
    b = a[1].split(")"),
    c = b[0];
  el.style.background = a[0] + "(" + str + ")" + b[1];
};
jCommon.prototype.clact = function (ctx, fnc) {
  var l = this;
  this.tmr(function (n, t) {
    l.ctxclr(ctx);
    fnc(n, t);
  });
};
jCommon.prototype.clearTag = function (id) {
  if (typeof id == "string") {
    if (document.getElementById(id)) {
      var doc = document.getElementById(id);
      doc.innerHTML = "";
    }
  } else {
    if (id) {
      id.innerHTML = "";
    }
  }
};
jCommon.prototype.commify = function (n) {
  var reg = /(^[+-]?\d+)(\d{3})/;
  n += "";
  while (reg.test(n)) n = n.replace(reg, "$1" + "," + "$2");

  return n;
};
jCommon.prototype.cord = function (a, b, c) {
  this.x = a;
  this.y = b;
  this.z = c == undefined ? 0 : c;
};
jCommon.prototype.cos = function (dg) {
  return this.roundXL(Math.cos(dg * (Math.PI / 180)), 10);
};
jCommon.prototype.countClock = function (limit, number) {
  var a = number % limit;
  return a;
};
jCommon.prototype.ctxclr = function (ctx) {
  ctx.canvas.width = ctx.canvas.width;
};
jCommon.prototype.ctxtest = function () {
  //2013.8.9
  var a = arguments[0];
  a.moveTo(0, 0);
  a.lineTo(100, 100);
  a.stroke();
};
jCommon.prototype.cube = function (ctx, pic1, pic2, z, v, fnc) {
  //2013.8.9
  var cf = this,
    num = 0,
    lng = pic1.width,
    l = Math.sqrt(((lng / 2) * lng) / 2 + ((lng / 2) * lng) / 2),
    Gx = pic1.width / 2,
    Gy = pic1.height / 2,
    Gz = z;

  var tmr = setInterval(function () {
    ctx.canvas.width = ctx.canvas.width;

    var x = lng / 2 + cf.sin(num - 45) * l,
      z = lng / 2 + cf.cos(num - 45) * l;
    var x1 = lng / 2 + cf.sin(num + 45) * l,
      z1 = lng / 2 + cf.cos(num + 45) * l;

    var x2 = lng / 2 + cf.sin(num + 225) * l,
      z2 = lng / 2 + cf.cos(num + 225) * l;
    var x3 = lng / 2 + cf.sin(num + 135) * l,
      z3 = lng / 2 + cf.cos(num + 135) * l;

    var w = x1 - x;
    var p1 = cf.pos(Gx, Gy, Gz, x, 0, z),
      p2 = cf.pos(Gx, Gy, Gz, x2, 0, z2);
    cf.disPic(ctx, pic1, p1.x, p1.y, p2.x, p2.y);
    var w = x2 - x;
    var p1 = cf.pos(Gx, Gy, Gz, x2, 0, z2),
      p2 = cf.pos(Gx, Gy, Gz, x3, 0, z3);
    cf.disPic(ctx, pic2, p1.x, p1.y, p2.x, p2.y);

    num -= v;
    if (num < -90) {
      clearInterval(tmr);
      if (fnc) fnc();
    }
  }, 20);
};
jCommon.prototype.cubeEx = function (ctx, pic1, pic2, z, v, fnc) {
  var img = new Image(),
    img1 = new Image();
  (img.src = pic1), (img1.src = pic2), (cf = this);

  img.onload = function () {
    setTimeout(function () {
      cf.cube(ctx, img, img1, z, v, fnc);
    }, 50);
  };
};
jCommon.prototype.cutHead = function (str, num) {
  return str.substring(num);
};
jCommon.prototype.cutTail = function (str, num) {
  return str.substring(0, str.length - num);
};
jCommon.prototype.datapositionY = function (chartHeight, max, min, data) {
  var result = chartHeight * (data - min);
  result = result / (max - min);
  result = chartHeight - result;
  return result;
};
jCommon.prototype.datify = function (n, opt) {
  var len = n.length;
  n += "";
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
};
jCommon.prototype.degreetoradian = function (degree) {
  return degree * (Math.PI / 180);
};
jCommon.prototype.delCookie = function (cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
jCommon.prototype.delElementInArray = function (arr, el) {
  var tmp = new Array();
  var fn = this.getElementInArray;
  var n = arr.length;
  var a = this.getElementInArray(arr, el);
  if (a == -1) {
    arr.push(el);
    return arr;
  } else {
    for (var i = 0; i < n; i++) {
      var t = arr.pop();
      if (t != el) tmp.push(t);
    }
  }
  return tmp;
};
jCommon.prototype.delElinArr = function (arr, num) {
  var a = new Array();
  for (var i = 0, lng = arr.length; i < lng; i++) {
    if (i != num) a.push(arr[i]);
  }
  return a;
};
jCommon.prototype.disPic = function () {
  //2013.8.9
  var len = arguments.length,
    args = arguments;
  if (len == 6) {
    var ctx = args[0],
      img = args[1],
      x1 = args[2],
      y1 = args[3],
      x2 = args[4],
      y2 = args[5];
  } else if (len == 4) {
    var ctx = args[0],
      img = args[1],
      x1 = args[2].x,
      y1 = args[2].y,
      x2 = args[3].x,
      y2 = args[3].y;
  }
  img.onload == null ? (args[1].onload = a) : a();

  function a() {
    var w = x2 - x1,
      h = y2 - y1,
      ow = img.width,
      oh = img.height,
      r = w / ow;
    if (w < 0) w = 0;
    if (parseInt(r) == 1 && y1 == y2) {
      ctx.drawImage(img, x1, y1);
    } else {
      for (var i = 0; i < ow; i++) {
        var icr = r * i,
          a = (icr * h) / w,
          b = x1 + icr,
          c = (oh / 2 - y1 - a) * 2,
          d = y1 + a;
        ctx.drawImage(img, i, 0, 1, oh, b, d, 1, c);
      }
    }
  }
};
jCommon.prototype.dx = function (x, v, a, n) {
  return x + v * n + (a * n * n) / 2;
};
jCommon.prototype.emptyChildren = function (el) {
  while (el.children.length > 0) {
    el.removeChild(el.children[0]);
  }
};
jCommon.prototype.emptyTbody = function (tbody) {
  var ar = new Array();
  for (var i = 0, lng = tbody.children.length; i < lng; i++)
    ar.push(tbody.children[i]);
  while (ar.length > 0) this.killTag(ar.pop());
};
jCommon.prototype.encode64 = function (input) {
  var _keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;
  input = utf8_encode(input);
  while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output =
      output +
      _keyStr.charAt(enc1) +
      _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) +
      _keyStr.charAt(enc4);
  }

  return output;

  function utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
};
jCommon.prototype.expandDiv = function (divs, limit, speed, fnc, opt) {
  var cf = this;
  var cv = jVar;
  var cc = cv.complexchart;
  var cclp = cc.leftpannel;
  var ccrp = cc.rightpannel;
  var div = divs[0],
    s = divs[1];
  cf.menuchangebeforeaction();
  if (opt) {
    var t = setInterval(function () {
      var left = cf.getDelpx(div.style.left);
      var width = cf.getDelpx(div.style.width);
      if (cf.getDelpx(div.style.width) > limit) {
        clearInterval(t);
        cf.menuchangecommonaction();
      } else {
        if (cf.getDelpx(div.style.width) + speed > limit) {
          clearInterval(t);
          div.style.left = cc.width - limit + "px";
          div.style.width = limit + "px";
          s.style.width = limit - 10 + "px";
          if (fnc) fnc();

          cf.menuchangecommonaction();
        } else {
          div.style.left = cf.getDelpx(div.style.left) - speed + "px";
          div.style.width = cf.getDelpx(div.style.width) + speed + "px";
          s.style.width = cf.getDelpx(s.style.width) + speed + "px";
        }
      }
    }, 20);
  } else {
    var t = setInterval(function () {
      if (cf.getDelpx(div.style.width) < limit) {
        if (cf.getDelpx(div.style.width) + speed > limit) {
          div.style.width = limit + "px";
          s.style.width = limit - cclp.wing + "px";
        } else {
          div.style.width = cf.getDelpx(div.style.width) + speed + "px";
          s.style.width = cf.getDelpx(s.style.width) + speed + "px";
        }
      } else {
        clearInterval(t);
        if (fnc) fnc();
        cf.menuchangecommonaction();
      }
    }, 20);
  }
};
jCommon.prototype.fall = function (m, fnc) {
  var ACCEL = 3;
  var cnt = 0,
    av = ACCEL,
    v0 = 0,
    t = setInterval(function () {
      var s = v0 * cnt + (av * cnt * cnt) / 2;
      cnt++;
      if (s > m) {
        s = m;
        fnc(s, true);
        clearInterval(t);
      } else {
        fnc(s);
      }
    }, 20);
};
jCommon.prototype.fallandrise = function (m, fnc) {
  fall(m, function (s, opt) {
    if (!opt) fnc(m - s);
    else {
      rise(m, function (s, opt) {
        fnc(s, opt);
      });
    }
  });
};
jCommon.prototype.fndTag = function (str) {
  var arr = [];
  var pat = /<[a-z]+[\s>]/;
  var pat1 = /<\/[\sa-z]+>/;
  var obj = pat.exec(str);
  var obj1 = pat1.exec(str);
  var prev;
  if (!obj) {
    log("close", obj1[0]);
    return;
  }
  while (obj.index - obj1.index > 0) {
    prev = obj1[0];
    str = str.substring(obj1.index + obj1[0].length);
    obj = pat.exec(str);
    obj1 = pat1.exec(str);
    log("close", prev);
  }

  if (obj && obj[0]) {
    log("open", obj[0]);
    arr.push(obj[0]);
    var tps = str.substring(obj.index + obj[0].length);

    this.fndTag(tps);
  } else {
    log("close");
    return false;
  }
};
jCommon.prototype.getArr = function (arr, limit, number) {
  var n = arr.length;
  var tmp = new Array();
  var count = 0,
    ch = true;
  for (var i = 0; i < n; i++) {
    tmp[i] = arr.shift();
  }
  for (var i = 0, lng = tmp.length; i < lng; i++) {
    if (number != tmp[i]) {
      arr[count] = tmp[i];
      count++;
    } else {
      ch = false;
    }
  }
  if (ch) {
    arr.push(number);
  }
  if (arr.length > limit) {
    arr.shift();
  }

  return arr;
};
jCommon.prototype.getArrMax = function (arr, col) {
  var max, cnt, row;
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var tmp = this.getmax(arr[i], col);
    if (max == undefined) {
      cnt = i;
      max = tmp.max;
      row = tmp.row;
    } else {
      if (tmp.max > max) {
        cnt = i;
        max = tmp.max;
        row = tmp.row;
      }
    }
  }
  return { max: max * 1, num: cnt, row: row };
};
jCommon.prototype.getArrMin = function (arr, col) {
  var min,
    cnt,
    row,
    len = arr.length;
  for (var i = 0; i < len; i++) {
    var tmp = this.getmin(arr[i], col);
    if (min == undefined) {
      cnt = i;
      min = tmp.min;
      row = tmp.row;
    } else {
      if (tmp.min < min) {
        cnt = i;
        min = tmp.min;
        row = tmp.row;
      }
    }
  }
  return { min: min * 1, num: cnt, row: row };
};
jCommon.prototype.getAttr = function (target, attr) {
  attr = "" + attr;
  var rtnVal = "";

  if (target.getAttribute) {
    rtnVal = target.getAttribute(attr);
  } else {
    rtnVal = target[attr];
  }

  return rtnVal;
};
jCommon.prototype.getCho = function (chr) {
  var cs = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  var chrs = [
    "가",
    "까",
    "나",
    "다",
    "따",
    "라",
    "마",
    "바",
    "빠",
    "사",
    "싸",
    "아",
    "자",
    "짜",
    "차",
    "카",
    "타",
    "파",
    "하",
    "힣",
  ];
  var rs;
  var unicodes = new Array();
  var comp = chr.charCodeAt(0);
  var nd = "힣".charCodeAt(0);
  var st = "가".charCodeAt(0);
  chrs.trav(function (d, n) {
    unicodes.push(d.charCodeAt(0));
  });
  cs.trav(function (d, n) {
    if (chr == d) {
      rs = chr;
      return true;
    }
  });
  if (rs == undefined)
    unicodes.trav(function (d, n) {
      if (comp < d) {
        rs = cs[n - 1];
        return true;
      }
    });

  if (rs == undefined) rs = chr == "힣" ? "ㅎ" : chr;
  return rs;
};
jCommon.prototype.getChos = function (str) {
  var rs = "";
  for (var i = 0, lng = str.length; i < lng; i++) rs += this.getCho(str[i]);
  return rs;
};
jCommon.prototype.getClip = function (start, end, data) {
  var jdata = new Array();
  var count = 0;
  for (var i = start; i <= end; i++) {
    jdata[count] = data[i];
    count++;
  }
  return jdata;
};
jCommon.prototype.getCookie = function (cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
};
jCommon.prototype.getdatabyposition = function (
  chartHeight,
  datapositionY,
  max,
  min
) {
  var result = chartHeight - datapositionY;
  result = result * (max - min);
  result = result / chartHeight;
  result = result + min;
  return result;
};
jCommon.prototype.getDelpx = function (str) {
  return str.split("px")[0] * 1;
};
jCommon.prototype.getDistance = function (x, y) {
  return Math.sqrt(x * x + y * y);
};
jCommon.prototype.getel = function (str, p) {
  var a = this.getHead(str, 1),
    b = this.cutHead(str, 1),
    rslt;

  if (p == undefined) p = document;

  var cnt = 0;
  if (!this.html5) {
    rslt = new Array();
    if (a == ".")
      cf.traverse(p, function (el) {
        if (el.className) if (el.className.indexOf(b) != -1) rslt.push(el);
      });
    if (a == "!")
      cf.traverse(p, function (el) {
        if (el.tagName == b.toUpperCase()) rslt.push(el);
      });
  } else {
    if (a == ".") rslt = p.getElementsByClassName(b);
    if (a == "!") rslt = p.getElementsByTagName(b);
  }
  return rslt;
};
jCommon.prototype.getElementInArray = function (arr, el) {
  for (var i = 0, lng = arr.length; i < lng; i++) {
    if (arr[i] == el) {
      return i;
    }
  }
  return -1;
};
jCommon.prototype.getEventPos = function (e, el, p) {
  var cf = this;
  var tx = cf.html5 ? e.pageX : event.x;
  var ty = cf.html5 ? e.pageY : event.y;
  var ol = cf.getOffsetLeft(el);
  var ot = cf.getOffsetTop(el);

  var rx = tx - ol,
    ry = ty - ot;
  if (cf.ieversion < 9) {
    rx += ol;
    ry += ot;
  }
  if (e.toString() != "[object MouseEvent]") {
    if (
      cf.tmpKit == "Android" ||
      cf.tmpKit == "iPad" ||
      cf.tmpKit == "iPhone"
    ) {
      var touch = e.targetTouches[0];
      rx = touch.pageX; //-50;
      ry = touch.pageY;
    }
  }

  return { x: rx, y: ry };
};
jCommon.prototype.getGet = function () {
  var url = document.URL,
    u = url.split("?")[1],
    a = {};
  if (u) {
    var arr = u.split("&");
    arr.trav(function (d, n) {
      var t = d.split("=");
      a[t[0]] = t[1];
    });
  } else {
    return false;
  }
  return a;
};
jCommon.prototype.getHead = function (str, num) {
  return str.substring(0, num);
};
jCommon.prototype.gethypotenuse = function (bottom, vertical) {
  var a;
  a = bottom * bottom + vertical * vertical;
  return Math.sqrt(a);
};
jCommon.prototype.getImgName = function (el) {
  //2013.8.9
  var url = el.style.background;
  var a = url.split("(")[1],
    b = a.split(")")[0];
  return b;
};
jCommon.prototype.getmax = function (arr, col) {
  var max, row;
  var len = arr.length;
  if (col == undefined) {
    col = 3;
  }
  for (var i = 0; i < len; i++) {
    if (arr[i][col] != "void") {
      if (max == undefined) {
        row = i;
        max = arr[i][col];
      } else {
        if (arr[i][col] * 1 > max) {
          row = i;
          max = arr[i][col];
        }
      }
    }
  }
  if (max == undefined) {
    return "void";
  }
  return { max: max * 1, row: row };
};
jCommon.prototype.getMax = function (arr) {
  var max;
  for (var i = 0, lng = arr.length; i < lng; i++) {
    if (max == undefined) {
      max = arr[i];
    } else {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
  }
  return max;
};
jCommon.prototype.getmin = function (arr, col) {
  var min,
    row,
    len = arr.length;
  if (col == undefined) {
    col = 4;
  }
  for (var i = 0; i < len; i++) {
    if (arr[i][col] != "void") {
      if (min == undefined) {
        row = i;
        min = arr[i][col];
      } else {
        if (arr[i][col] * 1 < min) {
          row = i;
          min = arr[i][col];
        }
      }
    }
  }
  if (min == undefined) {
    return "void";
  }
  return { min: min * 1, row: row };
};
jCommon.prototype.getMin = function (arr) {
  var min;
  for (var i = 0, lng = arr.length; i < lng; i++) {
    if (min == undefined) {
      min = arr[i];
    } else {
      if (arr[i] < min) {
        min = arr[i];
      }
    }
  }
  return min;
};
jCommon.prototype.getOffsetLeft = function (div) {
  var a = div;
  var b = document.body;
  var ol = 0;
  while (a != b) {
    if (a != null) {
      ol += a.offsetLeft;
      a = a.parentNode;
    } else {
      break;
    }
  }

  return ol;
};
jCommon.prototype.getOffsetTop = function (div) {
  var a = div;
  var b = document.body;
  var ot = 0;
  while (a != b) {
    ot += a.offsetTop;
    a = a.parentNode;
  }

  return ot;
};
jCommon.prototype.getQuadrant = function (x, y, w, h, left, top, div) {
  var hHalf = x + w / 2;
  if (left > hHalf) {
    div.style.left = left - 101 - 10 - x + "px";
  } else {
    div.style.left = left + 10 - x + "px";
  }
  var vHalf = h / 2;
  if (top > vHalf) {
    div.style.top = top - 57 - 10 + "px";
  } else {
    div.style.top = top + 10 + "px";
  }
};
jCommon.prototype.getRandom = function (start, end) {
  var amount = end - start;
  var rslt = Math.floor(Math.random() * (amount + 1) + start);
  return rslt;
};
jCommon.prototype.getStrMax = function (str, col) {
  var arr = this.mkArr(str),
    m = this.getmax(arr, 5),
    max = m.max,
    row = m.row;
  return { max: max * 1, row: row };
};
jCommon.prototype.getStrMin = function () {
  var arr = this.mkArr(str),
    m = this.getmin(arr, col),
    max = m.min,
    row = m.row;
  return { min: min * 1, row: row };
};
jCommon.prototype.getTail = function (str, num) {
  return str.substring(str.length - num);
};
jCommon.prototype.getText = function (elem) {
  // getText 추가(2014/07/21 - CJS)
  var returnStr = "";
  if (elem.textContent) returnStr = elem.textContent;
  else returnStr = elem.innerText;

  return returnStr;
};
jCommon.prototype.getTimeStamp = function () {
  //2015.03.04. by Jae Hyun Lee
  var a = new Date().getMilliseconds();
  var b = cf.getToday();
  var str = "";
  b.trav(function (d, i) {
    str += d;
  });
  str += a;
  return str;
};
jCommon.prototype.getToday = function () {
  var a = new Date();
  var y = a.getFullYear();
  var m = a.getMonth() + 1;
  var d = a.getDate();
  var h = a.getHours();
  var mm = a.getMinutes();
  var s = a.getSeconds();
  function f(val) {
    if (val < 10) {
      val = "0" + val;
    }
    return val;
  }
  return [y, f(m), f(d), f(h), f(mm), f(s)];
};
jCommon.prototype.getWorkareaSize = function () {
  if (this.tmpBrowserName == "IE") {
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
  } else {
    var w = window.innerWidth;
    var h = window.innerHeight;
  }
  return { w: w, h: h };
};
jCommon.prototype.getxy = function (e, obj) {
  var cf = this;
  var tx = cf.html5 ? e.pageX : event.x;
  var ty = cf.html5 ? e.pageY : event.y;
  var ol = cf.getOffsetLeft(obj);
  var ot = cf.getOffsetTop(obj);
  var rx = tx - ol - 1;
  var ry = ty - ot - 1;

  return { x: rx, y: ry };
};
jCommon.prototype.getxywhfromdiv = function (div) {
  var x = this.getDelpx(div.style.left);
  var y = this.getDelpx(div.style.top);
  var w = this.getDelpx(div.style.width);
  var h = this.getDelpx(div.style.height);
  return { x: x, y: y, w: w, h: h };
};
jCommon.prototype.goldenrate = function (num) {
  var gr = (Math.sqrt(5) + 1) / 2;
  var lng, shrt;
  lng = num * gr;
  shrt = num / gr;
  return { lng: lng, shrt: shrt };
};
jCommon.prototype.img = function (ctx, strImg) {
  var img = new Image();
  img.src = strImg;

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
};
jCommon.prototype.imgLocate = function (img, wlmt, hlmt) {
  //특정 영역 안에
  var wimg = img.width,
    himg = img.height;
  var wrslt = wimg,
    hrslt = himg;
  var lft, tp, r, wrst, hrst;
  if (wimg < wlmt && himg < hlmt) {
    lft = align("w");
    tp = align("h");
  }
  if (wimg > wlmt && himg < hlmt) {
    downscale("w");
    tp = align("h");
  }
  if (wimg < wlmt && himg > hlmt) {
    downscale("h");
    lft = align("w");
  }
  if (wimg > wlmt && himg > hlmt) {
    wrst = wimg - wlmt;
    hrst = himg - hlmt;
    if (wrst > hrst) {
      downscale("w");
      tp = align("h");
    }
    if (wrst < hrst) {
      downscale("h");
      lft = align("w");
    }
  }

  return { x: lft, y: tp };

  function align(opt) {
    if (opt == "w") return (wlmt - wrslt) / 2;
    if (opt == "h") return (hlmt - hrslt) / 2;
  }
  function downscale(opt) {
    if (opt == "w") {
      r = wlmt / wimg;
      wrslt = wlmt;
      hrslt = himg * r;
    }
    if (opt == "h") {
      r = hlmt / himg;
      wrslt = wimg * r;
      hrslt = hlmt;
    }
    img.width = wrslt;
    img.height = hrslt;
  }
};
jCommon.prototype.insdiv = function (div, el, idx) {
  var index;
  if (idx != undefined) index = idx;
  else index = 0;
  if (div.childNodes.length > 0) {
    div.insertBefore(el, div.children[index]);
  } else {
    div.appendChild(el);
  }
};
jCommon.prototype.jsnstr = function (jsn) {
  return JSON.stringify(jsn);
};
jCommon.prototype.jsoc = function (addr, fnc) {
  //2015.04.20. by Jae Hyun Lee
  var l = this;
  this.action;
  this.socket = new WebSocket(addr);
  this.socket.onopen = function (e) {
    log("web socket server connection complete :: " + l.socket.readyState);
    fnc(e);
  };
  this.socket.onmessage = function (e) {
    l.action(e);
  };
  this.socket.onclose = function (e) {
    log("server connection closed");
  };
};
jCommon.prototype.jsonParser = function (json) {
  var cnt = 0;
  var arr = new Array();
  var objarr = new Array();

  arr.push([cnt, "js", "root"]);
  traverse("js", js, arr);

  for (var i = 0; i < arr.length; i++) {
    var a = new obj(i, arr[i][1], getParent(i), getChildren(i), arr[i][0]);
    objarr.push(a);
  }
  return objarr;

  function obj(id, name, parent, children, depth) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.chilren = children;
    this.depth = depth;
  }
  function traverse(j, json, arr) {
    cnt++;
    var thiscnt = cnt;
    for (var i in json) {
      arr.push([thiscnt, i, j]);
      if (typeof json[i] == "object" && !(json[i] instanceof Array)) {
        traverse(i, json[i], arr);
      }
    }
  }
  function getParent(index) {
    var ct = index;
    var a = arr[index][0];
    if (a == 0) {
      return 0;
    }
    while (true) {
      ct--;
      if (a - 1 == arr[ct][0]) {
        return ct;
      }
    }
  }
  function getChildren(index) {
    if (index == arr.length - 1) return [];
    var rslt = new Array();
    var a = arr[index][0];
    var ct = index;

    if (arr[index + 1][0] == a + 1) {
      ct++;
      while (arr[ct][0] > a) {
        if (arr[ct][0] == a + 1) {
          rslt.push(ct);
        }
        ct++;
        if (ct == arr.length) break;
      }
    }
    return rslt;
  }
};
jCommon.prototype.jsonTraverse = function (json) {
  var arr = new Array();
  for (var i in json) {
    arr.push(json[i]);
    if (typeof json[i] == "object" && !json[i].length) {
      traverse(json[i]);
    }
  }
  return arr;
};
jCommon.prototype.killTag = function (id) {
  if (typeof id == "string") {
    if (document.getElementById(id)) {
      var doc = document.getElementById(id);
      doc.parentNode.removeChild(doc);
    }
  } else {
    if (id) {
      id.parentNode.removeChild(id);
    }
  }
};
jCommon.prototype.list = function (obj) {
  //like this

  if (!obj.style)
    obj.style = {
      paddingTop: 10 + "px",
      paddingBottom: 10 + "px",
      paddingLeft: 10 + "px",
      borderBottom: "1px solid #ddd",
      fontSize: 13 + "px",
      fontWeight: "bold",
      backgroundColor: "white",
      color: "black",
    };
  if (!obj.styleMove)
    obj.styleMove = {
      backgroundColor: "#eee",
      color: "black",
    };
  if (!obj.styleClick)
    obj.styleClick = {
      backgroundColor: "rgb(111,149,219)",
      color: "white",
    };

  var selected;
  var dvs = new Array();
  obj.ar.trav(travaction);
  return dvs;

  function travaction(d, n) {
    var dv = cf.mkTag("div", obj.p);
    cf.setCss(dv, obj.style);
    dv.innerHTML = d;
    dv.info = d;
    dv.idx = n;
    dvs.push(dv);

    dv.onmouseout = function () {
      if (!this.select) cf.setCss(this, obj.style);
    };
    dv.onmousemove = function () {
      if (!this.select) cf.setCss(this, obj.styleMove);
    };
    dv.onclick = function () {
      if (selected && !obj.multiple) {
        cf.setCss(selected, obj.style);
        selected.select = false;
      }
      cf.setCss(this, obj.styleClick);
      this.select = true;
      selected = this;
      obj.clickaction(d, this, selected);
    };
  }
};
jCommon.prototype.lns = function () {
  var ar = arguments;
  var w = ar[0].canvas.width,
    h = ar[0].canvas.height;
  var ps = [
    [0, 0],
    [0, h / 4],
    [0, h / 2],
    [0, (h * 3) / 4],
    [0, h],
    [w / 4, h],
    [w / 2, h],
    [(w * 3) / 4, h],
    [w, h],
    [w, (h * 3) / 4],
    [w, h / 2],
    [w, h / 4],
    [w, 0],
    [(w * 3) / 4, 0],
    [w / 2, 0],
    [w / 4, 0],
  ];
  lns();

  function lns() {
    ps.trav(function (d, n) {
      line(d[0], d[1], ar[0]);
    });
  }
  function line(x, y, ctx, clr) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ar[1].x, ar[1].y);
    ctx.strokeStyle = clr == undefined ? "#aaaaaa" : clr;
    ctx.stroke();
  }
};
jCommon.prototype.log = function (base, value) {
  var a = Math.log;
  return a(value) / a(base);
};
jCommon.prototype.lp = function (url, param, callback) {
  //long polling implemetation;
  var xhr = new XMLHttpRequest();
  var size = 0;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(param);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 3) {
      callback(xhr.responseText.substring(size));
      size = xhr.responseText.length;
    }
    if (xhr.readyState == 4) {
      callback(xhr.responseText.substring(size));
      size = 0;
      log("disconnected. connect again!");
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(param);
    }
  };
};
jCommon.prototype.mkAbsoluteDiv = function (x, y, w, h, p) {
  var sltr = this.mkTag("div", p);
  sltr.style.position = "absolute";
  sltr.style.top = y + "px";
  sltr.style.left = x + "px";
  sltr.style.width = w + "px";
  sltr.style.height = h + "px";

  sltr.onselectstart = function () {
    return false;
  };

  return sltr;
};
jCommon.prototype.mkArr = function (str) {
  var arr = new Array(),
    tmp = str.split("|&");
  for (var i = 0, lng = tmp.length; i < lng - 1; i++) {
    arr[i] = tmp[i].split("|");
  }
  return arr;
};
jCommon.prototype.mkCanvas = function (div) {
  var cf = this;
  var a = this.getxywhfromdiv(div);
  var canvas = document.createElement("canvas");
  if (cf.html5) {
  } else {
    G_vmlCanvasManager.initElement(canvas);
  }
  if (this.html5) {
    if (this.tmpBrowserName != "Chrome") {
      canvas.width = a.w;
    } else {
      canvas.width = a.w;
    }
    canvas.height = a.h;
  } else {
    canvas.width = a.w;
    canvas.height = a.h;
    canvas.style.width = a.w + "px";
    canvas.style.height = a.h + "px";
  }
  //canvas.style.top=0+"px";
  var context = canvas.getContext("2d");
  div.appendChild(canvas);
  return context;
};
jCommon.prototype.mkDiv = function (height, parent) {
  var doc = document.createElement("div");
  doc.style.display = "block";
  doc.style.height = height + "px";
  parent.appendChild(doc);
  return doc;
};
jCommon.prototype.mkFrag = function () {
  // mkFrag 추가(2014/07/21 - CJS)
  return document.createDocumentFragment();
};
jCommon.prototype.mkGrid = function (rows, cells, id, parent) {
  if (typeof id == "string") {
    if (document.getElementById("grid")) {
      var indiv = document.getElementById("grid");
    } else {
      var indiv = this.mkTag("div", parent);
    }
  } else {
    var indiv = id;
  }
  this.clearTag(indiv);

  indiv.id = "grid";
  indiv.style.border = "1px solid gray";
  indiv.style.padding = 5 + "px";
  indiv.style.marginTop = 5 + "px";
  indiv.style.backgroundColor = "white";

  var tb = this.mkTable(rows, cells, indiv);
  tb.table.cellPadding = 1;
  tb.table.cellSpacing = 2;
  tb.table.borderCollapse = "collapse";
  var cls = tb.cells;
  for (var i = 0, lng = cls.length; i < lng; i++) {
    for (var j = 0, kng = cls[0].length; j < kng; j++) {
      cls[i][j].id = "c" + i + "" + j;
      cls[i][j].style.border = "1px solid gray";
      cls[i][j].style.padding = 0 + "px";
      cls[i][j].style.height = cls[i][j].offsetWidth + "px";
      var m = new jMacro();

      m.standardChart(
        "c" + i + "" + j,
        cls[i][j].offsetHeight - cls[i][j].offsetHeight / 6 - 15
      );
    }
  }
};
jCommon.prototype.mkHCross = function (parent, width, opt) {
  var hCross = this.mkTag("div", parent);
  hCross.style.position = "absolute";
  hCross.style.top = 0 + "px";
  hCross.style.left = 0 + "px";
  hCross.style.width = width + "px";
  hCross.style.height = 1 + "px";
  hCross.style.backgroundColor = "gray";
  hCross.style.display = "none";
  if (opt) {
    var lwidth = 48;
    var padding = 2;
    var a = this.mkAbsoluteDiv(
      width,
      -15 / 2,
      lwidth - padding,
      15 - padding,
      hCross
    );
    a.style.backgroundColor = "white";
    a.style.border = "1px solid gray";
    a.style.paddingTop = a.style.paddingLeft = padding + "px";
    a.style.overflow = "hidden";
    a.style.fontSize = 11 + "px";
  }
  return { hCross: hCross, label: a };
};
jCommon.prototype.mkIndicator = function (md) {
  var ps = {
    x: 100,
    y: 0,
    w: 500,
    h: 20,
    cw: 10,
    ch: 20,
  };

  var csl = cf.mkAbsoluteDiv(0, ps.y, 100, 100, md);
  csl.style.textAlign = "right";
  csl.innerHTML = 0;

  var cnt = 0;
  var a = cf.mkAbsoluteDiv(ps.x, ps.y, ps.w, ps.h, md);
  a.style.backgroundColor = "white";

  a.addEventListener(
    "touchstart",
    function (event) {
      event.preventDefault();
    },
    false
  );
  a.addEventListener(
    "touchmove",
    function (event) {
      event.preventDefault();
      var p = cf.getEventPos(event, a).x;
      if (p < 0 || p > 500 - 10) {
        if (p < 0) {
          cr.style.left = -1 + "px";
        }
        return false;
      }
      cr.style.left = p + "px";
      csl.innerHTML = p;
    },
    false
  );
  a.addEventListener(
    "touchend",
    function (event) {
      event.preventDefault();
    },
    false
  );

  var pin = cf.mkAbsoluteDiv(0, 10, ps.w, 1, a);
  pin.style.backgroundColor = "red";

  var cr = cf.mkAbsoluteDiv(0, ps.h / 2 - ps.ch / 2, ps.cw, ps.ch, a);
  cr.style.backgroundColor = "yellow";
};
jCommon.prototype.mkLabelSelect = function (
  text,
  start,
  end,
  selectedNum,
  parent
) {
  var doc = this.mkTag("div", parent);
  doc.style.display = "inline-block";
  var tbl = this.mkTable(1, 2);
  tbl.table.width = "";
  tbl.table.style.display = "inline-block";
  doc.appendChild(tbl.table);
  var slct = this.mkSelect(start, end, selectedNum, tbl.cells[0][1]);
  tbl.cells[0][0].innerHTML = text;
  return { div: doc, table: tbl, select: slct };
};
jCommon.prototype.mkMinMaxLabel = function (opt, parent, value) {
  var div = this.mkTag("div", parent);
  div.style.position = "absolute";
  div.style.width = 70 + "px";
  div.style.height = 13 + "px";
  div.style.zIndex = -1;
  var t = this.mkTable(1, 2, div);
  t.table.cellPadding = 0;
  t.table.cellSpacing = 0;
  t.table.style.padding = 0 + "px";
  t.cells[0][0].style.width = 10 + "px";
  t.cells[0][1].style.width = 60 + "px";
  t.cells[0][0].style.height = 12 + "px";
  switch (opt) {
    case "max":
      t.cells[0][0].style.background =
        "url(" + cf.imgPath + "arrow_max.png) no-repeat";
      t.cells[0][1].style.color = this.red;
      t.cells[0][1].innerHTML = "최대:" + this.commify(value);
      break;
    case "min":
      t.cells[0][0].style.background =
        "url(" + cf.imgPath + "arrow_min.png) no-repeat";
      t.cells[0][1].style.color = this.blue;
      t.cells[0][1].innerHTML = "최소:" + this.commify(value);
      break;
  }

  t.cells[0][1].style.textAlign = "left";
  t.cells[0][1].style.fontSize = 11 + "px";
  return { label: div, table: t.table, cells: t.cells };
};
jCommon.prototype.mkOpt = function (p, ar) {
  var a = document.createElement("select");
  ar.trav(function (d, n) {
    var b = document.createElement("option");
    b.text = d;
    if (cf.html5) a.add(b, null);
    else a.add(b, a.options[null]);
  });
  p.appendChild(a);
  return a;
};
jCommon.prototype.mkPan = function (
  hh,
  n,
  maindiv,
  opt,
  clientfnc,
  currentdata
) {
  if (!n.global) {
    var ns = n;
    n = n[0];
  }

  var g = n.global;
  var x = g.x,
    y = g.y,
    w = g.width,
    h = g.height;
  var cf = this;
  var div = cf.mkTag("div", maindiv);
  var top = y + 1,
    left = x + 1,
    width = w - 1,
    height = h + hh;
  div.style.position = "absolute";
  div.style.top = top + "px";
  div.style.left = left + "px";
  div.style.width = width + "px";
  div.style.height = height + "px";
  div.onmouseout = function () {
    vCross.style.display = "none";
    hCross.style.display = "none";
    tip.style.display = "none";
    if (ns) {
      for (var i = 0, lng = ns.length; i < lng; i++) {
        img[i].style.display = "none";
      }
    } else {
      img.style.display = "none";
    }
  };
  div.style.zIndex = 20;

  var arr = new Array();
  for (var i = 0, lng = n.global.lane.length; i < lng; i++) {
    arr[i] = n.global.lane[i].data;
  }

  var maxlane = this.getmax(arr, 5).row,
    minlane = this.getmin(arr, 5).row;

  if (opt) {
    maxlane = this.getmax(arr).row;
    minlane = this.getmin(arr).row;
  }

  var v = cf.mkVCross(div, height, true);
  var vCross = v.vCross,
    vLabel = v.label;
  var hc = cf.mkHCross(div, width, true);
  var hCross = hc.hCross,
    hLabel = hc.label;
  var img = cf.mkPanImg(ns, div);
  var tip = cf.mkAbsoluteDiv(0, 0, 101, 57, div);
  tip.style.background = "url(" + cf.imgPath + "img/2.png)";
  tip.style.display = "none";
  var tipContent = cf.mkTable(2, 2, tip);
  var tcCell = tipContent.cells;
  tipContent.table.style.fontSize = 11 + "px";
  tipContent.table.style.width = 85 + "%";
  tipContent.table.style.height = 65 + "%";
  tipContent.table.style.margin = 5 + "px";
  tipContent.table.style.marginTop = 10 + "px";
  tcCell[0][0].style.width = 25 + "px";
  tcCell[0][0].innerHTML = "날짜";
  tcCell[1][0].innerHTML = "종가";
  tcCell[0][1].style.textAlign = "right";
  tcCell[1][1].style.textAlign = "right";

  for (var i = 0, lng = n.global.lane.length; i < lng; i++) {
    var lane = cf.mkTag("div", div);
    lane.style.position = "absolute";
    lane.style.top = 0 + "px";
    lane.style.left = n.global.lane[i].xposition - x - 1 + "px";

    if (i == n.global.lane.length - 1) {
      lane.style.width = n.global.lane[i].width - 1 + "px";
    } else {
      lane.style.width = n.global.lane[i].width + "px";
    }
    if (cf.html5) {
      lane.style.height = height + "px";
    } else {
      lane.style.height = height - 1 + "px";
    }

    if (i == maxlane || i == minlane) {
      var l;
      var d = n.global.data;
      var ln = n.global.lane[i];

      if (i == maxlane) {
        l = this.mkMinMaxLabel("max", div, ln.data[5]);

        if (opt) {
          l.label.style.top =
            cf.datapositionY(h, d.max, d.min, ln.data[3]) - 14 + "px";
        } else {
          l.label.style.top =
            cf.datapositionY(h, d.max, d.min, ln.data[5]) - 14 + "px";
        }
      } else {
        l = this.mkMinMaxLabel("min", div, ln.data[5]);
        if (opt) {
          l.label.style.top =
            cf.datapositionY(h, d.max, d.min, ln.data[4]) + "px";
        } else {
          l.label.style.top =
            cf.datapositionY(h, d.max, d.min, ln.data[5]) + "px";
        }
      }
      l.label.style.left = n.global.lane[i].center - x - 5 + "px";
    }

    if (ns) {
      lane.lane = new Array();
      lane.data = new Array();
      for (var j = 0, lng = ns.length; j < lng; j++) {
        lane.lane[j] = ns[j].global.lane[i];
        lane.data[j] = ns[j].global.data;
      }
    } else {
      lane.lane = n.global.lane[i];
      lane.data = n.global.data;
      lane.currentdata = currentdata[i];
    }

    lane.onmousemove = function () {
      var l = this;
      if (cf.html5) {
        vCross.style.display = "block";
        hCross.style.display = "block";
        tip.style.display = "block";

        if (ns) {
          tip.style.display = "none";
          hCross.style.display = "none";
          vCross.style.left = this.lane[0].center - x - 1 + "px";
          vLabel.innerHTML = cf.datify(this.lane[0].data[0]);
          for (var i = 0, lng = ns.length; i < lng; i++) {
            img[i].style.display = "block";
            img[i].style.left = this.lane[i].center - x - 1 - 7 + "px";
            img[i].style.top =
              cf.datapositionY(
                h,
                this.data[i].max,
                this.data[i].min,
                this.lane[i].data[5]
              ) -
              8 +
              "px";
          }
        } else {
          vCross.style.left = this.lane.center - x - 1 + "px";
          vLabel.innerHTML = cf.datify(this.lane.data[0]);

          img.style.display = "block";
          img.style.left = this.lane.center - x - 1 - 7 + "px";
          var infoTop = cf.datapositionY(
            h,
            this.data.max,
            this.data.min,
            this.lane.data[5]
          );
          img.style.top = infoTop - 8 + "px";

          hCross.style.top = infoTop + "px";
          hLabel.innerHTML = cf.commify(this.lane.data[5]);

          cf.getQuadrant(x, y, w, h, this.lane.center, infoTop, tip);
          tcCell[0][1].innerHTML = cf.datify(this.lane.data[0]);
          tcCell[1][1].innerHTML = cf.commify(this.lane.data[5]);
        }
      } else {
        var count = 0;
        var tm = setInterval(function () {
          count++;
          if (count < 2) {
            vCross.style.display = "block";
            hCross.style.display = "block";

            if (ns) {
              vCross.style.left = l.lane[0].center - x - 1 + "px";
              vLabel.innerHTML = cf.datify(l.lane[0].data[0]);
              for (var i = 0, lng = ns.length; i < lng; i++) {
                img[i].style.display = "block";
                img[i].style.left = l.lane[i].center - x - 1 - 7 + "px";
                img[i].style.top =
                  cf.datapositionY(
                    h,
                    l.data[i].max,
                    l.data[i].min,
                    l.lane[i].data[5]
                  ) -
                  8 +
                  "px";
              }
            } else {
              vCross.style.left = l.lane.center - x - 1 + "px";
              vLabel.innerHTML = cf.datify(l.lane.data[0]);

              img.style.display = "block";
              img.style.left = l.lane.center - x - 1 - 7 + "px";
              var infoTop = cf.datapositionY(
                h,
                l.data.max,
                l.data.min,
                l.lane.data[5]
              );
              img.style.top = infoTop - 8 + "px";

              hCross.style.top = infoTop + "px";
              hLabel.innerHTML = cf.commify(l.lane.data[5]);

              cf.getQuadrant(x, y, w, h, l.lane.center, infoTop, tip);
              tcCell[0][1].innerHTML = cf.datify(l.lane.data[0]);
              tcCell[1][1].innerHTML = cf.commify(l.lane.data[5]);
            }
          } else {
            clearInterval(tm);
          }
        }, 10);
      }

      if (clientfnc) clientfnc(this.lane.data, this.currentdata);
    };
  }
};
jCommon.prototype.mkPanImg = function (ns, parent) {
  var img;
  var cf = this;
  if (ns) {
    var img = new Array();
    for (var i = 0, lng = ns.length; i < lng; i++) {
      img[i] = cf.mkTag("img", parent);
      img[i].src = this.imgPath + "circle" + (i + 1) + ".png";
      img[i].style.position = "absolute";
      img[i].style.top = 0 + "px";
      img[i].style.left = 0 + "px";
      img[i].style.width = 15 + "px";
      img[i].style.height = 15 + "px";
      img[i].style.display = "none";
    }
  } else {
    var img = cf.mkTag("img", parent);
    img.src = this.imgPath + "point.png";
    img.style.position = "absolute";
    img.style.top = 0 + "px";
    img.style.left = 0 + "px";
    img.style.width = 15 + "px";
    img.style.height = 15 + "px";
    img.style.display = "none";
  }
  return img;
};
jCommon.prototype.mkSelect = function (start, end, selectedNum, parent) {
  var doc = document.createElement("select");
  for (var i = start; i <= end; i++) {
    var tmpOpt = document.createElement("option");
    doc.appendChild(tmpOpt);
    tmpOpt.innerHTML = i;
    tmpOpt.value = i;
    if (i == selectedNum) tmpOpt.selected = "selected";
  }
  parent.appendChild(doc);
  return doc;
};
jCommon.prototype.mkSerialButtons = function (
  x,
  y,
  w,
  h,
  count,
  imgs,
  imgovers,
  parent,
  f
) {
  //var cf=new jCommon();
  var img = this.mkAbsoluteDiv(x, y, w, h, parent),
    grid = this.mkTable(1, count, img),
    t = grid.table,
    cs = grid.cells;
  t.style.height = 100 + "%";
  t.style.width = 100 + "%";
  t.style.borderSpacing = 0;

  for (var i = 0; i < count; i++) {
    cs[0][i].style.background = imgs[i];
    cs[0][i].info = i;
    cs[0][i].onclick = function () {
      selectabutton(this.info);
      f(this.info);
    };
  }
  selectabutton(0);

  return { div: img, buttons: cs[0] };

  function selectabutton(num) {
    for (var i = 0; i < count; i++) {
      cs[0][i].style.background = imgs[i];
    }
    cs[0][num].style.background = imgovers[num];
  }
};
jCommon.prototype.mkStr = function (arr) {
  var str = "";
  for (var i = 0, lng = arr.length; i < lng; i++) {
    for (var j = 0, kng = arr[0].length; j < kng; j++) {
      str += arr[i][j] + "|";
    }
    str += "&";
  }
  return str;
};
jCommon.prototype.mkTab = function (x, y, w, h, p, fnc) {
  var cf = this;
  var tabHeight = 20;
  var a = this.mkAbsoluteDiv(x, y, w, h, p);
  var b = this.mkAbsoluteDiv(0, 0, w, tabHeight, a);
  var c = this.mkTable(1, 2, b);
  c.table.style.height = tabHeight + "px";
  c.table.style.fontSize = 13 + "px";
  c.table.style.fontWeight = "bold";
  c.table.style.background = "url(" + cf.imgPath + "img/tab_left.gif)";

  var one = c.cells[0][0],
    two = c.cells[0][1];
  one.innerHTML = "tab1";
  one.number = 0;
  two.innerHTML = "tab2";
  two.style.color = "#aaaaaa";
  two.number = 1;

  var d = this.mkAbsoluteDiv(0, tabHeight, w, h - tabHeight, a);
  var e = this.mkAbsoluteDiv(0, tabHeight, w, h - tabHeight, a);
  e.style.display = "none";

  var f = {
    div: a,
    tabdiv: b,
    tab: c,
    content: [d, e],
  };
  return f;

  one.onclick = function () {
    e.style.display = "none";
    d.style.display = "block";
    c.table.style.background = "url(" + cf.imgPath + "img/tab_left.gif)";
    one.style.color = "black";
    two.style.color = "#aaaaaa";
    fnc(this, f);
  };
  two.onclick = function () {
    d.style.display = "none";
    e.style.display = "block";
    c.table.style.background = "url(" + cf.imgPath + "img/tab_right.gif)";
    one.style.color = "#aaaaaa";
    two.style.color = "black";
    fnc(this, f);
  };
};
jCommon.prototype.mkTable = function (rowcount, cellcount, parent) {
  var arrTable = new Array();
  var table = document.createElement("table");
  table.width = "100%";
  table.style.textAlign = "center";
  table.style.tableLayout = "fixed";
  table.cellSpacing = 0 + "px";
  for (var i = 0; i < rowcount; i++) {
    arrTable[i] = new Array();
    if (this.html5) {
      var tr = document.createElement("tr");
      table.appendChild(tr);
    } else {
      var tr = table.insertRow(-1);
    }

    for (var j = 0; j < cellcount; j++) {
      if (this.html5) {
        var td = document.createElement("td");
        tr.appendChild(td);
      } else {
        var td = tr.insertCell(-1);
      }
      arrTable[i][j] = td;
    }
  }
  if (parent) {
    parent.appendChild(table);
  }
  return { table: table, cells: arrTable };
};
jCommon.prototype.mkTag = function (tagName, parent) {
  var doc = document.createElement(tagName);
  parent.appendChild(doc);
  return doc;
};
jCommon.prototype.mkText = function (text, p) {
  text = "" + text;
  var textNode = document.createTextNode(text);
  if (p) p.appendChild(textNode);
  return textNode;
};
jCommon.prototype.mkTextbox = function (x, y, w, h, p) {
  var doc = this.mkAbsoluteDiv(x, y, w, h, p);
  var tbl = this.mkTable(1, 1, doc);
  tbl.table.style.height = h + "px";
  tbl.table.style.fontSize = 11 + "px";
  tbl.cells[0][0].style.textAlign = "left";
  tbl.cells[0][0].style.paddingLeft = 0 + "px";
  return { div: doc, table: tbl.table, cell: tbl.cells[0][0] };
};
jCommon.prototype.mkTextboxEx = function (p) {
  var a = this.getxywhfromdiv(p);
  var doc = this.mkAbsoluteDiv(0, 0, a.w, a.h, p);
  var tbl = this.mkTable(1, 1, doc);
  tbl.table.style.height = a.h + "px";
  tbl.table.style.fontSize = 11 + "px";
  tbl.cells[0][0].style.textAlign = "left";
  tbl.cells[0][0].style.paddingLeft = 0 + "px";
  return { div: doc, table: tbl.table, cell: tbl.cells[0][0] };
};
jCommon.prototype.mkTwoButtons = function (text_1, text_2, parent) {
  var doc = mkTag("div", parent);
  var tbl = mkTable(1, 2);
  doc.appendChild(tbl.table);
  if (html5) {
    var fBtn = mkTag("input", tbl.cells[0][0]);
  } else {
    var fBtn = mkTag("button", tbl.cells[0][0]);
    fBtn.innerHTML = text_1;
  }
  if (html5) {
    var sBtn = mkTag("input", tbl.cells[0][1]);
    sBtn.type = "button";
    sBtn.value = text_2;
  } else {
    var sBtn = mkTag("button", tbl.cells[0][1]);
    sBtn.innerHTML = text_2;
  }
  return { div: doc, table: tbl, fBtn: fBtn, sBtn: sBtn };
};
jCommon.prototype.mkVCross = function (parent, height, opt) {
  var vCross = this.mkTag("div", parent);
  vCross.style.position = "absolute";
  vCross.style.top = 0 + "px";
  vCross.style.left = 0 + "px";
  vCross.style.width = 1 + "px";
  if (this.html5) {
    vCross.style.height = height + "px";
  } else {
    vCross.style.height = height - 1 + "px";
  }
  vCross.style.backgroundColor = "gray";
  vCross.style.display = "none";
  if (opt) {
    var lwidth = 48;
    var padding = 2;
    var a = this.mkAbsoluteDiv(
      -lwidth / 2,
      height,
      lwidth - padding,
      15 - padding,
      vCross
    );
    a.style.backgroundColor = "white";
    a.style.border = "1px solid gray";
    a.style.paddingTop = a.style.paddingLeft = padding + "px";
    a.style.overflow = "hidden";
    a.style.fontSize = 11 + "px";
  }
  return { vCross: vCross, label: a };
};
jCommon.prototype.mkWebGrid = function (rowcount, cellcount, parent) {
  var arrTable = new Array(),
    table = document.createElement("table");
  table.width = "100%";
  table.style.textAlign = "center";
  table.style.tableLayout = "fixed";
  for (var i = 0; i < rowcount; i++) {
    arrTable[i] = new Array();
    if (this.html5) {
      var tr = document.createElement("tr");
      table.appendChild(tr);
    } else {
      var tr = table.insertRow(-1);
    }

    for (var j = 0; j < cellcount; j++) {
      if (this.html5) {
        var td = document.createElement("td");
        tr.appendChild(td);
      } else {
        var td = tr.insertCell(-1);
      }
      arrTable[i][j] = td;
      td.info = i + "," + j;
      td.onclick = function () {
        cellselect(this.info);
      };
    }
  }
  if (parent) {
    parent.appendChild(table);
  }

  return { table: table, cells: arrTable };

  function cellclear() {
    for (var i = 0, lng = arrTable.length; i < lng; i++) {
      for (var j = 0, kng = arrTable[0].length; j < kng; j++) {
        arrTable[i][j].style.backgroundColor = "";
      }
    }
  }
  function cellselect(cord) {
    var tmp = cord.split(","),
      x = tmp[0],
      y = tmp[1];
    cellclear();
    for (var i = 0; i <= x; i++) {
      for (var j = 0; j <= y; j++) {
        arrTable[i][j].style.backgroundColor = "blue";
      }
    }
    arrTable[0][0].style.backgroundColor = "blue";
  }
};
jCommon.prototype.mkZero = function (n) {
  if (n < 10) {
    n = "0" + n;
  }
  return n;
};
jCommon.prototype.numPeriod = function (num) {
  num = num + "";
  var result = new Array();
  var tmprest = "";
  var rest = num.length % 3;
  var value = parseInt(num.length / 3);
  if (num.length > 3) {
    result[0] = num.substring(0, rest);
    tmprest = num.substring(rest);
    if (tmprest.length > 3) {
      for (var i = 1; i <= value - 1; i++) {
        result[i] = tmprest.substring(0, 3);
        tmprest = tmprest.substring(3);
        if (tmprest.length == 3) {
          result[i + 1] = tmprest;
        }
      }
    } else {
      result[1] = tmprest;
    }
  }
  return result.join();
};
jCommon.prototype.parseTag = function (str) {
  var pat = /<[a-z]+[\s]{0,}[^<{]*>/g,
    pat1 = /<\/[\sa-z]+>/g,
    obj = pat.exec(str),
    obj1 = pat1.exec(str),
    arr = [],
    arr1 = [];
  while (obj) {
    if (obj) arr.push([obj.index, obj[0]]);
    obj = pat.exec(str);
  }
  while (obj1) {
    if (obj1) arr1.push([obj1.index, obj1[0]]);
    obj1 = pat1.exec(str);
  }
  arr.trav(function (d, i) {
    var pt = /[a-z]+/;
    var tag = pt.exec(d[1]);
    arr1.trav(function (t, j) {
      var ctag = pt.exec(t[1]);
      if (t[0] > d[0] && tag[0] == ctag[0]) {
        var cnt1 = count(arr, d[0], t[0]),
          cnt2 = count(arr1, d[0], t[0]);
        if (cnt1 == cnt2) {
          d.push(t[0]);
          d.push(t[1]);
          return true;
        }
        return false;
      }
    });
  });
  arr.trav(function (d, i) {
    var ts = str.substring(d[0] + d[1].length, d[2]);
    arr[i].push(ts);
  });
  return arr;

  function count(ar, num1, num2) {
    var cnt = 0;
    ar.trav(function (d, i) {
      if (d[0] > num1 && d[0] < num2) {
        cnt++;
      } else if (d[0] > num2) {
        return true;
      }
    });
    return cnt;
  }
};
jCommon.prototype.percenttodegree = function (percent) {
  var result = (360 * percent) / 100;
  return result;
};
jCommon.prototype.pos = function () {
  //2013.8.9
  var len = arguments.length;
  if (len == 6) {
    var Gx = arguments[0],
      Gy = arguments[1],
      Gz = arguments[2],
      x = arguments[3],
      y = arguments[4],
      z = arguments[5];
  } else if (len == 2) {
    var Gx = arguments[0].x,
      Gy = arguments[0].y,
      Gz = arguments[0].z,
      x = arguments[1].x,
      y = arguments[1].y,
      z = arguments[1].z;
  }

  var lng = this.gethypotenuse(Gx - x, Gy - y);
  var cos = (Gx - x) / lng;
  var sin = (Gy - y) / lng;
  var r = (Gz - z) / Gz;
  z = lng / (Gz / z);
  return { x: x + cos * z, y: y + sin * z, r: r };
};
jCommon.prototype.posCord = function () {
  var a = this.pos(arguments[0], arguments[1]);
  return { x: a.x, y: a.y };
};
jCommon.prototype.post = function (addr, prm, fnc) {
  var a = new ajaxcallforgeneral();
  a.post(addr, prm);
  a.ajaxcallback = function (d) {
    fnc(d);
  };
};
jCommon.prototype.radiantodegree = function (radian) {
  return radian * (180 / Math.PI);
};
jCommon.prototype.recursive = function (dt) {
  //dt는 cf.arToJson의 리턴값임
  var obj = {},
    res;
  dt.trav(function (d, i) {
    var str = d.key;
    obj[str] = d;
    d.childNodes = [];
  });
  dt.trav(function (d, i) {
    var str = d.par;
    if (str) {
      obj[str].childNodes.push(d);
      d.parentNode = obj[str];
    } else {
      res = d;
    }
  });
  cf.traverse(res, function (el) {
    findDepth(el);
  });
  return res;

  function findDepth(el) {
    var cnt = 0;
    var tel = el;
    while (tel.par != 0) {
      cnt++;
      if (tel.parentNode) tel = tel.parentNode;
    }
    el.dep = cnt;
  }
};
jCommon.prototype.rise = function (m, fnc) {
  var ACCEL = 3;
  var cnt = 0,
    av = -ACCEL,
    v0 = Math.sqrt(Math.abs(av) * m * 2),
    prev,
    t = setInterval(function () {
      var s = v0 * cnt + (av * cnt * cnt) / 2;
      cnt++;
      if (s < prev) {
        s = m;
        fnc(s, true);
        clearInterval(t);
      } else {
        fnc(s);
      }
      prev = s;
    }, 20);
};
jCommon.prototype.riseandfall = function (m, fnc) {
  //2015.02.04. by Jae Hyun Lee
  rise(m, function (s, opt) {
    if (!opt) fnc(s);
    else {
      fall(m, function (s, opt) {
        fnc(m - s, opt);
      });
    }
  });
};
jCommon.prototype.rommify = function (n, num) {
  n = n * 1;
  return this.commify(this.roundXL(n, num));
};
jCommon.prototype.roundXL = function (n, digits) {
  if (n == "void") return false;

  if (digits >= 0) return parseFloat(n.toFixed(digits));
  digits = Math.pow(10, digits);
  var t = Math.round(n * digits) / digits;
  return parseFloat(t.toFixed(0));
};
jCommon.prototype.setAttr = function (target, attrInfo) {
  for (var el in attrInfo) {
    if (!Object.prototype.isPrototypeOf(attrInfo[el])) {
      if (target.setAttribute) {
        target.setAttribute(el, attrInfo[el]);
      } else {
        target[el] = attrInfo[el];
      }
    }
  }
};
jCommon.prototype.setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};
jCommon.prototype.setCss = function (target, css) {
  var cssInfo = target.style.cssText,
    str = ";";

  for (var el in css) {
    if (!Object.prototype.isPrototypeOf(css[el])) {
      str += getUpper(el) + ":" + css[el] + ";";
    }
  }
  target.style.cssText = cssInfo + str;

  function getUpper(str) {
    var chars = "abcdefghijklmnopqrstuvwxyz",
      tp,
      i,
      lng;
    for (i = 0, lng = str.length; i < lng; i++) {
      if (chars.indexOf(str.charAt(i)) == -1) {
        tp = str.split(str.charAt(i));
        tp[1] = str.charAt(i).toLowerCase() + tp[1];
        str = tp[0] + "-" + tp[1];
      }
    }
    return str;
  }
};
jCommon.prototype.setText = function (elem, text) {
  // setText 추가(2014/07/21 - CJS)
  if (elem.textContent) elem.textContent = text;
  else elem.innerText = text;
};
jCommon.prototype.SHA1 = function (msg) {
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xefcdab89;
  var H2 = 0x98badcfe;
  var H3 = 0x10325476;
  var H4 = 0xc3d2e1f0;
  var A, B, C, D, E;
  var temp;

  msg = Utf8Encode(msg);

  var msg_len = msg.length;

  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4) {
    j =
      (msg.charCodeAt(i) << 24) |
      (msg.charCodeAt(i + 1) << 16) |
      (msg.charCodeAt(i + 2) << 8) |
      msg.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;
      break;

    case 2:
      i =
        (msg.charCodeAt(msg_len - 2) << 24) |
        (msg.charCodeAt(msg_len - 1) << 16) |
        0x08000;
      break;

    case 3:
      i =
        (msg.charCodeAt(msg_len - 3) << 24) |
        (msg.charCodeAt(msg_len - 2) << 16) |
        (msg.charCodeAt(msg_len - 1) << 8) |
        0x80;
      break;
  }

  word_array.push(i);

  while (word_array.length % 16 != 14) word_array.push(0);

  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++)
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp =
        (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 20; i <= 39; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 40; i <= 59; i++) {
      temp =
        (rotate_left(A, 5) +
          ((B & C) | (B & D) | (C & D)) +
          E +
          W[i] +
          0x8f1bbcdc) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 60; i <= 79; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  var temp =
    cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();

  function rotate_left(n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  }
  function lsb_hex(val) {
    var str = "";
    var i;
    var vh;
    var vl;

    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  }
  function cvt_hex(val) {
    var str = "";
    var i;
    var v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  }
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }
};
jCommon.prototype.shrinkDiv = function (divs, limit, speed, fnc, opt) {
  var cf = this;
  var cv = jVar;
  var cc = cv.complexchart;
  var cclp = cc.leftpannel;
  var ccrp = cc.rightpannel;
  var div = divs[0],
    s = divs[1];
  cf.menuchangebeforeaction();
  if (opt) {
    var t = setInterval(function () {
      var left = cf.getDelpx(div.style.left);
      var width = cf.getDelpx(div.style.width);
      if (cf.getDelpx(div.style.width) <= limit) {
        cf.menuchangecommonaction();
        clearInterval(t);
      } else {
        if (cf.getDelpx(div.style.width) - speed < limit) {
          clearInterval(t);
          div.style.left = cc.width - limit + "px";
          div.style.width = limit + "px";
          s.style.width = limit - 10 + "px";
          if (fnc) fnc();

          cf.menuchangecommonaction();
        } else {
          div.style.left = cf.getDelpx(div.style.left) + speed + "px";
          div.style.width = cf.getDelpx(div.style.width) - speed + "px";
          s.style.width = cf.getDelpx(s.style.width) - speed + "px";
        }
      }
    }, 20);
  } else {
    var t = setInterval(function () {
      if (cf.getDelpx(div.style.width) > limit) {
        if (cf.getDelpx(div.style.width) - speed < limit) {
          div.style.width = limit + "px";
          s.style.width = limit - cclp.wing + "px";
        } else {
          div.style.width = cf.getDelpx(div.style.width) - speed + "px";
          s.style.width = cf.getDelpx(s.style.width) - speed + "px";
        }
      } else {
        clearInterval(t);
        if (fnc) fnc();
        cf.menuchangecommonaction();
      }
    }, 20);
  }
};
jCommon.prototype.sin = function (dg) {
  return this.roundXL(Math.sin(dg * (Math.PI / 180)), 10);
};
jCommon.prototype.sintodegree = function (dx, dy) {
  var mn = 2;
  var deg;
  var quadrant;
  var hpt = this.gethypotenuse(Math.abs(dx), Math.abs(dy));
  if (hpt == 0) var sin = Math.abs(dy);
  else var sin = Math.abs(dy) / hpt;

  var rad = Math.PI / 180;
  for (var i = 0; i <= 360; i++) {
    var ds = this.roundXL(
      Math.abs(sin - this.roundXL(Math.sin(rad * i), 4)),
      4
    );
    if (ds < mn) {
      deg = i;
      mn = ds;
    }
  }
  if (dx >= 0 && dy >= 0) {
    quadrant = 4;
  } else if (dx >= 0 && dy < 0) {
    quadrant = 1;
    deg = 360 - deg;
  } else if (dx < 0 && dy >= 0) {
    quadrant = 3;
    deg = 180 - deg;
  } else if (dx < 0 && dy < 0) {
    quadrant = 2;
    deg = 180 + deg;
  }
  return deg;
};
jCommon.prototype.swing = function (limit, num) {
  var a = parseInt(num / limit);
  if (a % 2 == 1) {
    return limit - (num % limit);
  } else {
    return num % limit;
  }
};
jCommon.prototype.tbody = function (t, r, c) {
  return t.children[r].children[c];
};
jCommon.prototype.timeChecker = function () {
  var tmp = new Date();
  var str = "";
  str += tmp.getFullYear() + "-";
  str += tmp.getMonth() + 1 + "-";
  str += tmp.getDate() + " ";
  str += tmp.getHours() + ":";
  str += tmp.getMinutes() + ":";
  str += tmp.getSeconds() + ":";
  str += tmp.getMilliseconds() + "";
};
jCommon.prototype.timify = function (n) {
  var len = n.length;
  n += "";
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
};
jCommon.prototype.tmr = function (fnc) {
  var cnt = 0;
  var tmr = setInterval(function () {
    fnc(cnt, tmr);
    cnt++;
  }, 20);
};
jCommon.prototype.tojson = function (str) {
  return JSON.parse(str);
};
jCommon.prototype.tq = function (tmr) {
  clearInterval(tmr);
};
jCommon.prototype.trav = function (arr, fnc) {
  ///////////////////////////////////////////////2014.07.09///
  var i, lng, a;
  for (i = 0, lng = arr.length; i < lng; i++) {
    a = fnc(arr[i], i);
    if (a) break;
  }
};
jCommon.prototype.traverse = function (el, fnc) {
  //2013.8.9 el의 자식노드들을 순회하는 함수
  fnc(el);
  var a = el.childNodes.length;
  for (var i = 0; i < a; i++) {
    this.traverse(el.childNodes[i], fnc);
  }
};
jCommon.prototype.trImg = function (ctx, strImg) {
  var img = new Image();
  img.src = strImg;

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    for (var i = 0, lng = img.width; i < lng; i++) {
      for (var k = 0, kng = img.height; k < kng; k++) {
        ctx.drawImage(img, i, k, 1, 1, i, kng - k + 140, 1, 1);
      }
    }
    for (var i = 0, lng = img.width; i < lng; i++) {
      for (var k = 0, kng = img.height; k < kng; k++) {
        ctx.drawImage(img, i, k, 1, 1, lng - i + 140, kng - k + 140, 1, 1);
      }
    }
    for (var i = 0, lng = img.width; i < lng; i++) {
      for (var k = 0, kng = img.height; k < kng; k++) {
        ctx.drawImage(img, i, k, 1, 1, lng - i + 140, k, 1, 1);
      }
    }

    var gr = ctx.createLinearGradient(0, 140, 0, 280);
    gr.addColorStop(0, "rgba(255,255,255,0.7)");
    gr.addColorStop(1, "rgba(255,255,255,1)");
    ctx.fillStyle = gr;
    ctx.fillRect(0, 140, 280, 140);
  };
};
