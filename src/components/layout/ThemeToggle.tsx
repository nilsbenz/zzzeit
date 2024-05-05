import { MoonIcon, SunIcon } from "lucide-react";
import { useTernaryDarkMode } from "usehooks-ts";
import { Button, ButtonProps } from "../ui/button";

export default function ThemeToggle(props: ButtonProps) {
  const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  return (
    <Button
      {...props}
      size={props.size ?? "icon"}
      variant={props.variant ?? "outline"}
      onClick={(e) => {
        setTernaryDarkMode(isDarkMode ? "light" : "dark");
        props.onClick?.(e);
      }}
    >
      {isDarkMode ? (
        <SunIcon strokeWidth={2.5} className="size-5" />
      ) : (
        <MoonIcon strokeWidth={2.5} className="size-5" />
      )}
    </Button>
  );
}
