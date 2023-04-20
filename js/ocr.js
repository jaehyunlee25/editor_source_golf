const httpHeader = { "Content-Type": "application/json" };
//const urlHeader = "https://dev.mnemosyne.co.kr/api/crawler";
const urlHeader = "http://localhost:8080";
const cf = new jCommon();
main();
function main() {}
iptFile.onchange = function () {
  const param = new FormData();
  param.append("data", 1);
  param.append("file", iptFile.files[0]);
  jFile(urlHeader + "/fileUploadTest", param, (resp) => {
    console.log(resp.jp());
  });
};
