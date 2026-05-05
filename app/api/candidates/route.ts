import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(candidates);
}
