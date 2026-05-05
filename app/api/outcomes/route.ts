import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Candidate, ExperimentOutcome } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const candidate = await Candidate.findById(data.candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const outcome = await ExperimentOutcome.create({
      candidateId: data.candidateId,
      actualYield: parseFloat(data.actualYield),
      actualSelectivity: parseFloat(data.actualSelectivity),
      actualStability: parseFloat(data.actualStability),
      result: data.result,
      voiceNote: data.voiceNote,
      loggedBy: data.loggedBy,
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
