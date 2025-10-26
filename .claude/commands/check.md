---
description: Run static checks (lint, format, type check, test) across the project
---

Run static checks across the entire codebase following these steps:

1. Check the project structure to identify which components exist (fe, api, etc.)

2. For each component that exists, run the following checks in parallel:
   - **Type checking**: Run TypeScript compiler in check mode (`tsc --noEmit`)
   - **Linting**: Run ESLint (`npm run lint`)
   - **Format checking**: Run Prettier in check mode (`npm run format:check`)
   - **Tests**: Run all tests (`npm test`)

3. For the frontend (fe directory):
   - Run: `npm run lint`
   - Run: `npm run format:check`
   - Run: `npx tsc --noEmit`
   - Run: `npm test`

4. For the API (api directory):
   - Run: `npm run lint`
   - Run: `npm run format:check`
   - Run: `npx tsc --noEmit`
   - Run: `npm test`

5. Summarize the results:
   - Report which checks passed ✅
   - Report which checks failed ❌
   - If any checks failed, provide details and suggestions for fixing

Important:
- Run checks in parallel where possible for better performance
- DO NOT fix issues automatically - only report them
- If a directory doesn't have a particular script, skip it gracefully
- Always show clear, actionable feedback to the user
