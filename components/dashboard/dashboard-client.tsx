"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { StationFilters } from "./station-filters";
import { StationsTable } from "./stations-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Station, StationsResponse } from "@/lib/types";
import { Fuel } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function buildUrl(search: string, zona: string, visible: string) {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (zona && zona !== "all") params.set("zona", zona);
  if (visible && visible !== "all") params.set("visible", visible);
  return `/api/stations?${params.toString()}`;
}

export function DashboardClient() {
  const [search, setSearch] = useState("");
  const [zona, setZona] = useState("all");
  const [visible, setVisible] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => setDebouncedSearch(value), 300);
      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const { data, error, isLoading, mutate } = useSWR<StationsResponse>(
    buildUrl(debouncedSearch, zona, visible),
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleUpdate = useCallback(
    async (idestacion: string, updates: Partial<Station>) => {
      try {
        const res = await fetch(`/api/stations/${idestacion}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          throw new Error("Error al actualizar");
        }

        toast.success("Estacion actualizada");
        mutate();
      } catch {
        toast.error("Error al actualizar la estacion");
      }
    },
    [mutate]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/actions/trigger-refresh", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Error al actualizar precios");
      }

      toast.success("Actualizacion de precios iniciada");
      // Wait a bit then refetch data
      setTimeout(() => mutate(), 3000);
    } catch {
      toast.error("Error al activar la actualizacion de precios");
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Fuel className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Precios Competencia
            </h1>
            <p className="text-sm text-muted-foreground leading-tight">
              Monitor de precios de gasolineras
            </p>
          </div>
          {data?.stations && (
            <span className="ml-auto text-sm text-muted-foreground tabular-nums">
              {data.stations.length} estaciones
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4">
          <StationFilters
            search={search}
            onSearchChange={handleSearchChange}
            zona={zona}
            onZonaChange={setZona}
            visible={visible}
            onVisibleChange={setVisible}
            zonas={data?.zonas ?? []}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Error al cargar las estaciones. Verifica que la base de datos este
              configurada correctamente.
            </div>
          )}

          {data && (
            <StationsTable
              stations={data.stations}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </main>
    </div>
  );
}
