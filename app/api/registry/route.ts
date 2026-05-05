import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const suppliers = await prisma.supplierRegistry.findMany({
      orderBy: { precursorName: 'asc' },
    });
    return NextResponse.json(suppliers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const supplier = await prisma.supplierRegistry.create({
      data: {
        precursorName: data.precursorName,
        supplier: data.supplier,
        leadTimeDays: parseInt(data.leadTimeDays),
        available: data.available,
        region: data.region,
      },
    });
    return NextResponse.json(supplier);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
