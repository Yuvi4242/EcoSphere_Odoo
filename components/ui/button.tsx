import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

/**
 * Standard primitive Button component.
 */
export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 duration-200 focus:outline-none",
        variant === "primary" && "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs",
        variant === "secondary" && "bg-slate-200 hover:bg-slate-300 text-slate-800",
        variant === "danger" && "bg-rose-600 hover:bg-rose-500 text-white",
        variant === "ghost" && "hover:bg-slate-100 text-slate-600",
        className
      )}
      {...props}
    />
  );
}
