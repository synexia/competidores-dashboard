import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const zona = searchParams.get("zona") || "";
    const visible = searchParams.get("visible");

    const where: Prisma.StationConfigWhereInput = {};

    if (q) {
      where.OR = [
        { idestacion: { contains: q, mode: "insensitive" } },
        { displayName: { contains: q, mode: "insensitive" } },
      ];
    }

    if (zona) {
      where.zona = zona;
    }

    if (visible === "true") {
      where.isVisible = true;
    } else if (visible === "false") {
      where.isVisible = false;
    }

    const stations = await prisma.stationConfig.findMany({
      where,
      include: { prices: true },
      orderBy: [{ sortOrder: "asc" }, { idestacion: "asc" }],
    });

    // Serialize Decimal fields to numbers for JSON
    const serialized = stations.map((s) => ({
      ...s,
      prices: s.prices
        ? {
            ...s.prices,
            gasolina95: s.prices.gasolina95?.toNumber() ?? null,
            gasolina98: s.prices.gasolina98?.toNumber() ?? null,
            gasoleo: s.prices.gasoleo?.toNumber() ?? null,
            gasoleoPremium: s.prices.gasoleoPremium?.toNumber() ?? null,
            glp: s.prices.glp?.toNumber() ?? null,
            dif95: s.prices.dif95?.toNumber() ?? null,
            dif98: s.prices.dif98?.toNumber() ?? null,
            difGasoleo: s.prices.difGasoleo?.toNumber() ?? null,
            difGasoleoPremium: s.prices.difGasoleoPremium?.toNumber() ?? null,
            difGlp: s.prices.difGlp?.toNumber() ?? null,
          }
        : null,
    }));

    // Get distinct zonas for filter dropdown
    const zonas = await prisma.stationConfig.findMany({
      where: { zona: { not: null } },
      select: { zona: true },
      distinct: ["zona"],
      orderBy: { zona: "asc" },
    });

    return NextResponse.json({
      stations: serialized,
      zonas: zonas.map((z) => z.zona).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
