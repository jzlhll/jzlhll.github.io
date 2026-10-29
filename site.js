const views = document.querySelectorAll('[data-view]');
const pageKeys = { home: 'page.home', about: 'page.about' };
const sectionKeys = { tools: 'nav.tools', games: 'nav.games', technology: 'notes.heading' };
const preferenceKey = 'allan.site.language';

// 只绑定对应的文本节点，保留链接箭头、图标、标题副行和 SVG 路径。
const textBindings = Array.from(document.querySelectorAll('[data-i18n]')).flatMap(element =>
  element.dataset.i18n.split(' ').map(key => {
    const original = translations['zh-Hans'][key];
    const node = Array.from(element.childNodes).find(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim() === original);
    if (!node) throw new Error('Missing translation text node: ' + key);
    return { node, key };
  })
);
const attributeBindings = ['aria-label', 'alt', 'title', 'content'].flatMap(attribute =>
  Array.from(document.querySelectorAll('[data-i18n-' + attribute + ']')).map(element => ({
    element, attribute, key: element.getAttribute('data-i18n-' + attribute),
  }))
);

function supportedLanguage(value) {
  if (typeof value !== 'string') return null;
  const tag = value.trim().replaceAll('_', '-').toLowerCase();
  if (tag === 'en' || tag.startsWith('en-')) return 'en';
  if (tag !== 'zh' && !tag.startsWith('zh-')) return null;
  if (tag.includes('-hant')) return 'zh-Hant';
  if (tag.includes('-hans')) return 'zh-Hans';
  return /-(tw|hk|mo)(-|$)/.test(tag) ? 'zh-Hant' : 'zh-Hans';
}
function savedLanguage() {
  try { return supportedLanguage(localStorage.getItem(preferenceKey)); }
  catch { return null; }
}
function browserLanguage() {
  for (const value of navigator.languages || [navigator.language]) {
    const supported = supportedLanguage(value);
    if (supported) return supported;
  }
  return 'en';
}
let language = supportedLanguage(new URL(location.href).searchParams.get('lang')) || savedLanguage() || browserLanguage();

function updateTitle() {
  const hash = location.hash.slice(1);
  const section = { android: 'technology', explore: 'tools' }[hash] || hash;
  const key = sectionKeys[section] || pageKeys[hash] || pageKeys.home;
  document.title = translations[language][key] + ' · ' + translations[language]['page.suffix'];
}
function applyLanguage(value) {
  language = value;
  const catalog = translations[language];
  for (const binding of textBindings) binding.node.textContent = catalog[binding.key];
  for (const binding of attributeBindings) binding.element.setAttribute(binding.attribute, catalog[binding.key]);
  document.documentElement.lang = language;
  document.querySelector('#language-select').value = language;
  updateTitle();
}
function showPage() {
  const hash = location.hash.slice(1);
  const page = Object.hasOwn(pageKeys, hash) ? hash : 'home';
  const section = { android: 'technology', explore: 'tools' }[hash] || hash;
  for (const view of views) view.hidden = view.dataset.view !== page;
  updateTitle();
  if (Object.hasOwn(sectionKeys, section)) document.getElementById(section).scrollIntoView({ block: 'start' });
  else window.scrollTo({ top: 0 });
}

// 保留原卡片节点和顺序，双列独立向下排列，窄屏恢复左右交替的阅读顺序。
const cardGroups = Array.from(document.querySelectorAll('.project-grid')).map(element => ({
  element, cards: Array.from(element.children),
}));
const singleColumn = window.matchMedia('(max-width: 760px)');
function layoutCards() {
  for (const group of cardGroups) {
    if (singleColumn.matches) group.element.replaceChildren(...group.cards);
    else {
      const columns = [document.createElement('div'), document.createElement('div')];
      for (const column of columns) column.className = 'project-column';
      group.cards.forEach((card, index) => columns[index % 2].append(card));
      group.element.replaceChildren(...columns);
    }
  }
}
singleColumn.addEventListener('change', layoutCards);
layoutCards();

// 三款游戏分别使用自己的子路径，完整本机预览沿用同一地址。
for (const link of document.querySelectorAll('[data-game-link]')) link.href = new URL(link.dataset.gameLink, location.origin).href;
document.querySelector('#language-select').addEventListener('change', event => {
  const selected = supportedLanguage(event.target.value);
  if (!selected) return;
  applyLanguage(selected);
  try { localStorage.setItem(preferenceKey, selected); } catch { /* 隐私模式下仍可通过链接保留语言。 */ }
  const url = new URL(location.href);
  url.searchParams.set('lang', selected);
  history.replaceState(history.state, '', url);
});
window.addEventListener('languagechange', () => {
  if (!supportedLanguage(new URL(location.href).searchParams.get('lang')) && !savedLanguage()) applyLanguage(browserLanguage());
});
document.querySelector('#year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', showPage);
applyLanguage(language);
showPage();
