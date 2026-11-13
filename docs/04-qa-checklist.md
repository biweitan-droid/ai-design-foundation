# 04 · QA checklist

每项记录 Pass / Fail / Not run + 证据。Code review 不能代替实际浏览器操作。

| ID | 操作 | 期望 |
|---|---|---|
| Q01 | 打开原页面和组件库 | 原始 3 条记录正常；无 console error |
| Q02 | 点击 Create task | 打开 modal；标题框聚焦 |
| Q03 | 直接提交、输入全空格提交 | 字段错误；无保存；聚焦首个错误 |
| Q04 | 80 字符和 81 字符分别提交 | 80 成功；81 inline error |
| Q05 | 有标题但 Owner 空 | Owner 错误；无新增 |
| Q06 | 合法输入，保留首尾空格 | 第一行出现 trim 后标题；To do；数量 +1 |
| Q07 | 保存期间快速双击 / Enter | 按钮呈 Creating…；只新增 1 条 |
| Q08 | 保存期间 Escape | modal 保持；状态可理解 |
| Q09 | ?failSave=1 页面第一次合法提交 | Banner 错误；输入保留；无新增 |
| Q10 | 不刷新，在同一 modal 重试 | 成功；只新增 1 条 |
| Q11 | 输入后 Cancel 或 Escape | 无新增；焦点回入口；再次打开干净 |
| Q12 | Tab、Shift+Tab、Enter | 焦点可见；modal 内循环；可提交 |
| Q13 | 成功后刷新浏览器 | 新数据还在 |
| Q14 | Show empty state 后创建 | 空状态消失，显示 1 条和正确统计 |
| Q15 | Reset demo data | 恢复原 3 条，不产生 console error |
| Q16 | 390×844、1440×900 | 无横向溢出；字段、按钮完整可操作 |
| Q17 | 重复打开 / 关闭 5 次 | 无多重监听导致的重复保存；无旧错误 |
| Q18 | 正式发布 URL 重做 Q02/Q06/Q13 | 发布环境可操作；相对资源路径正常 |

自动检查：`npm run check`、`npm test`、`npm run build`。初始 6 个测试覆盖数据层；新功能需要验收 UI，不能把已有测试通过当成功能完成。

若 Claude 能使用浏览器自动化，可让它补足关键行为测试并运行；若当前没有浏览器工具，亲自执行以上清单，在 outputs/03-qa-report.md 中注明“人工验证”。不用为了形式添加只检查字符串存在的测试。
