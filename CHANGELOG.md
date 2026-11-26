# Changelog

## 1.15.0 — 2026-11-26

- Removed the duplicated outcome band from each project progress row; outcomes now appear once, inside the expanded project progress detail.
- Added a dedicated **产品验收 / Product acceptance** role to each project:
  - selected automatically from the organization, preferring product/quality roles and excluding project members;
  - shown in the project panel and progress row;
  - project workspace gets a **产品验收：需求与成果校核** task assigned to them.
- Added duplicate-development protection:
  - requirements are normalized before task generation and duplicate requirements are skipped;
  - referencing a pool requirement checks both project requirements and existing development tasks using normalized names;
  - duplicate references are blocked with an explicit “无需重复开发” message.

## 1.14.0 — 2026-11-26

- Merged the standalone **项目成果** section into **项目进度**.
- Each project progress row now shows that project's latest outcome; expanding it lists all outcomes belonging to that project.
- Project outcomes are now strictly tied to their project (one project → its outcome timeline), including the outcome count in **近期项目**; there is no global outcome list or project-outcome filter.
- Removed the standalone outcomes card from both the project guide and the match result area.
- The progress project filter now filters projects and their outcomes together.

## 1.13.0 — 2026-11-26

- Added **新建员工 / Add employee** to the Talent pool header:
  - name, role, level, department, team, availability, city, current focus and optional skills;
  - created employees join the roster immediately and can participate in matching;
  - duplicate names are rejected.
- Added **删除员工 / Delete employee** to the employee detail drawer:
  - two-step confirmation;
  - removes the employee from the roster and training data;
  - removes them from project member lists while keeping task assignee names as historical records.
- The create action sits beside import/export in the Talent pool header.

## 1.12.1 — 2026-11-26

- Removed the **从 GitHub 导入 / Import from GitHub** employee import control and its contributor lookup from the import panel.
- CSV, TSV, JSON, Markdown and XLSX file/text import remain available; import/export still sit beside the **人才库 / Talent pool** title.
- No network request is made by employee import. GitHub is still used only for the separate skill research feature.
- Keeps the 1.12.0 alert deduplication: 卡点 / 难点 / 变更点 appear only in project alerts; project progress keeps stage outcomes and member progress.

## 1.12.0 — 2026-11-26

- Moved **导入员工 / 导出 CSV** from the global header to the **人才库 / Talent pool** page header.
- Added **GitHub employee import**:
  - paste a public repository URL or `owner/repo`;
  - read up to 100 contributors from `api.github.com`;
  - de-duplicate by GitHub login and add contributors with role, team and source focus;
  - only the repository address is sent to GitHub.
- Removed duplicate alert information from the project guide:
  - **项目进度** now keeps only outcome/stage/member information;
  - removed the progress **反馈信息** block and feedback count;
  - project outcomes show only outcome summaries, without blocker/difficulty/change tags;
  - **项目预警** is now the single place for 卡点 / 难点 / 变更点.
- Feedback parsing and desktop memo behavior are unchanged.

## 1.11.0 — 2026-11-26

- Replaced the four-field feedback form with a **single paste box** in both the direct project feedback modal and the match-result project panel.
- Added local intelligent parsing:
  - explicit labels such as **成果： / 卡点： / 难点： / 变更点：**;
  - bullet, numbered and Markdown-style pasted notes;
  - keyword fallback for unlabelled lines (e.g. 等待/依赖 → blocker, 分歧/复杂 → difficulty, 新增/调整 → change, 完成/交付 → outcome).
- The parsed result is previewed before saving and explicitly shows what will be written to **项目成果** and **项目预警**.
- Saving still updates project outcomes, progress feedback and the alert bar; desktop memo “记入反馈” now prefills the paste box.
- Parsing runs entirely in the browser; pasted text is not sent to a model or external service.

## 1.10.0 — 2026-11-25

- Added a **桌面备忘录 / Desktop memo**:
  - one lightweight sticky note per project, opened from the project hero or a project progress row;
  - auto-links to the current project, saves locally, and remembers the last update time;
  - **记入反馈 / Use in feedback** saves the memo and opens the feedback form with the memo text prefilled as the outcome.
- Project progress now has a direct **记录反馈 / Record feedback** action, so feedback can be recorded without returning to the match result.
- Renamed the in-page **智能匹配** tab to **人才匹配**, matching the left-sidebar entry and the requested flow; all related guidance now says 人才匹配.
- Memo data is stored alongside projects and survives reloads; direct feedback immediately updates project outcomes and the alert bar.

## 1.9.1 — 2026-11-25

- Added a clear typographic hierarchy across information cards:
  - card/section titles: 14px / 600;
  - subheads inside cards: 12.5px / 600;
  - primary body: 12px / 400;
  - hints and secondary text: 11.5px;
  - labels/meta: 11px.
- Increased distinction between outcome/warning task titles and their body text; project names, outcomes, blockers/difficulties/changes and progress facts no longer share the same visual weight.
- De-emphasized card hints so they no longer compete with the card title.

## 1.9.0 — 2026-11-25

- Stage feedback now captures **成果 / 卡点 / 难点 / 变更点** and synchronizes the three warning categories into the project alert bar.
- Project alerts support project search; the alert bar filters by project and reflects saved stage records as well as live risks.
- New **项目成果 / Project outcomes** section on the project guide and in the match result area, with a searchable project dropdown; outcomes show summary, blockers, difficulties and changes.
- Project progress, project outcomes and **近期项目 / Recent projects** (replacing recent matches) are stacked vertically as full-width sections; this was chosen over a three-column layout because each section carries lists, filters and detail text.
- All three sections, plus project alerts, use a searchable project dropdown.
- Project progress detail feedback now displays blockers, difficulties and changes separately.

## 1.8.0 — 2026-11-25

- New **需求池 / Requirement pool** tab:
  - add/edit-ready requirement entries with name, minimum level, weight and note;
  - **加入当前需求** references an entry into the current project need;
  - **引用到项目** references an entry into a selected project's requirement snapshot;
  - shows current-need and per-project usage counts; seed pool from the default project requirements and migrate existing local data.
- Workspace tasks now connect to the DSH conversation surface:
  - clicking a task title creates a conversation in the current DSH workspace and sends the task description (project, owner, status, team, goal);
  - all tasks of one project reuse the same `conversationId`, so a team's tasks share one conversation;
  - the task row keeps a separate status button for 待开始 / 进行中 / 已完成;
  - if session APIs are unavailable, opens a workspace draft with the task text as a fallback.
- Requirement pool is stored in local storage alongside employees, projects and planning data.

## 1.7.0 — 2026-11-25

- Project guide uses multi-color layer accents: violet project hero, four-color stat tiles, blue project progress, amber project alerts, teal recent matches.
- Project requirements now default to one **highest-priority requirement**, with an explicit “show all” toggle that preserves the full requirement list.
- New **项目进度 / Project progress** section: total projects, active projects, average progress, and a per-project progress row with cycle, start date and end date.
- Clicking a project progress row expands:
  - stage outcome preview (kickoff / delivery / acceptance),
  - per-member task completion,
  - feedback information points.
- New **项目预警 / Project alerts** bar with **卡点 / 难点 / 变更点**:
  - overdue or unassigned work,
  - skill gaps / low-capacity members / missing team,
  - requirement changes and latest feedback adjustments.
  Click an alert to jump to the project's progress detail.
- Projects now persist a planned end date (`dueAt`) when work starts, estimated from the requirement count.

## 1.6.0 — 2026-11-25

- **Project guide homepage redesign** with a clearer hierarchy: page kicker/title, a single primary project hero, compact requirement chips (4 + overflow), one primary CTA per state, a summary stats strip, and secondary project/history cards. Duplicate CTAs and competing actions were removed.
- **Workspace** tab (工作区) with started projects:
  - **开始工作 / Start work** on a project creates its workspace project and a skill-based task plan.
  - Tasks are assigned to project members (kickoff, one delivery task per requirement, acceptance/retrospective), with a kickoff task already in progress.
  - Click a task to cycle **待开始 → 进行中 → 已完成**; progress is shown per project and updates immediately.
  - Project cards show members, start date, task assignees and status.
- Project teams now distinguish **待开始 / 进行中 / 已复盘**; the project guide shows 开始工作 or 进入工作区 per project.
- Workspace projects and tasks persist in local storage alongside projects and feedback.

## 1.5.0 — 2026-11-25

- Split the old workbench into two pages:
  - **项目导览 / Project guide**: current need, recommended team, org summary tiles, created project teams and recent matches.
  - **人才库 / Talent pool**: the full roster, search/filter/sort, employee profiles, import/export and training plans.
- The tab bar now has four entries: 项目导览 / 人才库 / 组织架构 / 智能匹配.
- Stat tiles live on the project guide; skill, team and low-availability actions jump to the talent, organization or profile view.
- Import, reset, advice links and backup candidates now open the talent pool instead of a separate workbench.

## 1.4.1 — 2026-11-24

- Redesigned the skill research dialog: full-width search field with its own submit form, target-employee card, source counts, and clear loading / warning / empty states.
- GitHub failures no longer also show “no results”; the warning explains that skill-center results still work and the direct GitHub search link remains available.
- Removed the ambiguous inline layout that could collapse the search input on narrow or themed displays.

## 1.4.0 — 2026-11-23

- Training planner: current training skills now appear preselected in the skill center, the panel scrolls into view, the manual field has suggestions, and a “quick add from current skills” row makes existing skills visible before opening the center.
- Skill research dialog (from advice cards and the training planner): searches the skill center catalog and public GitHub repositories, with actions to add a result to the training plan or the employee’s skill profile at Lv.1. Includes a direct GitHub search fallback link.
- Project team module after matching: shows the recommended team, goal, coverage and availability; lets you create/track the project, record outcome / issues / adjustment feedback, and keeps a local feedback history.
- Local persistence now also stores project teams and their feedback.

## 1.3.0 — 2026-11-23

- Employee import now accepts CSV, TSV, JSON, Markdown tables and XLSX (first worksheet), by file picker or drag-and-drop; text files get a CSV preview before merging.
- Added a per-employee training plan in the profile drawer:
  - imports skills from the left-sidebar skill center (`api/dsh-skill-explorer/list`) or adds them manually;
  - skills can be removed, cleared and randomly combined (1–3 skills);
  - starts from vertical depth by default and warns when the selection is lateral (multiple skills), a brand-new skill, or has too thin a foundation;
  - shows target level, estimated weeks, mentor and knowledge topics; training plans persist locally;
  - capability advice cards now link straight into the training plan.
- The four summary tiles (people / teams / skills / capacity) are now clickable and open detail panels; team, skill and low-availability rows jump to the relevant team, filter or profile.

## 1.2.0 — 2026-11-23

- Added capability advice for single-point risks and skill gaps.
  - Single points: names the only holder, the best internal backup, a mentor-led plan, target level and estimated weeks.
  - Gaps: chooses skill upgrade when the learner is one level short, mentor-led training when an internal mentor exists, a knowledge plan when no mentor is available, and an external mentor/hire when nobody can take over.
  - Every recommendation includes three curated knowledge topics for that skill; custom/imported skills fall back to generic fundamentals, methods and case review.
  - Advice is shown per team under 组织架构 and inside each expanded 智能匹配 result.
- Updated the detail illustration palette and kept the package metadata current.

## 1.1.0 — 2026-11-23

- Market-ready packaging: MIT license, keywords, `engines.dsh`, public publish config, changelog and publishing guide.
- Added a localized detail document and a self-contained feature illustration for the plugin page.
- UI: wider spacing across stats, employee cards and team results; a department color system for people; colored avatars, rank, score ring, breakdown bars and semantic availability states.
- UI: the requirement form gained clearer section hierarchy and the result cards expose score composition at a glance.

## 1.0.0 — 2026-11-22

- First release: left-sidebar entry, 我的工作台 / 组织架构 / 智能匹配 tabs.
- Employee roster with current skills, availability, profile drawer, CSV import/export and local persistence.
- Organization tree, team coverage, single-point risks and an organization-wide skill matrix.
- Team matching over organization combinations with coverage, depth, availability, balance and synergy scores, gaps, single points, capacity impact and recent matches.
