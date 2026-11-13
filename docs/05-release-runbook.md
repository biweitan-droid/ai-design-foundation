# 05 · GitHub / CI / Release runbook

本练习：GitHub 保存源码 → PR 运行 CI → 合并 main → 手动运行 Pages workflow → URL 验证。**Merge 不会自动部署。** 无 PR 在线预览；PR 的 CI 产物可下载后本地查看。

## A. 首次上传

1. GitHub 网页创建仓库 `ai-design-foundation`。建议用个人练习 public 仓库，便于使用 Pages；所有内容保持虚构。不要自动添加 README、license、.gitignore，确保仓库为空。
2. 本地项目根目录（package.json 所在处）打开终端。先 `git status`；如果显示已是其他仓库的一部分，停止并确认目录，不要嵌套初始化。
3. 若未初始化，逐条执行：

```bash
git init -b main
git add .
git status
git commit -m "chore: add Taskroom design practice foundation"
```

首次 commit 可能要求 user.name / user.email。使用你自己的 GitHub 资料；可用 GitHub Settings → Emails 显示的 noreply 邮箱。由你填写真实值。

4. 在 GitHub 新仓库页面复制实际 HTTPS remote。运行下列命令前，把 `YOUR_GITHUB_USERNAME` 替换成实际账号；仓库名不同也要对应修改：

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ai-design-foundation.git
git push -u origin main
```

如果 origin 已存在，先 `git remote -v`，不要重复添加或盲目覆盖。

认证优先用 GitHub 支持的浏览器登录 / credential manager 或 GitHub Desktop。GitHub 账号密码不是 HTTPS Git 的有效密码；不要把 token 发给 Claude 或写进文件。也可以使用你已经配置好的 SSH。

5. GitHub → Actions → CI，确认 verify 运行成功。无需 npm install，因为没有第三方依赖。

## B. 分支与 PR

```bash
git switch main
git pull --ff-only
git switch -c feat/create-task
```

实现、检查后提交并 push。只在确认 diff 属于本次功能后暂存文件；不要把不相关变更一起提交。

```bash
git status
git diff
git add src tests outputs
git commit -m "feat: create tasks from the task list"
git push -u origin feat/create-task
```

若有其他应提交的文件，检查后逐个 add。GitHub → Pull requests → New pull request → base main / compare feat/create-task。填写模板，检查 CI。单人练习自己 Review 不等于独立审查；公司按其规则执行。

CI 包含语法、数据测试、构建，不自动验收所有 UI。产物名 app-build；如果下载 PR 产物，可解压到单独文件夹，用本机静态服务器查看，别覆盖工作目录。

## C. 手动发布

1. 验收通过后在 GitHub 合并 PR。为方便回退，选择 Create a merge commit。
2. 仓库 Settings → Pages → Build and deployment → Source 选 GitHub Actions。
3. Actions → Release to Pages → Run workflow，Branch 选 main。
4. workflow 在 main 上重新运行 check / test / build，上传 dist，然后 deploy。
5. 在成功的 deploy job / environment 中打开实际 URL。通常是 `https://账号.github.io/仓库名/`，以实际返回地址为准。
6. 执行 Q18，记录到 outputs/04-release-log.md。日志修改可单独提文档 PR；不必为了记录日志重复部署应用。

workflow 只允许 main；其他分支触发会跳过。没有设置 required reviewer 时手动点 Run 就是发布触发点；组织若配置 environment 审批，还需按其要求完成。

GitHub Release / tag 是版本记录，不会因创建它就自动部署本项目。

## D. 回退：保留历史，重新部署

此站点没有 feature flag，练习用 revert 恢复旧代码。不删 localStorage，已有任务数据可以继续保留。

1. 从 PR 页面找到实际 feature merge commit。记下 SHA，不使用下方占位符原样运行。
2. 确认工作区干净，更新 main，创建 `revert/create-task` 分支。
3. 若确实使用了 merge commit：`git revert -m 1 ACTUAL_FEATURE_MERGE_SHA`。
4. 若使用 squash merge，应对单个 squash commit 执行 `git revert ACTUAL_SQUASH_SHA`，不用 `-m 1`。不要凭猜测选命令。
5. 运行 check / test / build，push 新分支，创建 PR，审查后合并。
6. 再手动运行 main 的 Release to Pages。单纯 revert / merge 还没改变线上。
7. 正式网址刷新，确认创建入口消失、任务列表正常。
8. 恢复 feature：从更新后的 main 创建恢复分支，对上面生成的“回退内容 commit”做普通 `git revert ACTUAL_REVERT_COMMIT_SHA`，检查、PR、合并、再部署。不要误用包含它的 PR merge commit。

遇到冲突，让 Claude 先解释冲突和目标行为再修复，检查通过后继续。不要 force-push、reset --hard 或删除 main。

## E. 常见问题

| 现象 | 先检查 |
|---|---|
| git push 失败 | remote 是否正确、GitHub 认证、仓库权限；不要改应用代码 |
| CI 不出现 | .github/workflows 是否上传、Actions 是否启用 |
| Pages 404 | 发布来源是否 GitHub Actions；deploy 是否成功；是否打开仓库子路径 |
| Run workflow 不出现 | pages.yml 是否已在 main；是否有 workflow_dispatch |
| deploy 权限失败 | pages:write、id-token:write、组织策略、github-pages 环境限制 |
| 线上仍旧界面 | 最近部署 SHA 是否为 feature 合并之后；是否实际点过手动发布 |
| 本地新增数据线上没有 | localStorage 按 origin 隔离，预期行为 |

官方参考链接见 docs/06。
