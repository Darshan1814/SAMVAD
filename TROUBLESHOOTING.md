# SAMVĀDA - Troubleshooting Guide

## Common Issues & Solutions

### 1. "Super expression must either be null or a function"

**Cause**: React 19 incompatibility with Recharts

**Solution**: Already fixed - using React 18
```bash
npm install react@^18.3.1 react-dom@^18.3.1 --legacy-peer-deps
rm -rf .next
npm run dev
```

### 2. "Cannot find module '@prisma/client'"

**Cause**: Prisma client not generated

**Solution**:
```bash
npx prisma generate
```

### 3. Database not found

**Cause**: Migrations not run

**Solution**:
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. "Add your Groq API key in Settings"

**Cause**: AI features require API key

**Solution**:
1. Visit https://console.groq.com
2. Create account and get API key
3. Go to Settings in app
4. Paste API key and save

### 5. Port 3000 already in use

**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### 6. Peer dependency warnings

**Cause**: React 18 vs React 19 conflicts

**Solution**: Use `--legacy-peer-deps` flag
```bash
npm install --legacy-peer-deps
```

### 7. Charts not rendering

**Cause**: Client component issue

**Solution**: Already fixed - dashboard is client component with useEffect

### 8. Sidebar not showing retrain status

**Cause**: API route not responding

**Solution**: Check `/api/retrain-status` is accessible
```bash
curl http://localhost:3000/api/retrain-status
```

### 9. "No candidates found" in Log Outcome

**Cause**: Database not seeded

**Solution**:
```bash
npx tsx prisma/seed.ts
```

### 10. Build errors

**Solution**: Clean and rebuild
```bash
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run dev
```

## Development Tips

### Reset Everything
```bash
# Complete reset
rm -rf .next node_modules prisma/dev.db
npm install --legacy-peer-deps
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

### View Database
```bash
npx prisma studio
```

### Check Logs
- Browser console for client errors
- Terminal for server errors
- Network tab for API issues

### Hot Reload Issues
If changes aren't reflecting:
1. Save file again
2. Refresh browser (Cmd+R)
3. Hard refresh (Cmd+Shift+R)
4. Restart dev server

## API Testing

### Test Groq Integration
```bash
curl -X POST http://localhost:3000/api/groq \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generateCandidates",
    "apiKey": "YOUR_KEY",
    "data": {
      "targetReaction": "Test",
      "temperature": "300C",
      "pressure": "20bar",
      "selectivityGoal": "75"
    }
  }'
```

### Test Database Connection
```bash
curl http://localhost:3000/api/candidates
```

## Performance

### Slow Page Loads
- Check database size: `ls -lh prisma/dev.db`
- Clear browser cache
- Restart dev server

### Memory Issues
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run dev`

## Production Build

```bash
npm run build
npm start
```

If build fails:
1. Check TypeScript errors: `npx tsc --noEmit`
2. Fix any type issues
3. Rebuild

## Getting Help

1. Check browser console
2. Check terminal output
3. Review this guide
4. Check Next.js docs: https://nextjs.org/docs
5. Check Prisma docs: https://www.prisma.io/docs

## Quick Health Check

Run this to verify everything is working:

```bash
# 1. Check Node version (should be 18+)
node -v

# 2. Check database
ls prisma/dev.db

# 3. Check dependencies
npm list react recharts @prisma/client

# 4. Start server
npm run dev
```

Expected output:
- ✓ Ready in Xms
- ○ Compiling /dashboard ...
- ✓ Compiled /dashboard in Xms

Then visit http://localhost:3000 and you should see the dashboard.
