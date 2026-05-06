import Groq from 'groq-sdk';

export function getGroqClient(apiKey: string) {
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
}

export async function generateCandidates(apiKey: string, reactionQuery: any) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `You are a catalyst discovery AI. Generate 8 novel catalyst candidates for the following reaction:

Target Reaction: ${reactionQuery.targetReaction}
Temperature: ${reactionQuery.temperature}
Pressure: ${reactionQuery.pressure}
Selectivity Goal: ${reactionQuery.selectivityGoal}%
Constraints: ${reactionQuery.constraints || 'None'}

Return ONLY a JSON array of 8 candidates with this exact structure:
[{
  "name": "Catalyst-Name",
  "formula": "Chemical formula",
  "predictedActivity": 75-95,
  "predictedSelectivity": 70-90,
  "predictedStability": 80-160,
  "failureRiskTags": ["tag1", "tag2"],
  "procurementNotes": "Brief note on synthesis complexity"
}]`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || '[]';
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

export async function runResidualAnalysis(apiKey: string, underperformers: any[]) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Analyze these underperforming catalysts and identify systematic model errors:

${underperformers.map(u => `- ${u.name}: Predicted ${u.predicted}%, Actual ${u.actual}%, Gap: ${u.gap}%`).join('\n')}

Return ONLY a JSON object with this structure:
{
  "hypothesis": "Clear explanation of why the model underestimated performance",
  "shapFeatures": [{"feature": "feature name", "weight": 0.0-1.0}],
  "followUpExperiment": "Suggested next experiment"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

export async function simulateRetrain(apiKey: string, newPoints: number, currentVersion: string) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Simulate a model retraining outcome:
- Current checkpoint: ${currentVersion}
- New training points: ${newPoints}
- Current validation score: 0.847

Return ONLY a JSON object:
{
  "newValidationScore": 0.850-0.900,
  "improvement": 0.003-0.053,
  "promotionRecommended": true/false
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

/**
 * TOOL 1: Synthesizability Scorer (Indian Context)
 * Cross-references a catalyst formula with the Indian Supplier Registry to assess procurement risk.
 */
export async function scoreSynthesizability(apiKey: string, formula: string, registry: any[]) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Analyze the chemical formula "${formula}" against this Indian Supplier Registry:
${JSON.stringify(registry.slice(0, 50))}

Evaluate:
1. Availability of each component in the Indian market.
2. Estimated lead time (based on registry or Indian industrial typicals).
3. Synthesis complexity in a CSIR-type pilot plant.

Return ONLY a JSON object:
{
  "score": 0-100,
  "risks": ["risk1", "risk2"],
  "bottlenecks": ["component name"],
  "procurementStrategy": "recommended procurement path"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 50, risks: ["Data parsing error"] };
}

/**
 * TOOL 2: Failure Mode Ontology Tagger
 * Automatically tags lab notes against the SAMVĀDA failure-mode ontology.
 */
export async function tagFailureModes(apiKey: string, labNotes: string) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Tag the following lab observation against the SAMVĀDA Failure Ontology:
Ontology: [coking, sintering, support collapse, leaching, enzyme misfolding, flux bottlenecks, active site poisoning, thermal deactivation].

Observation: "${labNotes}"

Return ONLY a JSON object:
{
  "primaryMode": "tag",
  "confidence": 0.0-1.0,
  "evidence": "snippet from notes",
  "suggestedMitigation": "remediation step"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

/**
 * TOOL 3: Lead-Time Optimizer
 * Suggests alternative precursors or suppliers to minimize procurement delay.
 */
export async function optimizeLeadTime(apiKey: string, precursors: string[], registry: any[]) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Find alternative precursors for: ${precursors.join(', ')}.
Target: Minimize lead time in India.
Current Registry Context: ${JSON.stringify(registry.slice(0, 30))}

Return ONLY a JSON array of alternatives:
[{
  "original": "component",
  "alternative": "easier to procure equivalent",
  "timeSavedDays": number,
  "impactOnPerformance": "high/medium/low"
}]`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
  });

  const content = completion.choices[0]?.message?.content || '[]';
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

/**
 * TOOL 4: Reaction Condition Predictor
 * Predicts optimal T/P/Ratio for a given catalyst using the AI core logic.
 */
export async function predictOptimalConditions(apiKey: string, catalystFormula: string, targetSelectivity: number) {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Predict optimal reaction conditions for ethanol-to-jet oligomerization using catalyst: ${catalystFormula}.
Target Selectivity: ${targetSelectivity}%

Return ONLY a JSON object:
{
  "temperatureRange": "300-400°C",
  "pressureRange": "20-40 bar",
  "ethanolH2Ratio": "1:3",
  "predictedSelectivity": number,
  "confidence": 0.0-1.0
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

/**
 * TOOL 5: Voice-to-JSON Knowledge Capture
 * Structures raw multilingual transcripts into experiment records.
 */
export async function structureVoiceObservations(apiKey: string, transcript: string, language: 'EN' | 'HI' | 'MR') {
  const groq = getGroqClient(apiKey);
  
  const prompt = `Extract scientific observations from this ${language} transcript:
"${transcript}"

Structure it into a JSON record:
{
  "observationType": "visual/thermal/performance",
  "keyParameters": [{"name": "param", "value": "val"}],
  "sentiment": "positive/negative/neutral",
  "summaryEn": "English summary of the observation"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

