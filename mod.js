function funcMain() {
  log("funcMain");
  const tag = localStorage.getItem("TZ_MAIN");
  if (tag && new Date().getTime() - tag < 1000 * 5) {
    funcEnd();
    return;
  }
  localStorage.setItem("TZ_MAIN", new Date().getTime());

  location.href =
    "https://www.dongwonroyalcc.co.kr/_mobile/GolfRes/onepage/my_golfreslist.asp";
}
