"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";

interface StationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  zona: string;
  onZonaChange: (value: string) => void;
  visible: string;
  onVisibleChange: (value: string) => void;
  zonas: string[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function StationFilters({
  search,
  onSearchChange,
  zona,
  onZonaChange,
  visible,
  onVisibleChange,
  zonas,
  onRefresh,
  isRefreshing,
}: StationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID o nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card text-card-foreground"
          />
        </div>
        <Select value={zona} onValueChange={onZonaChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card text-card-foreground">
            <SelectValue placeholder="Todas las zonas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las zonas</SelectItem>
            {zonas.map((z) => (
              <SelectItem key={z} value={z}>
                {z}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={visible} onValueChange={onVisibleChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card text-card-foreground">
            <SelectValue placeholder="Visibilidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="true">Visibles</SelectItem>
            <SelectItem value="false">Ocultas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="shrink-0"
      >
        <RefreshCw
          className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        Actualizar precios
      </Button>
    </div>
  );
}
