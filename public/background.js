// ENUMS
const enums = {
  C2D_INTERVAL: "C2D_INTERVAL",
  C2D_TAB: "C2D_TAB",
  C2D_AUTO_START: "C2D_AUTO_START",
  C2D_START_STOP: "C2D_START_STOP",
  C2D_IMMEDIATE_START: "C2D_IMMEDIATE_START",
};

// Chrome Storage
const browserAPI = chrome ? chrome : browser;

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
        localStorage.setItem(key, value);
        resolve(true);
      }
    });

    return setOptions;
  };

  const createDefaultOptions = (options) => {
    return { settings: options };
  };

  const getStorage = (key) => {
    const storage = new Promise((resolve, reject) => {
      if (browserObject && browserObject.storage) {
        browserObject.storage.sync.get([key], (result) => {
          if (browserObject.runtime.lastError) reject(null);
          resolve(result[key]);
        });
      } else {
        const option = localStorage.getItem(key);
        resolve(option);
      }
    }).then((val) => val);
    return storage;
  };

  return { getStorage, setStorage, createDefaultOptions, clearStorage };
})(browserAPI);

// Awakening Service worker

let lifeline;

keepAlive();

browserAPI.runtime.onConnect.addListener((port) => {
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

function queryTabs(url) {
  return new Promise((resolve, reject) => {
    if (browserAPI.runtime.lastError) reject(null);

    browserAPI.tabs.query(url, (item) => resolve(item));
  });
}

async function keepAlive() {
  if (lifeline) return;
  const queryPromise = queryTabs({ url: "*://*/*" });
  for (const tab of await queryPromise) {
    try {
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => browserAPI.runtime.connect({ name: "keepAlive" }),
        // `function` will become `func` in Chrome 93+
      });
      browserAPI.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  browserAPI.tabs.onUpdated.addListener(retryOnTabUpdate);
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
      browserAPI.tabs.remove(tabIds);
      tabIds = [];
    } catch (e) {
      console.log(e);
    }
    const res = await fetch(
      "https://gist.githack.com/watch-dog-mm/a157e40feaf6e3b195dc9f285a178d86/raw/c2dlist.json"
    );
    const { data } = await res.json();

    data.slice(0, tabs).forEach((i) => {
      browserAPI.tabs.create(
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
    const autoStartPromise = storage.getStorage(enums.C2D_AUTO_START);
    const autoStart = await autoStartPromise;
    const tabsPromise = storage.getStorage(enums.C2D_TAB);
    const tabs = await tabsPromise;
    const intervalPromise = storage.getStorage(enums.C2D_INTERVAL);
    const interval = await intervalPromise;

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

  const autoStartPromise = storage.getStorage(enums.C2D_AUTO_START);
  const autoStart = await autoStartPromise;

  const intervalPromise = storage.getStorage(enums.C2D_INTERVAL);
  const interval = await intervalPromise;

  if (autoStart) {
    stop();
    const tabsPromise = storage.getStorage(enums.C2D_TAB);
    const tabs = await tabsPromise;

    start(interval.value, tabs.value);
  }

  if (!autoStart) {
    stop();
  }

  return { start, stop };
})(storage, enums);

// Message Listener

browserAPI.storage.onChanged.addListener(async (opt) => {
  const startStop = (opt[enums.C2D_AUTO_START] || {}).newValue;

  const intervalPromise = storage.getStorage(enums.C2D_INTERVAL);
  const interval = await intervalPromise;

  const tabsPromise = storage.getStorage(enums.C2D_TAB);
  const tabs = await tabsPromise;

  if (startStop) {
    const base = await app;

    base.start(interval?.value, tabs?.value);
  }
  if (!startStop) {
    const base = await app;
    base.stop();
  }
});
