# problems

## v0.1（初版）

1. 大一下学期结束没有绩点总结总结也不会跳转下一学年 ✅ 已修复
   - 根因：`handleResolveEvent` 在事件选项处理后将 `pendingEvent` 设为 null，导致 EventPopup 组件立即卸载。`DISMISS_EVENT` 永远不会被触发，学期阶段停滞无法推进。
   - 修复：RESOLVE_EVENT 保留 `pendingEvent` 引用（非 null），待玩家看完结果点击"继续"后再由 DISMISS_EVENT 清理并推进阶段。无选项事件（`noOptionEffect`）在一��中完成结算+阶段推进。


## v0.2

1. 不要写出是什么类型的事件 ✅ 已修复 — EventPopup 移除了分类标签
2. 标题页精简 ✅ 已修复 — 只保留标题、一行副标题、开始按钮
3. 事件池扩充 ✅ 已修复 — 新增5个事件（快递丢失、校园网崩溃、查寝、选课崩溃、实习白嫖），lecture_signin 改为不可重复
4. 绩点公式改为加性 ✅ 已修复 — 新公式: ability×abilityIndex + effort×effortIndex ± randomRange，系数写回 settings.md 第七章
5. 毛概描述去”混脸熟” ✅ 已修复
6. 总结移除OS，选课时提醒政治课 ✅ 已修复 — CourseSelector 添加政治课剩余提醒，EndingScreen 移除OS行

## v0.3

1. 事件50%空缺 ✅ 已修复 — `selectEvent` 开头增加 `if (Math.random() < 0.5) return null`
2. GitHub Pages 部署 ✅ 已完成配置

## v0.4 
1. 和我明确结局刷新方法和各个结局的结语 ✅
2. 美化ui，每半个学期先选课再选活动，在屏幕上铺开 ✅

## v0.5
1. 架构重构 ✅ — 引擎函数抽出为独立模块（gradeCalculator/eventEngine/endingEngine），专业注册表（majors.ts），事件影响统一
2. 每学期 4 次决策 ✅ — currentQuarter 1~4，绩点取 4 个阶段平均，文档已更新



### GitHub Pages 部署步骤

1. 创建 GitHub 仓库并 push 代码：
   ```bash
   git init && git add -A && git commit -m "v0.3"
   git remote add origin git@github.com:<你的用户名>/uni-emulator.git
   git push -u origin main
   ```
2. GitHub 仓库 → Settings → Pages → Source 选 "GitHub Actions"
3. 每次 push main 分支自动构建部署
4. 访问 `https://<你的用户名>.github.io/uni-emulator/`

已在 `.github/workflows/deploy.yml` 配置好 Actions，开箱即用。
