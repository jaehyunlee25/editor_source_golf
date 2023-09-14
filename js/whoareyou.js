const httpHeader = { "Content-Type": "application/json" };
let urlHeader = "https://mnemosynesolutions.co.kr/job";
const cf = new jCommon();
const strSetting = localStorage.getItem("mnemosyne_job_setting");
const setting = strSetting ? strSetting.jp() : {};
get(".env", {}, httpHeader, (resp) => {
  let { urlHeader: url } = resp.jp();
  urlHeader = url;
  main();
});

function main() {
  const param = {};
  post(urlHeader + "/getMember", param, httpHeader, (resp) => {
    const json = JSON.parse(resp);
    log(json);
    json.forEach((member) => {
      mkCard(member);
    });
  });
}
function saveSetting(key, val) {
  setting[key] = val;
  localStorage.setItem("mnemosyne_job_setting", JSON.stringify(setting));
}
function mkCard(member) {
  const { id, comId, name, alias, description, created_at, updated_at } =
    member;
  const tmpElem = tplMember.content;
  const tdFrag = document.importNode(tmpElem, true);
  const div = tdFrag.children[0];
  elMember.appendChild(div);
  const card = div.children[0];
  card.children[0].str(comId);
  card.children[1].str(name);
  card.children[2].str(alias);
  card.children[3].str(description);
  card.user = member;
  card.onmousemove = function () {
    this.style.border = "5px solid yellow";
  };
  card.onmouseout = function () {
    this.style.border = "5px solid white";
  };
  card.onclick = function () {
    saveSetting("user", this.user.id);
    location.href = "job.html";
  };
}
