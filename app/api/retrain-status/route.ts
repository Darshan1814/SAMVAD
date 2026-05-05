export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ExperimentOutcome, ModelCheckpoint, RetrainLog } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    
    const outcomes = await ExperimentOutcome.countDocuments();
    const checkpoint = await ModelCheckpoint.findOne({ status: 'ACTIVE' }).sort({ trainedAt: -1 });
    const lastRetrain = await RetrainLog.findOne().sort({ triggeredAt: -1 });

    let countSinceRetrain = outcomes;
    if (lastRetrain) {
      countSinceRetrain = await ExperimentOutcome.countDocuments({
        loggedAt: { $gte: lastRetrain.triggeredAt }
      });
    }

    return NextResponse.json({
      count: countSinceRetrain,
      total: 20,
      version: checkpoint?.version || 'v2.3',
    });
  } catch (error) {
    return NextResponse.json({ count: 0, total: 20, version: 'v2.3' });
  }
}
