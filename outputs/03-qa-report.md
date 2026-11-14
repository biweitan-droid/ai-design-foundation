# QA report · Create task

Commit / 分支：`feat/create-task`，基于 main `1a73003`；**改动尚未 commit**，测的是 2026-11-14 当时的工作区
浏览器 / 日期：Chrome 155.0.8059.85（headless，独立临时配置）/ 2026-11-14；Safari **未测**
操作者：
- **Claude（自动化）**：通过 Chrome DevTools Protocol 发送真实的鼠标和键盘事件，并读取 DOM 状态、截图。脚本放在会话临时目录，没有加入仓库。
- **学习者（人工）**：尚未执行，见文末。

说明：自动化浏览器测试只覆盖 Chrome，不能代替人工的视觉判断和 Safari 验收。

## 自动检查

| ID 或命令 | 结果 | 操作者、证据、问题 |
|---|---|---|
| npm run check | Pass | Claude：`JavaScript syntax checks passed.` |
| npm test | Pass | Claude：`tests 11 / pass 11 / fail 0`。原有 6 条，本分支新增 5 条（见“新增测试”） |
| npm run build | Pass | Claude：`Built dist/ …`；`dist/src/features/create-task.js` 存在 |

## 浏览器 QA（docs/04）

| ID | 结果 | 操作者、证据、问题 |
|---|---|---|
| Q01 | **Fail（基线遗留问题）** | Claude / Chrome 1440×900：清空 localStorage 后有 3 行，显示 `3 tasks`；组件库 4 个区块都正常渲染。Console 里有 1 条报错：`favicon.ico 404`。原因是项目里没有 favicon，`scripts/server.mjs` 对它返回 404。这个问题在 main 上同样存在，和本功能无关，**本分支没有修**。除此之外没有其他 console 报错 |
| Q02 | Pass | Claude / Chrome：点击 Create task 后 modal 打开，`activeElement = create-task-title`，初始值为 `"" / "" / Medium`，字数显示 `0/80` |
| Q03 | Pass | Claude / Chrome：直接提交，title 和 owner 下方出现 inline error，焦点在 title；只输入空格再按 Enter，出现同样的错误；行数保持 3 |
| Q04 | Pass | Claude / Chrome：81 字符显示 `Use 80 characters or fewer.`，字数 `81/80`，输入框没有 maxlength 限制（`maxLength = -1`），没有新增；80 字符创建成功，第一行就是这条 |
| Q05 | Pass | Claude / Chrome：填了 title、没选 Owner，只有 `Choose an owner.` 一条错误，焦点在 owner，没有新增 |
| Q06 | Pass | Claude / Chrome：输入 `  Test task  `，第一行显示 `Test task`，Status 为 `To do`，数量 +1，出现 Toast `Task created.`，焦点回到入口 |
| Q07 | Pass | Claude / Chrome：连续点击两次提交再按一次 Enter，按钮显示 `Creating…` 并禁用，最后只新增 1 条 |
| Q08 | Pass | Claude / Chrome：保存期间连按两次 Escape，modal 仍然打开，按钮一直显示 Creating… |
| Q09 | Pass | Claude / Chrome：打开 `/?failSave=1` 后第一次合法提交，出现 Banner `Task could not be saved. Please try again.`，输入保留为 `Retry me / Sam Patel / High`，按钮恢复，没有新增 |
| Q10 | Pass | Claude / Chrome：不刷新页面，在同一个 modal 里再提交一次，成功，只新增 1 条，焦点回到入口 |
| Q11 | Pass | Claude / Chrome：分别用 Escape 和 Cancel 关闭，都没有新增，焦点回到入口，DOM 中 dialog 数为 0；再次打开是干净的表单 |
| Q12 | Pass（仅 Chrome） | Claude / Chrome：Tab 顺序为 title → owner → priority → Cancel → Create task → 回到 title，Shift+Tab 反向。每个控件获得焦点时都匹配 `:focus-visible`，焦点框为实线。每转一圈焦点会在浏览器自身停一步（headless 环境里表现为 BODY），不会落到背后的页面上，这是原生 modal 的行为。按 Enter 可以提交。**Safari 未测** |
| Q13 | Pass | Claude / Chrome：成功创建后重新加载页面，数据仍在。dev（5173）和本地 dist 预览（5174）都测过 |
| Q14 | Pass | Claude / Chrome：点 Show empty state 后出现空状态；创建 1 条后显示 `1 tasks`，统计卡为 `1 / 0 / 0` |
| Q15 | Pass | Claude / Chrome：点 Reset demo data 后恢复 3 条，没有新的 console 报错 |
| Q16 | Pass（视觉需人工复核） | Claude / Chrome：390×844（移动端模拟）和 1440×900 下，分别检查页面、modal 显示错误、显示 Banner、列表中有 80 字符连续长标题这几种情况，`scrollWidth` 都没有超过 `clientWidth`。390 下 modal 宽 354px，两个按钮在同一行。有截图 |
| Q17 | Pass | Claude / Chrome：连续打开再按 Escape 关闭 5 次，然后创建 1 次，只新增 1 条，dialog 数为 0 |
| Q18 | Not run | 还没有发布。只用 `SERVE_DIST=1` 在本地 5174 端口预览了 dist：创建、刷新持久化、相对资源路径（除 favicon 外全部返回 200）都正常。**这不等于正式发布 URL 的验收** |

## 代码审查补充的风险检查

| 风险 | 结果 | 证据 |
|---|---|---|
| 重复提交 | Pass | `saving` 标志位 + 提交按钮禁用；Q07 实测只新增 1 条 |
| 失败后输入丢失 | Pass | 失败分支只插入 Banner，不重建表单；Q09 实测输入保留；新增数据层测试“失败后重试只存 1 条” |
| 保存中被关闭 | Pass | 保存中 Cancel 被禁用，`keydown` 捕获阶段和 `cancel` 事件都拦截了 Escape；Q08 实测连按两次 Escape 不会关闭 |
| 监听器重复 | Pass | 入口按钮只绑定一次；每次打开都新建 dialog 和表单，关闭时移除 dialog 和 document 上的 keydown 监听；Q17 实测 |
| 通过 innerHTML 注入 | Pass | 功能代码里没有 `innerHTML`；`app.js` 中仅有的 innerHTML 是静态骨架和表头。Chrome 实测创建标题 `<img src=x onerror=…><b>bold</b>`，列表中原样显示为文字，`img/b` 元素数为 0，脚本没有执行（dev 和 dist 都测了） |
| 存储数据损坏 | Pass | Chrome 实测：把 localStorage 写成 `{not json` 后提交，出现 Banner，输入保留，存储没有被覆盖；有对应的数据层测试 |
| 循环依赖 | Pass | `create-task.js` 只引入 `components.js`、`seed.js`、`task-service.js`，这几个文件都不引入 `app.js` |
| 绕过 DS | Pass | 只用了 Button / Field / Dialog / Banner / Toast；`<form>` 和 `.ds-dialog-actions` 容器按 docs/02 的推荐做法自建；CSS 只用 tokens，新增的 4 条规则中 3 条限定在 `.create-task-form` 内。小的耦合点：字数显示通过 `.ds-hint` 类名读取 Field 内部元素，因为 Field 没有暴露 hint 引用 |
| 刷新持久化 | Pass | Q13 |

## 新增测试（tests/task-service.test.js）

只测真实的业务行为，不检查实现代码里有没有某段字符串：
1. 校验失败时，`error.fields` 带有对应字段的错误文案（界面上的 inline error 依赖它）
2. 第一次保存失败后再重试，只保存 1 条（对应 failSave 演练）
3. 标题上限按去掉首尾空格后计算：带空格的 80 字符被接受并存为去空格后的值，81 字符被拒绝（和界面字数显示的规则一致）
4. 存储数据损坏时创建失败，并且不会覆盖原有数据
5. 包含 HTML 标记的标题原样保存

界面行为（焦点、loading、关闭等）不在 `npm test` 里。它们由上面的 Chrome 自动化实际操作验证；这套脚本依赖本机 Chrome 和正在运行的服务器，所以没有放进仓库和 CI。

## 已修复（本分支，发布前 QA 之前的几轮迭代）
- 80 字符连续长标题在 390px 下把页面撑到 727px 宽 → 加了 `td{overflow-wrap:anywhere}`
- 没有提示文字的字段，错误提示和控件之间多出 8px 空白 → 在 `.create-task-form` 内隐藏空的 hint
- 需求迭代：标题提示改为字数 `n/80`；出错字段的焦点框改为 `--color-danger`

本轮 QA 和代码审查**没有发现需要修改应用代码的新问题**，只补了测试。

## 仍存在
- favicon 404 导致 Console 里有一条报错（基线遗留，影响 Q01 的“无 console error”）。修不修需要学习者决定，属于本功能范围之外。
- 字段改对之后，红色错误状态要等再次提交才会清除，这符合 brief 的“提交后显示”。

## 未执行与原因
- **Safari 全部项目**：Claude 没有 Safari 自动化工具。
- **Q18**：还没有发布，本阶段按要求不发布。
- **人工视觉判断**：自动化只检查 DOM 和尺寸，加上 Claude 看了截图。观感、真机触控、读屏播报（Banner 的 `role=alert`、Toast 的 `role=status`）都没有人工验证。
