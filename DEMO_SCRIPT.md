# SAMVĀDA - Demo Walkthrough Script

## 🎬 5-Minute Demo (For Presentations)

### Setup (Before Demo)
1. Start server: `npm run dev`
2. Add Groq API key in Settings
3. Open http://localhost:3000
4. Have browser at 100% zoom

---

## Act 1: The Problem (30 seconds)

**Say:**
> "India's Ethanol-to-Jet programme needs new catalysts. Traditional discovery takes months. We built SAMVĀDA - a closed-loop AI engine that learns from failures."

**Show:** Dashboard
- Point to 31 candidates
- Point to 3 outcomes logged
- Point to retrain progress (3/20)

---

## Act 2: AI Generation (60 seconds)

**Say:**
> "Let's generate novel candidates using Groq AI."

**Do:**
1. Click "New Query" in sidebar
2. Fill form:
   - Target Reaction: `Ethanol → C8-C16 hydrocarbons`
   - Temperature: `350-400°C`
   - Pressure: `25 bar`
   - Selectivity Goal: `80`
3. Click "Generate Candidates"
4. Wait 5-10 seconds

**Show:** 8 AI-generated candidates with:
- Novel formulas
- Predicted performance
- Failure risk tags

**Say:**
> "In 10 seconds, we have 8 novel candidates. Traditional methods would take weeks."

---

## Act 3: Candidate Review (45 seconds)

**Say:**
> "Let's review all candidates and check procurement feasibility."

**Do:**
1. Click "Candidates" in sidebar
2. Show full table (31 + 8 new = 39 total)
3. Filter by "Novel"
4. Click on a candidate row

**Show:** Candidate detail drawer:
- Formula
- Predicted activity/selectivity/stability
- Failure risk tags
- Source (AI-generated)

**Say:**
> "Each candidate has procurement scores. Green means available in India within 2 weeks."

---

## Act 4: Logging Results (60 seconds)

**Say:**
> "After testing in the lab, we log actual results."

**Do:**
1. Click "Log Outcome" in sidebar
2. Select "Ni-ZSM5" from dropdown
3. Show predicted values (82% activity, 71% selectivity)
4. Enter actual values:
   - Yield: `75.5`
   - Selectivity: `65.2`
   - Stability: `105`
5. Select "Underperformed"
6. Voice note: `"Observed coking after 90 hours. Lower selectivity than predicted."`
7. Logged by: `"Dr. Sharma"`
8. Click "Log Outcome"

**Show:** Immediate feedback:
- Predicted: 71%
- Actual: 65.2%
- Gap: -5.8%

**Say:**
> "The model predicted 71% selectivity but we got 65%. This gap is valuable data."

---

## Act 5: Residual Analysis (60 seconds)

**Say:**
> "Now let's analyze why the model is wrong."

**Do:**
1. Click "Residual Analysis" in sidebar
2. Show scatter plot (predicted vs actual)
3. Show underperformers list
4. Click "Run Residual Analysis"
5. Wait 3-5 seconds

**Show:** AI-generated hypothesis:
> "The model appears to underweight acid-site density above 320°C in oligomerization conditions..."

**Show:** SHAP feature importance bars

**Say:**
> "The AI identifies that we're underestimating the impact of temperature on acid sites. This is actionable insight."

---

## Act 6: Retraining (30 seconds)

**Say:**
> "After 20 outcomes, we retrain the model to fix these biases."

**Do:**
1. Click "Retrain" in sidebar
2. Show current status: 3/20 outcomes
3. Show checkpoint history
4. Point to version v2.3 (active)

**Say:**
> "Each retrain creates a new checkpoint. If something goes wrong, we can rollback. This is version control for ML models."

---

## Act 7: Indian Context (30 seconds)

**Say:**
> "This is built for India. Let's check supplier availability."

**Do:**
1. Click "Supplier Registry" in sidebar
2. Show table with Indian suppliers:
   - Loba Chemie (Mumbai, 7 days)
   - SRL Chemicals (Delhi, 14 days)
   - Merck India (Bangalore, 5 days)

**Say:**
> "We track which precursors are available, from which Indian suppliers, and lead times. This is real-world deployability."

---

## Act 8: The Loop (30 seconds)

**Say:**
> "This is a closed loop. Every failure makes the model smarter."

**Show:** Dashboard again
- Point to activity feed
- Point to predicted vs actual chart
- Point to Jury Scorecard (expand it)

**Read scorecard:**
- Problem Relevance: Failure-aware ensemble
- Technical Implementation: GNN + Groq
- Real-World Deployability: SQLite, self-hosted
- Demo Quality: End-to-end workflow
- Scalability: Multi-project support

**Say:**
> "SAMVĀDA learns from mistakes, respects Indian constraints, and runs entirely on localhost. No cloud dependencies."

---

## Closing (15 seconds)

**Say:**
> "From query to retrain in 5 minutes. Traditional catalyst discovery takes months. SAMVĀDA accelerates India's sustainable fuel transition."

**Show:** Settings → Export Data
> "And you can export everything as JSON. Full data ownership."

---

## 🎯 Key Talking Points

### Problem Relevance
- India's Ethanol-to-Jet programme is real
- Catalyst discovery is slow and expensive
- Failures are valuable but often ignored

### Technical Innovation
- Groq AI for generation (llama-3.3-70b)
- Residual analysis identifies systematic errors
- SHAP for interpretability
- Checkpoint versioning for safety

### Real-World Deployment
- SQLite (no database setup)
- Self-hosted (no cloud costs)
- Indian supplier registry
- Procurement feasibility scoring

### Demo Quality
- End-to-end workflow visible
- 31 seeded candidates
- 3 seeded outcomes
- Realistic data

### Scalability
- Multi-project support (schema ready)
- Checkpoint rollback
- Data export
- API-first architecture

---

## 🎤 Audience Q&A Prep

**Q: "Why not use a cloud database?"**
A: "For research labs, self-hosted is critical. No internet dependency, full data control, zero ongoing costs."

**Q: "How accurate is the AI generation?"**
A: "That's the point - we don't trust it blindly. We test, log failures, and retrain. The loop makes it smarter."

**Q: "Why focus on India?"**
A: "Procurement is a real bottleneck. A great catalyst is useless if you can't source precursors. We solve that."

**Q: "Can this scale to other reactions?"**
A: "Yes. The schema supports multiple projects. Just create a new project in Settings."

**Q: "What about molecular structure visualization?"**
A: "Phase 2. We have 3Dmol.js planned. For now, we focus on the core loop."

---

## 📊 Demo Metrics to Highlight

- **31 candidates** seeded (23 known + 8 novel)
- **3 outcomes** logged (2 underperformed, 1 exceeded)
- **6 Indian suppliers** in registry
- **10 API routes** fully functional
- **8 pages** complete workflow
- **5-10 seconds** AI generation time
- **<50ms** database queries
- **0 external dependencies** (except Groq API)

---

## 🚨 Demo Gotchas (Avoid These)

❌ Don't forget to add Groq API key first
❌ Don't try to retrain with <20 outcomes (button disabled)
❌ Don't resize browser during demo (breaks charts)
❌ Don't skip the "why India" part (it's unique)
❌ Don't apologize for "simple" UI (it's intentional)

✅ Do emphasize the closed loop
✅ Do show the predicted vs actual gap
✅ Do highlight supplier registry
✅ Do mention checkpoint rollback
✅ Do export data at the end

---

**Good luck with your demo!** 🚀
