import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project, Candidate, ExperimentOutcome, ResidualAnalysis, RetrainLog, ModelCheckpoint, SupplierRegistry } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    
    const project = await Project.findOne();
    const candidates = await Candidate.find({ projectId: project?._id });
    const outcomes = await ExperimentOutcome.find().populate('candidateId');
    const residualAnalyses = await ResidualAnalysis.find({ projectId: project?._id });
    const retrainLogs = await RetrainLog.find({ projectId: project?._id });
    const modelCheckpoints = await ModelCheckpoint.find({ projectId: project?._id });
    const suppliers = await SupplierRegistry.find();

    return NextResponse.json({
      project,
      candidates,
      outcomes,
      residualAnalyses,
      retrainLogs,
      modelCheckpoints,
      suppliers,
      exportedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
