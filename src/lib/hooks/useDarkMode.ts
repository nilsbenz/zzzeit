import { useLayoutEffect } from "@tanstack/react-router";
import { useTernaryDarkMode } from "usehooks-ts";

export default function useDarkMode() {
  const { isDarkMode } = useTernaryDarkMode();

  useLayoutEffect(() => {
    document.body.classList.add(isDarkMode ? "dark" : "light");
    document.body.classList.remove(isDarkMode ? "light" : "dark");
  }, [isDarkMode]);
}
