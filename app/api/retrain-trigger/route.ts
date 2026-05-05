import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project, ModelCheckpoint, RetrainLog, ExperimentOutcome } from '@/lib/models';
import { simulateRetrain } from '@/lib/groq';

export async function GET() {
  try {
    await connectDB();
    const checkpoints = await ModelCheckpoint.find().sort({ trainedAt: -1 });
    return NextResponse.json(checkpoints);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { apiKey } = await request.json();
    
    const project = await Project.findOne();
    if (!project) {
      return NextResponse.json({ error: 'No project found' }, { status: 404 });
    }

    const currentCheckpoint = await ModelCheckpoint.findOne({ status: 'ACTIVE' }).sort({ trainedAt: -1 });
    const outcomesCount = await ExperimentOutcome.countDocuments();
    
    const result = await simulateRetrain(apiKey, outcomesCount, currentCheckpoint?.version || 'v2.3');

    const versionNum = parseFloat(currentCheckpoint?.version.replace('v', '') || '2.3') + 0.1;
    const newVersion = `v${versionNum.toFixed(1)}`;

    const newCheckpoint = await ModelCheckpoint.create({
      projectId: project._id,
      version: newVersion,
      validationScore: result.newValidationScore || 0.87,
      status: 'ACTIVE',
      lineage: JSON.stringify({ 
        baseModel: 'GNN-ensemble', 
        trainedOn: 1247 + outcomesCount, 
        validatedOn: 312 
      }),
    });

    if (currentCheckpoint) {
      await ModelCheckpoint.findByIdAndUpdate(currentCheckpoint._id, { status: 'ROLLED_BACK' });
    }

    await RetrainLog.create({
      projectId: project._id,
      newPointCount: outcomesCount,
      checkpointVersion: newVersion,
      status: 'PROMOTED',
      validationScore: result.newValidationScore || 0.87,
    });

    return NextResponse.json({ checkpoint: newCheckpoint });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { checkpointId } = await request.json();

    await ModelCheckpoint.updateMany({ status: 'ACTIVE' }, { status: 'ROLLED_BACK' });
    await ModelCheckpoint.findByIdAndUpdate(checkpointId, { status: 'ACTIVE' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
