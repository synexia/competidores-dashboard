"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StationRow } from "./station-row";
import type { Station } from "@/lib/types";

interface StationsTableProps {
  stations: Station[];
  onUpdate: (idestacion: string, data: Partial<Station>) => void;
}

export function StationsTable({ stations, onUpdate }: StationsTableProps) {
  if (stations.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed bg-card py-16 text-muted-foreground">
        No se encontraron estaciones.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="whitespace-nowrap font-semibold text-foreground">
                ID Estacion
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground min-w-[160px]">
                Nombre
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground min-w-[120px]">
                Zona
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-center">
                Propia
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-center">
                Visible
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-center">
                Orden
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-right">
                G95
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-right">
                G98
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-right">
                Gasoleo
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-right">
                G. Premium
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-right">
                GLP
              </TableHead>
              <TableHead className="whitespace-nowrap font-semibold text-foreground text-right">
                Actualizado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((station) => (
              <StationRow
                key={station.idestacion}
                station={station}
                onUpdate={onUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
