import { useAuthContext } from "@/lib/context/auth";
import { auth } from "@/lib/firebase";
import { ReactNode } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import {
  LogOutIcon,
  LucideIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { TernaryDarkMode, useTernaryDarkMode } from "usehooks-ts";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

const themeOptions: {
  [key in TernaryDarkMode]: {
    label: string;
    icon: LucideIcon;
  };
} = {
  light: {
    label: "Light",
    icon: SunIcon,
  },
  dark: {
    label: "Dark",
    icon: MoonIcon,
  },
  system: {
    label: "System",
    icon: MonitorSmartphoneIcon,
  },
};

function Item({ label, children }: { label: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between sm:grid sm:grid-cols-[12rem_1fr]">
      <div className="text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { user } = useAuthContext();
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  return (
    <div className="space-y-6">
      <h2 className="h1 standalone:hidden">Settings</h2>
      <Item label="Mail address">
        <p>{user.email}</p>
      </Item>
      <Item label={<Label htmlFor="theme">Theme</Label>}>
        <div className="w-full max-w-48">
          <Select
            value={ternaryDarkMode}
            onValueChange={(v) => setTernaryDarkMode(v as TernaryDarkMode)}
          >
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(themeOptions).map(
                ([key, { label, icon: Icon }]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <Icon className="size-5" strokeWidth={2.25} />
                      {label}
                    </span>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </Item>
      <Separator />
      <Button
        variant="outline"
        className="gap-1.5"
        onClick={async () => await signOut(auth)}
      >
        <LogOutIcon className="size-5" strokeWidth={2.5} />
        Logout
      </Button>
    </div>
  );
}
