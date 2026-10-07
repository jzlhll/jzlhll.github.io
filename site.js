const views = document.querySelectorAll('[data-view]');
const navItems = document.querySelectorAll('[data-page]');
const gamesMenu = document.querySelector('#games-menu');
const labels = { home: '首页', android: 'Android 技术', hobbies: '个人爱好', about: '关于这里' };

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
  for (const item of navItems) {
    const active = item.dataset.page === page;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  }
  document.title = `${labels[page]} · Allan 的博客`;
  document.querySelector('#breadcrumb').textContent = `${labels[page]} / ${page === 'home' ? '欢迎来到我的博客' : '代码与生活'}`;
  if (hash === 'games' || hash === 'explore') {
    if (hash === 'games') gamesMenu.open = true;
    document.querySelector(hash === 'games' ? '.featured' : '#explore').scrollIntoView({ block: 'start' });
  } else {
    window.scrollTo({ top: 0 });
  }
}

document.querySelector('#year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', showPage);
showPage();
