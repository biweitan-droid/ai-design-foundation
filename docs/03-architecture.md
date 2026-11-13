# 03 · 技术地图与数据契约

## 文件地图

| 文件 | 职责 | 练习时是否常改 |
|---|---|---|
| src/app.js | 页面框架、列表渲染、练习工具 | 是：接入新功能 |
| src/app.css | 页面布局、响应式 | 少量 |
| src/design-system/* | 组件和 tokens | 优先复用 |
| src/data/task-service.js | 校验、创建、读取、持久化 | 原有逻辑通常不用改 |
| src/data/seed.js | 初始任务、人员、优先级 | 不用改 |
| src/showcase.js | 组件实例展示 | 组件 API 变化时更新 |
| scripts/* | 本地服务、语法检查、构建 | 通常不用改 |
| tests/* | Node 自带测试 | 按新增行为补充 |
| .github/workflows/* | CI 与手动发布 | 本练习已备好 |

建议新增 `src/features/create-task.js`，导出 `mountCreateTask({container,service,onCreated})`。由 app.js 传入入口容器、现有 service 和 renderTasks。功能模块不要反向 import app.js。

## 已有数据能力

```js
const service = createTaskService({storage: localStorage});
service.listTasks(); // 同步返回任务数组；读取失败会抛异常
await service.createTask({title,owner,priority}); // 成功返回 task
service.reset(); // 移除保存数据，下次读取回到 3 条 seed
```

createTask 的内部步骤：校验 → 模拟 500ms 延迟 → 可选故障 → 构造任务 → 写 localStorage → 返回。校验错误有 `error.fields`；保存错误用表单级 Banner。UI 应捕获错误。

记录：`{id, title, owner, priority, status, createdAt}`。新任务 prepend 到数组，status 固定 To do。

## 可重复的失败演练

在新 feature 中加入仅用于练习的故障入口：

```js
// 由 Claude 在实现阶段接入。基础包尚无提交 UI。
let failNext = new URLSearchParams(location.search).has('failSave');
// 每次调用前：
const simulateFailure = failNext;
failNext = false;
await service.createTask(draft, { simulateFailure });
```

用 `http://localhost:5173/?failSave=1` 打开。输入合法内容，第一次提交失败，第二次重试成功。failNext 在功能挂载时初始化，不能每次 submit 都重新读取 URL，否则无法重试成功。保持页面不刷新进行重试。

## 空状态与重置

列表底部已有 Show empty state 和 Reset demo data。前者写入空数组，后者删除练习数据恢复种子。使用同一浏览器和同一网址端口。

## 构建和部署

`npm run build` 只复制 index.html、components.html、src 到 dist，不发布 docs、outputs、测试或 CLAUDE.md。所有资源使用相对路径，兼容 GitHub Pages 的仓库子路径。

这不是 React 工程，没有 bundler、服务器 API 或数据库。此选择减少初学者环境问题；公司练习时用公司真实栈替换，不要直接搬入生产仓库。
