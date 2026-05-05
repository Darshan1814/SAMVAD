import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const candidate = await prisma.candidate.findUnique({
      where: { id: data.candidateId },
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const outcome = await prisma.experimentOutcome.create({
      data: {
        candidateId: data.candidateId,
        actualYield: parseFloat(data.actualYield),
        actualSelectivity: parseFloat(data.actualSelectivity),
        actualStability: parseFloat(data.actualStability),
        result: data.result,
        voiceNote: data.voiceNote,
        loggedBy: data.loggedBy,
      },
    });

    const diff = {
      predicted: candidate.predictedSelectivity,
      actual: parseFloat(data.actualSelectivity),
      gap: Math.round((parseFloat(data.actualSelectivity) - candidate.predictedSelectivity) * 10) / 10,
    };

    return NextResponse.json({ outcome, diff });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
