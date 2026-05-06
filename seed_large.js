const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://202301040255_db_user:JSBhugcSbkw4uCjD@cluster01.v7kftdq.mongodb.net/samvada?retryWrites=true&w=majority';

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

const SupplierRegistrySchema = new mongoose.Schema({
  precursorName: String,
  supplier: String,
  leadTimeDays: Number,
  available: Boolean,
  region: String,
});

const Project = mongoose.model('Project', ProjectSchema);
const Candidate = mongoose.model('Candidate', CandidateSchema);
const SupplierRegistry = mongoose.model('SupplierRegistry', SupplierRegistrySchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create project if not exists
    let project = await Project.findOne({ name: 'Ethanol to Jet Fuel Campaign' });
    if (!project) {
      project = await Project.create({
        name: 'Ethanol to Jet Fuel Campaign',
        targetReaction: 'C2H5OH → C8-C16 hydrocarbons (jet fuel range)',
        conditions: 'T: 300-450°C, P: 20-40 bar, H2/ethanol ratio: 3:1',
        selectivityGoal: 75.0,
      });
    }

    // Generate 1000+ Candidates
    console.log('Generating 1000+ candidates...');
    const candidates = [];
    const metals = ['Ni', 'Cu', 'Fe', 'Pt', 'Pd', 'Ru', 'Ir', 'Rh', 'Co', 'Mo', 'W', 'Zn', 'Sn', 'Ga', 'Mn', 'Ag', 'Au', 'Cr', 'V', 'Ti', 'Zr', 'Hf', 'Nb', 'Ta'];
    const supports = ['ZSM-5', 'Al2O3', 'SiO2', 'TiO2', 'ZrO2', 'MCM-41', 'SBA-15', 'CNT', 'Graphene', 'Beta', 'USY', 'MCM-22', 'SAPO-34', 'HY', 'NaY', 'Ferrierite'];
    const promoters = ['Re', 'Ga', 'In', 'Sn', 'B', 'P', 'K', 'Mg', 'Ca', 'Ba', 'Sr', 'La', 'Ce', 'Sm', 'Y', 'Sc'];

    for (let i = 0; i < 1100; i++) {
      const metalCount = Math.floor(Math.random() * 2) + 1;
      let m = [];
      for (let j = 0; j < metalCount; j++) {
        m.push(metals[Math.floor(Math.random() * metals.length)]);
      }
      const support = supports[Math.floor(Math.random() * supports.length)];
      const promoter = promoters[Math.floor(Math.random() * promoters.length)];
      
      const name = `${m.join('-')}-${promoter}/${support}`;
      const formula = `${m.map(metal => metal + (Math.random() * 0.1).toFixed(3)).join('')}${promoter}${ (Math.random() * 0.1).toFixed(3)}/${support}`;
      
      candidates.push({
        projectId: project._id,
        name,
        formula,
        type: i < 200 ? 'KNOWN' : 'NOVEL',
        performanceScore: parseFloat((50 + Math.random() * 45).toFixed(1)),
        procurementScore: Math.floor(Math.random() * 50) + 40,
        predictedActivity: parseFloat((60 + Math.random() * 35).toFixed(1)),
        predictedSelectivity: parseFloat((55 + Math.random() * 40).toFixed(1)),
        predictedStability: parseFloat((80 + Math.random() * 100).toFixed(1)),
        failureRiskTags: JSON.stringify(['coking', 'sintering', 'leaching', 'poisoning'].slice(0, Math.floor(Math.random() * 3))),
        source: i < 200 ? 'Literature' : 'SAMVĀDA Generative Engine',
      });
    }

    await Candidate.insertMany(candidates);
    console.log('✅ 1100 candidates created');

    // Generate 500+ Supplier Registry entries
    console.log('Generating 500+ supplier entries...');
    const precursors = [
      'Nitrate', 'Chloride', 'Acetate', 'Sulfate', 'Oxide', 'Carbonate', 'Hydroxide', 'Isopropoxide', 'Ethoxide'
    ];
    const supplierNames = [
      'Loba Chemie', 'SRL Chemicals', 'Merck India', 'Sigma-Aldrich India', 'Himedia Laboratories', 'Rankem', 'Thermo Fisher Scientific India', 'CDH Fine Chemicals', 'Sisco Research Laboratories', 'Molychem', 'Sd Fine-Chem Limited', 'Avra Synthesis', 'TCI India', 'Matrix Fine Chemicals'
    ];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Navi Mumbai', 'Thane'];

    const registry = [];
    for (let i = 0; i < 600; i++) {
      const metal = metals[Math.floor(Math.random() * metals.length)];
      const prec = precursors[Math.floor(Math.random() * precursors.length)];
      const precursorName = `${metal} ${prec}`;
      
      registry.push({
        precursorName,
        supplier: supplierNames[Math.floor(Math.random() * supplierNames.length)],
        leadTimeDays: Math.floor(Math.random() * 30) + 2,
        available: Math.random() > 0.1,
        region: cities[Math.floor(Math.random() * cities.length)],
      });
    }
    
    // Add supports to registry too
    for (const s of supports) {
       registry.push({
        precursorName: s,
        supplier: 'Specialty Zeolites India',
        leadTimeDays: 14 + Math.floor(Math.random() * 14),
        available: true,
        region: 'Pune',
      });
    }

    await SupplierRegistry.insertMany(registry);
    console.log('✅ 600+ supplier entries created');

    console.log('✅ Database seeded with 1000+ entries successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
