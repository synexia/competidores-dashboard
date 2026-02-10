"use client";

import { cn } from "@/lib/utils";

interface PriceCellProps {
  price: number | null;
  diff: number | null;
}

export function PriceCell({ price, diff }: PriceCellProps) {
  if (price === null && diff === null) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="font-mono text-sm font-medium text-foreground tabular-nums">
        {price !== null ? price.toFixed(3) : "-"}
      </span>
      {diff !== null && (
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            diff > 0 && "text-[hsl(var(--negative))]",
            diff < 0 && "text-[hsl(var(--positive))]",
            diff === 0 && "text-muted-foreground"
          )}
        >
          {diff > 0 ? "+" : ""}
          {diff.toFixed(3)}
        </span>
      )}
    </div>
  );
}
