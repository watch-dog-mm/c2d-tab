// Awakening Service worker
let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "keepAlive") {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: "*://*/*" })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: "keepAlive" }),
        // `function` will become `func` in Chrome 93+
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}
// Application
var timerID;
var tabIds = [];
var urls = [
  "https://ouo.io/QBY0LQE",

  "https://adshort.co/RVJR8C",

  "https://ouo.io/YQCKU3",

  "https://adshnk.com/LqJTeJ",

  "https://ouo.io/jkjnb6",

  "https://droplink.co/TvMH",
];
clearTimeout(timerID);

function startTimer(timer = 50000) {
  clearTimeout(timerID);
  timerID = setTimeout(async function () {
    // Put your warning or auto logout here
    await UserIsDoingSomething();
  }, timer);
}

async function UserIsDoingSomething() {
  clearTimeout(timerID);
  // do something....
  try {
    chrome.tabs.remove(tabIds);
    tabIds = [];
  } catch (e) {
    console.log(e);
  }
  const res = await fetch(
    "https://gist.githack.com/watch-dog-mm/a157e40feaf6e3b195dc9f285a178d86/raw/c2dlist.json"
  );
  const { data } = await res.json();

  data.forEach((i) => {
    chrome.tabs.create(
      {
        url: i,
      },
      (val) => {
        tabIds.push(val.id);
        console.log(tabIds);
      }
    );
  });
}

function start() {
  let min = 0;
  setInterval(() => {
    min++;
    // startTimer(100);
    console.log(min);
  }, 600000);
}
start();

// Message Listener

chrome.storage.onChanged.addListener((opt) => {
  console.log(opt);
});
