const views = document.querySelectorAll('[data-view]');
const labels = { home: '首页', about: '关于这里' };
const sections = { tools: '小工具', games: '小游戏', technology: '技术与笔记' };

// 三款游戏分别使用自己的子路径，完整本机预览沿用同一地址。
for (const link of document.querySelectorAll('[data-game-link]')) {
  link.href = new URL(link.dataset.gameLink, location.origin).href;
}

function showPage() {
  const hash = location.hash.slice(1);
  const page = Object.hasOwn(labels, hash) ? hash : 'home';
  const section = { android: 'technology', explore: 'tools' }[hash] || hash;
  for (const view of views) view.hidden = view.dataset.view !== page;
  document.title = `${sections[section] || labels[page]} · Allan 的博客`;
  if (Object.hasOwn(sections, section)) {
    document.getElementById(section).scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo({ top: 0 });
  }
}

document.querySelector('#year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', showPage);
showPage();
