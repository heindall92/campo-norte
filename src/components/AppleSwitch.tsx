"use client";

import { cn } from "@/lib/utils";

/** Interruptor estilo iOS (switch). */
export function AppleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ease-out",
        checked ? "bg-[#34c759]" : "bg-[#e9e9eb] dark:bg-[#39393d]",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out",
          checked && "translate-x-[20px]",
        )}
      />
    </button>
  );
}
