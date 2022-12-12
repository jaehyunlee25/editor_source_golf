const httpHeader = { "Content-Type": "application/json" };
const urlHeader = "https://dev.mnemosyne.co.kr/api/reservation/";
const apiHeader = "http://mnemosynesolutions.co.kr";
const cf = new jCommon();

function main() {
  post(urlHeader + "/clubs", {}, httpHeader, (data) => {
    clubs = JSON.parse(data).clubs;
    clubs.sort();
    setBoxes(clubs);
  });
}
