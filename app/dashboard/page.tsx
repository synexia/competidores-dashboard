import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios Competencia - Dashboard",
  description: "Monitor de precios de gasolineras competidoras",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
