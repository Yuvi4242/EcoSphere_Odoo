const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'app'),
];

// Define fixes based on browser subagent findings
const replacements = [
  { pattern: /text-blue-400/g, replacement: 'text-blue-600' },
  { pattern: /hover:text-blue-300/g, replacement: 'hover:text-blue-700' },
  { pattern: /text-purple-400/g, replacement: 'text-purple-600' },
  { pattern: /hover:text-purple-300/g, replacement: 'hover:text-purple-700' },
  { pattern: /hover:text-emerald-300/g, replacement: 'hover:text-primary' },
  { pattern: /border-slate-850/g, replacement: 'border-border' },
  { pattern: /text-slate-300/g, replacement: 'text-foreground' },
  { pattern: /focus:ring-offset-slate-950/g, replacement: 'focus:ring-offset-background' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { pattern, replacement } of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => traverse(dir));
console.log('Fixes applied.');
