export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project, Candidate, ExperimentOutcome, ModelCheckpoint } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    
    const project = await Project.findOne();
    const candidatesCount = await Candidate.countDocuments({ projectId: project?._id });
    const outcomesCount = await ExperimentOutcome.countDocuments();
    const checkpoint = await ModelCheckpoint.findOne({ status: 'ACTIVE' }).sort({ trainedAt: -1 });

    const recentOutcomes = await ExperimentOutcome.find()
      .sort({ loggedAt: -1 })
      .limit(5)
      .populate('candidateId');

    const chartData = recentOutcomes.map((o: any) => ({
      name: o.candidateId?.name?.substring(0, 10) || 'Unknown',
      predicted: o.candidateId?.predictedSelectivity || 0,
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
