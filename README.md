# Org Talent Match · 组织人才匹配

A DeepSeek Harness plugin that puts organization-wide employee matching in the left sidebar: a project guide with searchable progress, outcomes, alerts and recent projects, a reusable requirement pool, a lightweight desktop memo that feeds project feedback, a workspace with assigned project tasks connected to DSH conversations, a searchable talent pool, an org chart, and team recommendations scored from organization-wide candidates.

左侧栏的 DSH 组织人才匹配插件：以项目导览组织需求、进度、成果与反馈，用需求池复用需求，用桌面备忘录随手记录并带入反馈，在工作区把项目拆成成员任务并连接 DSH 对话，以组织架构为整体为项目组队。

## Install · 安装

Once the package is available in a market or on npm:

```sh
dsh plugin --profile <profile> add dsh-org-talent
```

In DSH Desktop, open **Plugins → Add plugin** and install `dsh-org-talent` from the market or from this package directory.

For a local checkout:

```sh
dsh plugin --profile desktop add /absolute/path/to/org-talent
```

Reload the page after installing. The entry **人才匹配 (Talent match)** appears in the left sidebar between **排期** and **资料库**.

## What you get · 功能

### 项目导览 · Project guide

- Current project need: requirement name, target team size and required skills.
- The requirement area defaults to the **highest-priority requirement**; **展开全部** reveals the full list without changing the underlying requirements.
- Multi-color layers separate the page: violet project hero, four-color summary tiles, blue project progress, violet project outcomes, amber project alerts and teal recent projects.
- **项目进度**: total projects, active projects, average progress, and a row per project with completion, cycle, start date and planned end date. A searchable project dropdown filters the section.
- Click a progress row to expand **阶段成果预览** and **成员完成情况**. Alert details are not repeated in progress.
- **项目成果**: outcome summaries from feedback; a searchable project dropdown filters the list. It also appears in the match result area. Blockers, difficulties and changes are not repeated here.
- **近期项目**: projects sorted by latest update, with progress, outcome count and status; a searchable project dropdown filters them. It replaces the old recent-match card.
- Progress, outcomes and recent projects are stacked as full-width rows rather than squeezed into three columns; each carries lists, filters and detail text.
- **Typography hierarchy**: card/section titles are 14px/600, in-card subheads 12.5px/600, primary body 12px, secondary hints 11.5px, and meta labels 11px, so titles no longer read at the same size as their content.
- Created project teams show **开始工作** / **进入工作区**; the project's planned end date is stored when work starts.
- Each progress row also offers **备忘录** and **记录反馈** directly, so feedback no longer requires returning to the match result.
- **项目预警** is the single place for **卡点 / 难点 / 变更点**: overdue or unassigned work, skill gaps, low-capacity members, missing team, requirement changes and saved stage feedback. A project search dropdown filters alerts; click an alert to jump to its project. The old progress “反馈信息” block was removed to avoid duplication.

### 智能粘贴反馈 · Smart feedback paste

- **记录反馈** is now one paste box, both in the direct project modal and in the match-result project panel.
- Paste a progress update, meeting note or bullet list; the local parser separates:
  - **成果** → project outcomes;
  - **卡点 / 难点 / 变更点** → project alerts.
- Explicit labels such as `成果：`, `卡点：`, `难点：`, `变更点：` are respected; unlabelled lines fall back to keyword classification (等待/依赖 → 卡点, 分歧/复杂 → 难点, 新增/调整 → 变更点, 完成/交付 → 成果).
- A preview shows exactly where each item will go before saving; parsing runs entirely in the browser.

### 桌面备忘录 · Desktop memo

- Open **备忘录** from the project hero or any progress row; the memo auto-links to that project.
- One lightweight note per project with local persistence and last-saved time.
- **记入反馈** saves the memo and opens the paste box with the memo text prefilled.
- Memos are intentionally plain text — no rich text or formatting overhead.

### 需求池 · Requirement pool

- Add reusable requirements with a name, minimum level, weight and optional note.
- **加入当前需求** adds an entry to the current project requirement (the matching plan).
- **引用到项目** adds an entry to the selected project's requirement snapshot.
- Each entry shows whether it is in the current need and how many projects reference it; the pool persists locally.

### 工作区 · Workspace

- A started project appears with a skill-based task plan assigned to its members: requirements alignment, one delivery task per requirement, and integration/acceptance/retrospective.
- Click a task title to create/open its DSH conversation in the current workspace and send the task details (project, owner, status, team, goal).
- All tasks of one project reuse the same conversation; different projects get separate conversations.
- The separate status button cycles **待开始 → 进行中 → 已完成** and updates progress without sending another message.
- Each project card shows members, start date, task assignees and the current status.
- Workspace projects and tasks persist in this browser; conversation IDs are stored with the project.

### 人才库 · Talent pool

- Every employee in one roster with role, department/team, level, availability, current skills and skill level.
- Search by name, role, team or skill; filter by department; show only people with at least 50% availability; sort by name, availability or skill count.
- Open a profile for all skills, strengths, growth areas and current focus.
- Import/export actions sit beside the **人才库 / Talent pool** title, not in the global header.
- Import employees from CSV, TSV, JSON, Markdown tables or XLSX (first worksheet) — choose a file or drop it in; text files show a CSV preview before merging. Export the current roster, or restore the sample organization.
- People are color-coded by department; availability uses success/warning/error states.

### 组织架构 · Organization

- Department → team tree with headcount.
- Team roster, availability, skill coverage, and single-point skills held by only one person.
- An organization skill matrix (skills × teams) to see where capability is concentrated.

### 智能匹配 · Team match

- Set a project name, team size, maximum people from one team, and required skills with a minimum level and weight.
- Matching evaluates combinations of people across the organization — not just individual rankings — and scores each team on:
  **coverage 55% + depth 13% + availability 12% + balance 12% + synergy 8%**.
- The top three team options show the score, per-requirement owner, capability gaps, single-point dependencies, department mix, remaining team capacity after the draw, and backup candidates.
- Large organizations or large teams are pre-shortlisted by individual fit; the result header states how many candidates were actually evaluated. Recent matches are saved and can be reloaded.
- 中文：填项目名称、团队人数、同团队上限和所需技能（最低等级 + 权重），系统枚举整个组织的团队组合并评分，给出前三组团队、每项需求的分工、能力缺口、单点依赖、抽取后的团队剩余产能和补位建议；候选人数与组合数会如实显示。

## Capability advice · 能力建设建议

Every single-point risk and missing requirement gets a concrete way forward:

- **Single point** (only one person reaches the level): the only holder becomes the mentor, the best available teammate becomes the learner, and the plan states the target level and estimated weeks.
- **Gap** (nobody reaches the required level):
  - one level short → **skill upgrade** for the closest teammate;
  - internal mentor available → **mentor-led training**;
  - no internal mentor → **knowledge plan** plus an external-mentor recommendation;
  - nobody can take over → **external mentor or hire**.
- Each recommendation includes three curated knowledge topics for the skill (33 built-in skills; imported/custom skills fall back to fundamentals, methods and case review).
- Advice appears under **组织架构 → 能力建设建议** for the selected team and inside each expanded **智能匹配** result.

单点风险会给出“唯一持有人带教 + 最佳后备 + 目标等级 + 参考周期”；技能缺口会按差距大小和导师可用性，明确建议“技能提升 / 导师带教 / 知识点补充 / 外部导师或招聘”，并附该技能的 3 个知识点。全部为本地规则计算，不调用模型。

## Training plan · 培养计划

Each employee profile has a training planner:

- **Import from the skill center**: reads the left-sidebar skill center catalog (`api/dsh-skill-explorer/list`) and lets you search and tick skills; current training skills stay visible and preselected, and a manual field suggests known skills when the center is not installed.
- **Quick add**: existing employee skills are shown as one-click chips before the skill center is opened.
- **Combine and remove**: random mix picks 1–3 skills; each skill can be removed or the pool cleared.
- **Vertical depth first**: the planner starts from the employee's strongest deepenable skill (Lv.3–4). It warns when the selection is lateral (more than one skill), a brand-new skill, or has a foundation below Lv.2, and offers a one-click switch back to vertical depth.
- A valid vertical plan shows target level, estimated weeks, an internal mentor (or none) and three knowledge topics; plans persist in this browser.
- Advice cards under 组织架构 / 智能匹配 link directly into the employee's training plan.

## Skill research · 技能资料检索

“检索资料” (in a training plan or an advice card) opens a search dialog for the target employee:

- searches the skill center catalog and public GitHub repositories at the same time;
- shows source, description, stars and language for GitHub results;
- **加入培养** adds a result to that employee's training plan; **补到技能** adds it to the profile at Lv.1;
- a direct **在 GitHub 中搜索** link is available as a fallback if the API is unavailable.

Only the search keyword is sent to GitHub; employee names, skills and feedback are not included.

## Project team · 项目团队

After matching, the **项目团队** module shows the recommended team, goal, covered requirements and availability. **立项并跟踪** saves the team as a local project; **开始工作** creates the workspace project and assigns tasks to members; **记录反馈** opens one paste box whose text is parsed into **成果 / 卡点 / 难点 / 变更点**, with a dated feedback history that also feeds the project alert bar and project outcomes. Feedback and workspace tasks stay in this browser and are kept separately for each distinct goal + member combination.

## How matching works · 匹配方式

1. Individual fit ranks the candidate pool; if the pool is small enough, every employee is used, otherwise a shortlist is taken (best per department first, then by fit).
2. Every combination of the requested team size is checked against the per-team limit.
3. Each team gets a 0–99 score from the five weighted dimensions above, with coverage measured against the weighted requirements.
4. Near-duplicate teams are removed so the three options are meaningfully different.

Weeks/duration is not part of the model; staffing is scored on skills, availability, balance and synergy. All calculations run locally in the page; no model call is made.

## Data & privacy · 数据与隐私

- Employee data, training plans, project teams, tasks, requirement pool, desktop memos, feedback and match history are stored in this browser's `localStorage`.
- CSV/TSV/JSON/Markdown/XLSX import and CSV export move data only through the file the user chooses.
- **Skill research** sends only the typed keyword to `api.github.com`; no employee data is sent.
- **Workspace task conversations** are explicit user actions: clicking a task sends its task/project/team details to a DSH conversation, which follows the workspace's agent and model settings. **Feedback paste parsing** runs locally with deterministic rules and is never sent to a model. Other calculations run locally, with no telemetry.
- Clearing site data or using another browser loses locally stored employees; export CSV as a backup.

## Limitations · 限制

- The built-in 26-person organization is fictional demo data.
- Matching is a deterministic local heuristic, not an AI judgement; it supports decisions rather than making them.
- CSV import merges by name: an employee with the same name is overwritten.
- The talent pool is single-browser, not a shared HR database.
- The organization chart uses the flattened department/team fields from the roster; it does not model a multi-level reporting line.
- Skill research needs internet access; the public GitHub search API is rate-limited (10 requests/minute unauthenticated). A GitHub repository is not a validated competency — **补到技能** adds it at Lv.1 for a human to review.
- Project feedback is local to this browser; it does not sync across devices.
- Task conversations require the running DSH workspace/session services. If they are unavailable, the plugin opens a workspace draft with the task text instead.
- If a project's conversation was archived or removed, the next task click creates a new conversation and updates the project's stored conversation ID.

## Development · 开发

- `client.js` is the browser half (React through the Module Loader, all styles in the bundled CSS string).
- `index.js` is an empty Host half; the bundle patch is `cordis.patch.yml`.
- `locale/*.json` provides plugin-page metadata; `docs/` holds the detail illustration.
- `npm pack --dry-run` shows the published file set.

## Publish to a market · 发布

The package is npm-ready and also ships a GitHub Release tarball. The public repository is <https://github.com/MagicMOl/dsh-org-talent>; install from [v1.12.1](https://github.com/MagicMOl/dsh-org-talent/releases/tag/v1.12.1), and see [`PUBLISHING.md`](PUBLISHING.md) for the community-market catalog entry.

## License

MIT. See [LICENSE](LICENSE).
