# 从 Design System 到 Release：实操主指南

**目标：在已有 Taskroom 产品里，亲手完成 Create task 并发布。**

你不用先学完编程。每一步先看材料，再给 Claude 对应 prompt，然后亲自验收。一次只发送一个阶段的 prompt。

基础包已提供：运行中的产品、代码版 Design System、组件展示、数据服务、数据测试、CI、手动发布 workflow、需求与 QA 文件。**尚未提供：Create task 的表单与提交交互——这正是你的练习。**

预计分 4 次练习，每次 60–90 分钟；环境或账号问题可能需要额外时间。

## 操作总览

| 顺序 | 阶段 | 材料 | 你的产出 |
|---|---|---|---|
| 0 | 准备工具并启动 | README.md、package.json | 本地页面可打开 |
| 1 | 理解已有项目 | CLAUDE.md、docs/03、src/ | outputs/01-repo-map.md |
| 2 | 建 GitHub 基线 | docs/05、.github/ | main 已上传、CI 通过 |
| 3 | 识别和调用 DS | components.html、docs/02 | 组件与 API 映射 |
| 4 | 定义 feature | docs/01 | outputs/02-feature-plan.md |
| 5 | 新建分支并实施 | plan、src/、CLAUDE.md | 可运行的新功能 |
| 6 | 浏览器设计迭代 | docs/04、真实页面 | 完整状态、视觉和键盘体验 |
| 7 | 检查与修复 | tests/、docs/04 | outputs/03-qa-report.md |
| 8 | Commit + PR | .github/pull_request_template.md | 可 Review 的 PR |
| 9 | 合并并发布 | docs/05、pages.yml | 正式 URL |
| 10 | 验证与回退演练 | QA、release log | outputs/04-release-log.md |

第一次练 0–3；第二次练 4–5；第三次练 6–8；第四次练 9–10。

## 0 · 准备工具，启动基线

**材料：** README.md、package.json、docs/06-glossary-and-resources.md。

**你操作：**

1. 下载并解压整个 ZIP。移动到方便的位置，例如 Documents；文件夹保留为 `ai-design-foundation`。
2. 安装 VS Code、Git、Node.js 22+、Claude Code。账号需能使用 Claude Code；ChatGPT 订阅不等于 Claude 使用权限。
3. VS Code → File → Open Folder → 选该文件夹。Terminal → New Terminal。
4. 在 VS Code 终端逐条运行：

```bash
node --version
git --version
npm run dev
```

5. 打开 http://localhost:5173 。应看到 3 条任务，没有 Create task 按钮；组件库链接可打开。
6. 保留这个终端作为开发服务器。另开第二个终端，输入 `claude`，按官方登录流程进入。Claude 需在本项目文件夹内启动。

Mac 如果 `git` 提示安装命令行工具，按系统提示完成。若 5173 被占用，停止占用服务或在 Mac 用 `PORT=5174 npm run dev`，再打开对应端口；切换端口会对应不同本地数据。

Claude Code 的 macOS 安装命令（在终端执行，不是在聊天框发送）：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

安装后新开终端，运行 `claude --version`。如果找不到命令，按官方安装页面检查 PATH；不要因此重建项目。系统要求与最新安装方式见 docs/06 的官方链接。

**发给 Claude：**

```text
我在这个文件夹练习 AI-native 产品设计。先阅读 CLAUDE.md、README.md 和 package.json。
请检查当前工作目录、Node / Git、启动命令与文件结构。不要修改代码，不要安装依赖。
解释我应在 VS Code 的哪个终端运行开发服务器、在哪个终端与你对话，以及如何确认页面正常。
如果遇到环境错误，请依据实际错误诊断，不要重建项目。
```

**完成标准：** 任务页和组件页可打开；你知道两个终端各做什么。

## 1 · 让 Claude 读懂已有产品

**材料：** CLAUDE.md、docs/03-architecture.md、src/、outputs/01-repo-map.md。

**你操作：** 发送 prompt，随后打开 Claude 提到的几个文件，看路径是否真实存在。

```text
现在只做 repo discovery，不实现 feature。
读取 CLAUDE.md、docs/03-architecture.md，并核对真实源码。
将发现写进 outputs/01-repo-map.md：
1. 页面入口、列表渲染、Design System、数据服务的位置。
2. 用户点击按钮到保存数据，预计会经过哪些模块。
3. 现有数据测试检查什么、尚未检查什么。
4. 本地运行、检查、构建、发布分别使用什么命令或 workflow。
5. 新功能应接在哪里，建议新建什么文件。
用简短中文解释，引用实际路径。只更新这份 repo map。
```

**完成标准：** 你能指出“组件在哪里、数据在哪里、新 feature 接哪里”。

## 2 · 把基础项目放进 GitHub

**材料：** docs/05-release-runbook.md、.gitignore、.github/workflows/ci.yml。

**你操作：** 按 docs/05 的“首次上传”创建空仓库并执行命令。保留 `.github` 文件夹——Mac Finder 默认可能不显示它，终端 git add 会包含它。不要上传 ZIP 本身。

**发给 Claude：**

```text
现在建立项目基线，不实现 feature。
先检查 git status、当前分支和 remote；如果还不是 Git 仓库，说明情况。
阅读 docs/05-release-runbook.md，指导我创建空 GitHub 仓库并上传本地基线。
不要猜测我的用户名、远程地址、账号或认证方式。
本地 Git 操作前先确认没有其他项目历史或无关文件。
说明如何在 GitHub Actions 查看 CI，以及成功时应看到哪些检查。
本阶段不要改应用代码、不要发布网站。
```

**完成标准：** GitHub 的 main 包含源码、docs 和 `.github`；CI 绿色。若认证未完成，先解决，不跳过。

## 3 · 学会找现有组件

**材料：** 浏览器 `/components.html`、docs/02-design-system.md、src/design-system/、src/showcase.js。

**你操作：** 点击 Open dialog、按 Tab / Escape；点击 Preview toast；观察字段错误示例。

**发给 Claude：**

```text
现在做 Design System mapping，不写新功能。
阅读 docs/02-design-system.md、src/design-system/ 和 src/showcase.js。
针对未来的 Create task，列出：界面元素 → 现有组件 → 源码路径 → 真实参数与返回值。
重点解释 Button、Field、Dialog 如何组合，如何提交 form、显示 field error、显示保存失败和成功 Toast。
把组件映射追加到 outputs/01-repo-map.md。
指出哪些能力已存在、哪些交互需要 feature 自己负责。不要发明组件 props，不要增加依赖。
```

**完成标准：** 你能解释“复用 Dialog”与“实现创建任务业务逻辑”的区别。

## 4 · 设计 feature，先形成实施计划

**材料：** docs/01-product-brief.md、docs/02、docs/03、outputs/02-feature-plan.md。

**你操作：** 看清字段、默认值、失败和取消规则。让 Claude 提供方案后，你判断是否符合需求；在进入下一步前修改不合理之处。

```text
阅读 docs/01-product-brief.md、docs/02-design-system.md、docs/03-architecture.md 和已有 repo map。
暂时不要修改应用代码。
给出两个简短的布局方案，都复用现有 DS，并推荐其中一个。
然后把推荐方案写进 outputs/02-feature-plan.md，包含：
- 用户操作顺序与 modal 信息层级。
- 字段、默认值、inline errors、loading、success、failure、cancel。
- 键盘、窄屏和焦点行为。
- 组件复用清单及真实 API。
- 预计修改 / 新建文件。
- AC01–AC10 分别怎样验证。
严格保持 brief 范围，不新增日期、搜索、编辑或后端。
用设计师能理解的语言解释关键取舍。
```

**完成标准：** plan 足够清楚；你知道成功、失败、取消时会发生什么。

## 5 · 在 feature branch 里实现

**材料：** outputs/02-feature-plan.md、CLAUDE.md、docs/01–03、现有组件和 service。

**你操作：** 确认阶段 2 已上传基线，服务器仍运行。现在明确让 Claude 动手。

```text
现在按 outputs/02-feature-plan.md 实现 Create task。
先检查 git status 和分支；保护已有改动。在 main 基线创建并切换到 feat/create-task；若该分支已存在，先检查后复用。
要求：
1. 复用实际 Button、Field、Dialog、Toast、Banner 和 tokens。
2. 新建独立 feature 模块，由 app.js 传 service 和 renderTasks 回调；避免循环依赖。
3. 复用已有 validateTask / createTask，不重写数据层。
4. 完成 brief 的所有状态：inline error、首个错误焦点、防重复提交、保存中禁用及阻止 Escape、失败保留输入、重试、取消清理、成功刷新与焦点回归。
5. 按 docs/03 接入 ?failSave=1 的首次保存失败演练。
6. 保留已有任务列表、练习工具与组件展示页，支持 390px 和 1440px。
实现后运行 npm run check、npm test、npm run build，报告真实结果。
说明改了哪些文件、复用了哪些组件，以及我如何在浏览器试用。
本阶段不要 commit、push、合并或部署。
```

**完成标准：** 本地页面能完成一次创建；代码改动在 feature 分支；你实际操作过它。

## 6 · 像设计师一样在真实界面上迭代

**材料：** 运行中的页面、docs/04-qa-checklist.md、组件页、git diff。

**你操作：** 亲自尝试空提交、失败重试、取消、Tab、手机宽度。记录具体“观察到什么 → 希望怎样”。如果 Claude 的环境没有浏览器能力，由你执行并报告观察，不让它假称看过。

```text
现在做设计验收和小范围迭代。
依据 docs/01、docs/02 和 docs/04 审查当前实现。
若你有浏览器工具，实际操作并记录；没有就列出我需要亲自执行的步骤，不要声称已验证 UI。
检查信息层级、组件一致性、错误位置、loading、关闭行为、焦点回归和窄屏。
先列出具体问题及对应文件；修复有证据的问题，不做无关重构。
修复后运行受影响的检查，并告诉我需要重试哪些操作。
不要 commit、push 或发布。
```

**针对自己的观察，用这个追加 prompt：**

```text
我在 [页面 / 屏幕宽度] 执行 [操作]。
实际看到：[具体行为]。
期望行为：[具体结果]。
请检查原因，并用现有组件和 tokens 做最小修复；解释如何复测，不改无关区域。
```

**完成标准：** 你至少经历一轮“观察 → 修改 → 复测”，而不是只接受第一次生成结果。

## 7 · QA、检查和 Review

**材料：** docs/04、tests/、outputs/03-qa-report.md、git diff。

**你操作：** 完成 Q01–Q17，填写实际结果；Q18 等上线后做。

```text
现在做发布前 QA 和代码 review。
读取 docs/04，审查本分支相对 main 的 diff，检查 brief AC01–AC10。
运行 npm run check、npm test、npm run build。
重点审查：重复提交、失败后输入丢失、保存时被关闭、监听器重复、用户输入通过 innerHTML 注入、循环依赖、绕过 DS、刷新持久化。
针对实际新增业务风险补必要测试，不写只检查实现字符串存在的测试。
修复已确认的问题，然后复跑相关检查。
将每条 QA 的 Pass / Fail / Not run、操作者和证据写进 outputs/03-qa-report.md；没有实际操作的浏览器项标为 Not run。
说明还有哪些项需要我人工验收。不要 commit、push 或发布。
```

**完成标准：** 发布前必需项通过；UI 未验证项由你完成并补记录。不要因为 6 个原始测试通过，就直接判定新功能完成。

## 8 · Commit、Push、创建 PR

**材料：** diff、QA report、.github/pull_request_template.md。

**你操作：** 在 VS Code Source Control 里查看变更。能解释每个新增文件的用途，再提交。

```text
现在准备提交并创建 PR，不合并、不部署。
先检查当前分支是 feat/create-task、git diff 与 QA 报告，确认没有凭证、无关文件或未说明的测试失败。
总结变更和已验证 / 未验证内容；将本次 feature 和相关文档提交，push 到对应远程分支。
按 .github/pull_request_template.md 准备 PR，标题描述用户行为，附真实检查结果、人工 QA 和限制。
若有已认证的 GitHub 工具可创建 PR，就创建；否则给我 GitHub 上创建 PR 的具体步骤和可复制正文。
如果认证或远程地址缺失，明确指出，不猜测、不声称已上传。
```

**完成标准：** PR 的 base=main、compare=feat/create-task；CI 绿色；你看过 Files changed。截图可手工拖入 PR，勿包含个人敏感信息。

## 9 · 合并并真实发布

**材料：** PR、CI、docs/05、.github/workflows/pages.yml。

**你操作：**

1. 读 PR、检查 CI 和 QA；独立练习可自己 Review，公司项目按团队要求。
2. GitHub 点击 Merge pull request，使用 Create a merge commit，方便回退演练。
3. Settings → Pages → Source 选择 GitHub Actions。
4. Actions → Release to Pages → Run workflow → 选 main → Run。
5. 等 build / deploy 成功，打开部署显示的 URL。

```text
我正在执行 docs/05 的正式发布步骤。
请先核对 PR、CI、QA 报告和 pages workflow，说明是否有未完成的验收项。
解释我接下来在 GitHub 如何合并 PR、选择 Pages 发布来源，并手动运行 main 的 Release to Pages。
我会亲自点击合并和发布。请帮我判断结果和排查实际错误。
不要把 GitHub Release 页面或 PR merge 当作已部署成功；以 Actions deploy 成功和实际 URL 验证为准。
```

**完成标准：** 正式 URL 能打开并创建任务。初次线上只有 seed 数据是正常现象，因为本地数据不会同步过去。

## 10 · 上线验证与回退演练

**材料：** 正式 URL、Q18、docs/05、outputs/04-release-log.md。

**你操作：** 正式网址创建一条任务并刷新；执行 Q18。记录 merge commit、部署 commit、Actions run、URL。再按 runbook 做回退练习；这是你自己的练习站点，可真实恢复到无 Create task 的基线，再恢复 feature。

```text
现在完成 release 验证和回退演练。
读取 docs/05-release-runbook.md，指导我记录真实的 PR、merge commit、部署 commit、Actions run 和 URL 到 outputs/04-release-log.md。
核对 Q18 的真实验证结果；无法访问的内容标为待验证。
然后先检查实际 Git 历史和 PR 合并方式，给出用新分支、新 PR revert feature 的步骤；不要猜 commit SHA，不要 reset --hard 或 force-push。
我会按步骤操作并在 GitHub 手动运行 release。
回退后检查创建入口消失、列表仍可用；再通过 revert 回退 commit 的新 PR 恢复 feature，重新发布验证。
最后用 5 个问题检查我是否理解：组件复用、分支、PR、CI、部署与回退。
```

**完成标准：** 你能从线上结果追到具体 commit；知道如何发布、验证和撤销；日志记录真实结果。

## 卡住时的通用 prompt

```text
我卡在 START_HERE 的第 [编号] 步。
我执行的命令 / 操作是：[内容]。
完整错误是：[粘贴错误，移除 token 等敏感信息]。
请先定位原因，给最少的下一步；不要重建项目、跳过检查或顺便实现后面的阶段。
```

下一轮把 docs/07-company-transfer.md 的映射填好，再把同一流程应用到公司的真实组件库和发布机制。
