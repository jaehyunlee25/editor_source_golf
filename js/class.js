class TIMER {
  timer;
  url;
  timercount = 0;
  timercountlimit = 20;
  apiname = "connect";
  FLAG = true;
  keyStack = [];
  keyStackLength = 0;
  isStopped = false;
  messagecallback;
  self;
  round;
  cntServer;

  execStack = [];
  execClubId;
  execType;

  challenge = false;
  constructor(url, messagecallback) {
    this.url = url;
    this.keyStack = keyStack;
    this.messagecallback = messagecallback;
  }
  async start(keyStack, round, cntServer, millisec) {
    this.keyStack = keyStack;
    this.round = round;
    this.cntServer = cntServer;
    this.keyStackLength = keyStack.length;
    const self = this;
    this.timer = setInterval(() => {
      self.allstart_timeraction(self);
    }, millisec);
  }
  stop() {
    this.isStopped = true;
  }
  continue() {
    this.isStopped = false;
  }
  init() {
    clearInterval(this.timer);
    this.timercount = 0;
    this.FLAG = true;
    this.keyStack = [];
    this.isStopped = false;
  }
  async allstart_timeraction(self) {
    // 멈춤버튼이 눌린 상태에선 실행하지 않는다.
    if (self.isStopped) return;

    self.timercount++;
    if (self.timercount > self.timercountlimit) {
      self.timercount = 0;
      self.FLAG = true;
      self.messagecallback("timeout", {
        clubId: self.execClubId,
        type: self.execType,
      });
      if (!self.challenge) {
        // alert("타임아웃, 재시작::" + self.execType);
        self.execStack.unshift(self.execType);
        self.challenge = true;
      } else {
        // alert("재타임아웃, 끝::" + self.execType);
        self.challenge = false;
      }
    }
    log(self.url, self.timercount);
    if (!self.FLAG) return;

    self.FLAG = false;
    if (self.execStack.length == 0) {
      self.execClubId = self.keyStack.shift();
      if (!self.execClubId) {
        self.messagecallback("end", { msg: "the end of all work!" });
        self.init();
        return;
      }
      self.execStack = ["main", "login", "search"];
      const lng = self.keyStackLength;
      const nth = lng - self.keyStack.length;
      const clubId = self.execClubId;
      self.messagecallback("status", { nth, lng });
      self.messagecallback("club", { url: self.url, clubId });
    }
    self.execType = self.execStack.shift();

    const clubId = self.execClubId;
    const type = self.execType;
    const round = self.round;
    const cntServer = self.cntServer;
    self.messagecallback("start", { clubId, type });
    const result = await self.apiname.api(
      { clubId, type, round, cntServer },
      self.url
    );
    self.messagecallback("result", result);
    self.timercount = 0;
    self.FLAG = true;
    self.challenge = false;
  }
}
class ASCELL {
  id;
  club;
  td;
  head;
  name;
  login;
  main;
  search;
  constructor(numId, club, td) {
    this.id = numId;
    this.club = club;
    this.td = td;
    const [asCellHead] = td.gba("class", "asCellHead");
    const [asCellName] = td.gba("class", "asCellName");
    const [main, login, search] = td.gba("class", "asButton");
    this.head = asCellHead;
    this.name = asCellName;
    this.main = main;
    this.login = login;
    this.search = search;

    asCellHead.str(this.id);
    asCellName.str(club.name.limit(6));
  }
  setStart(json) {
    const { type } = json;
    this[type].style.backgroundColor = "orange";
  }
  setResult(json) {
    const { type, diff } = json;
    if (diff == -1) this[type].style.backgroundColor = "lightgray";
    else if (diff == -2) this[type].style.backgroundColor = "tomato";
    else this[type].style.backgroundColor = "lime";
  }
  setTimeout(json) {
    const { type } = json;
    this[type].style.backgroundColor = "dodgerblue";
  }
}
