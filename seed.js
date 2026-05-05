const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://202301040255_db_user:JSBhugcSbkw4uCjD@cluster01.v7kftdq.mongodb.net/samvada?retryWrites=true&w=majority';

const ProjectSchema = new mongoose.Schema({
  name: String,
  targetReaction: String,
  conditions: String,
  selectivityGoal: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CandidateSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  name: String,
  formula: String,
  type: String,
  performanceScore: Number,
  procurementScore: Number,
  predictedActivity: Number,
  predictedSelectivity: Number,
  predictedStability: Number,
  failureRiskTags: String,
  source: String,
  createdAt: { type: Date, default: Date.now },
});

const ExperimentOutcomeSchema = new mongoose.Schema({
  candidateId: mongoose.Schema.Types.ObjectId,
  actualYield: Number,
  actualSelectivity: Number,
  actualStability: Number,
  result: String,
  voiceNote: String,
  loggedBy: String,
  loggedAt: { type: Date, default: Date.now },
});

const SupplierRegistrySchema = new mongoose.Schema({
  precursorName: String,
  supplier: String,
  leadTimeDays: Number,
  available: Boolean,
  region: String,
});

const ModelCheckpointSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  version: String,
  trainedAt: { type: Date, default: Date.now },
  validationScore: Number,
  status: String,
  lineage: String,
});

const Project = mongoose.model('Project', ProjectSchema);
const Candidate = mongoose.model('Candidate', CandidateSchema);
const ExperimentOutcome = mongoose.model('ExperimentOutcome', ExperimentOutcomeSchema);
const SupplierRegistry = mongoose.model('SupplierRegistry', SupplierRegistrySchema);
const ModelCheckpoint = mongoose.model('ModelCheckpoint', ModelCheckpointSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Candidate.deleteMany({});
    await ExperimentOutcome.deleteMany({});
    await SupplierRegistry.deleteMany({});
    await ModelCheckpoint.deleteMany({});

    // Create project
    const project = await Project.create({
      name: 'Ethanol to Jet Fuel Campaign',
      targetReaction: 'C2H5OH → C8-C16 hydrocarbons (jet fuel range)',
      conditions: 'T: 300-450°C, P: 20-40 bar, H2/ethanol ratio: 3:1',
      selectivityGoal: 75.0,
    });

    console.log('✅ Project created');

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
    ];

    const candidateIds = [];
    for (const cat of knownCandidates) {
      const perfScore = (cat.activity * 0.4 + cat.selectivity * 0.4 + cat.stability * 0.2) / 1.5;
      const procScore = Math.floor(Math.random() * 40) + 50;
      const candidate = await Candidate.create({
        projectId: project._id,
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
      });
      candidateIds.push(candidate._id);
    }

    console.log('✅ Known candidates created');

    // Novel catalysts
    const novelCandidates = [
      { name: 'Ir-Ga/Beta', formula: 'Ir0.015Ga0.08/Beta', activity: 87, selectivity: 80, stability: 145 },
      { name: 'Pt-W/USY', formula: 'Pt0.025W0.06/USY', activity: 90, selectivity: 82, stability: 155 },
      { name: 'Ru-Zn/MCM-22', formula: 'Ru0.02Zn0.12/MCM-22', activity: 85, selectivity: 78, stability: 130 },
    ];

    for (const cat of novelCandidates) {
      const perfScore = (cat.activity * 0.4 + cat.selectivity * 0.4 + cat.stability * 0.2) / 1.5;
      const procScore = Math.floor(Math.random() * 30) + 40;
      const candidate = await Candidate.create({
        projectId: project._id,
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
      });
      candidateIds.push(candidate._id);
    }

    console.log('✅ Novel candidates created');

    // Experiment outcomes
    await ExperimentOutcome.create({
      candidateId: candidateIds[0],
      actualYield: 68.5,
      actualSelectivity: 61.2,
      actualStability: 95.0,
      result: 'UNDERPERFORMED',
      voiceNote: 'Observed significant coking after 80 hours.',
      loggedBy: 'Dr. Sharma',
    });

    await ExperimentOutcome.create({
      candidateId: candidateIds[1],
      actualYield: 72.3,
      actualSelectivity: 63.8,
      actualStability: 88.0,
      result: 'UNDERPERFORMED',
      voiceNote: 'Catalyst deactivation faster than predicted.',
      loggedBy: 'Dr. Patel',
    });

    await ExperimentOutcome.create({
      candidateId: candidateIds[2],
      actualYield: 85.2,
      actualSelectivity: 81.5,
      actualStability: 128.0,
      result: 'EXCEEDED',
      voiceNote: 'Excellent performance.',
      loggedBy: 'Dr. Kumar',
    });

    console.log('✅ Experiment outcomes created');

    // Supplier registry
    await SupplierRegistry.insertMany([
      { precursorName: 'Nickel nitrate hexahydrate', supplier: 'Loba Chemie', leadTimeDays: 7, available: true, region: 'Mumbai' },
      { precursorName: 'Zeolite ZSM-5', supplier: 'SRL Chemicals', leadTimeDays: 14, available: true, region: 'Delhi' },
      { precursorName: 'Copper acetate', supplier: 'Merck India', leadTimeDays: 5, available: true, region: 'Bangalore' },
      { precursorName: 'Platinum chloride', supplier: 'Sigma-Aldrich India', leadTimeDays: 21, available: true, region: 'Hyderabad' },
      { precursorName: 'Cobalt nitrate', supplier: 'Himedia Laboratories', leadTimeDays: 10, available: true, region: 'Mumbai' },
      { precursorName: 'Silica gel (high purity)', supplier: 'Rankem', leadTimeDays: 12, available: false, region: 'Chennai' },
    ]);

    console.log('✅ Supplier registry created');

    // Model checkpoint
    await ModelCheckpoint.create({
      projectId: project._id,
      version: 'v2.3',
      validationScore: 0.847,
      status: 'ACTIVE',
      lineage: JSON.stringify({ baseModel: 'GNN-ensemble', trainedOn: 1247, validatedOn: 312 }),
    });

    console.log('✅ Model checkpoint created');
    console.log('✅ Database seeded successfully');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
