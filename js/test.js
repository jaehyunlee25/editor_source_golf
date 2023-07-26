const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const apiHeader = "https://dev.mnemosyne.co.kr/api/webview";
const webHeader = "https://dev.mnemosyne.co.kr/html";
const dictClub = {};
const cf = new jCommon();

main();
function main() {
  post(
    apiHeader + "/getGolfClubList",
    { ostype: "aos", deploytype: "dev" },
    httpHeader,
    (data) => {
      console.log(data);
    }
  );
}
