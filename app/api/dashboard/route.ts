import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const project = await prisma.project.findFirst();
    const candidatesCount = await prisma.candidate.count({ where: { projectId: project?.id } });
    const outcomesCount = await prisma.experimentOutcome.count();
    const checkpoint = await prisma.modelCheckpoint.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { trainedAt: 'desc' },
    });

    const recentOutcomes = await prisma.experimentOutcome.findMany({
      take: 5,
      orderBy: { loggedAt: 'desc' },
      include: { candidate: true },
    });

    const chartData = recentOutcomes.map(o => ({
      name: o.candidate.name.substring(0, 10),
      predicted: o.candidate.predictedSelectivity,
      actual: o.actualSelectivity,
    })).reverse();

    return NextResponse.json({
      project,
      candidatesCount,
      outcomesCount,
      checkpoint,
      recentOutcomes,
      chartData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
