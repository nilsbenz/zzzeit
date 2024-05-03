import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
      <LoaderCircleIcon
        className="size-7 animate-spin opacity-40"
        strokeWidth={3}
      />
    </div>
  );
}
