# Changelog

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
