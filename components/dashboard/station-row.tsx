"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { EditableCell } from "./editable-cell";
import { PriceCell } from "./price-cell";
import type { Station } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StationRowProps {
  station: Station;
  onUpdate: (idestacion: string, data: Partial<Station>) => void;
}

export function StationRow({ station, onUpdate }: StationRowProps) {
  const p = station.prices;

  return (
    <TableRow
      className={cn(
        !station.isVisible && "opacity-60",
        station.propia && "bg-[hsl(var(--primary)/0.04)]"
      )}
    >
      <TableCell className="font-mono text-xs font-medium text-foreground whitespace-nowrap">
        <div className="flex items-center gap-2">
          {station.idestacion}
          {station.propia && (
            <Badge variant="default" className="text-[10px] px-1.5 py-0">
              Propia
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <EditableCell
          value={station.displayName || ""}
          onSave={(val) =>
            onUpdate(station.idestacion, {
              displayName: val || null,
            })
          }
          placeholder="Sin nombre"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={station.zona || ""}
          onSave={(val) =>
            onUpdate(station.idestacion, { zona: val || null })
          }
          placeholder="Sin zona"
        />
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={station.propia}
          onCheckedChange={(checked) =>
            onUpdate(station.idestacion, { propia: checked })
          }
          aria-label={`Marcar ${station.idestacion} como propia`}
        />
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={station.isVisible}
          onCheckedChange={(checked) =>
            onUpdate(station.idestacion, { isVisible: checked })
          }
          aria-label={`Cambiar visibilidad de ${station.idestacion}`}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={String(station.sortOrder)}
          onSave={(val) =>
            onUpdate(station.idestacion, {
              sortOrder: Number.parseInt(val, 10) || 0,
            })
          }
          type="number"
          className="w-16 text-center"
        />
      </TableCell>
      <TableCell className="text-right">
        <PriceCell price={p?.gasolina95 ?? null} diff={p?.dif95 ?? null} />
      </TableCell>
      <TableCell className="text-right">
        <PriceCell price={p?.gasolina98 ?? null} diff={p?.dif98 ?? null} />
      </TableCell>
      <TableCell className="text-right">
        <PriceCell price={p?.gasoleo ?? null} diff={p?.difGasoleo ?? null} />
      </TableCell>
      <TableCell className="text-right">
        <PriceCell
          price={p?.gasoleoPremium ?? null}
          diff={p?.difGasoleoPremium ?? null}
        />
      </TableCell>
      <TableCell className="text-right">
        <PriceCell price={p?.glp ?? null} diff={p?.difGlp ?? null} />
      </TableCell>
      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
        {p?.updatedAt
          ? new Date(p.updatedAt).toLocaleString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </TableCell>
    </TableRow>
  );
}
