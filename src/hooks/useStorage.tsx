import { useEffect, useState } from "react";
import { getStorage } from "../utils/storage";

const useStorage = (key: string) => {
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const loadStorage = async () => {
      const interval = getStorage(key)
      
      const result = await interval
      
      setResult(result)
      return result;
    };

    loadStorage();
  }, [key]);

  return result ;
};

export default useStorage
