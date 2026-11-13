# Repo map · 阶段 1：理解已有项目

填写者 / 日期：Claude 代为整理（待学习者打开文件核对）/ 2026-11-13
依据：CLAUDE.md、docs/03-architecture.md，以及对 `src/`、`tests/`、`scripts/`、`.github/workflows/` 实际源码的逐个读取。本阶段未改任何代码。

| 问题 | 实际发现 | 文件路径 |
|---|---|---|
| 入口和运行命令 | `index.html` 加载 3 份 CSS + `src/app.js`（ES module）；`npm run dev` 启动本地静态服务器，地址 127.0.0.1:5173 | index.html、src/app.js、scripts/server.mjs、package.json |
| Tokens 和组件库 | Tokens 是 CSS 变量（颜色 / 间距 / 圆角 / 字号 / 阴影）；6 个组件都是返回 DOM 的函数；组件展示页是 components.html | src/design-system/tokens.css、components.js、components.css；components.html + src/showcase.js |
| 列表数据从哪里来 | `app.js` 创建 `service = createTaskService({storage: localStorage})`，`renderTasks()` 调 `service.listTasks()`；localStorage 里没有数据时回落到 seed 的 3 条任务 | src/app.js:3、src/app.js:6-16、src/data/task-service.js:13、src/data/seed.js |
| 创建功能接在哪里 | 页头已经留了空容器 `<div id="feature-entry">`；`app.js` 末尾注释写明“在这里 import / mount 你的 feature”；`createTask` 已存在，但还没有 UI | src/app.js:5（#feature-entry）、src/app.js:19-20、src/data/task-service.js:14-20 |
| 检查和发布流程 | check / test / build 都是 Node 自带脚本；CI 在 PR 和 push main 时运行；Pages 只能手动触发，且只认 main | scripts/check.mjs、scripts/build.mjs、.github/workflows/ci.yml、.github/workflows/pages.yml |

---

## 1. 关键位置

**页面入口**
- `index.html`：只有 `<div id="app">`，样式顺序为 tokens.css → components.css → app.css。
- `src/app.js:5`：用一段**静态** innerHTML 生成整页骨架（侧边栏、页头、`#stats`、`#task-list`、`#lab-tools`）。这里面没有用户数据，所以不违反 textContent 规则。

**列表渲染**
- `src/app.js:6-16` 的 `renderTasks()` 是**导出函数**，每次调用都会清空后重画统计卡和表格。
- 单元格内容都用 `textContent` 插入；Priority / Status 两列用 `Badge`。
- 读取失败时显示 `Banner('Saved data could not be read…')`；空数组时显示空状态文案。
- `src/app.js:17` 是练习工具：Reset demo data、Show empty state。注意 Show empty state 直接写死了 `'taskroom.tasks.v1'`，没有引用 `STORAGE_KEY`。

**Design System**（实际签名见 `src/design-system/components.js`）

| 组件 | 实际签名 / 返回 | 要点 |
|---|---|---|
| Button | `Button({label, variant='primary', onClick, type='button', disabled=false})` → `<button>` | variant：primary / secondary / ghost |
| Badge | `Badge({label, tone='default'})` → `<span>` | tone：default / success / warning |
| Field | `Field({id, label, kind='input', type='text', options=[], required=false, hint=''})` → `{root, control, setError(msg)}` | `kind:'select'` 时选项写成 `{label, value}`；setError 会同步设置 aria-invalid；**没有** getValue，要读 `control.value` |
| Dialog | `Dialog({title, onClose})` → `{root, body, footer, open(), close()}` | 基于原生 `<dialog>` + showModal；open 时记住 activeElement，close 时把焦点还回去；第一次 open 才挂到 body 上 |
| Toast | `Toast(message)` | role=status，4 秒后自动移除 |
| Banner | `Banner(message)` | role=alert，适合表单级错误 |

**数据服务**
- `src/data/task-service.js`：`validateTask(draft)`、`createTaskService({storage, delay=500, newId, now})` → `{listTasks, createTask, reset}`；`STORAGE_KEY = 'taskroom.tasks.v1'`。
- `src/data/seed.js`：`seedTasks`（3 条）、`owners`（3 人）、`priorities`（High / Medium / Low）。表单的下拉选项应该从这里取，不要写死。

## 2. 从点击按钮到保存，预计经过的模块

```
#feature-entry 里的 Create task 按钮（Button）
  → Dialog.open()（记住触发按钮）
  → 表单：Field × 3（title 输入框；owner、priority 两个下拉，选项来自 seed.js）
  → submit：读取 control.value 组成 draft {title, owner, priority}
  → service.createTask(draft, {simulateFailure})        ← src/data/task-service.js
       ├ validateTask 不通过 → 抛错并带 error.fields → 用 Field.setError 内联显示，聚焦第一个错误字段
       ├ 等待 500ms（这段时间按钮应处于 loading / disabled 状态）
       ├ simulateFailure → 抛错 → 在 dialog 里显示 Banner，保留输入，可以重试
       └ 新任务 prepend 后写入 localStorage → 返回 task
  → 成功：Dialog.close()（焦点回到按钮）→ onCreated() 即 renderTasks() → Toast('Task created.')
```

实现时要注意的事实：
- `Dialog` 只提供 `body` / `footer`，**不自带 `<form>`**，需要 feature 自己在 body 里建 form，否则 Enter 提交和 submit 事件要另外处理。
- 原生 dialog 按 Escape 会触发 `cancel` → `close` → 调用 `onClose`。保存进行中按 Escape 该怎么处理，Dialog 没有内置方案，需要在 feature 层决定（比如保存中拦截 cancel）。
- 同一个 Dialog 实例会被重复打开，所以每次打开时要决定清空还是保留上次输入；按规则，失败后应保留输入。

## 3. 现有数据测试（tests/task-service.test.js，6 条，`npm test` 全部通过）

**已检查**
1. 没有存储数据时 `listTasks` 返回 3 条 seed，而且不会写入存储。
2. 校验：空白标题、81 个字符、未知 owner、未知 priority 都会报错；正好 80 个字符可以通过。
3. 创建：标题会 trim，新任务排在第一条，status 是 `To do`，换一个 service 实例重新读取仍然存在。
4. 校验失败和 `simulateFailure` 都不会改动存储。
5. 空数组保持为空；`reset()` 后恢复 seed。
6. `storage.setItem` 抛错时，错误会传给调用方。

**尚未检查**
- 校验失败时 `error.fields` 的具体内容（测试只断言了 rejects）。
- 存储数据损坏时的行为：非 JSON、或者不是数组。`listTasks` 和 `createTask` 都会抛错，但没有测试。
- `id`、`createdAt` 是否真的来自注入的 `newId` / `now`。
- 并发或重复提交（服务层没有防重，只能靠 UI 的 loading 状态）。
- **全部 UI 行为**：按钮、Dialog、内联错误、聚焦、loading、失败重试、Escape / Tab / Shift+Tab、焦点归还、列表刷新、Toast、移动端布局。这些都没有自动化测试，只能按 docs/04-qa-checklist.md 手动验收。

## 4. 命令和 workflow

| 用途 | 命令 / workflow | 实际行为 |
|---|---|---|
| 本地运行 | `npm run dev` | `node scripts/server.mjs`，地址 127.0.0.1:5173，`no-store` 不缓存；可用 `PORT=xxxx` 改端口，`SERVE_DIST=1` 改为预览 dist |
| 检查 | `npm run check` | 对 src / scripts / tests 下所有 .js / .mjs 运行 `node --check`（只查语法） |
| 测试 | `npm test` | `node --test`，自动发现 tests/*.test.js |
| 构建 | `npm run build` | 清空后重建 `dist/`，只复制 index.html、components.html、src/ |
| CI | `.github/workflows/ci.yml` | PR 和 push main 时触发：Node 22 → check → test → build → 上传 dist |
| 发布 | `.github/workflows/pages.yml` | 只能手动 `workflow_dispatch`，并且 `if: github.ref == 'refs/heads/main'`；跑完同样三步后部署 GitHub Pages。合并代码不会自动发布 |

## 5. 新功能接在哪里、建议新建什么文件

- **新建 `src/features/create-task.js`**，导出 `mountCreateTask({container, service, onCreated})`。
- **在 `src/app.js` 末尾（第 19-20 行注释处）挂载**：
  `mountCreateTask({container: document.querySelector('#feature-entry'), service, onCreated: renderTasks})`。
- 依赖方向：只允许 app.js → feature。feature 只 import `../design-system/components.js` 和 `../data/seed.js`，**不 import app.js**（app.js 也导出了 `service` 和 `renderTasks`，反向引用会形成循环）。
- 故障演练入口 `?failSave=1` 放在 feature 里，挂载时读取一次（按 docs/03 的说明）。
- 如果需要样式，优先用现有 tokens 和 `ds-*` 类。表单布局如果确实需要少量 CSS，可以加在 `src/app.css` 或新建 `src/features/create-task.css`；新建的话要在 index.html 里引用，而且 build 会复制整个 src/，不需要改构建脚本。
- 数据层（task-service.js、seed.js）预计**不用改**。测试可以补“尚未检查”里列出的数据层条目。

---

尚未确认：
- 本文件夹**还不是 Git 仓库**，还没有 `feat/create-task` 分支，也没有 remote，所以 CI / Pages 还没有实际跑过。这些在阶段 2 处理。
- 目前只在命令行里确认过 5173 上的页面和 `src/app.js` 返回 HTTP 200，**还没有在浏览器里目测**页面、移动端布局和组件页交互。
- 组件页的 Dialog 键盘行为（Tab 是否困在弹窗内、Escape、焦点归还）在源码里有对应设计，但没有人工验证过。
