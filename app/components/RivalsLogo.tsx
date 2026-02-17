import { cn } from "../lib/utils";

interface RivalsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
}

export function RivalsLogo({
  className,
  size = "md",
  variant = "full",
}: RivalsLogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-10",
    lg: "h-14",
    xl: "h-20",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  if (variant === "icon") {
    return (
      <img
        src="/logo.png"
        alt="KickOff Rivals"
        className={cn(
          "object-contain",
          sizeClasses[size],
          "aspect-square",
          className,
        )}
      />
    );
  }

  if (variant === "text") {
    return (
      <span
        className={cn(
          "font-sport font-black italic tracking-tighter",
          textSizeClasses[size],
          className,
        )}
      >
        KICKOFF<span className="text-primary">RIVALS</span>
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/logo.png"
        alt="KickOff Rivals"
        className={cn(
          "object-contain",
          sizeClasses[size],
          "aspect-square",
        )}
      />
      <span
        className={cn(
          "font-sport font-black italic tracking-tighter text-white",
          textSizeClasses[size],
        )}
      >
        KICKOFF<span className="text-primary">RIVALS</span>
      </span>
    </div>
  );
}

export default RivalsLogo;
