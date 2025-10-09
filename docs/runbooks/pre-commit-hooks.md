# Pre-commit Hooks Runbook

Automated quality gates that run before every commit.

## 🎯 What Gets Checked

Every time you run `git commit`, these checks run automatically:

1. **TypeScript Compilation** - Ensures no type errors
2. **ESLint** - Fixes linting issues automatically
3. **Prettier** - Formats code consistently

## ✅ Benefits

- **Catch bugs early** - Before they reach the codebase
- **Consistent formatting** - Auto-format on commit
- **No broken builds** - TypeScript must compile
- **Team standards** - Everyone follows same rules

## 🚀 How It Works

```bash
# When you commit:
git add file.ts
git commit -m "feat: my change"

# Husky runs automatically:
# 1. Checks TypeScript compilation
# 2. Runs ESLint on changed files
# 3. Runs Prettier on changed files
# 4. If any fail, commit is blocked

# If all pass:
# ✅ Commit succeeds
```

## 🔧 Configuration

### Hook Location

`.husky/pre-commit` - The script that runs on commit

### Lint-Staged Config

`package.json` - Defines what runs on which files:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

## 🚨 If Checks Fail

### TypeScript Error

```bash
📘 Checking TypeScript...
apps/web/src/components/MyComponent.tsx:10:5 - error TS2322: Type 'string' is not assignable to type 'number'.
```

**Solution**: Fix the TypeScript error, then commit again

### ESLint Error

```bash
🧹 Running lint-staged...
  ✖ src/file.ts
    ✖ 'unused' is defined but never used
```

**Solution**:

- Remove unused variable
- Or add `// eslint-disable-next-line` if intentional
- Commit again

### Prettier Formatting

Prettier usually auto-fixes formatting. If it fails:

**Solution**:

```bash
pnpm prettier --write path/to/file.ts
git add path/to/file.ts
git commit
```

## ⏭️ Skip Checks (Use Sparingly!)

Sometimes you need to commit despite failing checks (e.g., work-in-progress):

```bash
# Skip pre-commit hooks
git commit --no-verify -m "wip: incomplete work"
```

⚠️ **Warning**: Only use `--no-verify` for:

- WIP commits on feature branches
- Emergency fixes (but fix properly later!)
- Never on main branch

## 🛠️ Troubleshooting

### Issue: Hooks not running

**Cause**: Husky not initialized

**Solution**:

```bash
pnpm exec husky install
chmod +x .husky/pre-commit
```

### Issue: "husky: command not found"

**Cause**: Husky not installed

**Solution**:

```bash
pnpm install
```

### Issue: Checks too slow

**Cause**: Checking too many files

**Current**: Only checks staged files (via lint-staged)

**If still slow**: Consider removing TypeScript check from pre-commit and rely on CI instead

## 📝 Customizing Checks

### Add a New Check

Edit `.husky/pre-commit`:

```bash
# Add after existing checks
echo "🧪 Running tests..."
pnpm test || exit 1
```

### Check Only Specific Files

Edit `package.json` lint-staged config:

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.test.{ts,tsx}": ["jest --bail --findRelatedTests"]
}
```

### Remove TypeScript Check

If too slow, edit `.husky/pre-commit` and remove:

```bash
# Remove these lines:
echo "📘 Checking TypeScript..."
cd apps/web && pnpm typecheck || exit 1
cd ../..
```

## 🎓 Best Practices

### DO ✅

- Let hooks auto-fix formatting
- Fix TypeScript errors immediately
- Commit frequently with small changes
- Use descriptive commit messages

### DON'T ❌

- Skip hooks without good reason
- Commit with TypeScript errors
- Commit large, untested changes
- Use `--no-verify` on main branch

## 📊 Metrics

### Before Pre-commit Hooks

- Broken builds pushed to CI: Common
- Time spent fixing formatting: ~15 min/day
- TypeScript errors in PR: Frequent

### After Pre-commit Hooks

- Broken builds pushed to CI: Rare
- Time spent fixing formatting: ~0 min/day
- TypeScript errors in PR: Rare

**Time Saved**: ~1.5 hours/week per developer

## 🆘 Emergency: Disable All Hooks

If hooks are blocking critical work:

```bash
# Temporarily disable
mv .husky/pre-commit .husky/pre-commit.disabled

# Commit your work
git commit -m "emergency: critical fix"

# Re-enable
mv .husky/pre-commit.disabled .husky/pre-commit
```

**Remember**: Re-enable hooks immediately after!

## 🔗 Related Documentation

- Troubleshooting Guide: `docs/runbooks/troubleshooting.md`
- Code Quality Standards: TBD
- CI/CD Pipeline: TBD

---

**Remember**: Pre-commit hooks are your friend - they catch bugs before they become problems! 🛡️
