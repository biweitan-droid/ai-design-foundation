# Taskroom · AI-native design foundation

**先读 [START_HERE.md](START_HERE.md)**：每一步都有材料、操作、Claude prompt 和验收标准。

这是一个可运行、可上传 GitHub、可部署到 GitHub Pages 的练习项目。你在已有产品里完成 **Create task**；基础包故意没有实现该功能。

## 快速启动

安装 Node.js 22 或更高版本后，在这个文件夹的终端运行：

```bash
npm run dev
```

打开 http://localhost:5173 。组件库：http://localhost:5173/components.html 。无需 `npm install`。

另开终端验证：

```bash
npm run check
npm test
npm run build
```

## 材料地图

| 文件 | 用途 |
|---|---|
| START_HERE.md | 唯一主操作手册，包含全部分阶段 prompts |
| CLAUDE.md | Claude 自动读取的项目上下文和约束 |
| docs/01-product-brief.md | 用户、问题、范围、验收条件 |
| docs/02-design-system.md | 组件调用方法、tokens、交互约束 |
| docs/03-architecture.md | 文件地图、数据契约、故障模拟 |
| docs/04-qa-checklist.md | 手工验收与回归清单 |
| docs/05-release-runbook.md | GitHub、CI、Pages 发布与回退 |
| docs/06-glossary-and-resources.md | 术语与官方资源 |
| docs/07-company-transfer.md | 对接公司项目时应替换的信息 |
| outputs/ | 每阶段产出的工作材料模板 |
| .github/ | Issue / PR 模板、CI、手动发布工作流 |

## 练习边界

- 原生 JavaScript 实现，便于把注意力放在流程上；公司若用 React，要替换技术实现，但设计、复用、PR、发布的步骤仍适用。
- 代码版小型 Design System 是本包提供的练习资产，不是你公司的组件库。
- 数据存在当前浏览器的 localStorage；不同设备、域名、浏览器不共享。开发地址和线上地址的数据也不共享。
- 所有姓名、任务均为虚构。默认数据时间只是固定测试样本。
- GitHub Pages 发布的是公开静态站点。仓库和账户能否使用 Pages 取决于 GitHub 方案和设置。
- 未附已完成答案；你会亲自完成 Create task。基础测试只验证数据层，UI 验收要在练习中补齐。
- 当前版本没有线上部署，也没有关联你的 GitHub / Claude 账户。
