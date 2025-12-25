#!/usr/bin/env node

/**
 * Comprehensive Vue 2 to Vue 3 Composition API converter
 * Converts all .vue files using vue-property-decorator to Composition API
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`)
};

// Find all Vue files
function findVueFiles(dir, pattern = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findVueFiles(fullPath, pattern);
    } else if (file.endsWith('.vue')) {
      pattern.push(fullPath);
    }
  });
  
  return pattern;
}

// Check if file uses vue-property-decorator
function usesVuePropertyDecorator(content) {
  return content.includes('vue-property-decorator') || content.includes('@Component') || content.includes('@Prop');
}

// Convert a single component
function convertComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!usesVuePropertyDecorator(content)) {
    return null;
  }

  const originalContent = content;
  
  // Split template and script
  const templateMatch = content.match(/<template[\s\S]*?<\/template>/);
  const scriptMatch = content.match(/<script[\s\S]*?<\/script>/);
  const styleMatch = content.match(/<style[\s\S]*?<\/style>/g);
  
  if (!templateMatch || !scriptMatch) {
    log.warn(`Skipping ${filePath} - Missing template or script`);
    return null;
  }
  
  const template = templateMatch[0];
  const script = scriptMatch[0];
  const styles = styleMatch ? styleMatch.join('\n\n') : '';
  
  // Extract script content
  let scriptContent = script
    .replace(/<script[^>]*>/, '')
    .replace(/<\/script>/, '')
    .trim();
  
  // Remove old imports and decorators, build new script
  scriptContent = scriptContent
    .replace(/import\s*{\s*[^}]*?\}\s*from\s*['"]vue-property-decorator['"];?\n*/g, '')
    .replace(/import\s*{\s*Component\s*,\s*Vue\s*}\s*from\s*['"]vue-property-decorator['"];?\n*/g, '')
    .replace(/import\s*Vue\s*from\s*['"]vue['"];?\n*/g, '');
  
  // Remove @Component decorator and export default class statement
  scriptContent = scriptContent
    .replace(/@Component\({[\s\S]*?}\)\n*/g, '')
    .replace(/export\s+default\s+class\s+\w+\s+extends\s+Vue\s*{/g, '{');
  
  // Remove closing brace from class
  scriptContent = scriptContent.replace(/^}\s*$/m, '');
  
  // Extract class properties and methods
  let props = [];
  let data = {};
  let methods = {};
  let computed = {};
  let watchers = [];
  let lifecycle = {};
  
  // Match @Prop decorators
  const propMatches = scriptContent.matchAll(/@Prop\(\s*({[^}]*})?\s*\)\s+(\w+)!?:\s*([^;\n]+)/g);
  for (const match of propMatches) {
    const propConfig = match[1] || '{}';
    const propName = match[2];
    const propType = match[3];
    props.push({ name: propName, config: propConfig, type: propType });
  }
  
  // Remove @Prop decorators
  scriptContent = scriptContent.replace(/@Prop\(\s*{[^}]*}\s*\)\s+\w+!?:\s*[^;\n]+;?\n*/g, '');
  scriptContent = scriptContent.replace(/@Prop\(\)\s+\w+!?:\s*[^;\n]+;?\n*/g, '');
  
  // Remove @Emit decorators and collect emit info
  scriptContent = scriptContent.replace(/@Emit\(['"]*(\w+)['"]*\)\s+/g, '');
  scriptContent = scriptContent.replace(/@Emit\(\)\s+/g, '');
  
  // Collect class properties and methods
  const classBodyMatch = scriptContent.match(/{[\s\S]*}/);
  if (classBodyMatch) {
    const classBody = classBodyMatch[0];
    
    // Extract lifecycle methods
    const lifecycleMethods = ['mounted', 'created', 'destroyed', 'updated', 'beforeMount', 'beforeUpdate', 'beforeDestroy'];
    lifecycleMethods.forEach(method => {
      const regex = new RegExp(`\\s+(${method})\\s*\\([^)]*\\)\\s*{`, 'g');
      if (regex.test(classBody)) {
        lifecycle[method] = true;
      }
    });
  }
  
  // Remove @Watch, @Emit decorators
  scriptContent = scriptContent.replace(/@Watch\(['"]*(\w+)['"]*\)\s+/g, '');
  
  // Build new script setup
  let newScript = `<script setup lang="ts">\nimport { ref, computed, watch, onMounted, onUnmounted, onUpdated } from 'vue'\n`;
  
  // Add other imports that were preserved
  const importLines = originalContent.match(/^import\s+.*$/gm) || [];
  importLines.forEach(line => {
    if (!line.includes('vue-property-decorator') && !line.includes('from \'vue\'')) {
      newScript += line + '\n';
    }
  });
  
  // Add props with TypeScript
  if (props.length > 0) {
    newScript += `\ninterface Props {\n`;
    props.forEach(prop => {
      const cleanType = prop.type.replace(/!$/, '').trim();
      newScript += `  ${prop.name}${prop.config.includes('required') ? '' : '?'}: ${cleanType}\n`;
    });
    newScript += `}\n\nconst props = withDefaults(defineProps<Props>(), {\n`;
    props.forEach(prop => {
      if (!prop.config.includes('required')) {
        newScript += `  ${prop.name}: undefined\n`;
      }
    });
    newScript += `})\n`;
  }
  
  // Add emit
  newScript += `\nconst emit = defineEmits<{\n`;
  newScript += `  // Add your emits here\n`;
  newScript += `}>()\n`;
  
  // Extract and convert methods/computed
  // This is simplified - full extraction would require AST parsing
  const methodsPattern = /\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?(?=\n\s{2,4}(?:\w+|}))/g;
  
  newScript += `\n${scriptContent}\n</script>`;
  
  // Build final content
  let finalContent = template + '\n\n' + newScript;
  if (styles) {
    finalContent += '\n\n' + styles;
  }
  
  return finalContent;
}

// Main execution
const projectRoot = process.argv[2] || process.cwd();
log.info(`Scanning project: ${projectRoot}`);

const vueFiles = findVueFiles(projectRoot);
const filesToConvert = vueFiles.filter(file => {
  const content = fs.readFileSync(file, 'utf-8');
  return usesVuePropertyDecorator(content);
});

log.info(`Found ${filesToConvert.length} components using vue-property-decorator\n`);

let converted = 0;
let failed = 0;

filesToConvert.forEach(file => {
  const relativePath = path.relative(projectRoot, file);
  try {
    const result = convertComponent(file);
    if (result) {
      // Backup original
      fs.copyFileSync(file, file + '.bak');
      fs.writeFileSync(file, result);
      log.success(`${relativePath}`);
      converted++;
    }
  } catch (error) {
    log.error(`${relativePath} - ${error.message}`);
    failed++;
  }
});

log.info(`\n${'='.repeat(50)}`);
log.success(`Converted: ${converted}`);
if (failed > 0) log.error(`Failed: ${failed}`);
log.info(`Backup files created with .bak extension`);
