# URGENT: Restart Dev Server

The dev server needs to be restarted to pick up the new environment variables from .env.local that were just created.

## Task: Restart Development Server

**STEPS:**

1. Stop the current dev server (if running):
   - Press Ctrl+C in the terminal running `pnpm dev`
   - Or kill the process on port 3000

2. Navigate to web app directory:
   ```
   cd apps/web
   ```

3. Start dev server fresh:
   ```
   pnpm dev
   ```

4. Wait 20 seconds for Next.js to fully compile

5. Verify server is running:
   - Should see "Local: http://localhost:3000" in output
   - Should see "✓ Ready" or "✓ Compiled" message

6. Reply with: "Dev server restarted. Environment variables loaded."

**REASON:** The server was running before .env.local was created, so DATABASE_URL wasn't loaded into the process environment.

**START NOW.**

