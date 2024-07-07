import { useLayoutEffect, useState } from "react";

export default function useIsStandalone() {
  const [isStandalone, setIsStandalone] = useState(false);

  useLayoutEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  return isStandalone;
}
