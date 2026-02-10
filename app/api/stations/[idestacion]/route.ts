import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  displayName: z.string().nullable().optional(),
  zona: z.string().nullable().optional(),
  propia: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idestacion: string }> }
) {
  try {
    const { idestacion } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.stationConfig.update({
      where: { idestacion },
      data: parsed.data,
      include: { prices: true },
    });

    // Serialize Decimal fields
    const serialized = {
      ...updated,
      prices: updated.prices
        ? {
            ...updated.prices,
            gasolina95: updated.prices.gasolina95?.toNumber() ?? null,
            gasolina98: updated.prices.gasolina98?.toNumber() ?? null,
            gasoleo: updated.prices.gasoleo?.toNumber() ?? null,
            gasoleoPremium: updated.prices.gasoleoPremium?.toNumber() ?? null,
            glp: updated.prices.glp?.toNumber() ?? null,
            dif95: updated.prices.dif95?.toNumber() ?? null,
            dif98: updated.prices.dif98?.toNumber() ?? null,
            difGasoleo: updated.prices.difGasoleo?.toNumber() ?? null,
            difGasoleoPremium:
              updated.prices.difGasoleoPremium?.toNumber() ?? null,
            difGlp: updated.prices.difGlp?.toNumber() ?? null,
          }
        : null,
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error updating station:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
