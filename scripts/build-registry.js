#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');
const REGISTRY_DIR = path.join(__dirname, '..', 'registry');
const REGISTRY_JSON = path.join(__dirname, '..', 'registry.json');

/**
 * Recursively get all TypeScript/TSX files from a directory
 */
async function getAllFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  async function scanDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  await scanDir(dir);
  return files;
}

/**
 * Determine registry type based on file path
 */
function getRegistryType(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  
  if (relativePath.startsWith('hooks/')) {
    return 'registry:hook';
  } else if (relativePath.startsWith('components/ui/')) {
    return 'registry:ui';
  } else if (relativePath.startsWith('lib/')) {
    return 'registry:lib';
  } else if (relativePath.startsWith('types/')) {
    return 'registry:lib';
  } else {
    return 'registry:component';
  }
}

/**
 * Get registry directory for a given type
 */
function getRegistryDir(type) {
  switch (type) {
    case 'registry:hook':
      return path.join(REGISTRY_DIR, 'hooks');
    case 'registry:ui':
      return path.join(REGISTRY_DIR, 'ui');
    case 'registry:lib':
      return path.join(REGISTRY_DIR, 'lib');
    case 'registry:component':
    default:
      return path.join(REGISTRY_DIR, 'components');
  }
}

/**
 * Extract dependencies from a file
 */
async function extractDependencies(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const dependencies = new Set();
  const registryDependencies = new Set();
  
  // Extract import statements
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip relative imports
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      continue;
    }
    
    // Check for known dependencies
    if (importPath.startsWith('@radix-ui/')) {
      dependencies.add(importPath);
    } else if (importPath === 'react-hook-form') {
      dependencies.add('react-hook-form');
    } else if (importPath === 'zod') {
      dependencies.add('zod');
    } else if (importPath === 'better-auth') {
      dependencies.add('better-auth');
    } else if (importPath === 'lucide-react') {
      dependencies.add('lucide-react');
    } else if (importPath === 'class-variance-authority') {
      dependencies.add('class-variance-authority');
    } else if (importPath === 'clsx') {
      dependencies.add('clsx');
    } else if (importPath === 'tailwind-merge') {
      dependencies.add('tailwind-merge');
    } else if (importPath === 'sonner') {
      dependencies.add('sonner');
    } else if (importPath === '@hookform/resolvers/zod') {
      dependencies.add('@hookform/resolvers');
    }
  }
  
  // Check for registry dependencies (cn function, other components)
  if (content.includes('cn(')) {
    registryDependencies.add('utils');
  }
  
  return {
    dependencies: Array.from(dependencies),
    registryDependencies: Array.from(registryDependencies)
  };
}

/**
 * Generate component name from file path
 */
function getComponentName(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  const parsedPath = path.parse(relativePath);
  
  // Remove directory structure and extension
  let name = parsedPath.name;
  
  // Handle index files by using parent directory name
  if (name === 'index') {
    name = path.basename(parsedPath.dir);
  }
  
  return name;
}

/**
 * Generate title from component name
 */
function generateTitle(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Copy file to registry with proper structure
 */
async function copyToRegistry(srcPath, registryType) {
  const registryDir = getRegistryDir(registryType);
  const fileName = path.basename(srcPath);
  const targetPath = path.join(registryDir, fileName);
  
  // Ensure directory exists
  await fs.mkdir(registryDir, { recursive: true });
  
  // Copy file
  await fs.copyFile(srcPath, targetPath);
  
  return path.relative(path.join(__dirname, '..'), targetPath);
}

/**
 * Main function to build registry
 */
async function buildRegistry() {
  console.log('🚀 Building complete registry...');
  
  try {
    // Load existing registry
    const registryData = JSON.parse(await fs.readFile(REGISTRY_JSON, 'utf-8'));
    const existingItems = new Map(registryData.items.map(item => [item.name, item]));
    
    // Get all source files
    const componentFiles = await getAllFiles(path.join(SRC_DIR, 'components'));
    const hookFiles = await getAllFiles(path.join(SRC_DIR, 'hooks'));
    const libFiles = await getAllFiles(path.join(SRC_DIR, 'lib'));
    
    const allFiles = [...componentFiles, ...hookFiles, ...libFiles];
    
    console.log(`📁 Found ${allFiles.length} files to process`);
    
    const newItems = [];
    
    for (const filePath of allFiles) {
      const componentName = getComponentName(filePath);
      const registryType = getRegistryType(filePath);
      
      console.log(`📝 Processing: ${componentName} (${registryType})`);
      
      // Skip if already exists
      if (existingItems.has(componentName)) {
        console.log(`⏭️  Skipping ${componentName} - already exists`);
        continue;
      }
      
      try {
        // Extract dependencies
        const deps = await extractDependencies(filePath);
        
        // Copy to registry
        const registryPath = await copyToRegistry(filePath, registryType);
        
        // Create registry item
        const item = {
          name: componentName,
          type: registryType,
          title: generateTitle(componentName),
          description: `${generateTitle(componentName)} component for better-auth-ui`,
          files: [
            {
              path: registryPath,
              type: registryType
            }
          ]
        };
        
        // Add dependencies if any
        if (deps.dependencies.length > 0) {
          item.dependencies = deps.dependencies;
        }
        
        if (deps.registryDependencies.length > 0) {
          item.registryDependencies = deps.registryDependencies;
        }
        
        newItems.push(item);
        console.log(`✅ Added ${componentName}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${componentName}:`, error.message);
      }
    }
    
    // Merge with existing items
    const allItems = [...registryData.items, ...newItems];
    
    // Sort items by name
    allItems.sort((a, b) => a.name.localeCompare(b.name));
    
    // Update registry.json
    registryData.items = allItems;
    
    await fs.writeFile(REGISTRY_JSON, JSON.stringify(registryData, null, 2));
    
    console.log(`\n🎉 Registry build complete!`);
    console.log(`📊 Total items: ${allItems.length}`);
    console.log(`🆕 New items added: ${newItems.length}`);
    console.log(`📁 Files in registry: ${await getAllFiles(REGISTRY_DIR).then(files => files.length)}`);
    
    // Display summary by type
    const typeStats = allItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Registry breakdown:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} items`);
    });
    
  } catch (error) {
    console.error('❌ Error building registry:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildRegistry();
}

export { buildRegistry };