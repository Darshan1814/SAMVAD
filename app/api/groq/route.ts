import { NextRequest, NextResponse } from 'next/server';
import { generateCandidates, runResidualAnalysis, simulateRetrain } from '@/lib/groq';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { action, data, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }

    if (action === 'generateCandidates') {
      const candidates = await generateCandidates(apiKey, data);
      
      const project = await prisma.project.findFirst();
      if (project) {
        for (const candidate of candidates) {
          const perfScore = (candidate.predictedActivity * 0.4 + candidate.predictedSelectivity * 0.4 + candidate.predictedStability * 0.2) / 1.5;
          const procScore = Math.floor(Math.random() * 30) + 40;
          
          await prisma.candidate.create({
            data: {
              projectId: project.id,
              name: candidate.name,
              formula: candidate.formula,
              type: 'NOVEL',
              performanceScore: Math.round(perfScore * 10) / 10,
              procurementScore: procScore,
              predictedActivity: candidate.predictedActivity,
              predictedSelectivity: candidate.predictedSelectivity,
              predictedStability: candidate.predictedStability,
              failureRiskTags: JSON.stringify(candidate.failureRiskTags),
              source: 'AI-generated (Groq)',
            },
          });
        }
      }

      return NextResponse.json({ candidates });
    }

    if (action === 'runResidualAnalysis') {
      const analysis = await runResidualAnalysis(apiKey, data.underperformers);
      
      const project = await prisma.project.findFirst();
      const checkpoint = await prisma.modelCheckpoint.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { trainedAt: 'desc' },
      });

      if (project && checkpoint) {
        await prisma.residualAnalysis.create({
          data: {
            projectId: project.id,
            hypothesis: analysis.hypothesis,
            shapFeatures: JSON.stringify(analysis.shapFeatures),
            underperformers: JSON.stringify(data.underperformers),
            checkpointVersion: checkpoint.version,
          },
        });
      }

      return NextResponse.json({ analysis });
    }

    if (action === 'simulateRetrain') {
      const result = await simulateRetrain(apiKey, data.newPoints, data.currentVersion);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
