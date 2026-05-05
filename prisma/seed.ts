const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create default project
  const project = await prisma.project.create({
    data: {
      name: 'Ethanol to Jet Fuel Campaign',
      targetReaction: 'C2H5OH → C8-C16 hydrocarbons (jet fuel range)',
      conditions: 'T: 300-450°C, P: 20-40 bar, H2/ethanol ratio: 3:1',
      selectivityGoal: 75.0,
    },
  });

  // Known catalysts
  const knownCandidates = [
    { name: 'Ni-ZSM5', formula: 'Ni0.05-H-ZSM5', activity: 82, selectivity: 71, stability: 120 },
    { name: 'Cu-ZnO/Al2O3', formula: 'Cu0.3Zn0.7O/Al2O3', activity: 76, selectivity: 68, stability: 95 },
    { name: 'Fe-Co/SiO2', formula: 'Fe0.6Co0.4/SiO2', activity: 79, selectivity: 73, stability: 110 },
    { name: 'Pt-Re/γ-Al2O3', formula: 'Pt0.3Re0.1/γ-Al2O3', activity: 88, selectivity: 79, stability: 140 },
    { name: 'Mo-W/ZrO2', formula: 'Mo0.15W0.05/ZrO2', activity: 74, selectivity: 66, stability: 88 },
    { name: 'Pd-Cu/C', formula: 'Pd0.05Cu0.15/C', activity: 81, selectivity: 72, stability: 105 },
    { name: 'Ru-Sn/TiO2', formula: 'Ru0.02Sn0.08/TiO2', activity: 85, selectivity: 77, stability: 125 },
    { name: 'Co-Mo/MCM-41', formula: 'Co0.1Mo0.2/MCM-41', activity: 77, selectivity: 69, stability: 98 },
    { name: 'Ni-Cu/SBA-15', formula: 'Ni0.4Cu0.2/SBA-15', activity: 80, selectivity: 74, stability: 115 },
    { name: 'Fe-Mn/CNT', formula: 'Fe0.5Mn0.3/CNT', activity: 73, selectivity: 65, stability: 85 },
    { name: 'Zn-Cr/Al2O3', formula: 'Zn0.6Cr0.2/Al2O3', activity: 78, selectivity: 70, stability: 100 },
    { name: 'V-Nb/SiO2', formula: 'V0.1Nb0.05/SiO2', activity: 75, selectivity: 67, stability: 92 },
    { name: 'Rh-Ir/CeO2', formula: 'Rh0.01Ir0.02/CeO2', activity: 89, selectivity: 81, stability: 150 },
    { name: 'Cu-Ni/ZnO', formula: 'Cu0.4Ni0.3/ZnO', activity: 76, selectivity: 68, stability: 94 },
    { name: 'Co-Fe/γ-Al2O3', formula: 'Co0.5Fe0.3/γ-Al2O3', activity: 79, selectivity: 71, stability: 108 },
    { name: 'Pt-Sn/MgO', formula: 'Pt0.02Sn0.05/MgO', activity: 86, selectivity: 78, stability: 135 },
    { name: 'Ni-Mo/HY', formula: 'Ni0.1Mo0.15/HY', activity: 77, selectivity: 69, stability: 97 },
    { name: 'Pd-Ag/SiO2', formula: 'Pd0.03Ag0.07/SiO2', activity: 83, selectivity: 75, stability: 118 },
    { name: 'Fe-K/C', formula: 'Fe0.7K0.05/C', activity: 72, selectivity: 64, stability: 82 },
    { name: 'Cu-Ce/ZrO2', formula: 'Cu0.25Ce0.15/ZrO2', activity: 78, selectivity: 70, stability: 102 },
    { name: 'Ru-Co/Al2O3', formula: 'Ru0.03Co0.2/Al2O3', activity: 84, selectivity: 76, stability: 122 },
    { name: 'Ni-La/SiO2', formula: 'Ni0.35La0.1/SiO2', activity: 75, selectivity: 67, stability: 90 },
    { name: 'Mo-Co/TiO2', formula: 'Mo0.12Co0.18/TiO2', activity: 76, selectivity: 68, stability: 96 },
  ];

  for (const cat of knownCandidates) {
    const perfScore = (cat.activity * 0.4 + cat.selectivity * 0.4 + cat.stability * 0.2) / 1.5;
    const procScore = Math.floor(Math.random() * 40) + 50; // 50-90
    await prisma.candidate.create({
      data: {
        projectId: project.id,
        name: cat.name,
        formula: cat.formula,
        type: 'KNOWN',
        performanceScore: Math.round(perfScore * 10) / 10,
        procurementScore: procScore,
        predictedActivity: cat.activity,
        predictedSelectivity: cat.selectivity,
        predictedStability: cat.stability,
        failureRiskTags: JSON.stringify(['sintering', 'coking'].slice(0, Math.random() > 0.5 ? 1 : 2)),
        source: 'Literature database',
      },
    });
  }

  // Novel AI-proposed candidates
  const novelCandidates = [
    { name: 'Ir-Ga/Beta', formula: 'Ir0.015Ga0.08/Beta', activity: 87, selectivity: 80, stability: 145 },
    { name: 'Pt-W/USY', formula: 'Pt0.025W0.06/USY', activity: 90, selectivity: 82, stability: 155 },
    { name: 'Ru-Zn/MCM-22', formula: 'Ru0.02Zn0.12/MCM-22', activity: 85, selectivity: 78, stability: 130 },
    { name: 'Pd-In/SiO2-Al2O3', formula: 'Pd0.04In0.09/SiO2-Al2O3', activity: 88, selectivity: 81, stability: 142 },
    { name: 'Rh-Ce/ZSM-12', formula: 'Rh0.012Ce0.1/ZSM-12', activity: 86, selectivity: 79, stability: 138 },
    { name: 'Ni-Ga-La/SBA-16', formula: 'Ni0.3Ga0.05La0.08/SBA-16', activity: 84, selectivity: 77, stability: 128 },
    { name: 'Co-Mn-K/CNF', formula: 'Co0.4Mn0.2K0.03/CNF', activity: 83, selectivity: 76, stability: 125 },
    { name: 'Cu-Zr-Y/MFI', formula: 'Cu0.28Zr0.1Y0.05/MFI', activity: 85, selectivity: 78, stability: 132 },
  ];

  for (const cat of novelCandidates) {
    const perfScore = (cat.activity * 0.4 + cat.selectivity * 0.4 + cat.stability * 0.2) / 1.5;
    const procScore = Math.floor(Math.random() * 30) + 40; // 40-70 (lower for novel)
    await prisma.candidate.create({
      data: {
        projectId: project.id,
        name: cat.name,
        formula: cat.formula,
        type: 'NOVEL',
        performanceScore: Math.round(perfScore * 10) / 10,
        procurementScore: procScore,
        predictedActivity: cat.activity,
        predictedSelectivity: cat.selectivity,
        predictedStability: cat.stability,
        failureRiskTags: JSON.stringify(['novel_composition', 'synthesis_complexity']),
        source: 'AI-generated (Groq)',
      },
    });
  }

  // Get some candidates for outcomes
  const candidates = await prisma.candidate.findMany({ take: 3 });

  // Experiment outcomes (2 underperformed, 1 exceeded)
  await prisma.experimentOutcome.create({
    data: {
      candidateId: candidates[0].id,
      actualYield: 68.5,
      actualSelectivity: 61.2,
      actualStability: 95.0,
      result: 'UNDERPERFORMED',
      voiceNote: 'Observed significant coking after 80 hours. Selectivity dropped below target.',
      loggedBy: 'Dr. Sharma',
    },
  });

  await prisma.experimentOutcome.create({
    data: {
      candidateId: candidates[1].id,
      actualYield: 72.3,
      actualSelectivity: 63.8,
      actualStability: 88.0,
      result: 'UNDERPERFORMED',
      voiceNote: 'Catalyst deactivation faster than predicted. Possible metal sintering.',
      loggedBy: 'Dr. Patel',
    },
  });

  await prisma.experimentOutcome.create({
    data: {
      candidateId: candidates[2].id,
      actualYield: 85.2,
      actualSelectivity: 81.5,
      actualStability: 128.0,
      result: 'EXCEEDED',
      voiceNote: 'Excellent performance. Stability exceeded predictions by 18 hours.',
      loggedBy: 'Dr. Kumar',
    },
  });

  // Supplier registry
  await prisma.supplierRegistry.createMany({
    data: [
      { precursorName: 'Nickel nitrate hexahydrate', supplier: 'Loba Chemie', leadTimeDays: 7, available: true, region: 'Mumbai' },
      { precursorName: 'Zeolite ZSM-5', supplier: 'SRL Chemicals', leadTimeDays: 14, available: true, region: 'Delhi' },
      { precursorName: 'Copper acetate', supplier: 'Merck India', leadTimeDays: 5, available: true, region: 'Bangalore' },
      { precursorName: 'Platinum chloride', supplier: 'Sigma-Aldrich India', leadTimeDays: 21, available: true, region: 'Hyderabad' },
      { precursorName: 'Cobalt nitrate', supplier: 'Himedia Laboratories', leadTimeDays: 10, available: true, region: 'Mumbai' },
      { precursorName: 'Silica gel (high purity)', supplier: 'Rankem', leadTimeDays: 12, available: false, region: 'Chennai' },
    ],
  });

  // Initial checkpoint
  await prisma.modelCheckpoint.create({
    data: {
      projectId: project.id,
      version: 'v2.3',
      validationScore: 0.847,
      status: 'ACTIVE',
      lineage: JSON.stringify({ baseModel: 'GNN-ensemble', trainedOn: 1247, validatedOn: 312 }),
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
