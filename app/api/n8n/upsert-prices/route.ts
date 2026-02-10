import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function toDecimal(value: unknown): Prisma.Decimal | null {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value).replace(",", ".");
  const num = Number.parseFloat(str);
  if (Number.isNaN(num)) return null;
  return new Prisma.Decimal(str);
}

function mapKey(key: string): string {
  const lower = key.toLowerCase().trim();
  if (lower === "gasoleo plus" || lower === "gasoleopremium") return "gasoleoPremium";
  if (lower === "glpdata" || lower === "glp") return "glp";
  return key;
}

interface IncomingPrice {
  idestacion: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.N8N_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items: IncomingPrice[] = Array.isArray(body) ? body : [body];

    const results = [];

    for (const item of items) {
      if (!item.idestacion) {
        results.push({ error: "Missing idestacion", item });
        continue;
      }

      const mapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(item)) {
        mapped[mapKey(key)] = value;
      }

      const idestacion = String(mapped.idestacion);

      // Ensure StationConfig exists
      await prisma.stationConfig.upsert({
        where: { idestacion },
        create: { idestacion },
        update: {},
      });

      // Upsert prices
      const priceData = {
        gasolina95: toDecimal(mapped.gasolina95),
        gasolina98: toDecimal(mapped.gasolina98),
        gasoleo: toDecimal(mapped.gasoleo),
        gasoleoPremium: toDecimal(mapped.gasoleoPremium),
        glp: toDecimal(mapped.glp),
        dif95: toDecimal(mapped.dif95),
        dif98: toDecimal(mapped.dif98),
        difGasoleo: toDecimal(mapped.difGasoleo),
        difGasoleoPremium: toDecimal(mapped.difGasoleoPremium),
        difGlp: toDecimal(mapped.difGlp),
      };

      await prisma.stationPricesLatest.upsert({
        where: { idestacion },
        create: { idestacion, ...priceData },
        update: priceData,
      });

      results.push({ idestacion, status: "ok" });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error upserting prices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
