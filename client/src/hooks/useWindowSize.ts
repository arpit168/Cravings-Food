import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      
      window.addEventListener("resize", handleResize);
      handleResize(); // Call on mount
      
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return size;
};

export default useWindowSize;
