function mneCall(date, callback) {
  log("mneCall");

  const param = {
    V_IN_GOLF_ID: "P1",
    V_IN_YEAR: date.gh(4),
    V_IN_MONTH: date.gt(2),
    V_IN_COURSE: "F",
  };
  post("/golf.calendar.pns?getCalendar", param, {}, (data) => {
    const els = JSON.parse(data).entitys;
    Array.from(els).forEach((el) => {
      if (el.IT_OPEN_DESC != "신청하기") return;
      const fulldate = el.ORI_CD_DATE.split("-").join("");
      dates.push([fulldate, 0]);
    });
    callback();
  });
  timer(2000, () => {
    const param = {
      clickTdId: "",
      clickTdClass: "",
      workMonth: date,
      workDate: date + "01",
      bookgDate: "",
      bookgTime: "",
      bookgCourse: "",
      searchTime: "",
      selfTYn: "",
      macroChk: "",
      temp001: "",
      bookgComment: "",
      memberCd: 61,
    };
    post("/reservation/ajax/golfCalendar", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const tbls = ifr.getElementsByClassName("cm_calender_tbl");
      let as = [];
      Array.from(tbls).forEach((tbl) => {
        const arr = Array.from(tbl.getElementsByTagName("a"));
        as = as.concat(arr);
      });

      as.forEach((a) => {
        if (a.className === "cal_end") return;
        const str = a.attr("onclick");
        if (str.indexOf("CLOSE") !== -1) return;
        if (str.indexOf("NOOPEN") !== -1) return;
        console.log(str);
        const [, , date] = str.inparen();
        log(date);
        dates.push([date, 0]);
      });

      callback();
    });
  });
}
