import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const outcomes = await prisma.experimentOutcome.count();
    const checkpoint = await prisma.modelCheckpoint.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { trainedAt: 'desc' },
    });

    const lastRetrain = await prisma.retrainLog.findFirst({
      orderBy: { triggeredAt: 'desc' },
    });

    const countSinceRetrain = lastRetrain 
      ? await prisma.experimentOutcome.count({
          where: { loggedAt: { gte: lastRetrain.triggeredAt } }
        })
      : outcomes;

    return NextResponse.json({
      count: countSinceRetrain,
      total: 20,
      version: checkpoint?.version || 'v2.3',
    });
  } catch (error) {
    return NextResponse.json({ count: 0, total: 20, version: 'v2.3' });
  }
}
