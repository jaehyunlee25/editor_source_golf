const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/reservation/";
const apiHeader = "https://dev.mnemosyne.co.kr/crawler/";
const cf = new jCommon();

main();
function main() {
  post(apiHeader + "clubs", {}, httpHeader, (data) => {
    log(data);
  });
}
