// ENUMS
const enums = {
  C2D_INTERVAL: "C2D_INTERVAL",
  C2D_TAB: "C2D_TAB",
  C2D_AUTO_START: "C2D_AUTO_START",
  C2D_START_STOP: "C2D_START_STOP",
  C2D_IMMEDIATE_START: "C2D_IMMEDIATE_START",
};

// Chrome Storage
const runtime = chrome ? chrome : browser;

const storage = ((browserObject) => {
  const clearStorage = () => {
    if (browserObject && browserObject.storage) {
      browserObject.storage.sync.clear();
    } else {
      localStorage.clear();
    }
  };

  const setStorage = (key, value) => {
    const setOptions = new Promise((resolve, reject) => {
      if (browserObject && browserObject.storage) {
        browserObject.storage.sync.set({ [key]: value }, () => {
          if (browserObject.runtime.lastError) reject(null);

          resolve(true);
        });
      } else {
        localStorage.setItem(key, JSON.stringify({ setting_storage: value }));
        resolve(true);
      }
    });

    return setOptions;
  };

  const createDefaultOptions = (options) => {
    return { settings: options };
  };

  const getStorage = async (key) => {
    if (browserObject && browserObject.storage) {
      const result = await browserObject.storage.sync.get([key]);

      return result[key];
    } else {
      const option = localStorage.getItem(key);
      return option;
    }
  };

  return { getStorage, setStorage, createDefaultOptions, clearStorage };
})(runtime);

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
const app = (async (storage, enums) => {
  let timerID;
  let tabIds = [];
  let intervalId;

  clearTimeout(timerID);

  function startTimer(timer = 50000, tabs = 4) {
    clearTimeout(timerID);
    timerID = setTimeout(async function () {
      // Put your warning or auto logout here
      await UserIsDoingSomething(tabs);
    }, timer);
  }

  async function UserIsDoingSomething(tabs) {
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

    data.slice(0, tabs).forEach((i) => {
      chrome.tabs.create(
        {
          url: i,
        },
        (val) => {
          tabIds.push(val.id);
        }
      );
    });
  }

  const setDefaultSettings = async () => {
    const autoStart = await storage.getStorage(enums.C2D_AUTO_START);

    const tabs = await storage.getStorage(enums.C2D_TAB);
    const interval = await storage.getStorage(enums.C2D_INTERVAL);

    if (
      autoStart === undefined &&
      tabs === undefined &&
      interval === undefined
    ) {
      await storage.setStorage(enums.C2D_AUTO_START, false);
      await storage.setStorage(enums.C2D_INTERVAL, {
        label: "5 minutes",
        value: 300000,
      });

      await storage.setStorage(enums.C2D_TAB, {
        label: "4 Tabs",
        value: 4,
      });
    }
  };

  const start = (timer = 3000, tabs = 4) => {
    let min = 0;
    intervalId = setInterval(() => {
      min++;
      startTimer(min, tabs);
    }, timer);
  };

  const stop = () => {
    clearTimeout(timerID);
    clearInterval(intervalId);
  };
  await setDefaultSettings();

  const autoStart = await storage.getStorage(enums.C2D_AUTO_START);

  const interval = await storage.getStorage(enums.C2D_INTERVAL);

  if (autoStart) {
    stop();
    const tabs = await storage.getStorage(enums.C2D_TAB);

    start(interval.value, tabs.value);
  }

  if (!autoStart) {
    stop();
  }

  return { start, stop };
})(storage, enums);

// Message Listener

chrome.storage.onChanged.addListener(async (opt) => {
  const startStop = (opt[enums.C2D_AUTO_START] || {}).newValue;
  const interval = await storage.getStorage(enums.C2D_INTERVAL);
  const tabs = await storage.getStorage(enums.C2D_TAB);

  if (startStop) {
    const base = await app;

    base.start(interval?.value, tabs?.value);
  }
  if (!startStop) {
    const base = await app;
    base.stop();
  }
});
