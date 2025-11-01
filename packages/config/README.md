# @galaxyco/config

Shared configuration and environment management for GalaxyCo.ai v2.0 monorepo.

## Purpose

Provides centralized configuration, environment variable validation, and shared constants across all apps and packages.

## Installation

Already included via workspace protocol:

```json
{
  "dependencies": {
    "@galaxyco/config": "workspace:*"
  }
}
```

## Key Exports

- **`env`** - Validated environment variables
- **`constants`** - Shared application constants
- **`config`** - Application configuration

## Usage

```typescript
import { env, constants } from '@galaxyco/config';

// Access validated environment variables
console.log(env.DATABASE_URL);
console.log(env.OPENAI_API_KEY);

// Use shared constants
const maxTokens = constants.DEFAULT_MAX_TOKENS;
```

## Environment Variables

See `docs/setup/ENVIRONMENT_VARIABLES_REFERENCE.md` for complete list.

## Development

```bash
pnpm typecheck  # Type check
```

---

**Version**: 0.1.0  
**Maintained By**: GalaxyCo.ai Team
