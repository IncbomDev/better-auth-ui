# Registry Build Script

This Node.js script automates the process of adding all components from the `src/` directory to the shadcn/ui-compatible registry.

## Usage

### Using npm script (recommended)
```bash
npm run build-registry
```

### Direct execution
```bash
node scripts/build-registry.js
```

## What it does

The script automatically:

1. **Scans all source files** - Recursively finds all `.ts` and `.tsx` files in:
   - `src/components/` (109 files)
   - `src/hooks/` (8 files) 
   - `src/lib/` (multiple files)

2. **Determines registry types** based on file location:
   - `src/hooks/` → `registry:hook`
   - `src/components/ui/` → `registry:ui`
   - `src/lib/` and `src/types/` → `registry:lib`
   - Everything else → `registry:component`

3. **Extracts dependencies** by analyzing import statements:
   - External dependencies: `@radix-ui/*`, `react-hook-form`, `zod`, `better-auth`, etc.
   - Registry dependencies: Components that use `cn()` function get `utils` dependency

4. **Copies files to registry** with proper directory structure:
   - `registry/components/` - Auth-specific components
   - `registry/ui/` - Base UI components
   - `registry/hooks/` - React hooks
   - `registry/lib/` - Utility libraries

5. **Updates registry.json** with proper entries including:
   - Component metadata (name, title, description)
   - Type classification
   - Dependencies (external packages)
   - Registry dependencies (other registry components)

## Results

After running the script:

- **140 total registry items** (up from 45)
- **95 new components** added automatically
- **Complete registry coverage** of all source components

### Breakdown by type:
- `registry:component`: 92 items (auth flows, organization, settings)
- `registry:ui`: 17 items (base UI components)
- `registry:lib`: 23 items (utilities, providers, helpers)
- `registry:hook`: 8 items (React hooks)

## Features

- ✅ **Automatic dependency detection** - Scans import statements
- ✅ **Smart categorization** - Assigns correct registry types
- ✅ **Duplicate prevention** - Skips existing components
- ✅ **Progress reporting** - Shows detailed processing status
- ✅ **Error handling** - Continues on individual file errors
- ✅ **Complete coverage** - Processes all source files

## Registry Structure

The script maintains compatibility with the official shadcn/ui registry format:

```json
{
  "name": "component-name",
  "type": "registry:component|ui|hook|lib",
  "title": "Human Readable Title",
  "description": "Component description",
  "dependencies": ["external-package"],
  "registryDependencies": ["other-registry-component"],
  "files": [
    {
      "path": "registry/components/component-name.tsx",
      "type": "registry:component"
    }
  ]
}
```

This allows components to be installed using the shadcn CLI:

```bash
npx shadcn@latest add --from ./registry.json component-name
```