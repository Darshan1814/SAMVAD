import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ExperimentOutcome, ResidualAnalysis } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    
    const outcomes = await ExperimentOutcome.find({ result: 'UNDERPERFORMED' }).populate('candidateId');

    const underperformers = outcomes.map((o: any) => ({
      name: o.candidateId?.name || 'Unknown',
      predicted: o.candidateId?.predictedSelectivity || 0,
      actual: o.actualSelectivity,
      gap: Math.round((o.actualSelectivity - (o.candidateId?.predictedSelectivity || 0)) * 10) / 10,
    }));

    const latestAnalysis = await ResidualAnalysis.findOne().sort({ runAt: -1 });

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
