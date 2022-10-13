function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    pmode: "appointment",
    s: date.datify(),
  };
  const dictCourse = { 1: "단일" };

  post("/new/sub4/menu1.php", param, {}, (data) => {
    const ifr = doc.createElement("div");
    ifr.innerHTML = data;

    const cvr = doc.getElementById("booking");
    const els = cvr.gtn("a");
    Array.from(els).forEach((el) => {
      if (el.str() != "예약하기") return;
      const param = el.attr("href").inparen()[0].split("?")[1].split("&");
      let course = 1;
      let [, opt] = param[1].split("=");
      let [, time] = param[3].split("=");
      time = time.rm(":");
      const hole = opt == "3" ? "9홀" : "18홀";
      const fee_discount = 85000;
      const fee_normal = 85000;
      course = dictCourse[course];

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}
