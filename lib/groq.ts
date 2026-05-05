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
