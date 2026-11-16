import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
export const root = new URL('../', import.meta.url);
export const readJSON = path => JSON.parse(readFileSync(new URL(path, root), 'utf8').replace(/^\uFEFF/, ''));
export function validateSchema(value, schema, path = '$') {
  const fail = message => { throw new Error(`${path}: ${message}`); };
  if (schema.enum && !schema.enum.includes(value)) fail('值不在 enum 中');
  if (schema.type === 'array') {
    if (!Array.isArray(value)) fail('必須為陣列');
    if (value.length < (schema.minItems ?? 0)) fail('陣列過短');
    if (schema.uniqueItems && new Set(value.map(item => JSON.stringify(item))).size !== value.length) fail('陣列重複');
    value.forEach((item, index) => validateSchema(item, schema.items, `${path}[${index}]`));
  } else if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('必須為物件');
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) fail(`缺少 ${key}`);
    for (const key of Object.keys(value)) { if (!schema.properties[key] && schema.additionalProperties === false) fail(`未知欄位 ${key}`); if (schema.properties[key]) validateSchema(value[key], schema.properties[key], `${path}.${key}`); }
  } else if (schema.type === 'string') {
    if (typeof value !== 'string') fail('必須為字串');
    if (value.trim().length < (schema.minLength ?? 0)) fail('字串不可空白');
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) fail('格式錯誤');
  }
}
export function validateArticles(articles) {
  validateSchema(articles, readJSON('data/article.schema.json'));
  const ids = new Set();
  for (const article of articles) { if (ids.has(article.id)) throw new Error(`重複 ID: ${article.id}`); ids.add(article.id); if (!article.id.startsWith(`${article.language}-`)) throw new Error(`語言前綴不符: ${article.id}`); }
  for (const article of articles) for (const id of article.related) if (!ids.has(id) || id === article.id) throw new Error(`無效 related: ${article.id} → ${id}`);
  return articles;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const articles = validateArticles(readJSON('data/articles.json')); console.log(`PASS Schema、ID、related：${articles.length} 篇文章`);
}
