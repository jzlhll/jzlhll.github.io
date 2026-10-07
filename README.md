# Allan · 代码与生活

独立个人博客，远端仓库为 `jzlhll/jzlhll.github.io`，网站地址为 `https://jzlhll.github.io/`。使用原生 HTML、CSS 和 JavaScript，无构建步骤、无后台、无第三方资源加载。

## 页面与入口

- 品牌位于主页面左上角；首页以 Android 技术、个人爱好、小游戏三个大块作为分类入口，不使用侧栏或窄屏顶部分类导航。
- Android 技术和个人爱好目前为预留栏目，显示准备中的说明，不生成虚构文章。
- 首页保留「小游戏列表」展示区；点击「小游戏」大块，通过 `#games` 定位到同一页面的作品卡片，再点击「开始旅途」进入 `https://jzlhll.github.io/HtmlCarGame/`。
- 新增游戏时，在 `#games` 区域追加对应作品卡片；「小游戏」大块始终指向作品列表，不直接进入某一款游戏。
- 游戏作品卡片提供直接进入游戏的按钮。游戏独立维护在 `jzlhll/HtmlCarGame`，发布游戏不会自动修改博客。
- 部署在 GitHub Pages 时，游戏链接自动沿用博客的账号域名；本机预览使用 jzlhll 的正式地址。
- 支持手机与电脑布局、键盘导航及减少动态效果的系统偏好。

## 本机预览

在仓库目录运行：

```bash
python3 -m http.server 5186 --bind 127.0.0.1
```

浏览器访问 `http://localhost:5186/`。使用 HTTP 预览，结束后按 Ctrl+C 停止服务。

## 发布规则

在 GitHub 仓库 Settings → Pages → Build and deployment 中，将 Source 设置为 **GitHub Actions**。如果 github-pages 环境限制了部署分支或 tag，请允许用于发布的 tag。

`.github/workflows/pages.yml` 只在发布正式 Release 时更新网站；检出该 Release 的 tag 对应代码。普通提交、推送、单独创建或推送 tag、保存 Release 草稿、发布预发布版本，均不更新网站。不提供手动发布入口，但管理员仍可重新运行已有任务；删除 Release 不会下线网站，编辑 Release 说明也不触发更新。

首次上线需要先把页面和工作流推送到远端，再创建包含这些文件的版本 tag 并发布正式 Release。Release 需要关联 tag；可以在 GitHub 创建 Release 时同时创建 tag。

仅发布 `index.html`、`style.css` 和 `site.js`。不向网站发布 README、Git 信息或工作流文件。

## 内容维护

`index.html` 维护简介、分类内容、作品及链接；`style.css` 维护布局与响应式样式；`site.js` 维护栏目切换、页面标题和游戏链接。

提交邮箱仅在本仓库配置为 `jzl.hll@163.com`，不修改全局 Git 配置。
