# 多游戏与 GitHub Pages 发布约定

## 站点与固定版本

博客和三款小游戏由 `jzlhll/jzlhll.github.io` 统一部署。首页按工具、小游戏、技术与笔记的顺序排列。轻绘独立部署到 https://jzlhll.github.io/MacSimplePaint/ ，工具卡片直接链接该站点。

| 游戏 | 固定源码与程序版本 | 源码目录 | 访问路径 |
| --- | --- | --- | --- |
| 四季车途 | `2103681e4503fe0ba7706ec5ccb0085ada12290b`，`v1.0.8` | 仓库根目录 | `/games/cargame/` |
| 英语空战 | `71a8ea36fac3e9631796a8bb9adbbe6c2b8a44df`，`v1.2.1` | 仓库根目录 | `/games/english/` |
| 低空穿越 | `d750518056c958ba2573f89f1950047f98734b39`，`v1.0.1` | `low-altitude-flight/` | `/games/flight/` |

所有游戏源码来自 `jzlhll/HtmlCarGame`。`games.json` 锁定完整 SHA、程序版本和唯一访问路径，不读取分支最新代码；可选的 `source_directory` 支持单仓库内的独立子工程，未设置时使用仓库根目录。原赛车地址 https://jzlhll.github.io/HtmlCarGame/ 保持独立。

## 打包与发布

`node scripts/prepare-site.mjs` 将源码获取到 `.game-sources/<id>`，在对应源码目录安装锁定依赖并运行 `scripts/prepare-pages.mjs`，将 `.pages-output` 复制到 `_site/games/<id>`，再加入首页、样式、脚本、图片和清单。任意游戏打包失败都会阻止上传。

博客 Release 版本只用于博客静态资源缓存，游戏构建使用清单中的程序版本。打包会清除博客 tag 校验环境，分别保留三款游戏的模块、Worker 与资源相对地址。游戏模型和声音资源由各自构建脚本准备。

`.github/workflows/pages.yml` 仅在正式 Release 发布时触发，检出该 Release 的 tag，使用 `github-pages` 并发组串行上传完整 `_site`。普通提交、推送、单独推送 tag、草稿和预发布 Release 不更新站点；删除 Release 不会下线站点。

## 更新作品

1. 在游戏源码仓库完成对应工程的提交和推送，确认程序版本与包版本一致。
2. 在博客 `games.json` 修改该游戏的固定 SHA、程序版本与必要的源码目录，保留其他游戏已有配置。
3. 新增游戏时分配唯一的 `games/<id>` 路径并添加首页作品卡片；聚合脚本同步检查必需游戏。
4. 运行完整聚合打包，检查入口与各子目录资源。
5. 提交、推送网站变更，创建 tag 并发布正式 Release，由同一次部署更新首页和所有游戏。

新增工具时，在工具区添加入口；独立工具站点按各自仓库的发布方式更新。技术区尚无文章，只保留明确标注的示意图片与说明。
