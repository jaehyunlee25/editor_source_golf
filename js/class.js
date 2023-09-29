class TIMER {
  timer;
  url;
  timercount = 0;
  FLAG = true;
  keyStack = [];
  keyStackLength = 0;
  isStopped = false;
  messagecallback;
  self;
  constructor(url, messagecallback) {
    this.url = url;
    this.keyStack = keyStack;
    this.messagecallback = messagecallback;
  }
  async start(keyStack, millisec) {
    this.keyStack = keyStack;
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
    this.timercount = 0;
    this.FLAG = true;
    this.keyStack = [];
    this.isStopped = false;
    clearInterval(this.timer);
  }
  async allstart_timeraction(self) {
    if (self.isStopped) return;

    self.timercount++;
    log(self.url, self.timercount);

    if (self.timercount > 20) {
      self.timercount = 0;
      self.FLAG = true;
      log(self.url, "timeout");
      return;
    }

    if (!self.FLAG) return;

    self.FLAG = false;
    const clubId = self.keyStack.shift();
    if (!clubId) {
      self.messagecallback("end", { msg: "the end of all work!" });
      self.init();
      return;
    }

    const lng = self.keyStackLength;
    const nth = lng - self.keyStack.length;

    self.messagecallback("status", { nth, lng });
    self.messagecallback("club", { url: self.url, clubId });
    // const resHomepage = await conHomepage(clubId);

    let type = "main";
    const resHomepage = await "connect".api({ clubId, round, type }, self.url);
    self.messagecallback("result", resHomepage);
    self.timercount = 0;

    type = "login";
    const resLogin = await "connect".api({ clubId, round, type }, self.url);
    self.messagecallback("result", resLogin);
    self.timercount = 0;

    type = "search";
    const resSearch = await "connect".api({ clubId, round, type }, self.url);
    self.messagecallback("result", resSearch);

    self.timercount = 0;
    self.FLAG = true;
  }
}
