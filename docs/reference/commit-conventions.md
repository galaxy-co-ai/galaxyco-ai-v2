# Commit Conventions

GalaxyCo.ai follows the [Conventional Commits](https://www.conventionalcommits.org/) specification to ensure consistent commit history and automated changelog generation.

## Format

```
type(scope): subject

[optional body]

[optional footer(s)]
```

## Valid Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Valid Scopes

### Agent Scopes

- **scope-agent**: Multi-page document analysis agent
- **call-agent**: Phone call automation agent
- **email-agent**: Email processing and response agent
- **note-agent**: Note-taking and organization agent
- **task-agent**: Task management and tracking agent
- **roadmap-agent**: Project roadmap planning agent
- **content-agent**: Content generation and editing agent

### Infrastructure Scopes

- **api**: Backend API (NestJS)
- **web**: Frontend web app (Next.js)
- **db**: Database schema and migrations
- **infra**: Infrastructure, CI/CD, deployment

## Examples

### Good Commits

```bash
feat(scope-agent): add multi-page PDF support
fix(api): handle missing Clerk session
docs(readme): update deployment instructions
refactor(web): standardize error handling
test(db): add tenant isolation tests
chore(infra): update CI/CD pipeline
```

### Bad Commits

```bash
# Missing scope
feat: add new feature

# Wrong case
Feat(scope-agent): Add new feature

# Too vague
fix: bug fix

# Wrong scope
feat(random): add something
```

## Enforcement

Commits are enforced via:

- **Husky commit-msg hook**: Validates commit messages locally
- **GitHub Actions**: Validates commit messages in pull requests
- **Commitlint**: Provides clear error messages for invalid commits

## Configuration

The commit message template is automatically set up after `pnpm install`. To manually configure:

```bash
git config commit.template .gitmessage
```

## Bypassing (Emergency Only)

In rare cases where the commit message validation prevents urgent fixes:

```bash
git commit --no-verify -m "emergency: fix critical production issue"
```

**Note**: Emergency bypasses should be documented and addressed in follow-up commits.

## Automated Benefits

Following these conventions enables:

- **Automated versioning**: Semantic version bumps based on commit types
- **Changelog generation**: Automatically generated release notes
- **Release automation**: Automated releases based on conventional commits
- **Better collaboration**: Clear intent and scope in commit history

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
