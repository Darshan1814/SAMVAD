-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "targetReaction" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "selectivityGoal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "performanceScore" REAL NOT NULL,
    "procurementScore" REAL NOT NULL,
    "predictedActivity" REAL NOT NULL,
    "predictedSelectivity" REAL NOT NULL,
    "predictedStability" REAL NOT NULL,
    "failureRiskTags" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Candidate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExperimentOutcome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "actualYield" REAL NOT NULL,
    "actualSelectivity" REAL NOT NULL,
    "actualStability" REAL NOT NULL,
    "result" TEXT NOT NULL,
    "voiceNote" TEXT,
    "loggedBy" TEXT NOT NULL,
    "loggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExperimentOutcome_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResidualAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "runAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hypothesis" TEXT NOT NULL,
    "shapFeatures" TEXT NOT NULL,
    "underperformers" TEXT NOT NULL,
    "checkpointVersion" TEXT NOT NULL,
    CONSTRAINT "ResidualAnalysis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RetrainLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "triggeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newPointCount" INTEGER NOT NULL,
    "checkpointVersion" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "validationScore" REAL NOT NULL,
    CONSTRAINT "RetrainLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupplierRegistry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "precursorName" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "leadTimeDays" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL,
    "region" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "VoiceNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "outcomeId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "structuredData" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    CONSTRAINT "VoiceNote_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "ExperimentOutcome" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModelCheckpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "trainedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validationScore" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "lineage" TEXT NOT NULL,
    CONSTRAINT "ModelCheckpoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
