import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Candidate } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json(candidates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
