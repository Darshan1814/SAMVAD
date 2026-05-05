import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const project = await prisma.project.findFirst({
      include: {
        candidates: true,
        residualAnalyses: true,
        retrainLogs: true,
        modelCheckpoints: true,
      },
    });

    const outcomes = await prisma.experimentOutcome.findMany({
      include: { candidate: true },
    });

    const suppliers = await prisma.supplierRegistry.findMany();

    return NextResponse.json({
      project,
      outcomes,
      suppliers,
      exportedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
