const views = document.querySelectorAll('[data-view]');
const labels = { home: '首页', android: 'Android 技术', hobbies: '个人爱好', games: '小游戏', about: '关于这里' };

// 部署后沿用博客所在账号的域名，本机预览保留指定的游戏地址。
if (location.hostname.endsWith('.github.io')) {
  for (const link of document.querySelectorAll('[data-game-link]')) {
    link.href = new URL('/HtmlCarGame/', location.origin).href;
  }
}

function showPage() {
  const hash = location.hash.slice(1);
  const page = Object.hasOwn(labels, hash) ? hash : 'home';
  for (const view of views) view.hidden = view.dataset.view !== page;
  document.title = `${labels[page]} · Allan 的博客`;
  if (hash === 'explore') {
    document.querySelector('#explore').scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo({ top: 0 });
  }
}

document.querySelector('#year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', showPage);
showPage();
