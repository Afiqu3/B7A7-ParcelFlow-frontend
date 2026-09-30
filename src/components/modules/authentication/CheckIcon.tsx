import { Check } from "lucide-react";

type CheckIconProps = {
  className?: string;
  iconClassName?: string;
  strokeWidth?: number;
};

export default function CheckIcon({
  className = "size-6 bg-chart-2",
  iconClassName = "size-4 text-black",
  strokeWidth = 3,
}: CheckIconProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
    >
      <Check className={iconClassName} strokeWidth={strokeWidth} />
    </div>
  );
}