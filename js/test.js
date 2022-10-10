javascript: (() => {
  main();
  function main() {
    const script = localStorage.getItem("tz_script");
    if (!script) {
      console.log("script가 존재하지 않습니다.");
      localStorage.setItem("tz_script", "const a = 1;");
      main();
      return;
    }
    eval(script);
    //console.log(1);
  }
})();
