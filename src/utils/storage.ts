//@ts-ignore
export const browserObject = chrome ? chrome : browser;

export const SETTING_STORAGE = "setting_storage";

export const clearStorage = () => {
  if (browserObject && browserObject.storage) {
    browserObject.storage.sync.clear();
  } else {
    localStorage.clear();
  }
};

export const setStorage = (key: string, value: any) => {
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

export const createDefaultOptions = (options: any) => {
  return { settings: options };
};

export const getStorage = (key: string) => {
  const storage = new Promise((resolve, reject) => {
    if (browserObject && browserObject.storage) {
      browserObject.storage.sync.get([key], (result: any) => {
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
