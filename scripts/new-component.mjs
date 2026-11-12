#!/usr/bin/env node
/**
 * 从模板新建组件
 *
 * 用法：
 *   node scripts/new-component.mjs <category> <slug> [--title 中文名] [--name PascalName] [--impl vanilla,react]
 *
 * 示例：
 *   node scripts/new-component.mjs button magnetic-button --title "磁吸按钮"
 *   node scripts/new-component.mjs text typewriter-text --title "打字机" --impl vanilla
 *
 * 说明：slug 必须为 kebab-case 且至少含一个连字符，以便直接作为 Web Component 标签名。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_DIR = path.join(ROOT, 'templates', 'component');
const COMPONENTS_DIR = path.join(ROOT, 'components');
const CATEGORIES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'categories.json'), 'utf8'));
const IMPL_DIRS = ['vanilla', 'react', 'vue', 'css', 'svelte'];

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

const toPascal = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('');

const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function findExistingSlug(slug) {
  if (!fs.existsSync(COMPONENTS_DIR)) return null;
  for (const cat of fs.readdirSync(COMPONENTS_DIR)) {
    const p = path.join(COMPONENTS_DIR, cat, slug);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function copyTemplate(src, dest, vars) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const targetName = entry.name.replaceAll('__slug__', vars.slug).replaceAll('__Name__', vars.Name);
    const from = path.join(src, entry.name);
    const to = path.join(dest, targetName);
    if (entry.isDirectory()) {
      copyTemplate(from, to, vars);
    } else {
      let content = fs.readFileSync(from, 'utf8');
      for (const [k, v] of Object.entries(vars)) {
        content = content.replaceAll(`{{${k}}}`, v);
      }
      fs.writeFileSync(to, content);
    }
  }
}

// ---------- main ----------
const { positional, flags } = parseArgs(process.argv.slice(2));
const [category, slug] = positional;

if (!category || !slug) {
  fail('用法：node scripts/new-component.mjs <category> <slug> [--title 中文名] [--name PascalName] [--impl vanilla,react]');
}
if (!CATEGORIES.some((c) => c.id === category)) {
  fail(`未知分类 "${category}"。可选：${CATEGORIES.map((c) => c.id).join(', ')}`);
}
if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(slug)) {
  fail(`slug "${slug}" 不合法：需为 kebab-case 且至少包含一个连字符（Web Component 标签要求），如 magnetic-button`);
}
const existing = findExistingSlug(slug);
if (existing) fail(`slug 已存在：${path.relative(ROOT, existing)}`);

const vars = {
  slug,
  Name: typeof flags.name === 'string' ? flags.name : toPascal(slug),
  title: typeof flags.title === 'string' ? flags.title : slug,
  category,
  date: today(),
};

const dest = path.join(COMPONENTS_DIR, category, slug);
copyTemplate(TEMPLATE_DIR, dest, vars);

// 分类目录有了真实内容后，移除占位用的 .gitkeep
fs.rmSync(path.join(COMPONENTS_DIR, category, '.gitkeep'), { force: true });

// 按 --impl 裁剪实现目录
if (typeof flags.impl === 'string') {
  const impls = flags.impl.split(',').map((s) => s.trim()).filter(Boolean);
  for (const dir of IMPL_DIRS) {
    const p = path.join(dest, dir);
    if (impls.includes(dir)) {
      fs.mkdirSync(p, { recursive: true });
    } else if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
  const metaPath = path.join(dest, 'meta.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  meta.implementations = impls;
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
}

console.log(`✔ 已创建 ${path.relative(ROOT, dest)}/`);
console.log('  下一步：完善 meta.json / README.md / demo.html 与实现代码，然后运行 npm run catalog');
