# 06 · 必要术语与官方资源

材料准备日期：2026-11-13。界面和安装方式可能更新，以官方页面为准。

| 术语 | 在这次练习里的含义 |
|---|---|
| Repo / 仓库 | 整个项目和它的变更历史 |
| Local / 本地 | 你电脑上的文件和开发服务器 |
| Branch / 分支 | 在独立版本里做 feature，暂不改 main |
| Diff | 这次具体改动的内容 |
| Commit | 一次有说明、可追溯的代码快照 |
| Push | 把本地 commits 上传 GitHub |
| PR / Pull Request | 请求把分支合并进 main，并展示差异和检查 |
| CI | 自动运行语法检查、测试、构建 |
| Build | 准备可部署的 dist 文件 |
| Deploy | 把构建产物送到托管环境 |
| Release | 决定向用户交付某个版本；此练习手动部署即公开交付 |
| Token（设计） | 颜色、间距等设计变量；不同于认证 token |
| Component | 可复用 UI 实现；要读真实参数和返回值 |
| CLAUDE.md | Claude 的项目说明，不是组件库本身 |
| Agent | 能读取、修改文件并调用工具执行任务的 AI；结果仍需验收 |
| MCP | 工具 / 数据连接协议；本次本地代码练习不依赖 MCP |
| Revert | 通过新 commit 撤销已有 commit，保留历史 |

## 安装与入门

- VS Code：https://code.visualstudio.com/
- Node.js：https://nodejs.org/en/download （选择 22+ 的受支持 LTS）
- Git：https://git-scm.com/downloads
- Claude Code 入门：https://code.claude.com/docs/en/overview
- Claude Code 安装：https://code.claude.com/docs/en/setup
- Claude Code 项目说明：https://code.claude.com/docs/en/memory
- Claude 官方第一天指南：https://support.claude.com/en/articles/14552382-your-first-day-in-claude-code

## 按需查，不用先通读

- GitHub PR：https://docs.github.com/en/pull-requests
- GitHub HTTPS 认证：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github
- Pages 发布来源：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Pages 自定义 workflow：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- 官方静态 Pages 模板：https://github.com/actions/starter-workflows/blob/main/pages/static.yml
- 发布环境：https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments

先掌握 branch、diff、PR、CI、deploy。Agents 分工、MCP、Figma 连接可以在完成第一轮后再加。
