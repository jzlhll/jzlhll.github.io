import { cp, mkdir, readFile, writeFile, rm, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const sources = path.join(root, '.game-sources');
const { games } = JSON.parse(await readFile(path.join(root, 'games.json'), 'utf8'));
const ids = new Set(), paths = new Set();
for (const game of games) {
  if (!/^[a-z][a-z0-9-]*$/.test(game.id) || ids.has(game.id) || !/^games\/[a-z][a-z0-9-]*$/.test(game.path) || paths.has(game.path) || !/^[a-f0-9]{40}$/.test(game.commit) || !/^v\d+\.\d+\.\d+$/.test(game.version) || game.repository !== 'https://github.com/jzlhll/HtmlCarGame.git') throw new Error('Invalid game manifest entry');
  ids.add(game.id); paths.add(game.path);
  if (game.source_directory !== undefined && !/^[a-z][a-z0-9-]*$/.test(game.source_directory)) throw new Error('Invalid game source directory');
}
if (!['cargame', 'english', 'flight'].every(id => ids.has(id))) throw new Error('All three games are required');
function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) throw new Error(command + ' failed: ' + (result.error?.message || result.stderr || result.stdout));
  return result.stdout.trim();
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(sources, { recursive: true });
for (const game of games) {
  const source = path.join(sources, game.id);
  await rm(source, { recursive: true, force: true });
  await mkdir(source, { recursive: true });
  run('git', ['init', '--quiet'], source);
  run('git', ['remote', 'add', 'origin', game.repository], source);
  run('git', ['fetch', '--quiet', '--depth=1', 'origin', game.commit], source);
  run('git', ['checkout', '--quiet', '--detach', 'FETCH_HEAD'], source);
  if (run('git', ['rev-parse', 'HEAD'], source) !== game.commit) throw new Error('Game commit differs: ' + game.id);
  const project = path.join(source, game.source_directory || '.');
  run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], project);
  // 博客 Release 与游戏版本独立，游戏打包只使用清单中的版本。
  const env = { ...process.env, RELEASE_TAG: game.version };
  delete env.GITHUB_REF_TYPE; delete env.GITHUB_REF_NAME;
  run('node', ['scripts/prepare-pages.mjs'], project, env);
  const bundled = path.join(project, '.pages-output');
  await stat(path.join(bundled, 'index.html'));
  await cp(bundled, path.join(output, game.path), { recursive: true });
  console.info('Game packaged', game.id, game.version, game.commit);
}
const version = encodeURIComponent(process.env.RELEASE_VERSION || 'preview');
let html = await readFile(path.join(root, 'index.html'), 'utf8');
html = html.replace('./style.css', './style.css?v=' + version).replace('./i18n.js', './i18n.js?v=' + version).replace('./site.js', './site.js?v=' + version);
await writeFile(path.join(output, 'index.html'), html);
for (const file of ['style.css', 'i18n.js', 'site.js', 'games.json']) await cp(path.join(root, file), path.join(output, file));
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
await cp(path.join(root, 'tools'), path.join(output, 'tools'), { recursive: true });
await writeFile(path.join(output, '.nojekyll'), '');
async function size(directory) {
  let bytes = 0, files = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) { const nested = await size(target); bytes += nested.bytes; files += nested.files; }
    else { bytes += (await stat(target)).size; files++; }
  }
  return { bytes, files };
}
console.info('Site and three games prepared', await size(output));
