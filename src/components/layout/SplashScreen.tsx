import { HourglassIcon } from "lucide-react";
import Loading from "../common/Loading";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-12">
        <div className="flex items-center gap-2">
          <HourglassIcon
            className="size-12 animate-hourglass"
            strokeWidth={3}
          />
          <p className="font-brand text-4xl">zzzeit</p>
        </div>
        <Loading />
      </div>
    </div>
  );
}
