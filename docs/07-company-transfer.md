# 07 · 如何迁移到公司的真实工作

这次先练交付路径。进入公司仓库后，第一步重新 discovery，不把此项目的技术假设直接带进去。

| 练习里的材料 | 公司需要找到的对应物 | 填实际位置 / 负责人 |
|---|---|---|
| src/design-system | React / Vue 组件包、源码或依赖名 | |
| tokens.css | 公司 tokens、主题系统 | |
| components.html | Storybook / 组件文档 / Figma 对照 | |
| CLAUDE.md | 团队已有 AI 指令、编码与设计约束 | |
| product brief | PM brief、Issue、验收标准 | |
| task-service.js | API、类型、请求库、错误处理 | |
| localStorage | 真实后端、权限、数据契约 | |
| CI | 团队 lint、类型、测试、安全和构建检查 | |
| 本地预览 | 团队开发环境、PR preview、staging | |
| 自己 Review | CODEOWNERS、设计 / 工程审查人 | |
| 手动 Pages | 团队发布流程、feature flag、监控和回退 | |

## 向团队索取的最小信息

1. 一个可本地启动、允许设计师改动的仓库。
2. DS 的代码入口和一页已正确使用 DS 的页面。
3. 一个已经上线的小 feature PR，作为提交与发布范例。
4. staging / preview 怎么打开，谁 Review，谁有发布权限。
5. 公司批准的 Claude 使用方式与账号，哪些代码 / 数据允许送入该环境。

拿到后给 Claude 的第一段 prompt：

```text
先读取本仓库已有项目指令，遵守团队约定，不套用我的练习项目结构。
请定位真实 DS、tokens、相似 feature、API、测试、预览、PR 和 release 机制。
引用实际路径，列出已确认与尚未确认的信息。暂时不改代码。
```

在公司项目中，设计师可以提交 PR 或发布到什么环境，取决于团队权限和流程；AI 工具本身不会赋予这些权限。
