# Org Talent Match · 组织人才匹配

A DeepSeek Harness plugin that puts organization-wide employee matching in the left sidebar: one workbench for every employee and their current skills, an org chart, team recommendations scored from organization-wide candidates, and a capability plan for gaps and single points.

左侧栏的 DSH 组织人才匹配插件：把员工整合进一张工作台，看到他们现在具备什么技能，并以组织架构为整体为项目组队。

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

### 我的工作台 · My workbench

- Every employee in one roster with role, department/team, level, availability, current skills and skill level.
- Search by name, role, team or skill; filter by department; show only people with at least 50% availability; sort by name, availability or skill count.
- Open a profile for all skills, strengths, growth areas and current focus.
- Import employees from CSV, TSV, JSON, Markdown tables or XLSX (first worksheet) — choose a file or drop it in; text files show a CSV preview before merging. Export the current roster, or restore the sample organization.
- People are color-coded by department; availability uses success/warning/error states.
- The four summary tiles (people, teams, skills, capacity) open detail panels; team, skill and low-availability rows jump to the team, filter the roster, or open a profile.

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

After matching, the **项目团队** module shows the recommended team, goal, covered requirements and availability. **立项并跟踪** saves the team as a local project; **记录反馈** captures outcome, issues/risks and the adjustment for the next round, with a dated feedback history. Feedback stays in this browser and is kept separately for each distinct goal + member combination.

## How matching works · 匹配方式

1. Individual fit ranks the candidate pool; if the pool is small enough, every employee is used, otherwise a shortlist is taken (best per department first, then by fit).
2. Every combination of the requested team size is checked against the per-team limit.
3. Each team gets a 0–99 score from the five weighted dimensions above, with coverage measured against the weighted requirements.
4. Near-duplicate teams are removed so the three options are meaningfully different.

Weeks/duration is not part of the model; staffing is scored on skills, availability, balance and synergy. All calculations run locally in the page; no model call is made.

## Data & privacy · 数据与隐私

- Employee data, training plans, project feedback and match history are stored in this browser's `localStorage`, and nothing is uploaded.
- CSV/TSV/JSON/Markdown/XLSX import and CSV export move data only through the file the user chooses.
- **Skill research** sends only the typed keyword to `api.github.com`; no employee data is sent. All other calculations run locally, with no model calls or telemetry.
- Clearing site data or using another browser loses locally stored employees; export CSV as a backup.

## Limitations · 限制

- The built-in 26-person organization is fictional demo data.
- Matching is a deterministic local heuristic, not an AI judgement; it supports decisions rather than making them.
- CSV import merges by name: an employee with the same name is overwritten.
- The workbench is single-browser, not a shared HR database.
- The organization chart uses the flattened department/team fields from the roster; it does not model a multi-level reporting line.
- Skill research needs internet access; the public GitHub search API is rate-limited (10 requests/minute unauthenticated). A GitHub repository is not a validated competency — **补到技能** adds it at Lv.1 for a human to review.
- Project feedback is local to this browser; it does not sync across devices.

## Development · 开发

- `client.js` is the browser half (React through the Module Loader, all styles in the bundled CSS string).
- `index.js` is an empty Host half; the bundle patch is `cordis.patch.yml`.
- `locale/*.json` provides plugin-page metadata; `docs/` holds the detail illustration.
- `npm pack --dry-run` shows the published file set.

## Publish to a market · 发布

The package is npm-ready and also ships a GitHub Release tarball. The public repository is <https://github.com/MagicMOl/dsh-org-talent>; install from [v1.4.1](https://github.com/MagicMOl/dsh-org-talent/releases/tag/v1.4.1), and see [`PUBLISHING.md`](PUBLISHING.md) for the community-market catalog entry.

## License

MIT. See [LICENSE](LICENSE).
