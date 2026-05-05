import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const outcomes = await prisma.experimentOutcome.findMany({
      where: { result: 'UNDERPERFORMED' },
      include: { candidate: true },
    });

    const underperformers = outcomes.map(o => ({
      name: o.candidate.name,
      predicted: o.candidate.predictedSelectivity,
      actual: o.actualSelectivity,
      gap: Math.round((o.actualSelectivity - o.candidate.predictedSelectivity) * 10) / 10,
    }));

    const latestAnalysis = await prisma.residualAnalysis.findFirst({
      orderBy: { runAt: 'desc' },
    });

    let parsedAnalysis = null;
    if (latestAnalysis) {
      parsedAnalysis = {
        hypothesis: latestAnalysis.hypothesis,
        shapFeatures: JSON.parse(latestAnalysis.shapFeatures),
        followUpExperiment: null,
      };
    }

    return NextResponse.json({ underperformers, latestAnalysis: parsedAnalysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
