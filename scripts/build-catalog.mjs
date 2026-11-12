#!/usr/bin/env node
/**
 * 校验所有组件的 meta.json，并生成 CATALOG.md 与 index.html（组件画廊）
 *
 * 用法：
 *   node scripts/build-catalog.mjs          # 校验 + 生成
 *   node scripts/build-catalog.mjs --check  # 仅校验，不写文件
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = path.join(ROOT, 'components');
const CATEGORIES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'categories.json'), 'utf8'));
const CHECK_ONLY = process.argv.includes('--check');

const STATUS = ['idea', 'wip', 'stable'];
const SOURCE_TYPES = ['original', 'adapted', 'reference'];
const STATUS_LABEL = { idea: '💡 idea', wip: '🚧 wip', stable: '✅ stable' };
const REQUIRED = ['name', 'slug', 'title', 'category', 'description', 'tags', 'status', 'implementations', 'source', 'createdAt', 'updatedAt'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const warnings = [];
const components = [];

// ---------- 扫描与校验 ----------
const catIds = new Set(CATEGORIES.map((c) => c.id));

if (fs.existsSync(COMPONENTS_DIR)) {
  for (const cat of fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue;
    if (!catIds.has(cat.name)) {
      errors.push(`components/${cat.name}/：未在 scripts/categories.json 中注册的分类`);
      continue;
    }
    const catDir = path.join(COMPONENTS_DIR, cat.name);
    for (const comp of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!comp.isDirectory()) continue;
      const rel = `components/${cat.name}/${comp.name}`;
      const dir = path.join(catDir, comp.name);
      const metaPath = path.join(dir, 'meta.json');

      if (!fs.existsSync(metaPath)) {
        errors.push(`${rel}：缺少 meta.json`);
        continue;
      }
      let meta;
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      } catch (e) {
        errors.push(`${rel}/meta.json：JSON 解析失败 - ${e.message}`);
        continue;
      }

      const err = (m) => errors.push(`${rel}：${m}`);
      const warn = (m) => warnings.push(`${rel}：${m}`);

      for (const key of REQUIRED) if (meta[key] === undefined) err(`meta.json 缺少字段 "${key}"`);
      if (meta.slug && meta.slug !== comp.name) err(`slug "${meta.slug}" 与目录名 "${comp.name}" 不一致`);
      if (meta.category && meta.category !== cat.name) err(`category "${meta.category}" 与父目录 "${cat.name}" 不一致`);
      if (meta.status && !STATUS.includes(meta.status)) err(`status 必须是 ${STATUS.join(' / ')}`);
      if (meta.name && !/^[A-Z][A-Za-z0-9]*$/.test(meta.name)) err(`name "${meta.name}" 应为 PascalCase`);
      if (meta.tags && !Array.isArray(meta.tags)) err('tags 必须是数组');
      for (const k of ['createdAt', 'updatedAt']) {
        if (meta[k] && !DATE_RE.test(meta[k])) err(`${k} 应为 YYYY-MM-DD`);
      }

      const src = meta.source || {};
      if (src.type && !SOURCE_TYPES.includes(src.type)) err(`source.type 必须是 ${SOURCE_TYPES.join(' / ')}`);
      if ((src.type === 'adapted' || src.type === 'reference') && !src.url) err(`source.type 为 ${src.type} 时必须填写 source.url`);
      if (src.type === 'adapted' && !src.license) err('改编组件必须填写 source.license');

      const impls = Array.isArray(meta.implementations) ? meta.implementations : [];
      for (const impl of impls) {
        if (!fs.existsSync(path.join(dir, impl))) err(`implementations 声明了 "${impl}"，但目录不存在`);
      }
      if (meta.status !== 'idea' && impls.length === 0) err('非 idea 状态的组件至少需要一种实现');
      if (!fs.existsSync(path.join(dir, 'README.md'))) err('缺少 README.md');

      const hasDemo = fs.existsSync(path.join(dir, 'demo.html'));
      if (!hasDemo && meta.status !== 'idea') err('缺少 demo.html');
      if (!meta.description) warn('description 为空');

      const preview = ['preview.gif', 'preview.png', 'preview.jpg', 'preview.webp'].find((f) => fs.existsSync(path.join(dir, f)));

      components.push({
        ...meta,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        implementations: impls,
        path: rel,
        demo: hasDemo ? `${rel}/demo.html` : null,
        readme: `${rel}/README.md`,
        preview: preview ? `${rel}/${preview}` : null,
      });
    }
  }
}

// slug 全局唯一
const seen = new Map();
for (const c of components) {
  if (seen.has(c.slug)) errors.push(`slug "${c.slug}" 重复：${seen.get(c.slug)} 与 ${c.path}`);
  else seen.set(c.slug, c.path);
}

// ---------- 输出校验结果 ----------
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);
console.log(`共 ${components.length} 个组件，${errors.length} 个错误，${warnings.length} 个警告`);

if (errors.length) process.exit(1);
if (CHECK_ONLY) process.exit(0);

// ---------- 生成 CATALOG.md ----------
// 使用码点比较而非 localeCompare，保证不同机器 / CI 上生成结果完全一致
const sorted = [...components].sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
const byCat = CATEGORIES.map((cat) => ({ ...cat, items: sorted.filter((c) => c.category === cat.id) }));
const count = (s) => components.filter((c) => c.status === s).length;
const esc = (s = '') => String(s).replaceAll('|', '\\|');

let md = `# 组件索引

> ⚠️ 本文件由 \`npm run catalog\` 自动生成，请勿手动编辑。可视化浏览请打开 [index.html](./index.html)。

共 **${components.length}** 个组件：✅ stable ${count('stable')} ｜ 🚧 wip ${count('wip')} ｜ 💡 idea ${count('idea')}

`;

for (const cat of byCat) {
  if (!cat.items.length) continue;
  md += `## ${cat.label}（\`${cat.id}\`）\n\n`;
  md += '| 组件 | 名称 | 描述 | 实现 | 状态 | 标签 |\n| --- | --- | --- | --- | --- | --- |\n';
  for (const c of cat.items) {
    const demo = c.demo ? ` · [demo](./${c.demo})` : '';
    md += `| [${c.name}](./${c.readme})${demo} | ${esc(c.title)} | ${esc(c.description)} | ${c.implementations.join(', ') || '-'} | ${STATUS_LABEL[c.status] || c.status} | ${c.tags.map((t) => `\`${t}\``).join(' ')} |\n`;
  }
  md += '\n';
}

if (!components.length) md += '_暂无组件，使用 `npm run new -- <category> <slug> --title "中文名"` 新建第一个吧。_\n';

fs.writeFileSync(path.join(ROOT, 'CATALOG.md'), md);

// ---------- 生成 index.html（画廊） ----------
const data = JSON.stringify({
  categories: CATEGORIES.filter((c) => components.some((x) => x.category === c.id)),
  components: sorted.map(({ name, slug, title, category, description, tags, status, implementations, demo, readme, preview }) => ({
    name, slug, title, category, description, tags, status, implementations, demo, readme, preview,
  })),
}).replaceAll('<', '\\u003c');

const html = fs
  .readFileSync(path.join(ROOT, 'scripts', 'gallery.template.html'), 'utf8')
  .replace('/*__DATA__*/null', data);
fs.writeFileSync(path.join(ROOT, 'index.html'), html);

console.log('✔ 已生成 CATALOG.md 与 index.html');
