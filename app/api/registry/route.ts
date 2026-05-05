import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SupplierRegistry } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const suppliers = await SupplierRegistry.find().sort({ precursorName: 1 });
    return NextResponse.json(suppliers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const supplier = await SupplierRegistry.create({
      precursorName: data.precursorName,
      supplier: data.supplier,
      leadTimeDays: parseInt(data.leadTimeDays),
      available: data.available,
      region: data.region,
    });
    return NextResponse.json(supplier);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
