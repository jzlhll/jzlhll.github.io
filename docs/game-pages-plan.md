# 多游戏分支与 GitHub Pages 发布约定

## 站点与固定版本

博客和两个子游戏统一由 `jzlhll/jzlhll.github.io` 部署。博客小游戏分类指向 `#games`，作品卡片分别进入并列子目录。游戏源码仍独立维护在 `jzlhll/HtmlCarGame` 的不同分支，禁止将整款游戏合并到另一款游戏分支。

| 游戏 | 固定源码 | 访问地址 |
| --- | --- | --- |
| 四季车途 | `v1.0.8`，`2103681e4503fe0ba7706ec5ccb0085ada12290b` | `https://jzlhll.github.io/games/cargame/` |
| 英语空战 | `codex/english-air-combat`，程序 `v1.2.1`，`71a8ea36fac3e9631796a8bb9adbbe6c2b8a44df` | `https://jzlhll.github.io/games/english/` |

`games.json` 记录仓库、完整提交 SHA、程序版本与唯一目录，打包不读取分支最新代码。英语程序版本不表示已有同名正式 Release。原地址 `https://jzlhll.github.io/HtmlCarGame/` 继续由游戏仓库已有 Pages 站点提供。

## 打包与发布

运行 `node scripts/prepare-site.mjs`，从公开仓库获取固定提交，在 `.game-sources` 安装各版本锁定依赖，调用对应版本的 `scripts/prepare-pages.mjs`，将静态包分别复制到 `_site/games/cargame` 和 `_site/games/english`，再加入博客入口、样式、脚本与清单。生成目录已忽略，不提交 Git。任一游戏打包失败会阻止上传。

每次部署必须包含两款游戏完整静态文件。游戏使用相对模块、Worker 与资源地址，允许从各自子目录加载。博客 Release tag 用于博客缓存版本；游戏打包使用清单中的程序版本，清除博客 tag 的校验环境。

`.github/workflows/pages.yml` 仅在博客正式 Release 发布时运行，检出该 Release tag 对应的清单、脚本与入口，一次上传完整 `_site`，通过 `github-pages` 并发组串行部署。普通 commit、push、单独推送 tag、草稿与预发布版本不会更新网站。删除 Release 不会下线网站。

英语分支工作流只上传 `english-air-combat` 静态包，不执行 Pages 部署，避免覆盖原赛车站点。赛车分支旧流程只影响原项目站点，不自动更新博客固定副本。

## 更新游戏

1. 在对应游戏分支完成修改并提交、推送，取得完整 SHA，确认程序与包版本一致。
2. 在博客 `games.json` 只修改该游戏的提交和程序版本，其他游戏保持原值；新增游戏分配唯一 `games/<id>` 路径并添加作品卡片。
3. 运行聚合打包，在 `_site` 中预览入口及受影响游戏的子路径加载。
4. 提交、推送博客变更后，按正式 Release 流程发布博客；准备包和 push 本身不创建 Release。

清单与入口随同一个博客 Release 原子部署。发布前基于博客最新分支处理清单变更，保留其他游戏已经更新的固定提交。
