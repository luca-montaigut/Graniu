const root = document.querySelector("#root");
const form = document.querySelector("form");
const input = document.querySelector("#file-input");

const makeDownloadButton = (seeds) => {
  console.log(seeds);
  const dataUrl = `data:text/rb;charset=utf-8,${seeds}`;
  return `<a download="seeds.rb" href="${dataUrl}"><button type="button">&#8659 Download &#8659</button></a>`;
};

const displayResult = (seeds) => {
  root.innerHTML = "";
  root.innerHTML = `<b>seeds.rb</b><br/><div id="area"></div>`;
  const area = document.querySelector("#area");

  const downloadButton = makeDownloadButton(seeds);
  const returnButton = `<button onClick="window.location.reload();">&#8656; Return</button>`;
  const buttons = `<div>${returnButton}&nbsp;${downloadButton}</div>`;

  root.insertAdjacentHTML("afterbegin", buttons);
  area.insertAdjacentHTML("beforeend", `<pre>${seeds}</pre>`);
};

const handleFile = (e) => {
  e.preventDefault();
  const file = input.files[0];
  if (!file) {
    return false;
  }

  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = (event) => {
    const schema = event.target.result;
    hash = new SkeemaParser(schema).parse();
    if (!hash) {
      throw Error("Not a schema.rb file");
    }
    console.log(hash);
    const seeds = new SeedsMaker(hash).make();
    displayResult(seeds);
  };

  reader.onerror = (event) => {
    alert(event.target.error.name);
  };
};

form.addEventListener("submit", handleFile);

//  (\(\_
//  ( -.-)       "See you in the next hole!"
//  o_(")(")                          - LazyRabbit
