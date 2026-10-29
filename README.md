# Allan · 代码与生活

个人作品与笔记站点，仓库为 `jzlhll/jzlhll.github.io`，网站地址为 https://jzlhll.github.io/ 。使用原生 HTML、CSS 和 JavaScript，无后台或第三方字体、图片加载。

## 首页结构

首页按以下顺序展示三个栏目：

1. **小工具**：`#tools`，目前收录轻绘，直接进入 https://jzlhll.github.io/MacSimplePaint/ 。轻绘由 `jzlhll/MacSimplePaint` 独立维护和部署，网页源版本为 `webapp1.0`。
2. **小游戏**：`#games`，展示四季车途、英语空战和低空穿越，分别进入 `/games/cargame/`、`/games/english/` 和 `/games/flight/`。
3. **技术与笔记**：`#technology`，位于首页底部，目前没有文章。保留 Android、图形交互、工程工具三张明确标注为“示意图”的占位卡片，不生成虚构文章或阅读入口。

保留关于页面、品牌和深色薄荷绿视觉风格。支持手机与电脑布局、键盘导航，以及减少动态效果的系统偏好。旧 `#android` 和 `#explore` 入口分别定位到技术区和工具区。

## 内容与资源

- `index.html`：首页栏目、工具和游戏卡片、关于页面。
- `style.css`：样式与响应式布局。
- `site.js`：栏目定位、关于页面切换、游戏链接。
- `assets/`：站点本地图片，轻绘画布示例来自轻绘仓库的 `docs/Quiet Morning.png`。
- `games.json`：三款游戏的完整源码提交、程序版本、源码子目录与发布路径。
- `scripts/prepare-site.mjs`：下载清单中的固定版本，构建三个独立游戏并组装完整站点。

游戏源码独立维护在 `jzlhll/HtmlCarGame`；源码仓库的提交不会自动更新本站固定版本。完整约定见 [game-pages-plan.md](docs/game-pages-plan.md)。

## 本机预览

只查看首页：

```bash
python3 -m http.server 5186 --bind 127.0.0.1
```

完整预览：

```bash
node scripts/prepare-site.mjs
python3 -m http.server 5280 --bind 127.0.0.1 --directory _site
```

完整打包需要联网，获取固定的公开游戏提交和锁定依赖。生成的 `_site` 与 `.game-sources` 已忽略，不提交。轻绘入口指向已部署的独立站点。

## 发布

GitHub Pages 的 Source 使用 **GitHub Actions**。`.github/workflows/pages.yml` 在发布正式 Release 时检出该 Release 的 tag，生成并发布完整 `_site`；普通 commit、push、单独推送 tag、草稿和预发布 Release 不更新网站。已有部署任务可以重新运行。

发布包包含首页、样式、脚本、本地图片、固定版本清单和三款游戏的全部静态资源，不包含 README、Git 元数据或开发文档。样式和脚本附加 Release 版本以避免缓存混用。单次部署完整替换站点，保留三个游戏的独立子路径；轻绘 Pages 独立发布。

提交邮箱仅在本仓库配置为 `jzl.hll@163.com`，不修改全局 Git 配置。
