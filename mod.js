function mneCall(date, callback) {
<<<<<<< HEAD
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
=======
  timer(2000, () => {
    const param = {
      V_IN_GOLF_ID: "S1",
      V_IN_YEAR: date.gh(4),
      V_IN_MONTH: date.gt(2),
      V_IN_MEMNO: "",
      T_MONTH: date.gt(2),
    };
    post("/golf.calendar.pns?getCalendar_S1", param, {}, (data) => {
      const els = JSON.parse(data).entitys;
      Array.from(els).forEach((el) => {
        if (el.IT_OPEN != "신청하기") return;
        const fulldate = el.ORI_CD_DATE.split("-").join("");
        dates.push([fulldate, 0]);
      });
      callback();
    });
  });  
>>>>>>> 2f0fcfcfef4afeb73bef21ca404add411fe854e1
}
