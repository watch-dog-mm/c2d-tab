import { useEffect, useState } from "react";
import { getStorage } from "../utils/storage";

const useStorage = (key: string) => {
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const loadStorage = async () => {
      const interval = await getStorage(key);
      setResult(interval[key])
      return interval[key];
    };

    loadStorage();
  }, [key]);

  return result ;
};

export default useStorage
