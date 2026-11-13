# 02 · Design System 使用说明

先打开 `/components.html`，再读源码。这里的“调用”就是导入真实组件并按其 API 使用。

## 组件来源

```js
import { Button, Field, Dialog, Toast, Banner } from './design-system/components.js';
```

上面的相对路径适用于 `src/` 下的文件；若功能放进 `src/features/`，需改成 `../design-system/components.js`。

| 组件 | 参数 | 返回 | 使用方式 |
|---|---|---|---|
| Button | label, variant: primary/secondary/ghost, onClick, type, disabled | button DOM | append 到容器；提交按钮用 type: submit |
| Field | id, label, kind: input/select, type, options, required, hint | {root, control, setError} | append root；通过 control.value 取值 |
| Dialog | title, onClose | {root, body, footer, open, close} | 把 form 放 body，按钮放 form 内；open 调用 showModal |
| Badge | label, tone: default/success/warning | span DOM | 优先级或状态 |
| Toast | message 字符串 | DOM | Toast('Task created.') |
| Banner | message 字符串 | DOM | 表单级错误，role=alert |

## 示例：复用一个字段

```js
const title = Field({
  id: 'task-title', label: 'Task title', required: true,
  hint: 'Use 80 characters or fewer.'
});
form.append(title.root);
title.setError('Enter a task title.');
title.control.focus();
```

这是 API 示例，不是完成后的功能。完整交互需要你在练习阶段连接。

## Tokens

| 类型 | 既有值 / 变量 | 规则 |
|---|---|---|
| 主色 | --color-primary | 主要操作和焦点 |
| 文字 | --color-text / --color-muted | 复用，不在 feature 中随意加灰色 |
| 错误 | --color-danger / --color-danger-soft | 同时使用文字说明，不只变红 |
| 间距 | --space-1…7：4/8/12/16/24/32/48px | 新布局优先使用现有变量 |
| 圆角 | --radius-sm/md/lg | 6/10/16px |
| 字号 | --font-sm/md/lg/title | 13/15/20/32px |

## 组合约束

- 一个界面只保留一个主要提交动作；Cancel 用 secondary。
- 用 form 的 submit 事件，支持 Enter；设置 form.noValidate=true，统一走已有数据层校验，以呈现一致的 inline error。
- 推荐在 dialog.body 中放整个 form，把 `.ds-dialog-actions` 容器也放进 form，避免提交按钮脱离 form。
- 每次打开可创建新 dialog；关闭后 root.remove()，避免 DOM 累积。
- 原生 dialog 提供 modal 基础行为；仍需验收 Tab、Shift+Tab、Escape 和焦点回归。
- 保存中在 dialog.root 的 cancel 事件中 preventDefault()；完成或失败后恢复正常关闭行为。
- 新样式加到 app.css 的功能区域；只有可复用能力才修改组件库，并同步 showcase。
