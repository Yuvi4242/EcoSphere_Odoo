import React from "react";
import { cn } from "@/lib/utils";

/**
 * Standard primitive Card container component.
 */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white border border-slate-200 rounded-2xl p-6 shadow-xs", className)}
      {...props}
    />
  );
}
