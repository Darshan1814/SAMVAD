import { NextResponse } from 'next/server';
import { 
  scoreSynthesizability, 
  tagFailureModes, 
  optimizeLeadTime, 
  predictOptimalConditions, 
  structureVoiceObservations 
} from '@/lib/groq';
import { HARDCODED_SUPPLIERS } from '@/lib/data/hardcoded_entries';

const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export async function POST(req: Request) {
  try {
    const { tool, payload } = await req.json();

    if (!API_KEY) {
      return NextResponse.json({ error: 'Groq API Key not found in environment' }, { status: 500 });
    }

    let result;
    switch (tool) {
      case 'synthesizability':
        result = await scoreSynthesizability(API_KEY, payload.formula, HARDCODED_SUPPLIERS);
        break;
      case 'failure-tagger':
        result = await tagFailureModes(API_KEY, payload.notes);
        break;
      case 'lead-time':
        result = await optimizeLeadTime(API_KEY, payload.precursors, HARDCODED_SUPPLIERS);
        break;
      case 'condition-predictor':
        result = await predictOptimalConditions(API_KEY, payload.formula, payload.target);
        break;
      case 'voice-structurer':
        result = await structureVoiceObservations(API_KEY, payload.transcript, payload.language);
        break;
      default:
        return NextResponse.json({ error: 'Invalid tool' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
