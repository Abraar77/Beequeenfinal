import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "pink" | "green" | "red" | "gray";
  className?: string;
}

export default function Badge({ children, variant = "gold", className }: BadgeProps) {
  const variants = {
    gold: "badge-gold",
    pink: "badge-pink",
    green: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
    red: "bg-red-500/10 border border-red-500/30 text-red-400",
    gray: "bg-white/5 border border-white/10 text-gray-400",
  };

  return (
    <span className={cn("inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full", variants[variant], className)}>
      {children}
    </span>
  );
}
