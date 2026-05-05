import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { simulateRetrain } from '@/lib/groq';

export async function GET() {
  try {
    const checkpoints = await prisma.modelCheckpoint.findMany({
      orderBy: { trainedAt: 'desc' },
    });
    return NextResponse.json(checkpoints);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();
    
    const project = await prisma.project.findFirst();
    if (!project) {
      return NextResponse.json({ error: 'No project found' }, { status: 404 });
    }

    const currentCheckpoint = await prisma.modelCheckpoint.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { trainedAt: 'desc' },
    });

    const outcomesCount = await prisma.experimentOutcome.count();
    
    const result = await simulateRetrain(apiKey, outcomesCount, currentCheckpoint?.version || 'v2.3');

    const versionNum = parseFloat(currentCheckpoint?.version.replace('v', '') || '2.3') + 0.1;
    const newVersion = `v${versionNum.toFixed(1)}`;

    const newCheckpoint = await prisma.modelCheckpoint.create({
      data: {
        projectId: project.id,
        version: newVersion,
        validationScore: result.newValidationScore || 0.87,
        status: 'ACTIVE',
        lineage: JSON.stringify({ 
          baseModel: 'GNN-ensemble', 
          trainedOn: 1247 + outcomesCount, 
          validatedOn: 312 
        }),
      },
    });

    if (currentCheckpoint) {
      await prisma.modelCheckpoint.update({
        where: { id: currentCheckpoint.id },
        data: { status: 'ROLLED_BACK' },
      });
    }

    await prisma.retrainLog.create({
      data: {
        projectId: project.id,
        newPointCount: outcomesCount,
        checkpointVersion: newVersion,
        status: 'PROMOTED',
        validationScore: result.newValidationScore || 0.87,
      },
    });

    return NextResponse.json({ checkpoint: newCheckpoint });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { checkpointId } = await request.json();

    await prisma.modelCheckpoint.updateMany({
      where: { status: 'ACTIVE' },
      data: { status: 'ROLLED_BACK' },
    });

    await prisma.modelCheckpoint.update({
      where: { id: checkpointId },
      data: { status: 'ACTIVE' },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
