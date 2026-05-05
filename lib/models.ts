import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  targetReaction: String,
  conditions: String,
  selectivityGoal: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CandidateSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
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
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  actualYield: Number,
  actualSelectivity: Number,
  actualStability: Number,
  result: String,
  voiceNote: String,
  loggedBy: String,
  loggedAt: { type: Date, default: Date.now },
});

const ResidualAnalysisSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  runAt: { type: Date, default: Date.now },
  hypothesis: String,
  shapFeatures: String,
  underperformers: String,
  checkpointVersion: String,
});

const RetrainLogSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  triggeredAt: { type: Date, default: Date.now },
  newPointCount: Number,
  checkpointVersion: String,
  status: String,
  validationScore: Number,
});

const SupplierRegistrySchema = new mongoose.Schema({
  precursorName: String,
  supplier: String,
  leadTimeDays: Number,
  available: Boolean,
  region: String,
});

const VoiceNoteSchema = new mongoose.Schema({
  outcomeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperimentOutcome' },
  rawText: String,
  language: String,
  structuredData: String,
  confidence: Number,
});

const ModelCheckpointSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  version: String,
  trainedAt: { type: Date, default: Date.now },
  validationScore: Number,
  status: String,
  lineage: String,
});

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
export const ExperimentOutcome = mongoose.models.ExperimentOutcome || mongoose.model('ExperimentOutcome', ExperimentOutcomeSchema);
export const ResidualAnalysis = mongoose.models.ResidualAnalysis || mongoose.model('ResidualAnalysis', ResidualAnalysisSchema);
export const RetrainLog = mongoose.models.RetrainLog || mongoose.model('RetrainLog', RetrainLogSchema);
export const SupplierRegistry = mongoose.models.SupplierRegistry || mongoose.model('SupplierRegistry', SupplierRegistrySchema);
export const VoiceNote = mongoose.models.VoiceNote || mongoose.model('VoiceNote', VoiceNoteSchema);
export const ModelCheckpoint = mongoose.models.ModelCheckpoint || mongoose.model('ModelCheckpoint', ModelCheckpointSchema);
