# Feature plan · Create task

填写者 / 日期：Claude 起草（待学习者确认）/ 2026-11-13
依据：docs/01-product-brief.md、docs/02-design-system.md、docs/03-architecture.md、docs/04-qa-checklist.md、outputs/01-repo-map.md（第 6 节组件映射）。本阶段只做计划，没有修改应用代码。

## 用户问题

演练结束后，协调者要把后续行动快速分配给同事。他们希望**不离开任务页**就能新建一条任务，写清标题、负责人和优先级，并且马上在列表第一行看到这条任务。目前列表只能查看，不能新增。

## 两个布局方案（都使用居中 modal，都只用现有 DS）

**方案 A · 单列表单（推荐）**
```
┌ Create task ─────────────────────┐
│ [Banner：仅在保存失败时出现]        │
│ Task title *                      │
│ [_____________________________]   │
│ Use 80 characters or fewer.       │
│ Owner *                           │
│ [Choose an owner           ▾]     │
│ Priority *                        │
│ [Medium                    ▾]     │
│                 [Cancel] [Create task] │
└───────────────────────────────────┘
```

**方案 B · 标题独占一行，Owner 和 Priority 并排**
```
┌ Create task ─────────────────────┐
│ Task title *                      │
│ [_____________________________]   │
│ Owner *            Priority *     │
│ [Choose…   ▾]      [Medium   ▾]   │
│                 [Cancel] [Create task] │
└───────────────────────────────────┘
```
（窄屏时 B 需要再退回单列。）

**推荐 A，理由：**
1. **零新增布局 CSS。** `.ds-field` 本来就是纵向排列并带下间距，`.ds-dialog` 的最大宽度是 520px，单列能直接放下。B 需要新写一套两列 grid，再加一个窄屏断点。
2. **错误状态更稳定。** B 里如果只有 Owner 出错，左列会多出一行红字，左右两列高度就会对不上。A 每个字段独占一行，错误文案直接出现在字段下方，不会挤乱布局。
3. **阅读和 Tab 顺序一致。** A 从上到下就是 Tab 的顺序。B 横向并排后，视觉顺序和键盘顺序更容易让人搞混。
4. **手机和桌面用同一个结构。** brief 要求手机上用同一个 modal。A 不需要任何断点，测试 390px 宽度时要检查的情况也更少。

B 唯一的好处是弹窗矮一点，但这里只有 3 个字段，A 在 844px 高的手机屏幕上也不用滚动，所以这个好处不明显。

## 用户操作顺序与 modal 信息层级

**操作顺序：**
1. 在任务页点击页头右侧的 **Create task**（主按钮）。
2. modal 打开，焦点自动落在 **Task title**。
3. 输入标题 → 选择 Owner → Priority 已默认为 Medium，可以不改。
4. 点击 **Create task** 或按 Enter 提交 → 按钮显示 **Creating…**。
5. 成功：modal 关闭 → 新任务出现在列表第一行，总数 +1 → 右下角显示 Toast **Task created.** → 焦点回到页头的 Create task 按钮。

**modal 信息层级（从上到下）：**
1. 标题 `Create task`（h2，Dialog 自动生成，也是 modal 的可访问名称）
2. 表单级错误 Banner：只在保存失败时出现，放在最上面，因为它说的是“整个表单没保存成功”
3. 三个字段，按填写顺序排列：Task title → Owner → Priority
4. 操作区，靠右排列：Cancel（secondary）在左，Create task（primary）在右。全页只有一个主操作

Status 由系统自动设为 To do，**不显示在表单里**。

## 字段与状态

**字段**

| 字段 | 组件 | 默认值 | 规则（由数据层校验） | 错误文案（来自 task-service.js） |
|---|---|---|---|---|
| Task title | Field（input），required，hint 为 `Use 80 characters or fewer.` | 空 | trim 后 1–80 个字符；**不设 maxlength**，这样才能看到超长时的报错 | `Enter a task title.` / `Use 80 characters or fewer.` |
| Owner | Field（select），required | `Choose an owner`（value 为空） | 必须是 seed.js 里的 3 位候选人之一 | `Choose an owner.` |
| Priority | Field（select），required | **Medium** | High / Medium / Low | `Choose a priority.`（正常操作下不会出现） |

**状态**

| 状态 | 用户看到什么 | 关键取舍 |
|---|---|---|
| 初始 | 空标题、Owner 未选、Priority 为 Medium；焦点在标题上 | 提交按钮**默认就能点**，不会因为表单没填完而置灰。用户点了之后才看到具体哪里有问题，比面对一个不能点的按钮更容易理解 |
| Inline error | 出错字段下方出现红色文字，边框变红；焦点跳到**第一个**出错的字段 | 用文字加颜色两种方式提示，不只靠红色；同时会清掉上一次的错误 |
| Loading | 按钮文案变成 `Creating…` 并禁用；三个字段和 Cancel 也禁用；按 Escape 不会关闭 | 防止重复创建（AC04）。这段时间约 500ms，短到不需要进度条 |
| Success | modal 关闭 → 列表和统计刷新 → Toast 显示 `Task created.` → 焦点回到入口按钮 | Toast 要在 modal 关闭**之后**再出现，否则会被遮罩盖住 |
| Failure | modal 顶部出现 Banner `Task could not be saved. Please try again.`，输入都保留，按钮恢复可点 | 这是表单级错误，不归属于任何一个字段，所以用 Banner 而不是 inline error。重试时先清掉旧的 Banner |
| Cancel / Escape | modal 关闭，不保存，焦点回到入口按钮；下次打开是全新的表单 | 每次打开都新建一个 modal，关闭后整体移除，这样旧输入和旧错误不会留下来 |

## 键盘、窄屏与焦点

**键盘**
- Tab 顺序：Task title → Owner → Priority → Cancel → Create task。原生 modal 会把 Tab 限制在弹窗内，Shift+Tab 反向。
- 在标题框里按 Enter 会提交（因为用的是 form 的 submit 事件）。
- Escape：未保存时关闭 modal；保存中不关闭。
- 所有可聚焦元素都使用 DS 的 `:focus-visible` 3px 主色描边。

**焦点**

| 时机 | 焦点位置 |
|---|---|
| 打开 modal | Task title |
| 校验失败 | 第一个出错的字段（按 title → owner → priority 的顺序） |
| 保存失败 | 留在提交按钮附近；Banner 是 `role="alert"`，读屏会自动播报，不需要移动焦点 |
| 关闭（成功 / Cancel / Escape） | 页头的 Create task 按钮 |

已知需要实测的风险：在 macOS Safari 里用鼠标点按钮，按钮默认不会获得焦点，关闭后焦点可能回不到入口。计划在打开 modal 前先让入口按钮获得焦点，这样不用改组件就能规避（见 repo map 6.5）。

**窄屏（390px）**
- 页头在 760px 以下变成纵向排列，入口按钮会出现在页面描述文字下方，靠左对齐。这是现有的响应式行为，不改动。
- modal 宽度 = `min(520px, 屏幕宽度 − 32px)`，窄屏内边距缩小到 24px，表单内容区约 310px 宽。单列字段和两个按钮都能放下（按钮不换行），需要在 390px 下实际看一下确认。
- 不新增断点，也不新增布局 CSS；如果 Banner 和下面的字段贴得太近，只在 app.css 里用 `--space-*` 加一个间距。

## 复用组件与实际 API

所有组件都从 `../design-system/components.js` 导入，参数以源码为准，没有新增 props。

| 用在哪里 | 组件 | 实际 API |
|---|---|---|
| 页头入口、Cancel、提交 | Button | `Button({label, variant, onClick, type, disabled})` → `<button>` |
| modal | Dialog | `Dialog({title, onClose})` → `{root, body, footer, open(), close()}` |
| 三个字段 | Field | `Field({id, label, kind, type, options, required, hint})` → `{root, control, setError(msg)}` |
| 保存失败 | Banner | `Banner(message)` → `<p role="alert">` |
| 成功提示 | Toast | `Toast(message)`，自动挂载，4 秒后移除 |
| 列表 Priority / Status | Badge | 已由 `renderTasks()` 使用，本功能不改 |

组件没有提供、需要由功能代码自己处理的：`<form>` 和 `noValidate`；用 `control.value` 读值和设默认值；改 `disabled` 和按钮文案来实现 loading；监听 `cancel` 事件阻止 Escape；聚焦；移除旧 Banner；关闭后 `root.remove()`；`?failSave=1` 故障演练。详见 repo map 6.4。

## 计划修改 / 新建文件

| 文件 | 动作 | 内容 |
|---|---|---|
| `src/features/create-task.js` | 新建 | 导出 `mountCreateTask({container, service, onCreated})`；只导入 components.js 和 seed.js，不导入 app.js |
| `src/app.js` | 小改 | import 上面的模块，在第 19–20 行注释处挂载到 `#feature-entry`，传入 `service` 和 `renderTasks` |
| `src/app.css` | 可能小改 | 只有 Banner 需要间距时才加一行，并且只用 tokens |
| `tests/task-service.test.js` | 可选补充 | 校验失败时 `error.fields` 的具体内容等数据层断言；UI 行为靠手工 QA |
| `outputs/03-qa-report.md` | 后续阶段 | 记录实际验收结果 |

不改动：`src/design-system/*`、`src/data/*`、`src/showcase.js`、`scripts/*`、`.github/*`、`index.html`。

## AC01–AC10 对应验证方法

`npm run check`、`npm test`、`npm run build` 只能证明语法、数据层和构建没有问题。下表的 UI 验收都需要**人工在浏览器里操作**（Q 编号对应 docs/04-qa-checklist.md）。

| AC | 内容 | 怎样验证 |
|---|---|---|
| AC01 | 所有入口和字段都用现有 DS | 代码审查：create-task.js 只从 components.js 导入组件，没有手写 button / input 样式；DevTools 中元素都是 `ds-*` 类名；组件库页面没有变化 |
| AC02 | 合法输入能创建，trim，状态为 To do | Q06：输入 `  Test task  ` 并选择 Owner，第一行出现 `Test task`，Status 为 To do，数量 +1；`npm test` 中的数据层用例通过 |
| AC03 | 非法输入显示 inline error，不新增数据 | Q03、Q04、Q05：空标题、纯空格、81 字符、不选 Owner，分别在对应字段下看到错误，焦点在第一个错误字段上；列表数量不变；80 字符能成功 |
| AC04 | 保存中多次点击只产生一条 | Q07：快速双击提交按钮，以及连按 Enter，看到 Creating…，最终只多 1 条 |
| AC05 | 失败保留输入，可以重试成功 | Q09、Q10：打开 `/?failSave=1`，第一次提交出现 Banner、输入保留、没有新增；不刷新页面再次提交，成功并只多 1 条 |
| AC06 | 取消 / Escape 不保存；再次打开没有旧输入和错误 | Q11、Q17：输入后点 Cancel、按 Escape，各测一次；重新打开时表单是干净的；反复开关 5 次后提交一次，只多 1 条（确认没有重复绑定事件） |
| AC07 | 列表、数量、空状态同步；刷新后保留 | Q06、Q13、Q14：创建后统计卡更新；刷新浏览器后数据仍在；点 Show empty state 后创建，空状态消失，显示 1 条 |
| AC08 | 键盘能完成全流程；焦点不离开 modal；关闭后回到入口 | Q02、Q08、Q12：不用鼠标，Tab 到入口按 Enter，填写并提交；Tab 和 Shift+Tab 只在 modal 内循环；保存中按 Escape 不会关闭；关闭后焦点回到入口。在 Chrome 和 Safari 各测一次 |
| AC09 | 390px 和 1440px 都能操作，没有横向溢出 | Q16：DevTools 设备模式切到 390×844 和 1440×900，在 modal 打开、显示错误、显示 Banner 三种状态下检查，页面都没有横向滚动条 |
| AC10 | 原列表、组件库、Reset demo data / Show empty state 都继续可用 | Q01、Q15：组件库页面正常；Reset 后恢复 3 条；Console 没有报错；CI 的 check / test / build 都是绿色 |

## 决策记录

**2026-11-14 · 必填字段与提交按钮状态**
- 需求：所有字段必填，任何一项没填都不能创建任务。
- 现状：计划本来就满足这条。三个字段都是 `required`，数据层也会拒绝不完整的 draft。Priority 默认是 Medium，所以用户实际需要填的是 Task title 和 Owner。
- 讨论过的另一个做法：在字段都有效之前让 Create task 按钮保持置灰。
- 决定：**保持 brief，按钮始终可以点击**。点击后在对应字段下显示错误、聚焦第一个错误字段，不创建任务。
- 理由：
  - brief 要求提交按钮默认可点，用来观察 inline validation。
  - 如果按钮一直置灰，Enter 也无法提交，Q03/Q04/Q05 就测不了。
  - 置灰的按钮不会告诉用户缺了什么。用键盘 Tab 时禁用按钮会被跳过，读屏用户也不知道为什么提交不了。
- 按钮只在保存中（Creating…）禁用。

## 范围之外

不做：编辑、删除、搜索、到期日、登录、后端、AI 生成任务、权限管理、邮件通知。

不改：Status 字段（固定为 To do）、组件库 API、数据层逻辑、发布流程。

localStorage 只是模拟的数据层，不代表真实的多人共享数据。
