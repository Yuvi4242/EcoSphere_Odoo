const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'context')
];

// Define replacements
const replacements = [
  { pattern: /bg-slate-950(\/\d+)?/g, replacement: 'bg-background' },
  { pattern: /bg-slate-900(\/\d+)?/g, replacement: 'bg-card' },
  { pattern: /bg-slate-850(\/\d+)?/g, replacement: 'bg-muted' },
  { pattern: /bg-slate-800(\/\d+)?/g, replacement: 'bg-muted' },
  { pattern: /border-slate-900(\/\d+)?/g, replacement: 'border-border' },
  { pattern: /border-slate-800(\/\d+)?/g, replacement: 'border-border' },
  { pattern: /text-slate-400/g, replacement: 'text-muted-foreground' },
  { pattern: /text-slate-500/g, replacement: 'text-muted-foreground' },
  { pattern: /text-slate-600/g, replacement: 'text-muted-foreground' },
  { pattern: /text-slate-200/g, replacement: 'text-foreground' },
  { pattern: /text-white/g, replacement: 'text-foreground' },
  { pattern: /text-emerald-400/g, replacement: 'text-primary' },
  { pattern: /text-emerald-500/g, replacement: 'text-primary' },
  { pattern: /bg-emerald-500\/10/g, replacement: 'bg-primary/10' },
  { pattern: /border-emerald-500\/30/g, replacement: 'border-primary/20' },
  { pattern: /bg-emerald-500/g, replacement: 'bg-primary' },
  { pattern: /border-emerald-500/g, replacement: 'border-primary' },
  // charts
  { pattern: /stroke="#94a3b8"/g, replacement: 'stroke="#64748b"' }, // slate-400 -> slate-500
  { pattern: /fill="#94a3b8"/g, replacement: 'fill="#64748b"' },
  { pattern: /stroke="#1e293b"/g, replacement: 'stroke="#e5e7eb"' }  // slate-800 -> border
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { pattern, replacement } of replacements) {
    content = content.replace(pattern, replacement);
  }

  // Handle glass-panel to remove text-white dependency if any
  content = content.replace(/glass-panel(\s+text-white)?/g, 'glass-panel');

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
      // Don't process globals.css since we already did it
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => traverse(dir));
console.log('Refactoring complete.');
