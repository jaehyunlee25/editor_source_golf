function mneCall(date, callback) {
  const els = doc.gcn("bookyesbgcolor");
  Array.from(els).forEach((el) => {
    const param = el.attr("onclick").inparen();
    const fulldate = param[0];
    dates.push([fulldate, param]);
  });
  callback();
}
