/* Org talent matching — client half.
 * A full main panel plus its left-sidebar entry. Data is demo/imported and
 * kept in this browser; nothing leaves the page.
 */
window.__ModuleLoader__.load({
  id: 'dsh-org-talent',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useState, useMemo, useEffect, useCallback, useRef } = React

    const PANEL_ID = 'org-talent'
    const NS = 'orgTalent'
    const LS_KEY = 'dsh-org-talent/v1'

    const DEPT_ORDER = ['产品与设计中心', '研发中心', '增长中心', '客户成功']

    const DICTS = {
      zh: {
        'panel.label': '人才匹配',
        'page.title': '组织人才匹配',
        'page.subtitle': '从项目需求出发，连接人才库与全组织匹配',
        'tab.project': '项目导览',
        'tab.talent': '人才库',
        'tab.workspace': '工作区',
        'tab.pool': '需求池',
        'tab.org': '组织架构',
        'tab.match': '智能匹配',
        'pool.kicker': '需求资产',
        'pool.title': '需求池',
        'pool.hint': '维护可复用的需求；可引用到当前项目需求，或引用到某个项目。',
        'pool.count': '{n} 条需求',
        'pool.name': '需求名称',
        'pool.namePlaceholder': '例如 数据分析、React',
        'pool.min': '最低等级',
        'pool.weight': '权重',
        'pool.note': '备注',
        'pool.notePlaceholder': '可选：说明、验收标准或适用场景',
        'pool.add': '添加到需求池',
        'pool.added': '已添加需求“{name}”',
        'pool.needName': '请先填写需求名称',
        'pool.duplicate': '需求池中已有同名需求',
        'pool.referenceTarget': '引用到项目',
        'pool.referenceHint': '每条需求可加入当前需求，或引用到所选项目',
        'pool.noProjects': '还没有项目，先立项',
        'pool.inPlanBadge': '当前需求',
        'pool.inPlan': '已在当前需求',
        'pool.addPlan': '加入当前需求',
        'pool.addProject': '引用到项目',
        'pool.levelWeight': '最低 Lv.{min} · 权重 {weight}',
        'pool.usedBy': '{n} 个项目引用',
        'pool.delete': '删除需求',
        'pool.empty': '需求池为空',
        'pool.emptyHint': '添加常用需求，之后可在项目导览和项目中复用。',
        'pool.alreadyPlan': '“{name}”已在当前需求中',
        'pool.addedPlan': '已把“{name}”加入当前需求',
        'pool.alreadyProject': '“{name}”已在项目“{project}”中',
        'pool.addedProject': '已把“{name}”引用到项目“{project}”',
        'pool.removed': '已从需求池删除“{name}”',
        'workspace.title': '工作区',
        'workspace.hint': '已启动项目与成员任务；点任务可切换状态。',
        'workspace.count': '{n} 个进行中项目',
        'workspace.empty': '还没有开始的项目。',
        'workspace.emptyHint': '到「项目导览」的项目团队行点「开始工作」，系统会创建项目并按技能分配任务。',
        'workspace.back': '返回项目导览',
        'workspace.started': '已开始「{name}」，任务已分配。',
        'workspace.already': '这个项目已经在工作区中了。',
        'workspace.progress': '{done}/{total} 已完成',
        'workspace.startedAt': '启动于 {date}',
        'workspace.unassigned': '待分配',
        'workspace.toggle': '{title} · 当前{status}；点击切换状态',
        'workspace.toggleHint': '点击任务切换：待开始 → 进行中 → 已完成',
        'workspace.taskHint': '点击任务在左侧工作区创建/打开团队对话；右侧状态按钮切换进度。',
        'workspace.chatOpen': '打开团队对话处理 {title}',
        'workspace.chatHint': '打开团队对话',
        'workspace.chatProject': '项目',
        'workspace.chatOwner': '负责人',
        'workspace.chatStatus': '当前状态',
        'workspace.chatTeam': '团队成员',
        'workspace.chatGoal': '项目目标',
        'workspace.chatInstruction': '请与团队成员协作推进这个任务，完成后更新任务状态并记录成果。',
        'workspace.chatSent': '已把“{name}”的任务发送到工作区对话。',
        'workspace.chatDraft': '已在工作区打开对话并填入任务信息。',
        'workspace.chatUnavailable': '工作区服务不可用，无法创建对话。',
        'workspace.chatFailed': '发送任务到工作区对话失败，请重试。',
        'workspace.task.kickoff': '需求对齐与验收标准',
        'workspace.task.deliver': '交付：{skill}（≥Lv.{min}）',
        'workspace.task.review': '联调、验收与复盘',
        'workspace.task.todo': '待开始',
        'workspace.task.doing': '进行中',
        'workspace.task.done': '已完成',
        'talent.title': '人才库',
        'talent.hint': '搜索、筛选并查看员工档案；培养计划与技能补充也在这里。',
        'talent.count': '{n} 名员工',
        'guide.title': '项目导览',
        'guide.kicker': '项目总览',
        'guide.hint': '从项目需求出发，查看当前团队、项目反馈与最近匹配。',
        'guide.current': '当前项目需求',
        'guide.requirements': '{n} 项技能需求 · 目标 {size} 人',
        'guide.topRequirement': '最高优先级需求',
        'guide.weight': '权重 {n}',
        'guide.showAll': '展开全部 {n} 项',
        'guide.hideAll': '收起',
        'guide.warnings': '项目预警',
        'guide.warningsHint': '卡点、难点与变更点；点击预警可展开对应项目',
        'guide.warningCount': '{n} 条预警',
        'guide.warnBlockers': '卡点',
        'guide.warnDifficulties': '难点',
        'guide.warnChanges': '变更点',
        'guide.none': '暂无',
        'guide.progress': '项目进度',
        'guide.progressHint': '每个项目的完成度、周期与起止时间',
        'guide.projectCount': '{n} 个项目',
        'guide.totalProjects': '全部项目',
        'guide.activeProjects': '进行中',
        'guide.avgProgress': '平均进度',
        'guide.cycle': '周期 {n} 天',
        'guide.cyclePending': '周期 未开始',
        'guide.startAt': '开始 {date}',
        'guide.endAt': '结束 {date}',
        'guide.stagePreview': '阶段成果预览',
        'guide.deliveryStage': '需求交付',
        'guide.deliveryDone': '{n}/{total} 已完成',
        'guide.outcomePreview': '最新成果',
        'guide.noOutcome': '暂无阶段成果记录',
        'guide.memberProgress': '成员完成情况',
        'guide.noTasks': '尚未开始任务',
        'guide.feedbackPoints': '反馈信息',
        'guide.noFeedback': '暂无反馈',
        'guide.notStarted': '未开始',
        'guide.warn.overdue': '已超过计划结束时间 {n} 天',
        'guide.warn.unassigned': '存在未分配负责人的任务',
        'guide.warn.noMembers': '项目没有团队成员',
        'guide.warn.skillGap': '{skill} 需 Lv.{min}，团队最高 Lv.{best}',
        'guide.warn.lowCapacity': '{name} 可投入仅 {n}%',
        'guide.warn.requirementChanged': '当前需求已变更，项目仍按旧需求执行',
        'guide.warn.feedbackAdjust': '反馈调整：{text}',
        'guide.topTeam': '当前推荐团队',
        'guide.topMeta': '{n} 人 · 覆盖 {coverage}%',
        'guide.noTop': '还没有匹配结果，先到智能匹配生成团队。',
        'guide.openMatch': '查看匹配',
        'guide.goMatch': '去智能匹配',
        'guide.goTalent': '人才库',
        'guide.projects': '项目团队',
        'guide.projectsHint': '已立项团队与反馈进度',
        'guide.feedbackCount': '{n} 条反馈',
        'guide.recent': '最近匹配',
        'guide.recentHint': '点击记录恢复当时需求',
        'guide.historyMeta': '{n} 人 · {score} 分',
        'guide.noProjects': '还没有立项的项目团队。',
        'guide.noProjectsHint': '完成匹配后，在结果页点「立项并跟踪」。',
        'guide.noHistory': '还没有匹配记录。',
        'workbench.status': '已整合 {n} 名员工 · 数据只保存在本机浏览器',
        'workbench.import': '导入员工',
        'workbench.export': '导出 CSV',
        'workbench.reset': '恢复示例数据',
        'workbench.search': '搜索姓名、职位、团队或技能',
        'workbench.allDepts': '全部部门',
        'workbench.available': '只看现在可投入 ≥ 50%',
        'workbench.sort': '排序',
        'sort.name': '按姓名',
        'sort.available': '按可投入',
        'sort.skills': '按技能数',
        'stat.people': '员工',
        'stat.teams': '团队',
        'stat.skills': '技能项',
        'stat.capacity': '可投入',
        'stat.capacityUnit': 'FTE',
        'stat.detail.peopleHint': '按部门查看人员、团队与平均可投入。',
        'stat.detail.teamsHint': '点击团队进入组织架构查看名册与技能覆盖。',
        'stat.detail.skillsHint': '点击技能在员工中筛选；这里按掌握人数排序。',
        'stat.detail.capacityHint': '按部门查看可投入 FTE，并列出低于 50% 的员工。',
        'stat.detail.deptMeta': '{teams} 个团队 · {people} 人 · 平均可投入 {avg}%',
        'stat.detail.teamMeta': '{people} 人 · 平均可投入 {avg}% · {singles} 个单点',
        'stat.detail.skillMeta': '{holders} 人 ≥Lv.3 · 平均 Lv.{avg} · 最强 {name}',
        'stat.detail.capacityMeta': '{fte} FTE · 平均可投入 {avg}%',
        'stat.detail.lowTitle': '可投入偏低',
        'stat.detail.lowHint': '低于 50%，点击查看员工档案。',
        'stat.detail.lowNone': '没有低于 50% 的员工。',
        'stat.detail.teamOpen': '打开团队',
        'stat.detail.skillFilter': '在员工中筛选该技能',
        'stat.detail.close': '关闭详情',
        'stat.detail.open': '点击查看详情',
        'employee.available': '可投入 {n}%',
        'employee.skills': '当前技能',
        'employee.updated': '技能更新',
        'employee.focus': '现在在做',
        'employee.profile': '员工档案',
        'employee.viewTeam': '查看所属团队',
        'employee.strengths': '强项',
        'employee.growth': '待提升',
        'employee.none': '暂无技能记录',
        'employee.dept': '部门',
        'employee.team': '团队',
        'employee.level': '职级',
        'employee.city': '城市',
        'employee.joined': '加入',
        'employee.lead': '负责人',
        'empty.employees': '没有符合条件的员工',
        'empty.employeesHint': '换个筛选条件，或导入新的员工数据。',
        'org.members': '{n} 人',
        'org.teamSkills': '团队技能覆盖',
        'org.teamSkillsHint': '括号内为达到 Lv.3 的人数',
        'org.singlePoint': '单点风险',
        'org.singlePointHint': '只有 1 人达到 Lv.3 的技能；抽人时会先提示',
        'org.noRisk': '暂无单点风险',
        'org.matrix': '全员技能矩阵',
        'org.matrixHint': '颜色越深，掌握该技能的人越多',
        'org.capacity': '可投入',
        'org.empty': '选择左侧的团队查看详情',
        'org.openProfile': '档案',
        'match.title': '项目需求',
        'match.name': '项目名称',
        'match.namePlaceholder': '例如：企业知识库 Agent',
        'match.size': '团队人数',
        'match.maxPerTeam': '同团队最多',
        'match.peopleUnit': '人',
        'match.skills': '所需技能',
        'match.skillLevel': '最低等级',
        'match.weight': '权重',
        'match.addSkill': '添加技能',
        'match.noMoreSkills': '所有技能都已加入',
        'match.run': '开始匹配',
        'match.saved': '最近匹配',
        'match.none': '还没有匹配记录，先设定需求并开始匹配。',
        'match.summary': '从 {people} 名员工中取 {pool} 位候选，评估 {teams} 种团队组合 · {ms} ms',
        'match.result': '推荐团队 {n}',
        'match.resultsHead': '{n} 组推荐团队',
        'match.member': '成员',
        'match.score': '综合分',
        'match.coverage': '需求覆盖',
        'match.depth': '能力深度',
        'match.availability': '可用产能',
        'match.balance': '组织均衡',
        'match.synergy': '协同互补',
        'match.gaps': '能力缺口',
        'match.gapItem': '{skill}（需 Lv.{min}，最高 Lv.{best}）',
        'match.noGaps': '全部需求技能都有人达到最低等级',
        'advice.section': '能力建设建议',
        'advice.orgHint': '针对单点风险给出内部提升、知识点与导师带教建议；组织内没有导师时，建议外部导师或招聘。',
        'advice.matchHint': '按当前团队和组织内可用导师计算，周期为参考值。',
        'advice.action.upskill': '技能提升',
        'advice.action.mentor': '导师带教',
        'advice.action.knowledge': '知识点补充',
        'advice.action.external': '外部导师/招聘',
        'advice.reason.upskill': '只差 1 级，优先内部提升',
        'advice.reason.mentor': '组织内有导师，优先带教',
        'advice.reason.knowledge': '暂无内部导师，先补知识点并寻找外部导师',
        'advice.reason.external': '团队内无人可接替，建议外部导师或招聘',
        'advice.gapDiagnosis': '需 Lv.{min}，团队最高 Lv.{best}',
        'advice.soloDiagnosis': '仅 {name} 达到 Lv.{min}',
        'advice.learnerLabel': '学员',
        'advice.mentorLabel': '导师',
        'advice.plan': '培养周期',
        'advice.topics': '知识点',
        'advice.availability': '可投入 {n}%',
        'advice.noMentor': '组织内暂无 ≥Lv.{min} 的导师，建议外部导师/招聘',
        'advice.selfStudy': '可在知识点支持下自学，不强制配导师',
        'advice.weeks': '约 {n} 周',
        'advice.none': '需求技能都有备份，无需补位',
        'advice.more': '还有 {n} 项建议',
        'train.title': '培养计划',
        'train.hint': '先尝试垂直深耕：选一个已有技能继续加深；导入新技能会提示横向拓展。',
        'train.importShort': '技能中心',
        'train.random': '随机组合',
        'train.clear': '清空',
        'train.empty': '还没有培养技能',
        'train.emptyHint': '可点“技能中心”导入，或随机组合；也可以直接选已有技能。',
        'train.vertical': '垂直深耕型',
        'train.verticalHint': '在 {skill} 上从 Lv.{from} 到 Lv.{to}，约 {n} 周。',
        'train.warnMulti': '不符合垂直深耕型',
        'train.warnMultiHint': '已选 {n} 个技能，更像横向拓展；保留 1 个主技能，其余作为知识点。',
        'train.warnNew': '新技能，不是垂直深耕',
        'train.warnNewHint': '{skill} 不在该员工现有技能中；先补基础，或改选已有技能。',
        'train.warnFoundation': '基础不足，暂不适合垂直深耕',
        'train.warnFoundationHint': '{skill} 目前 Lv.{level}，垂直深耕建议从 Lv.2 以上开始。',
        'train.max': '已达 Lv.5',
        'train.maxHint': '{skill} 已是最高等级，建议承担导师或复杂项目。',
        'train.target': '目标',
        'train.weeks': '周期',
        'train.mentor': '导师',
        'train.noMentor': '组织内暂无 ≥Lv.{n} 的导师',
        'train.topics': '知识点',
        'train.fix': '改为垂直深耕：{skill}',
        'train.openPlan': '制定培养计划',
        'train.centerLoading': '正在读取技能中心…',
        'train.centerError': '技能中心不可用：{error}；可以手动添加技能。',
        'train.centerEmpty': '技能中心里没有匹配的技能',
        'train.search': '搜索技能',
        'train.picked': '已选 {n}',
        'train.add': '加入培养',
        'train.manualPlaceholder': '手动添加技能名称',
        'train.addManual': '添加',
        'train.randomDone': '已随机组合 {n} 个技能',
        'train.randomEmpty': '没有可组合的技能',
        'train.noBase': '该员工还没有技能，无法做垂直深耕。',
        'train.remove': '移除',
        'train.otherGroup': '其他',
        'train.suggest': '从已有技能快速添加',
        'train.currentGroup': '当前培养',
        'train.currentHint': '当前培养计划中的技能',
        'search.openShort': '检索资料',
        'search.title': '技能资料检索',
        'search.hint': '从技能中心目录和 GitHub 公开仓库检索；可加入培养计划，或补充到员工技能档案。',
        'search.target': '目标员工：{name}',
        'search.targetLabel': '目标员工',
        'search.targetMeta': '{role} · {team} · 可投入 {available}%',
        'search.sourcesHint': '同时检索技能中心与 GitHub 公开仓库',
        'search.errorTitle': '检索未完成',
        'search.githubUnreachable': '无法连接 GitHub。你仍可以使用技能中心的结果，或点“在 GitHub 中搜索”直接打开网页。',
        'search.emptyHint': '可以换一个更短的关键词，或直接使用 GitHub 搜索。',
        'search.placeholder': '输入技能或关键词，例如 React、用户研究',
        'search.run': '检索',
        'search.loading': '正在检索技能中心与 GitHub…',
        'search.error': '检索失败：{error}',
        'search.empty': '没有找到相关技能或仓库，换个关键词试试。',
        'search.centerSource': '技能中心',
        'search.centerBadge': '技能中心',
        'search.githubSource': 'GitHub 公开仓库',
        'search.githubHint': 'GitHub 结果按 Star 排序；未认证 API 有速率限制。',
        'search.addTraining': '加入培养',
        'search.inTraining': '已在培养',
        'search.addProfile': '补到技能',
        'search.inProfile': '已有该技能',
        'search.openGithub': '打开仓库',
        'search.githubSearch': '在 GitHub 中搜索',
        'search.alreadyTraining': '“{skill}”已在 {name} 的培养计划中。',
        'search.trainingAdded': '已把“{skill}”加入 {name} 的培养计划。',
        'search.alreadySkill': '“{skill}”已在员工技能中。',
        'search.skillAdded': '已把“{skill}”补充到 {name} 的技能档案（Lv.1）。',
        'project.title': '项目团队',
        'project.hint': '组建后在这里立项、开始工作并记录成果与调整；反馈只保存在本机。',
        'project.status.pending': '待立项',
        'project.status.notStarted': '待开始',
        'project.status.active': '进行中',
        'project.status.reviewed': '已复盘',
        'project.name': '项目名称',
        'project.goal': '项目目标',
        'project.noGoal': '未填写目标',
        'project.untitled': '未命名项目',
        'project.defaultName': '{goal} 项目组',
        'project.create': '立项并跟踪',
        'project.start': '开始工作',
        'project.enterWorkspace': '进入工作区',
        'project.save': '保存名称',
        'project.feedback': '记录反馈',
        'project.adjust': '调整需求',
        'project.feedbackTitle': '项目反馈',
        'project.outcome': '成果',
        'project.outcomePlaceholder': '已完成什么、结果如何',
        'project.issues': '问题 / 风险',
        'project.issuesPlaceholder': '协作、人员、技能或进度上的问题',
        'project.adjustment': '调整建议',
        'project.adjustmentPlaceholder': '下一次组队或培养要调整什么',
        'project.saveFeedback': '保存反馈',
        'project.cancel': '取消',
        'project.emptyFeedback': '至少填写一项反馈再保存。',
        'project.feedbackSaved': '项目反馈已保存。',
        'project.created': '项目团队已立项，可以点「开始工作」分配任务。',
        'project.history': '反馈记录（{n}）',
        'match.members': '成员与分工',
        'match.showMembers': '展开成员、分工与培养建议',
        'match.hideMembers': '收起成员、分工与培养建议',
        'match.impact': '组织影响',
        'match.impactHint': '抽取后各团队剩余产能',
        'match.impactWarn': '从 {team} 抽走 {n}% 产能',
        'match.backup': '补位建议',
        'match.backupHint': '未入选、但能补上缺口的员工',
        'match.historyScore': '{n} 分',
        'match.formula': '综合分 = 需求覆盖 55% + 能力深度 13% + 可用产能 12% + 组织均衡 12% + 协同互补 8%',
        'match.dirty': '需求已修改，重新匹配后生效',
        'match.noResult': '点击「开始匹配」查看推荐团队',
        'match.noResultHint': '会从整个组织里评估团队组合，而不只是给每个人打分。',
        'match.reqEmpty': '至少添加一项技能需求',
        'match.noCombo': '当前人数或同团队上限下组不出团队，请放宽约束',
        'match.role': '分工',
        'match.team': '团队',
        'match.capacity': '产能',
        'match.teamCount': '{n} 个部门',
        'import.title': '导入员工',
        'import.hint': '每行一名员工：姓名,职位,部门,团队,职级,可投入(0-100),技能。技能用 | 分隔，等级 1-5，例如 React:4|TypeScript:3。同名员工会被覆盖。',
        'import.formats': '支持 CSV、TSV、JSON、Markdown 表格与 XLSX（首个工作表）；也可直接拖入文件。',
        'import.chooseFile': '选择文件',
        'import.dropHint': '或把文件拖到这里',
        'import.reading': '正在读取文件…',
        'import.fileLoaded': '已读取 {name}（{n} 名员工），确认后点击导入。',
        'import.fileFailed': '读取失败：{error}',
        'import.placeholder': '姓名,职位,部门,团队,职级,可投入,技能',
        'import.example': '示例,前端工程师,研发中心,前端组,P6,80,React:4|TypeScript:3',
        'import.confirm': '导入并整合',
        'import.cancel': '关闭',
        'import.reset': '恢复示例数据',
        'import.resetConfirm': '会覆盖当前 {n} 名员工，确定恢复示例数据？',
        'import.resetYes': '确认恢复',
        'import.resetNo': '取消',
        'import.bad': '没有解析到员工，请检查格式',
        'import.done': '已导入 {n} 名员工',
        'import.exported': '已导出 CSV',
        'import.exportFailed': '导出失败，请重试',
        'import.resetDone': '已恢复示例数据',
        'common.close': '关闭',
        'common.remove': '移除',
        'common.all': '全部',
        'common.level': 'Lv.{n}',
        'footer.note': '示例数据仅用于展示匹配方式；导入真实员工后可用于实际组队。',
      },
      en: {
        'panel.label': 'Talent match',
        'page.title': 'Organization talent match',
        'page.subtitle': 'Start from a project need and connect the talent pool with organization-wide matching',
        'tab.project': 'Project guide',
        'tab.talent': 'Talent pool',
        'tab.workspace': 'Workspace',
        'tab.pool': 'Requirement pool',
        'tab.org': 'Organization',
        'tab.match': 'Team match',
        'pool.kicker': 'Requirement assets',
        'pool.title': 'Requirement pool',
        'pool.hint': 'Maintain reusable requirements and reference them from the current project need or a specific project.',
        'pool.count': '{n} requirements',
        'pool.name': 'Requirement name',
        'pool.namePlaceholder': 'e.g. data analysis, React',
        'pool.min': 'Minimum level',
        'pool.weight': 'Weight',
        'pool.note': 'Note',
        'pool.notePlaceholder': 'Optional: description, acceptance criteria or scenario',
        'pool.add': 'Add to pool',
        'pool.added': 'Added “{name}”',
        'pool.needName': 'Enter a requirement name',
        'pool.duplicate': 'A requirement with this name already exists',
        'pool.referenceTarget': 'Reference to project',
        'pool.referenceHint': 'Each requirement can join the current need or be referenced by the selected project',
        'pool.noProjects': 'No project yet; create one first',
        'pool.inPlanBadge': 'Current need',
        'pool.inPlan': 'Already in current need',
        'pool.addPlan': 'Add to current need',
        'pool.addProject': 'Reference to project',
        'pool.levelWeight': 'Min Lv.{min} · weight {weight}',
        'pool.usedBy': '{n} project(s) reference',
        'pool.delete': 'Delete requirement',
        'pool.empty': 'The requirement pool is empty',
        'pool.emptyHint': 'Add reusable requirements for project guides and projects.',
        'pool.alreadyPlan': '“{name}” is already in the current need',
        'pool.addedPlan': 'Added “{name}” to the current need',
        'pool.alreadyProject': '“{name}” is already in project “{project}”',
        'pool.addedProject': 'Referenced “{name}” by project “{project}”',
        'pool.removed': 'Removed “{name}” from the pool',
        'workspace.title': 'Workspace',
        'workspace.hint': 'Started projects and member tasks; click a task to change its status.',
        'workspace.count': '{n} active projects',
        'workspace.empty': 'No project has been started yet.',
        'workspace.emptyHint': 'Open a project team in Project guide and click “Start work”; the project and skill-based task assignments are created for you.',
        'workspace.back': 'Back to Project guide',
        'workspace.started': '“{name}” started; tasks have been assigned.',
        'workspace.already': 'This project is already in the workspace.',
        'workspace.progress': '{done}/{total} done',
        'workspace.startedAt': 'Started {date}',
        'workspace.unassigned': 'Unassigned',
        'workspace.toggle': '{title} · currently {status}; click to change status',
        'workspace.toggleHint': 'Click a task to cycle: to do → in progress → done',
        'workspace.taskHint': 'Click a task to create/open the team conversation in the left workspace; the status button on the right changes progress.',
        'workspace.chatOpen': 'Open the team conversation for {title}',
        'workspace.chatHint': 'Open team conversation',
        'workspace.chatProject': 'Project',
        'workspace.chatOwner': 'Owner',
        'workspace.chatStatus': 'Current status',
        'workspace.chatTeam': 'Team',
        'workspace.chatGoal': 'Project goal',
        'workspace.chatInstruction': 'Work with the team on this task, then update its status and record the outcome.',
        'workspace.chatSent': 'Sent “{name}” task to the workspace conversation.',
        'workspace.chatDraft': 'Opened the workspace conversation with the task details.',
        'workspace.chatUnavailable': 'Workspace services are unavailable; could not create a conversation.',
        'workspace.chatFailed': 'Could not send the task to the workspace conversation. Please retry.',
        'workspace.task.kickoff': 'Requirements alignment and acceptance criteria',
        'workspace.task.deliver': 'Deliver: {skill} (≥Lv.{min})',
        'workspace.task.review': 'Integration, acceptance and retrospective',
        'workspace.task.todo': 'To do',
        'workspace.task.doing': 'In progress',
        'workspace.task.done': 'Done',
        'talent.title': 'Talent pool',
        'talent.hint': 'Search, filter and open employee profiles; training plans and skill research live here too.',
        'talent.count': '{n} employees',
        'guide.title': 'Project guide',
        'guide.kicker': 'Project overview',
        'guide.hint': 'Start from the project need and review the current team, project feedback and recent matches.',
        'guide.current': 'Current project need',
        'guide.requirements': '{n} skill requirements · target {size} people',
        'guide.topRequirement': 'Highest-priority requirement',
        'guide.weight': 'weight {n}',
        'guide.showAll': 'Show all {n}',
        'guide.hideAll': 'Collapse',
        'guide.warnings': 'Project alerts',
        'guide.warningsHint': 'Blockers, difficulties and changes; click an alert to expand the project',
        'guide.warningCount': '{n} alerts',
        'guide.warnBlockers': 'Blockers',
        'guide.warnDifficulties': 'Difficulties',
        'guide.warnChanges': 'Changes',
        'guide.none': 'None',
        'guide.progress': 'Project progress',
        'guide.progressHint': 'Completion, cycle, start and end for every project',
        'guide.projectCount': '{n} projects',
        'guide.totalProjects': 'All projects',
        'guide.activeProjects': 'In progress',
        'guide.avgProgress': 'Average progress',
        'guide.cycle': 'Cycle {n} days',
        'guide.cyclePending': 'Cycle not started',
        'guide.startAt': 'Start {date}',
        'guide.endAt': 'End {date}',
        'guide.stagePreview': 'Stage outcome preview',
        'guide.deliveryStage': 'Delivery',
        'guide.deliveryDone': '{n}/{total} done',
        'guide.outcomePreview': 'Latest outcome',
        'guide.noOutcome': 'No stage outcome recorded yet',
        'guide.memberProgress': 'Member completion',
        'guide.noTasks': 'Tasks have not started',
        'guide.feedbackPoints': 'Feedback',
        'guide.noFeedback': 'No feedback yet',
        'guide.notStarted': 'Not started',
        'guide.warn.overdue': 'Overdue by {n} days',
        'guide.warn.unassigned': 'Some tasks have no assignee',
        'guide.warn.noMembers': 'The project has no team members',
        'guide.warn.skillGap': '{skill} needs Lv.{min}; team best is Lv.{best}',
        'guide.warn.lowCapacity': '{name} is only {n}% available',
        'guide.warn.requirementChanged': 'Requirements changed; the project still follows the old plan',
        'guide.warn.feedbackAdjust': 'Feedback adjustment: {text}',
        'guide.topTeam': 'Current recommended team',
        'guide.topMeta': '{n} people · {coverage}% coverage',
        'guide.noTop': 'No match yet. Build a team in Team match first.',
        'guide.openMatch': 'View match',
        'guide.goMatch': 'Go to Team match',
        'guide.goTalent': 'Talent pool',
        'guide.projects': 'Project teams',
        'guide.projectsHint': 'Created teams and feedback progress',
        'guide.feedbackCount': '{n} feedback entries',
        'guide.recent': 'Recent matches',
        'guide.recentHint': 'Click a record to restore its requirements',
        'guide.historyMeta': '{n} people · {score} pts',
        'guide.noProjects': 'No project team has been created yet.',
        'guide.noProjectsHint': 'After matching, click “Create & track” in the result.',
        'guide.noHistory': 'No match history yet.',
        'workbench.status': '{n} employees integrated · data stays in this browser',
        'workbench.import': 'Import',
        'workbench.export': 'Export CSV',
        'workbench.reset': 'Restore sample data',
        'workbench.search': 'Search name, role, team, or skill',
        'workbench.allDepts': 'All departments',
        'workbench.available': 'Only available ≥ 50%',
        'workbench.sort': 'Sort',
        'sort.name': 'Name',
        'sort.available': 'Availability',
        'sort.skills': 'Skill count',
        'stat.people': 'People',
        'stat.teams': 'Teams',
        'stat.skills': 'Skills',
        'stat.capacity': 'Capacity',
        'stat.capacityUnit': 'FTE',
        'stat.detail.peopleHint': 'People, teams and average availability by department.',
        'stat.detail.teamsHint': 'Click a team to open its roster and skill coverage.',
        'stat.detail.skillsHint': 'Click a skill to filter employees; sorted by how many people hold it.',
        'stat.detail.capacityHint': 'Available FTE by department, plus people below 50%.',
        'stat.detail.deptMeta': '{teams} teams · {people} people · {avg}% average availability',
        'stat.detail.teamMeta': '{people} people · {avg}% average availability · {singles} single points',
        'stat.detail.skillMeta': '{holders} people ≥Lv.3 · average Lv.{avg} · strongest {name}',
        'stat.detail.capacityMeta': '{fte} FTE · {avg}% average availability',
        'stat.detail.lowTitle': 'Low availability',
        'stat.detail.lowHint': 'Below 50%; click to open the profile.',
        'stat.detail.lowNone': 'Nobody is below 50%.',
        'stat.detail.teamOpen': 'Open team',
        'stat.detail.skillFilter': 'Filter employees by this skill',
        'stat.detail.close': 'Close details',
        'stat.detail.open': 'Open details',
        'employee.available': '{n}% available',
        'employee.skills': 'Current skills',
        'employee.updated': 'Updated',
        'employee.focus': 'Current focus',
        'employee.profile': 'Employee profile',
        'employee.viewTeam': 'View team',
        'employee.strengths': 'Strengths',
        'employee.growth': 'Growth areas',
        'employee.none': 'No skills recorded',
        'employee.dept': 'Department',
        'employee.team': 'Team',
        'employee.level': 'Level',
        'employee.city': 'City',
        'employee.joined': 'Joined',
        'employee.lead': 'Lead',
        'empty.employees': 'No employees match these filters',
        'empty.employeesHint': 'Adjust the filters or import new employee data.',
        'org.members': '{n} people',
        'org.teamSkills': 'Team skill coverage',
        'org.teamSkillsHint': 'Numbers show how many people reach Lv.3',
        'org.singlePoint': 'Single points of failure',
        'org.singlePointHint': 'Skills only one person reaches Lv.3 in; flagged before staffing',
        'org.noRisk': 'No single points of failure',
        'org.matrix': 'Organization skill matrix',
        'org.matrixHint': 'Darker cells mean more people hold that skill',
        'org.capacity': 'Availability',
        'org.empty': 'Pick a team on the left',
        'org.openProfile': 'Profile',
        'match.title': 'Project requirement',
        'match.name': 'Project name',
        'match.namePlaceholder': 'e.g. Enterprise knowledge Agent',
        'match.size': 'Team size',
        'match.maxPerTeam': 'Max per team',
        'match.peopleUnit': 'people',
        'match.skills': 'Required skills',
        'match.skillLevel': 'Min level',
        'match.weight': 'Weight',
        'match.addSkill': 'Add skill',
        'match.noMoreSkills': 'Every skill is already required',
        'match.run': 'Start matching',
        'match.saved': 'Recent matches',
        'match.none': 'No matches yet. Set a requirement and start matching.',
        'match.summary': 'Evaluated {teams} team combinations from {pool} candidates of {people} people · {ms} ms',
        'match.result': 'Team option {n}',
        'match.resultsHead': '{n} team options',
        'match.member': 'Member',
        'match.score': 'Score',
        'match.coverage': 'Coverage',
        'match.depth': 'Depth',
        'match.availability': 'Availability',
        'match.balance': 'Balance',
        'match.synergy': 'Synergy',
        'match.gaps': 'Gaps',
        'match.gapItem': '{skill} (needs Lv.{min}, best Lv.{best})',
        'match.noGaps': 'Every required skill is covered at its minimum level',
        'advice.section': 'Capability plan',
        'advice.orgHint': 'For single points it recommends internal upskilling, knowledge topics, or mentorship; when no internal mentor exists, consider an external mentor or hire.',
        'advice.matchHint': 'Based on this team and available internal mentors; durations are estimates.',
        'advice.action.upskill': 'Skill upgrade',
        'advice.action.mentor': 'Mentor-led',
        'advice.action.knowledge': 'Knowledge plan',
        'advice.action.external': 'External mentor',
        'advice.reason.upskill': 'Only one level short; upskill internally first',
        'advice.reason.mentor': 'An internal mentor is available; mentor-led training first',
        'advice.reason.knowledge': 'No internal mentor yet; cover the knowledge and look for an external mentor',
        'advice.reason.external': 'Nobody in the team can take over; consider an external mentor or hire',
        'advice.gapDiagnosis': 'Needs Lv.{min}; team best Lv.{best}',
        'advice.soloDiagnosis': 'Only {name} reaches Lv.{min}',
        'advice.learnerLabel': 'Learner',
        'advice.mentorLabel': 'Mentor',
        'advice.plan': 'Plan',
        'advice.topics': 'Knowledge',
        'advice.availability': '{n}% available',
        'advice.noMentor': 'No internal mentor at Lv.{min}+; consider an external mentor or hire',
        'advice.selfStudy': 'Can self-study with the knowledge plan; a mentor is optional',
        'advice.weeks': '~{n} weeks',
        'advice.none': 'Every required skill has a backup; no cover needed',
        'advice.more': '{n} more recommendations',
        'train.title': 'Training plan',
        'train.hint': 'Start with vertical depth: deepen one existing skill. Importing new skills raises a lateral-training warning.',
        'train.importShort': 'Skill center',
        'train.random': 'Random mix',
        'train.clear': 'Clear',
        'train.empty': 'No training skill yet',
        'train.emptyHint': 'Import from the skill center, try a random mix, or pick an existing skill.',
        'train.vertical': 'Vertical depth',
        'train.verticalHint': '{skill}: Lv.{from} → Lv.{to}, about {n} weeks.',
        'train.warnMulti': 'Not vertical depth',
        'train.warnMultiHint': '{n} skills selected; this is lateral expansion. Keep one primary skill and treat the rest as knowledge.',
        'train.warnNew': 'New skill, not vertical depth',
        'train.warnNewHint': '{skill} is not one of this employee\'s current skills; build foundations first or choose an existing skill.',
        'train.warnFoundation': 'Foundation too thin for vertical depth',
        'train.warnFoundationHint': '{skill} is Lv.{level}; vertical depth starts from Lv.2 or above.',
        'train.max': 'Already Lv.5',
        'train.maxHint': '{skill} is at the top level; consider mentoring or a complex project.',
        'train.target': 'Target',
        'train.weeks': 'Duration',
        'train.mentor': 'Mentor',
        'train.noMentor': 'No internal mentor at Lv.{n}+',
        'train.topics': 'Knowledge',
        'train.fix': 'Switch to vertical depth: {skill}',
        'train.openPlan': 'Open training plan',
        'train.centerLoading': 'Reading the skill center…',
        'train.centerError': 'Skill center unavailable: {error}; add a skill manually.',
        'train.centerEmpty': 'No matching skills in the skill center',
        'train.search': 'Search skills',
        'train.picked': '{n} selected',
        'train.add': 'Add to plan',
        'train.manualPlaceholder': 'Add a skill name manually',
        'train.addManual': 'Add',
        'train.randomDone': 'Random mix of {n} skills',
        'train.randomEmpty': 'No skills available to combine',
        'train.noBase': 'This employee has no skills to deepen yet.',
        'train.remove': 'Remove',
        'train.otherGroup': 'Other',
        'train.suggest': 'Quick add from current skills',
        'train.currentGroup': 'Current plan',
        'train.currentHint': 'Already in the current training plan',
        'search.openShort': 'Find resources',
        'search.title': 'Skill research',
        'search.hint': 'Search the skill center catalog and public GitHub repositories; add a result to the training plan or the employee profile.',
        'search.target': 'Target employee: {name}',
        'search.targetLabel': 'Target employee',
        'search.targetMeta': '{role} · {team} · {available}% available',
        'search.sourcesHint': 'Searches the skill center and public GitHub repositories together',
        'search.errorTitle': 'Search incomplete',
        'search.githubUnreachable': 'GitHub is unreachable. Skill-center results still work, or open “Search GitHub” directly.',
        'search.emptyHint': 'Try a shorter keyword, or use the GitHub search link.',
        'search.placeholder': 'Skill or keyword, e.g. React, user research',
        'search.run': 'Search',
        'search.loading': 'Searching the skill center and GitHub…',
        'search.error': 'Search failed: {error}',
        'search.empty': 'No matching skills or repositories; try another keyword.',
        'search.centerSource': 'Skill center',
        'search.centerBadge': 'Skill center',
        'search.githubSource': 'Public GitHub repositories',
        'search.githubHint': 'GitHub results are sorted by stars; the unauthenticated API is rate-limited.',
        'search.addTraining': 'Add to plan',
        'search.inTraining': 'In plan',
        'search.addProfile': 'Add skill',
        'search.inProfile': 'Already has it',
        'search.openGithub': 'Open repo',
        'search.githubSearch': 'Search GitHub',
        'search.alreadyTraining': '“{skill}” is already in {name}’s training plan.',
        'search.trainingAdded': 'Added “{skill}” to {name}’s training plan.',
        'search.alreadySkill': '“{skill}” is already in the employee profile.',
        'search.skillAdded': 'Added “{skill}” to {name}’s profile at Lv.1.',
        'project.title': 'Project team',
        'project.hint': 'After forming the team, create a project here, start work, and record outcomes and adjustments; feedback stays in this browser.',
        'project.status.pending': 'Not created',
        'project.status.notStarted': 'Not started',
        'project.status.active': 'In progress',
        'project.status.reviewed': 'Reviewed',
        'project.name': 'Project name',
        'project.goal': 'Project goal',
        'project.noGoal': 'No goal set',
        'project.untitled': 'Untitled project',
        'project.defaultName': '{goal} project team',
        'project.create': 'Create & track',
        'project.start': 'Start work',
        'project.enterWorkspace': 'Open workspace',
        'project.save': 'Save name',
        'project.feedback': 'Record feedback',
        'project.adjust': 'Adjust requirements',
        'project.feedbackTitle': 'Project feedback',
        'project.outcome': 'Outcome',
        'project.outcomePlaceholder': 'What was delivered, and how did it go?',
        'project.issues': 'Issues / risks',
        'project.issuesPlaceholder': 'Collaboration, staffing, skills or schedule issues',
        'project.adjustment': 'Adjustment',
        'project.adjustmentPlaceholder': 'What to adjust in the next team or training plan',
        'project.saveFeedback': 'Save feedback',
        'project.cancel': 'Cancel',
        'project.emptyFeedback': 'Fill in at least one feedback field before saving.',
        'project.feedbackSaved': 'Project feedback saved.',
        'project.created': 'Project team created. Click “Start work” to assign tasks.',
        'project.history': 'Feedback history ({n})',
        'match.members': 'Members and coverage',
        'match.showMembers': 'Show members, coverage and plan',
        'match.hideMembers': 'Hide members, coverage and plan',
        'match.impact': 'Organization impact',
        'match.impactHint': 'Remaining capacity after the draw',
        'match.impactWarn': '{team} loses {n}% capacity',
        'match.backup': 'Backup candidates',
        'match.backupHint': 'Not selected, but able to close a gap',
        'match.historyScore': '{n} pts',
        'match.formula': 'Score = coverage 55% + depth 13% + availability 12% + balance 12% + synergy 8%',
        'match.dirty': 'Requirement changed; run matching again',
        'match.noResult': 'Click Start matching to see team options',
        'match.noResultHint': 'It evaluates team combinations across the whole organization, not just individual scores.',
        'match.reqEmpty': 'Add at least one skill requirement',
        'match.noCombo': 'No team fits these size and per-team limits; relax a constraint',
        'match.role': 'Covers',
        'match.team': 'Team',
        'match.capacity': 'Capacity',
        'match.teamCount': 'departments: {n}',
        'import.title': 'Import employees',
        'import.hint': 'One employee per line: name, role, department, team, level, availability (0-100), skills. Separate skills with |, levels 1-5, e.g. React:4|TypeScript:3. An employee with the same name is overwritten.',
        'import.formats': 'Supports CSV, TSV, JSON, Markdown tables and XLSX (first sheet); you can also drop a file here.',
        'import.chooseFile': 'Choose file',
        'import.dropHint': 'or drop a file here',
        'import.reading': 'Reading file…',
        'import.fileLoaded': 'Loaded {name} ({n} employees); review and import.',
        'import.fileFailed': 'Could not read: {error}',
        'import.placeholder': 'name,role,department,team,level,availability,skills',
        'import.example': 'Ada,Frontend engineer,R&D,Web,P6,80,React:4|TypeScript:3',
        'import.confirm': 'Import and integrate',
        'import.cancel': 'Close',
        'import.reset': 'Restore sample data',
        'import.resetConfirm': 'This overwrites the current {n} employees. Restore sample data?',
        'import.resetYes': 'Restore',
        'import.resetNo': 'Cancel',
        'import.bad': 'No employees parsed; check the format',
        'import.done': '{n} employees imported',
        'import.exported': 'CSV exported',
        'import.exportFailed': 'Export failed; try again',
        'import.resetDone': 'Sample data restored',
        'common.close': 'Close',
        'common.remove': 'Remove',
        'common.all': 'All',
        'common.level': 'Lv.{n}',
        'footer.note': 'Sample data only demonstrates the matching method; import real employees to staff actual projects.',
      },
    }

    function pickDict(locale) {
      const base = String(locale || 'zh').split('-')[0]
      return DICTS[base] || DICTS.en
    }

    function interpolate(text, params) {
      if (params === undefined || params === null) return text
      return String(text).replace(/\{(\w+)\}/g, (all, key) => (
        Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : all
      ))
    }

    function makeT(locale) {
      const dict = pickDict(locale)
      return function t(key, params) {
        const text = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : (DICTS.en[key] || key)
        return interpolate(text, params)
      }
    }

    /* ------------------------------------------------------------------ data */

    const S = (name, level) => [name, level]

    const SEED = [
      {
        id: 'p1', name: '林小满', role: '高级产品经理', dept: '产品与设计中心', team: '产品一组', level: 'P7', available: 60,
        city: '上海', joined: '2019', focus: '企业知识库 Agent 的需求与路线图', updated: '2026-11', lead: true,
        skills: [S('需求分析', 5), S('用户研究', 4), S('产品规划', 5), S('数据分析', 3), S('商业分析', 4)],
      },
      {
        id: 'p2', name: '周行', role: '产品经理', dept: '产品与设计中心', team: '产品一组', level: 'P6', available: 82,
        city: '杭州', joined: '2021', focus: '增长实验平台的产品设计', updated: '2026-11',
        skills: [S('需求分析', 4), S('用户研究', 3), S('数据分析', 4), S('A/B 实验', 3), S('SQL', 3)],
      },
      {
        id: 'p3', name: '陈可', role: '产品经理', dept: '产品与设计中心', team: '产品二组', level: 'P5', available: 90,
        city: '深圳', joined: '2022', focus: '客户成功 SaaS 工作台', updated: '2026-10',
        skills: [S('需求分析', 3), S('产品规划', 3), S('用户研究', 2), S('项目管理', 3), S('商业分析', 3)],
      },
      {
        id: 'p4', name: '苏芮', role: '产品经理', dept: '产品与设计中心', team: '产品二组', level: 'P6', available: 55,
        city: '上海', joined: '2020', focus: '定价与套餐策略', updated: '2026-11',
        skills: [S('需求分析', 4), S('商业分析', 5), S('数据分析', 4), S('用户研究', 3)],
      },
      {
        id: 'p5', name: '唐然', role: '交互设计师', dept: '产品与设计中心', team: '设计组', level: 'P6', available: 75,
        city: '北京', joined: '2020', focus: 'Agent 控制台交互与设计规范', updated: '2026-11',
        skills: [S('交互设计', 5), S('用户测试', 4), S('原型', 4), S('设计系统', 3)],
      },
      {
        id: 'p6', name: '叶知秋', role: '视觉设计师', dept: '产品与设计中心', team: '设计组', level: 'P5', available: 88,
        city: '上海', joined: '2023', focus: '品牌与官网改版', updated: '2026-10',
        skills: [S('视觉设计', 5), S('设计系统', 4), S('交互设计', 2), S('用户测试', 2)],
      },
      {
        id: 'p7', name: '贺婷', role: '设计负责人', dept: '产品与设计中心', team: '设计组', level: 'P8', available: 45,
        city: '上海', joined: '2017', focus: '设计系统 2.0 与设计团队管理', updated: '2026-09', lead: true,
        skills: [S('交互设计', 5), S('设计系统', 4), S('用户测试', 5), S('视觉设计', 3), S('项目管理', 3)],
      },
      {
        id: 'p8', name: '沈亦', role: '前端工程师', dept: '研发中心', team: '前端组', level: 'P6', available: 70,
        city: '杭州', joined: '2020', focus: '工作台前端架构', updated: '2026-11',
        skills: [S('React', 5), S('TypeScript', 4), S('数据可视化', 4), S('性能优化', 3)],
      },
      {
        id: 'p9', name: '罗一鸣', role: '前端工程师', dept: '研发中心', team: '前端组', level: 'P5', available: 85,
        city: '成都', joined: '2022', focus: '数据看板与图表组件', updated: '2026-11',
        skills: [S('React', 4), S('TypeScript', 4), S('数据可视化', 3), S('交互设计', 2)],
      },
      {
        id: 'p10', name: '顾飞', role: '前端负责人', dept: '研发中心', team: '前端组', level: 'P8', available: 40,
        city: '北京', joined: '2016', focus: 'Agent 运行时前端', updated: '2026-10', lead: true,
        skills: [S('React', 5), S('TypeScript', 5), S('性能优化', 5), S('数据可视化', 3), S('微服务', 2)],
      },
      {
        id: 'p11', name: '韩东', role: '后端工程师', dept: '研发中心', team: '后端组', level: 'P6', available: 76,
        city: '杭州', joined: '2020', focus: 'Agent 网关与鉴权', updated: '2026-11',
        skills: [S('Node.js', 5), S('Go', 4), S('数据库设计', 4), S('微服务', 4)],
      },
      {
        id: 'p12', name: '程予', role: '后端工程师', dept: '研发中心', team: '后端组', level: 'P6', available: 68,
        city: '深圳', joined: '2021', focus: '计费与配额服务', updated: '2026-10',
        skills: [S('Go', 5), S('微服务', 5), S('数据库设计', 4), S('性能优化', 3)],
      },
      {
        id: 'p13', name: '邵嘉', role: '后端工程师', dept: '研发中心', team: '后端组', level: 'P5', available: 92,
        city: '成都', joined: '2023', focus: '开放平台 API', updated: '2026-11',
        skills: [S('Node.js', 3), S('数据库设计', 3), S('微服务', 3), S('SQL', 3)],
      },
      {
        id: 'p14', name: '陆星野', role: '算法工程师', dept: '研发中心', team: '算法组', level: 'P7', available: 58,
        city: '北京', joined: '2019', focus: 'RAG 检索增强与评测', updated: '2026-11',
        skills: [S('Python', 5), S('PyTorch', 5), S('推荐算法', 4), S('数据挖掘', 4)],
      },
      {
        id: 'p15', name: '白露', role: '算法工程师', dept: '研发中心', team: '算法组', level: 'P6', available: 80,
        city: '杭州', joined: '2021', focus: '意图识别与对话策略', updated: '2026-11',
        skills: [S('Python', 4), S('PyTorch', 4), S('数据挖掘', 4), S('数据分析', 3), S('SQL', 3)],
      },
      {
        id: 'p16', name: '蒋川', role: '数据工程师', dept: '研发中心', team: '算法组', level: 'P6', available: 72,
        city: '上海', joined: '2020', focus: '指标中台与数据资产', updated: '2026-10',
        skills: [S('SQL', 5), S('数据建模', 5), S('BI 报表', 4), S('Python', 3), S('数据挖掘', 3)],
      },
      {
        id: 'p17', name: '温言', role: '内容运营', dept: '增长中心', team: '品牌组', level: 'P5', available: 86,
        city: '广州', joined: '2022', focus: '开发者内容矩阵', updated: '2026-11',
        skills: [S('内容运营', 5), S('社群运营', 4), S('用户研究', 2), S('商业分析', 2)],
      },
      {
        id: 'p18', name: '何畅', role: '品牌经理', dept: '增长中心', team: '品牌组', level: 'P6', available: 64,
        city: '上海', joined: '2020', focus: '年度品牌战役', updated: '2026-10',
        skills: [S('内容运营', 4), S('商业分析', 4), S('项目管理', 3), S('用户研究', 3)],
      },
      {
        id: 'p19', name: '宗野', role: '增长负责人', dept: '增长中心', team: '增长组', level: 'P8', available: 50,
        city: '北京', joined: '2018', focus: '增长实验体系与渠道策略', updated: '2026-11', lead: true,
        skills: [S('广告投放', 5), S('A/B 实验', 5), S('数据分析', 4), S('SQL', 3), S('项目管理', 4)],
      },
      {
        id: 'p20', name: '许知', role: '增长运营', dept: '增长中心', team: '增长组', level: 'P5', available: 84,
        city: '广州', joined: '2022', focus: '私域转化与社群增长', updated: '2026-11',
        skills: [S('广告投放', 4), S('社群运营', 4), S('内容运营', 3), S('A/B 实验', 3)],
      },
      {
        id: 'p21', name: '方木', role: '增长分析师', dept: '增长中心', team: '增长组', level: 'P6', available: 78,
        city: '杭州', joined: '2021', focus: '渠道 ROI 模型', updated: '2026-11',
        skills: [S('数据分析', 5), S('SQL', 4), S('A/B 实验', 4), S('BI 报表', 4)],
      },
      {
        id: 'p22', name: '邱雨', role: '客户成功经理', dept: '客户成功', team: '交付组', level: 'P6', available: 66,
        city: '上海', joined: '2020', focus: '大客户续约与健康度', updated: '2026-10',
        skills: [S('客户沟通', 5), S('项目管理', 4), S('解决方案', 4), S('培训交付', 4)],
      },
      {
        id: 'p23', name: '倪好', role: '实施顾问', dept: '客户成功', team: '交付组', level: 'P5', available: 88,
        city: '苏州', joined: '2023', focus: '制造业客户实施', updated: '2026-11',
        skills: [S('解决方案', 4), S('培训交付', 5), S('客户沟通', 3), S('项目管理', 3)],
      },
      {
        id: 'p24', name: '卢卡', role: '解决方案架构师', dept: '客户成功', team: '交付组', level: 'P7', available: 54,
        city: '深圳', joined: '2019', focus: '私有化部署方案', updated: '2026-11', lead: true,
        skills: [S('解决方案', 5), S('商业分析', 4), S('微服务', 3), S('客户沟通', 4), S('项目管理', 3)],
      },
      {
        id: 'p25', name: '顾清', role: '数据分析师', dept: '产品与设计中心', team: '产品一组', level: 'P5', available: 80,
        city: '上海', joined: '2022', focus: '产品指标与实验分析', updated: '2026-11',
        skills: [S('数据分析', 4), S('SQL', 4), S('BI 报表', 3), S('用户研究', 3)],
      },
      {
        id: 'p26', name: '江屿', role: '项目经理', dept: '客户成功', team: '交付组', level: 'P6', available: 61,
        city: '北京', joined: '2020', focus: '跨部门项目群', updated: '2026-10',
        skills: [S('项目管理', 5), S('客户沟通', 4), S('解决方案', 3), S('培训交付', 3)],
      },
    ]

    const DEFAULT_PLAN = {
      name: '企业知识库 Agent',
      size: 4,
      maxPerTeam: 2,
      skills: [
        { name: '需求分析', min: 3, weight: 3 },
        { name: 'React', min: 3, weight: 2 },
        { name: 'Python', min: 3, weight: 2 },
        { name: '项目管理', min: 3, weight: 2 },
        { name: '数据分析', min: 2, weight: 1 },
      ],
    }

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

    function currentMonth() {
      const now = new Date()
      return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
    }

    function normalizeSkill(raw) {
      if (typeof raw === 'string') {
        const name = raw.trim()
        return name ? { name, level: 3 } : null
      }
      if (Array.isArray(raw)) {
        const name = String(raw[0] || '').trim()
        if (!name) return null
        return { name, level: clamp(Number(raw[1]) || 3, 1, 5) }
      }
      if (raw && typeof raw === 'object') {
        const name = String(raw.name || raw['技能'] || '').trim()
        if (!name) return null
        return { name, level: clamp(Number(raw.level ?? raw['等级']) || 3, 1, 5) }
      }
      return null
    }

    function normalizeEmployee(raw, index) {
      if (!raw || typeof raw !== 'object') return null
      const name = String(raw.name || raw['姓名'] || '').trim()
      if (!name) return null
      const skills = Array.isArray(raw.skills)
        ? raw.skills.map(normalizeSkill).filter(Boolean)
        : typeof raw.skills === 'string' ? parseSkillCell(raw.skills)
          : Array.isArray(raw['技能']) ? raw['技能'].map(normalizeSkill).filter(Boolean)
            : typeof raw['技能'] === 'string' ? parseSkillCell(raw['技能']) : []
      const seen = new Set()
      const deduped = []
      for (const skill of skills) {
        if (seen.has(skill.name)) continue
        seen.add(skill.name)
        deduped.push(skill)
      }
      return {
        id: String(raw.id || ('e' + (index + 1))),
        name,
        role: String(raw.role || raw['职位'] || '员工').trim(),
        dept: String(raw.dept || raw['部门'] || '未分组').trim(),
        team: String(raw.team || raw['团队'] || '未分组').trim(),
        level: String(raw.level || raw['职级'] || 'P5').trim(),
        available: clamp(Number(raw.available ?? raw['可投入'] ?? 80) || 0, 0, 100),
        city: String(raw.city || raw['城市'] || '').trim(),
        joined: String(raw.joined || raw['加入'] || '').trim(),
        focus: String(raw.focus || raw['现在在做'] || '').trim(),
        updated: String(raw.updated || raw['更新'] || currentMonth()).trim(),
        lead: raw.lead === true,
        skills: deduped,
      }
    }

    function seedEmployees() {
      return SEED.map((raw, index) => normalizeEmployee(raw, index))
    }

    function seedRequirementPool() {
      return DEFAULT_PLAN.skills.map((skill, index) => ({
        id: 'req-seed-' + index,
        name: skill.name,
        min: skill.min,
        weight: skill.weight,
        note: '',
        createdAt: '',
      }))
    }

    function normalizePoolItem(raw, index) {
      if (!raw || typeof raw !== 'object') return null
      const name = String(raw.name || '').trim().slice(0, 80)
      if (!name) return null
      return {
        id: String(raw.id || ('req-' + index + '-' + Date.now().toString(36))),
        name,
        min: clamp(Number(raw.min) || 3, 1, 5),
        weight: clamp(Number(raw.weight) || 2, 1, 3),
        note: String(raw.note || '').slice(0, 800),
        createdAt: String(raw.createdAt || ''),
      }
    }

    function defaultState() {
      return { employees: seedEmployees(), plan: DEFAULT_PLAN, history: [], training: {}, projects: [], requirementPool: seedRequirementPool() }
    }

    function normalizeProject(raw) {
      if (!raw || typeof raw !== 'object') return null
      const feedback = Array.isArray(raw.feedback)
        ? raw.feedback.filter(item => item && typeof item === 'object').slice(0, 30).map(item => ({
          id: String(item.id || ''),
          at: String(item.at || ''),
          outcome: String(item.outcome || '').slice(0, 4000),
          issues: String(item.issues || '').slice(0, 4000),
          adjustment: String(item.adjustment || '').slice(0, 4000),
        }))
        : []
      const requirements = Array.isArray(raw.requirements)
        ? raw.requirements.filter(item => item && typeof item === 'object').slice(0, 12).map(item => ({
          name: String(item.name || '').trim().slice(0, 80),
          min: clamp(Number(item.min) || 3, 1, 5),
        })).filter(item => item.name)
        : []
      const tasks = Array.isArray(raw.tasks)
        ? raw.tasks.filter(item => item && typeof item === 'object').slice(0, 40).map(item => ({
          id: String(item.id || ''),
          title: String(item.title || '').slice(0, 240),
          assigneeId: String(item.assigneeId || ''),
          assigneeName: String(item.assigneeName || '').slice(0, 80),
          status: ['todo', 'doing', 'done'].includes(item.status) ? item.status : 'todo',
          createdAt: String(item.createdAt || ''),
        })).filter(item => item.title)
        : []
      return {
        id: String(raw.id || ''),
        name: String(raw.name || '').slice(0, 100),
        goal: String(raw.goal || '').slice(0, 2000),
        memberIds: Array.isArray(raw.memberIds) ? raw.memberIds.map(String).filter(Boolean) : [],
        createdAt: String(raw.createdAt || ''),
        updatedAt: String(raw.updatedAt || ''),
        startedAt: String(raw.startedAt || ''),
        dueAt: String(raw.dueAt || ''),
        conversationId: String(raw.conversationId || ''),
        requirements,
        tasks,
        feedback,
      }
    }

    function normalizePlan(raw) {
      if (!raw || typeof raw !== 'object') return DEFAULT_PLAN
      const skills = Array.isArray(raw.skills)
        ? raw.skills
          .map(skill => ({
            name: String((skill && (skill.name || skill['技能'])) || '').trim(),
            min: clamp(Number(skill && (skill.min ?? skill['最低等级'])) || 3, 1, 5),
            weight: clamp(Number(skill && skill.weight) || 2, 1, 3),
          }))
          .filter(skill => skill.name)
        : DEFAULT_PLAN.skills
      return {
        name: String(raw.name || DEFAULT_PLAN.name),
        size: clamp(Number(raw.size) || 4, 2, 8),
        maxPerTeam: clamp(Number(raw.maxPerTeam) || 2, 1, 4),
        skills: skills.length ? skills : DEFAULT_PLAN.skills,
      }
    }

    function loadStored() {
      try {
        const raw = JSON.parse(window.localStorage.getItem(LS_KEY) || 'null')
        if (!raw || !Array.isArray(raw.employees)) return defaultState()
        const employees = raw.employees.map(normalizeEmployee).filter(Boolean)
        if (!employees.length) return defaultState()
        const training = raw.training && typeof raw.training === 'object' && !Array.isArray(raw.training)
          ? Object.fromEntries(Object.entries(raw.training)
            .filter(([, value]) => Array.isArray(value))
            .map(([key, value]) => [key, value.map(name => String(name)).filter(Boolean)]))
          : {}
        const projects = Array.isArray(raw.projects) ? raw.projects.map(normalizeProject).filter(Boolean).slice(0, 20) : []
        const requirementPool = Array.isArray(raw.requirementPool)
          ? raw.requirementPool.map(normalizePoolItem).filter(Boolean).slice(0, 100)
          : seedRequirementPool()
        return {
          employees,
          plan: normalizePlan(raw.plan),
          history: Array.isArray(raw.history) ? raw.history.slice(0, 5) : [],
          training,
          projects,
          requirementPool,
        }
      } catch (error) {
        return defaultState()
      }
    }

    function saveStored(state) {
      try {
        window.localStorage.setItem(LS_KEY, JSON.stringify(state))
      } catch (error) {
        /* Storage can be full or blocked; the page keeps working in memory. */
      }
    }

    /* --------------------------------------------------------------- derived */

    function buildOrg(employees) {
      const byDept = new Map()
      for (const employee of employees) {
        if (!byDept.has(employee.dept)) byDept.set(employee.dept, new Map())
        const teams = byDept.get(employee.dept)
        if (!teams.has(employee.team)) teams.set(employee.team, { name: employee.team, dept: employee.dept, members: [] })
        teams.get(employee.team).members.push(employee)
      }
      const depts = [...byDept.entries()].map(([name, teams]) => ({
        name,
        teams: [...teams.values()].sort((a, b) => a.name.localeCompare(b.name, 'zh')),
      }))
      depts.sort((a, b) => {
        const ia = DEPT_ORDER.indexOf(a.name)
        const ib = DEPT_ORDER.indexOf(b.name)
        if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
        return a.name.localeCompare(b.name, 'zh')
      })
      return depts
    }

    function allSkillNames(employees) {
      const names = new Set()
      for (const employee of employees) for (const skill of employee.skills) names.add(skill.name)
      return [...names]
    }

    const DEPT_COLORS = {
      '产品与设计中心': '#8b5cf6',
      '研发中心': '#4c7df0',
      '增长中心': '#e0932f',
      '客户成功': '#17a398',
    }
    const DEPT_PALETTE = ['#8b5cf6', '#4c7df0', '#e0932f', '#17a398', '#e05a7d', '#5470c6']

    function deptColor(name) {
      const key = String(name || '')
      if (DEPT_COLORS[key]) return DEPT_COLORS[key]
      let hash = 0
      for (let index = 0; index < key.length; index += 1) hash = (hash * 31 + key.charCodeAt(index)) >>> 0
      return DEPT_PALETTE[hash % DEPT_PALETTE.length]
    }

    function availabilityTone(value) {
      if (value >= 70) return 'high'
      if (value >= 50) return 'mid'
      return 'low'
    }

    function scoreTone(score) {
      if (score >= 90) return 'high'
      if (score >= 80) return 'mid'
      return 'low'
    }

    const SKILL_TOPICS = {
      '需求分析': {
        zh: ['用户访谈与场景拆解', '需求分层与优先级（MoSCoW / KANO）', '验收标准与需求评审'],
        en: ['User interviews and scenario mapping', 'Prioritisation with MoSCoW / KANO', 'Acceptance criteria and requirement reviews'],
      },
      '用户研究': {
        zh: ['研究问题与样本设计', '访谈与可用性测试', '洞察归纳与用户画像'],
        en: ['Research questions and sampling', 'Interviews and usability tests', 'Synthesis and personas'],
      },
      '产品规划': {
        zh: ['路线图与里程碑', '机会评估与投入产出', '版本范围与依赖管理'],
        en: ['Roadmaps and milestones', 'Opportunity sizing and ROI', 'Scope and dependency management'],
      },
      '数据分析': {
        zh: ['指标口径与漏斗', 'SQL 取数与清洗', '归因与实验分析'],
        en: ['Metric definitions and funnels', 'SQL extraction and cleaning', 'Attribution and experiment analysis'],
      },
      '商业分析': {
        zh: ['商业模式画布', '单位经济模型', '竞品与市场测算'],
        en: ['Business model canvas', 'Unit economics', 'Competitor and market sizing'],
      },
      '交互设计': {
        zh: ['信息架构与任务流', '交互规范与状态设计', '可用性走查'],
        en: ['Information architecture and task flows', 'Interaction states and patterns', 'Usability reviews'],
      },
      '用户测试': {
        zh: ['测试脚本与任务设计', '观察记录与问题编码', '问题分级与迭代'],
        en: ['Test scripts and tasks', 'Observation notes and coding', 'Severity and iteration'],
      },
      '原型': {
        zh: ['低保真到高保真', '组件与交互状态', '原型评审与交接'],
        en: ['Low- to high-fidelity prototyping', 'Components and interaction states', 'Prototype review and handoff'],
      },
      '设计系统': {
        zh: ['Design token 与组件库', '组件 API 与文档', '版本与治理'],
        en: ['Design tokens and component libraries', 'Component APIs and documentation', 'Versioning and governance'],
      },
      '视觉设计': {
        zh: ['版式与栅格', '色彩与字体系统', '品牌一致性'],
        en: ['Layout and grids', 'Colour and type systems', 'Brand consistency'],
      },
      'React': {
        zh: ['组件与状态管理', 'Hooks 与渲染性能', '可访问性与测试'],
        en: ['Components and state management', 'Hooks and render performance', 'Accessibility and testing'],
      },
      'TypeScript': {
        zh: ['类型建模', '泛型与工具类型', '严格模式迁移'],
        en: ['Type modelling', 'Generics and utility types', 'Strict-mode migration'],
      },
      '数据可视化': {
        zh: ['图表选型', '视觉编码与交互', '可读性与无障碍'],
        en: ['Chart selection', 'Visual encoding and interaction', 'Readability and accessibility'],
      },
      '性能优化': {
        zh: ['指标与火焰图', '渲染与缓存', '加载与网络优化'],
        en: ['Metrics and flame charts', 'Rendering and caching', 'Loading and network optimisation'],
      },
      'Node.js': {
        zh: ['事件循环与异步', '服务分层与错误处理', '性能与可观测性'],
        en: ['Event loop and async', 'Service layers and error handling', 'Performance and observability'],
      },
      'Go': {
        zh: ['并发模型', '接口与工程结构', '性能剖析'],
        en: ['Concurrency model', 'Interfaces and project structure', 'Profiling'],
      },
      '数据库设计': {
        zh: ['建模与范式', '索引与查询计划', '迁移与一致性'],
        en: ['Modelling and normal forms', 'Indexes and query plans', 'Migrations and consistency'],
      },
      '微服务': {
        zh: ['服务边界与契约', '治理与可观测性', '容错与一致性'],
        en: ['Service boundaries and contracts', 'Governance and observability', 'Resilience and consistency'],
      },
      'Python': {
        zh: ['语言核心与类型提示', '数据处理与脚本化', '测试与打包'],
        en: ['Language core and type hints', 'Data processing and scripting', 'Testing and packaging'],
      },
      'PyTorch': {
        zh: ['张量与自动求导', '训练与调参', '推理与部署'],
        en: ['Tensors and autograd', 'Training and tuning', 'Inference and deployment'],
      },
      '推荐算法': {
        zh: ['召回与排序', '特征与评估', '冷启动与多样性'],
        en: ['Recall and ranking', 'Features and evaluation', 'Cold start and diversity'],
      },
      '数据挖掘': {
        zh: ['特征工程', '聚类与分类', '因果与可解释性'],
        en: ['Feature engineering', 'Clustering and classification', 'Causality and explainability'],
      },
      'SQL': {
        zh: ['查询与窗口函数', '索引与执行计划', '数据质量校验'],
        en: ['Queries and window functions', 'Indexes and execution plans', 'Data quality checks'],
      },
      '数据建模': {
        zh: ['维度建模', '指标口径与血缘', '湖仓分层'],
        en: ['Dimensional modelling', 'Metric definitions and lineage', 'Lakehouse layers'],
      },
      'BI 报表': {
        zh: ['指标看板设计', '数据源与刷新', '自助分析与权限'],
        en: ['Dashboard design', 'Data sources and refresh', 'Self-service and permissions'],
      },
      '内容运营': {
        zh: ['内容策略与选题', '生产流程与分发', '数据复盘'],
        en: ['Content strategy and topics', 'Production and distribution', 'Performance review'],
      },
      '广告投放': {
        zh: ['渠道与预算', '素材与定向', 'ROI 与归因'],
        en: ['Channels and budgets', 'Creative and targeting', 'ROI and attribution'],
      },
      'A/B 实验': {
        zh: ['假设与指标', '分流与样本量', '显著性与决策'],
        en: ['Hypotheses and metrics', 'Assignment and sample size', 'Significance and decisions'],
      },
      '社群运营': {
        zh: ['社群分层与规则', '活动与内容节奏', '活跃与留存'],
        en: ['Segmentation and rules', 'Events and content cadence', 'Activity and retention'],
      },
      '客户沟通': {
        zh: ['需求澄清与期望管理', '汇报与谈判', '冲突与升级'],
        en: ['Clarifying needs and expectations', 'Reporting and negotiation', 'Conflict and escalation'],
      },
      '项目管理': {
        zh: ['范围与排期', '风险与依赖', '复盘与度量'],
        en: ['Scope and scheduling', 'Risks and dependencies', 'Retrospectives and metrics'],
      },
      '解决方案': {
        zh: ['业务诊断', '方案架构与报价', 'POC 与交付边界'],
        en: ['Business diagnosis', 'Solution architecture and pricing', 'POC and delivery boundaries'],
      },
      '培训交付': {
        zh: ['课程设计与材料', '授课与演练', '效果评估'],
        en: ['Course design and materials', 'Delivery and practice', 'Effectiveness evaluation'],
      },
    }

    function employeeLevel(employee, name) {
      const found = employee.skills.find(skill => skill.name === name)
      return found ? found.level : 0
    }

    function strongestSkill(employee) {
      if (!employee || !employee.skills.length) return null
      return employee.skills
        .slice()
        .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name, 'zh'))[0]
    }

    function defaultTrainingSkill(employee) {
      if (!employee || !employee.skills.length) return ''
      const sorted = employee.skills
        .slice()
        .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name, 'zh'))
      const deepenable = sorted.find(skill => skill.level >= 3 && skill.level < 5)
      return (deepenable || sorted[0]).name
    }

    function skillTopics(skill, locale) {
      const entry = SKILL_TOPICS[skill]
      const zh = String(locale || '').startsWith('zh')
      if (entry) return zh ? entry.zh : entry.en
      return zh
        ? [skill + ' 基础概念与术语', skill + ' 常用方法与流程', skill + ' 真实案例复盘']
        : [skill + ' fundamentals', skill + ' methods and workflows', skill + ' case review']
    }

    async function fetchSkillCenterCatalog() {
      const response = await fetch('api/dsh-skill-explorer/list', { headers: { accept: 'application/json' } })
      let payload = null
      try {
        payload = await response.json()
      } catch (error) {
        payload = null
      }
      if (!response.ok) {
        const message = payload && typeof payload.error === 'string' ? payload.error : 'HTTP ' + response.status
        throw new Error(message)
      }
      const entries = []
      const seen = new Set()
      for (const group of Array.isArray(payload && payload.groups) ? payload.groups : []) {
        for (const skill of Array.isArray(group && group.skills) ? group.skills : []) {
          const name = String((skill && skill.name) || '').trim()
          if (!name || seen.has(name)) continue
          seen.add(name)
          entries.push({
            name,
            description: String((skill && skill.description) || '').trim(),
            group: String((group && group.title) || '').trim(),
          })
        }
      }
      return entries.sort((a, b) => a.name.localeCompare(b.name, 'zh'))
    }

    async function searchGitHubRepositories(query) {
      const text = String(query || '').trim()
      if (!text) return []
      const url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(text + ' in:name,description,topics') + '&sort=stars&order=desc&per_page=6'
      let response
      try {
        response = await fetch(url, { headers: { accept: 'application/vnd.github+json' } })
      } catch (error) {
        throw new Error('GitHub is unreachable')
      }
      let payload = null
      try {
        payload = await response.json()
      } catch (error) {
        payload = null
      }
      if (!response.ok) {
        const message = payload && typeof payload.message === 'string' ? payload.message : 'HTTP ' + response.status
        throw new Error(message)
      }
      return (Array.isArray(payload && payload.items) ? payload.items : []).slice(0, 6).map(item => ({
        name: String((item && item.name) || '').trim(),
        fullName: String((item && item.full_name) || '').trim(),
        description: String((item && item.description) || '').trim(),
        stars: Number(item && item.stargazers_count) || 0,
        language: String((item && item.language) || '').trim(),
        url: String((item && item.html_url) || '').trim(),
      })).filter(item => item.name && item.url)
    }

    function projectKeyFor(plan, team) {
      const text = String((plan && (plan.goal || plan.name)) || '') + '|' + (team || []).map(member => member.id).sort().join('|')
      let hash = 2166136261
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index)
        hash = Math.imul(hash, 16777619)
      }
      return 'prj-' + ((hash >>> 0).toString(36))
    }

    function pickLearner(team, skill, excludeId) {
      return team
        .filter(member => member.id !== excludeId)
        .slice()
        .sort((a, b) => employeeLevel(b, skill) - employeeLevel(a, skill) || b.available - a.available)[0] || null
    }

    function pickMentor(employees, skill, min, excludeIds) {
      return employees
        .filter(member => !excludeIds.has(member.id) && employeeLevel(member, skill) >= min && member.available >= 20)
        .sort((a, b) => employeeLevel(b, skill) - employeeLevel(a, skill) || b.available - a.available)[0] || null
    }

    function buildGapAdvice(team, employees, requirement, locale) {
      const skill = requirement.name
      const min = requirement.min
      const levels = team.map(member => employeeLevel(member, skill))
      const best = levels.length ? Math.max(...levels) : 0
      if (best >= min) return null
      const gap = min - best
      const learner = pickLearner(team, skill)
      const teamIds = new Set(team.map(member => member.id))
      const mentor = pickMentor(employees, skill, min, teamIds)
      let action
      if (best > 0 && gap === 1 && learner && (learner.available >= 40 || mentor)) action = 'upskill'
      else if (mentor) action = 'mentor'
      else if (best > 0) action = 'knowledge'
      else action = 'external'
      const weeks = gap > 0 ? clamp(2 + gap * 2, 3, 12) : null
      return {
        kind: 'gap',
        skill,
        min,
        best,
        action,
        learner,
        mentor,
        target: min,
        weeks,
        topics: skillTopics(skill, locale),
        holder: null,
      }
    }

    function buildSoloAdvice(team, skill, min, locale) {
      const holders = team.filter(member => employeeLevel(member, skill) >= min)
      const holder = holders.slice().sort((a, b) => employeeLevel(b, skill) - employeeLevel(a, skill))[0] || null
      const backup = holder ? pickLearner(team, skill, holder.id) : null
      const gap = backup ? Math.max(1, min - employeeLevel(backup, skill)) : null
      let action
      if (!backup) action = 'external'
      else if (gap === 1 && backup.available >= 40) action = 'upskill'
      else if (holder && holder.available >= 15) action = 'mentor'
      else action = 'external'
      const weeks = action === 'external' ? null : clamp(2 + gap * 2, 3, 12)
      return {
        kind: 'solo',
        skill,
        min,
        best: holder ? employeeLevel(holder, skill) : 0,
        action,
        learner: backup,
        mentor: action === 'external' ? null : holder,
        target: min,
        weeks,
        topics: skillTopics(skill, locale),
        holder,
      }
    }

    function initials(name) {
      return String(name || '?').trim().slice(0, 1)
    }

    function formatTime(ts) {
      try {
        const date = new Date(ts)
        return String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' ' +
          String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
      } catch (error) {
        return ''
      }
    }

    /* --------------------------------------------------------------- matching */

    function requirementList(plan) {
      return (plan.skills || []).filter(skill => skill && skill.name)
    }

    function utility(employee, requirements) {
      let total = 0
      for (const requirement of requirements) {
        const level = employeeLevel(employee, requirement.name)
        const weight = Math.max(1, requirement.weight)
        if (level >= requirement.min) total += weight * (1 + 0.25 * (level - requirement.min))
        else total += weight * (level / Math.max(1, requirement.min)) * 0.5
      }
      return total + (employee.available || 0) / 100
    }

    function evaluateTeam(team, requirements, size, levelMaps) {
      const totalWeight = requirements.reduce((sum, requirement) => sum + Math.max(1, requirement.weight), 0) || 1
      let covered = 0
      let depth = 0
      let bus = 0
      const gaps = []
      const providers = {}

      for (const requirement of requirements) {
        const weight = Math.max(1, requirement.weight)
        let best = 0
        const holders = []
        for (const employee of team) {
          const level = levelMaps.get(employee.id).get(requirement.name) || 0
          if (level > best) best = level
          if (level >= requirement.min) holders.push(employee)
        }
        if (best >= requirement.min) {
          covered += weight
          depth += (best - requirement.min) / Math.max(1, 5 - requirement.min)
          if (holders.length >= 2) bus += weight
        } else {
          covered += weight * (best / Math.max(1, requirement.min)) * 0.55
          gaps.push({ name: requirement.name, min: requirement.min, best })
        }
        providers[requirement.name] = best > 0
          ? team.filter(employee => (levelMaps.get(employee.id).get(requirement.name) || 0) === best).map(employee => employee.id)
          : []
      }

      const coverage = covered / totalWeight
      const depthScore = requirements.length ? depth / requirements.length : 0
      const availability = team.reduce((sum, employee) => sum + (employee.available || 0), 0) / team.length / 100
      const teamCounts = {}
      const deptCounts = {}
      for (const employee of team) {
        teamCounts[employee.team] = (teamCounts[employee.team] || 0) + 1
        deptCounts[employee.dept] = (deptCounts[employee.dept] || 0) + 1
      }
      const maxSame = Math.max(...Object.values(teamCounts))
      const sameScore = 1 - (maxSame - 1) / Math.max(1, team.length - 1)
      const diversity = Object.keys(deptCounts).length / Math.min(team.length, 4)
      const balance = sameScore * 0.6 + Math.min(1, diversity) * 0.4
      const synergy = bus / totalWeight
      const score = Math.round(100 * (
        0.55 * coverage + 0.13 * depthScore + 0.12 * availability + 0.12 * balance + 0.08 * synergy
      ))

      return {
        team,
        score: Math.min(99, score),
        coverage,
        depth: depthScore,
        availability,
        balance,
        synergy,
        gaps,
        providers,
        deptCounts,
        size,
        requirements,
      }
    }

    function runMatching(employees, plan) {
      const requirements = requirementList(plan)
      if (!requirements.length || !employees.length) return null
      const started = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
      const size = clamp(Math.round(plan.size) || 4, 2, 8)
      const maxPerTeam = clamp(Math.round(plan.maxPerTeam) || 2, 1, 4)
      const levelMaps = new Map(employees.map(employee => [
        employee.id,
        new Map(employee.skills.map(skill => [skill.name, skill.level])),
      ]))

      const ranked = employees
        .map(employee => ({ employee, value: utility(employee, requirements) }))
        .sort((a, b) => b.value - a.value)

      const combinationCount = (n, k) => {
        if (k > n) return 0
        let total = 1
        for (let index = 1; index <= k; index += 1) total = total * (n - k + index) / index
        return total
      }

      let pool
      if (combinationCount(employees.length, size) <= 120000) {
        pool = employees.slice()
      } else {
        const cap = Math.min(employees.length, Math.max(18, size + 4))
        const shortlist = []
        const chosen = new Set()
        const bestPerDept = new Map()
        for (const row of ranked) {
          if (!bestPerDept.has(row.employee.dept)) bestPerDept.set(row.employee.dept, row.employee)
        }
        for (const employee of bestPerDept.values()) {
          if (!chosen.has(employee.id)) { chosen.add(employee.id); shortlist.push(employee) }
        }
        for (const row of ranked) {
          if (shortlist.length >= cap) break
          if (!chosen.has(row.employee.id)) { chosen.add(row.employee.id); shortlist.push(row.employee) }
        }
        pool = shortlist.slice(0, Math.max(size, cap))
      }
      if (pool.length < size) return null

      const results = []
      const indexes = new Array(size)
      const walk = (start, depth) => {
        if (depth === size) {
          const team = indexes.map(index => pool[index])
          const counts = {}
          let allowed = true
          for (const employee of team) {
            counts[employee.team] = (counts[employee.team] || 0) + 1
            if (counts[employee.team] > maxPerTeam) { allowed = false; break }
          }
          if (!allowed) return
          results.push(evaluateTeam(team, requirements, size, levelMaps))
          return
        }
        for (let index = start; index <= pool.length - (size - depth); index += 1) {
          indexes[depth] = index
          walk(index + 1, depth + 1)
        }
      }
      walk(0, 0)
      if (!results.length) return null

      results.sort((a, b) => b.score - a.score || b.coverage - a.coverage || b.availability - a.availability)
      const picked = []
      for (const result of results) {
        if (picked.length >= 3) break
        const ids = new Set(result.team.map(employee => employee.id))
        let overlap = false
        for (const previous of picked) {
          let shared = 0
          for (const employee of previous.team) if (ids.has(employee.id)) shared += 1
          if (shared > size - 2) { overlap = true; break }
        }
        if (!overlap) picked.push(result)
      }
      for (const result of results) {
        if (picked.length >= 3) break
        if (!picked.includes(result)) picked.push(result)
      }

      const ended = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
      return {
        results: picked,
        evaluated: results.length,
        elapsed: Math.max(1, Math.round(ended - started)),
        size,
        poolSize: pool.length,
        requirements,
        signature: JSON.stringify({ size, maxPerTeam, skills: requirements }),
      }
    }

    function orgImpact(team, employees) {
      const teams = new Map()
      for (const employee of employees) {
        if (!teams.has(employee.team)) teams.set(employee.team, { team: employee.team, dept: employee.dept, total: 0, after: 0, drawn: 0 })
        const row = teams.get(employee.team)
        row.total += employee.available
        row.after += employee.available
      }
      for (const employee of team) {
        const row = teams.get(employee.team)
        if (!row) continue
        row.after -= employee.available
        row.drawn += 1
      }
      return [...teams.values()]
        .filter(row => row.drawn > 0)
        .map(row => ({
          ...row,
          drawnPct: row.total ? Math.round((row.total - row.after) / row.total * 100) : 0,
          afterPct: row.total ? Math.round(row.after / row.total * 100) : 0,
        }))
        .sort((a, b) => b.drawnPct - a.drawnPct)
    }

    function backupCandidates(result, employees) {
      const selected = new Set(result.team.map(employee => employee.id))
      const gapNames = result.gaps.map(gap => gap.name)
      const scored = employees
        .filter(employee => !selected.has(employee.id))
        .map(employee => {
          const coveredGaps = gapNames.filter(name => {
            const gap = result.gaps.find(item => item.name === name)
            return gap && employeeLevel(employee, name) >= gap.min
          }).length
          return { employee, coveredGaps }
        })
        .filter(row => gapNames.length === 0 || row.coveredGaps > 0)
        .sort((a, b) => b.coveredGaps - a.coveredGaps || b.employee.available - a.employee.available)
      return scored.slice(0, 3)
    }

    /* ------------------------------------------------------------------- csv */

    function splitDelimitedLine(line, delimiter) {
      const cells = []
      let current = ''
      let quoted = false
      const separator = delimiter || ','
      for (let index = 0; index < line.length; index += 1) {
        const char = line[index]
        if (char === '"') {
          if (quoted && line[index + 1] === '"') { current += '"'; index += 1 } else quoted = !quoted
        } else if (char === separator && !quoted) {
          cells.push(current)
          current = ''
        } else {
          current += char
        }
      }
      cells.push(current)
      return cells
    }

    const HEADER_ALIASES = {
      name: ['name', '姓名', '员工', '员工姓名', '名字'],
      role: ['role', '职位', '岗位', '职务'],
      dept: ['department', 'dept', '部门', '中心', '事业部'],
      team: ['team', '团队', '小组', '组'],
      level: ['level', '职级', '级别', '等级'],
      available: ['availability', 'available', '可投入', '产能', '可用产能'],
      skills: ['skills', 'skill', '技能', '技能项', '技能清单'],
    }

    function parseEmployeeRows(rows) {
      if (!Array.isArray(rows) || !rows.length) return []
      const first = rows[0].map(cell => String(cell == null ? '' : cell).trim())
      const indexMap = {}
      first.forEach((cell, index) => {
        const key = cell.toLowerCase()
        for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
          if (aliases.includes(key) && indexMap[field] === undefined) indexMap[field] = index
        }
      })
      const hasHeader = indexMap.name !== undefined
      const dataRows = hasHeader ? rows.slice(1) : rows
      const pick = (row, field, fallback) => {
        const index = indexMap[field]
        const value = index === undefined ? (hasHeader ? '' : row[fallback]) : row[index]
        return String(value == null ? '' : value).trim()
      }
      const employees = []
      for (const row of dataRows) {
        const cells = Array.isArray(row) ? row : []
        const name = pick(cells, 'name', 0)
        if (!name) continue
        const availability = pick(cells, 'available', 5)
        const skillsText = indexMap.skills === undefined
          ? (hasHeader ? '' : cells.slice(6).join(','))
          : String(cells[indexMap.skills] == null ? '' : cells[indexMap.skills])
        const employee = normalizeEmployee({
          name,
          role: pick(cells, 'role', 1),
          dept: pick(cells, 'dept', 2),
          team: pick(cells, 'team', 3),
          level: pick(cells, 'level', 4),
          available: availability === '' ? 80 : clamp(Number(availability) || 0, 0, 100),
          skills: parseSkillCell(skillsText),
        }, employees.length)
        if (employee) employees.push(employee)
      }
      return employees
    }

    function parseSkillCell(text) {
      if (!text) return []
      const skills = []
      const seen = new Set()
      for (const chunk of String(text).split(/[|;；、]/)) {
        const item = chunk.trim()
        if (!item) continue
        let name = item
        let level = 3
        const colon = item.split(/[:：]/)
        if (colon.length >= 2) {
          name = colon.slice(0, -1).join(':').trim()
          level = Number(colon[colon.length - 1]) || 3
        } else {
          const spaced = /^(.*?)\s+(\d)$/.exec(item)
          if (spaced) { name = spaced[1].trim(); level = Number(spaced[2]) }
        }
        if (!name || seen.has(name)) continue
        seen.add(name)
        skills.push({ name, level: clamp(level, 1, 5) })
      }
      return skills
    }

    function parseCsv(text) {
      return parseDelimited(text, ',')
    }

    function parseDelimited(text, delimiter) {
      const lines = String(text || '').replace(/^\uFEFF/, '').split(/\r?\n/).map(line => line.trim()).filter(Boolean)
      if (!lines.length) return []
      return parseEmployeeRows(lines.map(line => splitDelimitedLine(line, delimiter)))
    }

    function parseTsv(text) {
      return parseDelimited(text, '\t')
    }

    function parseMarkdownTable(text) {
      const lines = String(text || '').split(/\r?\n/).map(line => line.trim()).filter(line => line.startsWith('|') && line.endsWith('|'))
      if (!lines.length) return []
      const rows = lines.map(line => line.slice(1, -1).split('|').map(cell => cell.trim()))
        .filter(row => !row.every(cell => /^:?-{3,}:?$/.test(cell)))
      return parseEmployeeRows(rows)
    }

    function parseJsonEmployees(text) {
      const data = JSON.parse(String(text || '').replace(/^\uFEFF/, ''))
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data && data.employees) ? data.employees
          : Array.isArray(data && data.people) ? data.people
            : Array.isArray(data && data.data) ? data.data
              : data && typeof data === 'object' ? [data] : []
      return list.map((raw, index) => normalizeEmployee(raw, index)).filter(Boolean)
    }

    function parseEmployeeFile(name, text) {
      const lower = String(name || '').toLowerCase()
      const trimmed = String(text || '').replace(/^\uFEFF/, '').trim()
      if (lower.endsWith('.json')) return parseJsonEmployees(trimmed)
      if (lower.endsWith('.tsv')) return parseTsv(trimmed)
      if (lower.endsWith('.md') || lower.endsWith('.markdown')) return parseMarkdownTable(trimmed)
      if (lower.endsWith('.csv')) return parseCsv(trimmed)
      if (lower.endsWith('.txt') || !lower.includes('.')) {
        const firstLine = trimmed.split(/\r?\n/)[0] || ''
        if (firstLine.includes('\t')) return parseTsv(trimmed)
        if (firstLine.trim().startsWith('|')) return parseMarkdownTable(trimmed)
      }
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          return parseJsonEmployees(trimmed)
        } catch (error) {
          /* Fall back to delimited text. */
        }
      }
      return parseCsv(trimmed)
    }

    function readZipU16(bytes, offset) {
      return bytes[offset] | (bytes[offset + 1] << 8)
    }

    function readZipU32(bytes, offset) {
      return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0
    }

    async function unzipXlsx(arrayBuffer) {
      const bytes = new Uint8Array(arrayBuffer)
      let eocd = -1
      const minimum = Math.max(0, bytes.length - 65557)
      for (let offset = bytes.length - 22; offset >= minimum; offset -= 1) {
        if (readZipU32(bytes, offset) === 0x06054b50) { eocd = offset; break }
      }
      if (eocd < 0) throw new Error('not a zip')
      const count = readZipU16(bytes, eocd + 10)
      let offset = readZipU32(bytes, eocd + 16)
      const entries = new Map()
      for (let index = 0; index < count; index += 1) {
        if (readZipU32(bytes, offset) !== 0x02014b50) break
        const method = readZipU16(bytes, offset + 10)
        const compressedSize = readZipU32(bytes, offset + 20)
        const nameLength = readZipU16(bytes, offset + 28)
        const extraLength = readZipU16(bytes, offset + 30)
        const commentLength = readZipU16(bytes, offset + 32)
        const localOffset = readZipU32(bytes, offset + 42)
        const name = new TextDecoder().decode(bytes.subarray(offset + 46, offset + 46 + nameLength))
        entries.set(name.replace(/\\/g, '/'), { method, compressedSize, localOffset })
        offset += 46 + nameLength + extraLength + commentLength
      }
      return { bytes, entries }
    }

    async function readZipEntry(zip, name) {
      const entry = zip.entries.get(name)
      if (!entry) return null
      const bytes = zip.bytes
      const local = entry.localOffset
      if (readZipU32(bytes, local) !== 0x04034b50) throw new Error('bad zip entry')
      const nameLength = readZipU16(bytes, local + 26)
      const extraLength = readZipU16(bytes, local + 28)
      const start = local + 30 + nameLength + extraLength
      const data = bytes.subarray(start, start + entry.compressedSize)
      if (entry.method === 0) return data
      if (entry.method !== 8) throw new Error('unsupported zip compression')
      if (typeof DecompressionStream !== 'function') throw new Error('xlsx decompression is unavailable')
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
      return new Uint8Array(await new Response(stream).arrayBuffer())
    }

    function columnIndexFromRef(ref) {
      const letters = (String(ref || '').match(/[A-Z]+/i) || [''])[0].toUpperCase()
      if (!letters) return -1
      let index = 0
      for (const char of letters) index = index * 26 + (char.charCodeAt(0) - 64)
      return index - 1
    }

    async function parseXlsx(arrayBuffer) {
      if (typeof DOMParser !== 'function') throw new Error('xlsx XML parser is unavailable')
      const zip = await unzipXlsx(arrayBuffer)
      const decoder = new TextDecoder()
      const sharedBytes = await readZipEntry(zip, 'xl/sharedStrings.xml')
      const shared = []
      if (sharedBytes) {
        const document = new DOMParser().parseFromString(decoder.decode(sharedBytes), 'application/xml')
        for (const item of [...document.getElementsByTagName('si')]) shared.push(item.textContent || '')
      }
      let sheetName = 'xl/worksheets/sheet1.xml'
      if (!zip.entries.has(sheetName)) {
        sheetName = [...zip.entries.keys()].find(name => /^xl\/worksheets\/[^/]+\.xml$/.test(name)) || ''
      }
      if (!sheetName) throw new Error('no worksheet')
      const sheetBytes = await readZipEntry(zip, sheetName)
      const document = new DOMParser().parseFromString(decoder.decode(sheetBytes), 'application/xml')
      const rows = []
      for (const row of [...document.getElementsByTagName('row')]) {
        const rowIndex = Number(row.getAttribute('r')) || rows.length + 1
        const cells = []
        for (const cell of [...row.getElementsByTagName('c')]) {
          const column = columnIndexFromRef(cell.getAttribute('r'))
          if (column < 0) continue
          const type = cell.getAttribute('t')
          let value = ''
          if (type === 'inlineStr') {
            const inline = cell.getElementsByTagName('is')[0]
            value = inline ? inline.textContent || '' : ''
          } else {
            const node = cell.getElementsByTagName('v')[0]
            const raw = node ? node.textContent || '' : ''
            value = type === 's' ? (shared[Number(raw)] || '') : raw
          }
          cells[column] = value
        }
        rows[rowIndex - 1] = cells
      }
      const matrix = rows.filter(Boolean).map(row => Array.from(row, cell => cell == null ? '' : String(cell)))
      return parseEmployeeRows(matrix)
    }

    function toCsv(employees) {
      const quote = value => {
        const text = String(value == null ? '' : value)
        return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text
      }
      const lines = ['姓名,职位,部门,团队,职级,可投入,技能']
      for (const employee of employees) {
        lines.push([
          quote(employee.name),
          quote(employee.role),
          quote(employee.dept),
          quote(employee.team),
          quote(employee.level),
          employee.available,
          quote(employee.skills.map(skill => skill.name + ':' + skill.level).join('|')),
        ].join(','))
      }
      return lines.join('\n')
    }

    /* ------------------------------------------------------------------ icons */

    const ICON_PATHS = {
      search: [['circle', { cx: 11, cy: 11, r: 7 }], ['path', { d: 'M20 20l-3.5-3.5' }]],
      plus: [['path', { d: 'M12 5v14M5 12h14' }]],
      download: [['path', { d: 'M12 4v11m0 0 4-4m-4 4-4-4' }], ['path', { d: 'M5 19h14' }]],
      upload: [['path', { d: 'M12 16V5m0 0 4 4m-4-4-4 4' }], ['path', { d: 'M5 19h14' }]],
      close: [['path', { d: 'M6 6l12 12M18 6L6 18' }]],
      users: [['circle', { cx: 9, cy: 8, r: 3 }], ['path', { d: 'M3 20c0-3 2.5-5 6-5s6 2 6 5' }], ['path', { d: 'M16 5.5a3 3 0 0 1 0 5.8' }], ['path', { d: 'M17.5 20c0-2-1-3.6-3-4.4' }]],
      org: [['circle', { cx: 12, cy: 5, r: 2.2 }], ['circle', { cx: 6, cy: 18.5, r: 2.2 }], ['circle', { cx: 18, cy: 18.5, r: 2.2 }], ['path', { d: 'M12 7.2v4.2M6 16.3v-2.4h12v2.4' }]],
      target: [['circle', { cx: 12, cy: 12, r: 8 }], ['circle', { cx: 12, cy: 12, r: 4 }], ['circle', { cx: 12, cy: 12, r: 0.9, fill: 'currentColor', stroke: 'none' }]],
      sparkle: [['path', { d: 'M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z' }], ['path', { d: 'M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z' }]],
      chevron: [['path', { d: 'M9 6l6 6-6 6' }]],
      check: [['path', { d: 'M5 13l4 4L19 7' }]],
      alert: [['path', { d: 'M12 4l9 16H3z' }], ['path', { d: 'M12 10v4' }], ['circle', { cx: 12, cy: 17, r: 0.9, fill: 'currentColor', stroke: 'none' }]],
      arrow: [['path', { d: 'M5 12h14m-6-6 6 6-6 6' }]],
      reset: [['path', { d: 'M4.5 10a8 8 0 1 1 2.2 6.6' }], ['path', { d: 'M4 4v6h6' }]],
      chart: [['path', { d: 'M4 20V11M10 20V4M16 20v-6M2 20h20' }]],
      grid: [['rect', { x: 4, y: 4, width: 7, height: 7, rx: 1.4 }], ['rect', { x: 13, y: 4, width: 7, height: 7, rx: 1.4 }], ['rect', { x: 4, y: 13, width: 7, height: 7, rx: 1.4 }], ['rect', { x: 13, y: 13, width: 7, height: 7, rx: 1.4 }]],
      pin: [['path', { d: 'M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z' }], ['circle', { cx: 12, cy: 11, r: 2 }]],
    }

    function Icon({ name, size }) {
      const paths = ICON_PATHS[name] || []
      return h('svg', {
        width: size || 16,
        height: size || 16,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        style: { display: 'block', flex: 'none' },
      }, paths.map((node, index) => h(node[0], { key: index, ...node[1] })))
    }

    function PanelIcon({ size }) {
      const edge = size || 18
      return h('svg', {
        width: edge, height: edge, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
      },
        h('circle', { key: 'a', cx: 12, cy: 5.4, r: 2.1 }),
        h('circle', { key: 'b', cx: 5.8, cy: 18.4, r: 2.1 }),
        h('circle', { key: 'c', cx: 18.2, cy: 18.4, r: 2.1 }),
        h('path', { key: 'd', d: 'M12 7.5v3.1M5.8 16.3v-2.6h12.4v2.6' }),
        h('circle', { key: 'e', cx: 12, cy: 12.4, r: 1.1, fill: 'currentColor', stroke: 'none' }),
      )
    }

    /* --------------------------------------------------------------- elements */

    function Btn({ children, onClick, tone, icon, small, title, disabled, type }) {
      const label = title || (typeof children === 'string' ? children : undefined)
      return h('button', {
        type: type || 'button',
        className: 'ot-btn' + (tone ? ' ot-btn-' + tone : '') + (small ? ' ot-btn-sm' : ''),
        onClick,
        title,
        disabled,
        'aria-label': label,
      }, icon ? h(Icon, { name: icon, size: small ? 13 : 15 }) : null, h('span', { className: 'ot-btn-label' }, children))
    }

    function LevelBar({ level, compact }) {
      const values = [1, 2, 3, 4, 5]
      return h('span', { className: 'ot-level' + (compact ? ' ot-level-sm' : ''), 'aria-label': 'Lv.' + level },
        values.map(value => h('i', {
          key: value,
          className: value <= level ? 'on' : '',
          style: value <= level ? { opacity: 0.35 + level * 0.13 } : undefined,
        })))
    }

    function SkillChip({ skill, tone }) {
      const meter = Math.ceil(skill.level / 5 * 3)
      return h('span', {
        className: 'ot-chip' + (tone ? ' ot-chip-' + tone : ''),
        title: skill.name + ' · Lv.' + skill.level,
      },
        h('span', { className: 'ot-chip-name' }, skill.name),
        h('span', { className: 'ot-chip-meter', 'aria-hidden': true },
          [1, 2, 3].map(value => h('i', { key: value, className: value <= meter ? 'on' : '' }))),
        h('span', { className: 'ot-chip-level' }, skill.level))
    }

    function Avatar({ employee, size }) {
      const edge = size || 40
      return h('span', {
        className: 'ot-avatar',
        style: {
          width: edge,
          height: edge,
          fontSize: Math.round(edge * 0.4),
          '--ot-dept': deptColor(employee.dept),
        },
        'aria-hidden': true,
      }, initials(employee.name))
    }

    function Availability({ value, label }) {
      return h('span', { className: 'ot-avail', 'data-tone': availabilityTone(value), 'aria-label': (label || '') + ' ' + value + '%' },
        h('span', { className: 'ot-avail-track' }, h('i', { style: { width: clamp(value, 0, 100) + '%' } })),
        h('span', { className: 'ot-avail-dot', 'aria-hidden': true }),
        h('span', { className: 'ot-avail-num' }, value + '%'))
    }

    function AdviceCard({ advice, t, onPlan, onSearch }) {
      const from = advice.learner ? employeeLevel(advice.learner, advice.skill) : null
      const mentorLevel = advice.mentor ? employeeLevel(advice.mentor, advice.skill) : null
      const diagnosis = advice.kind === 'gap'
        ? t('advice.gapDiagnosis', { min: advice.min, best: advice.best })
        : t('advice.soloDiagnosis', { min: advice.min, name: advice.holder ? advice.holder.name : '—' })
      return h('article', { className: 'ot-advice', 'data-action': advice.action },
        h('div', { className: 'ot-advice-head' },
          h('span', { className: 'ot-advice-skill' }, advice.skill),
          h('span', { className: 'ot-advice-badge' }, t('advice.action.' + advice.action))),
        h('p', { className: 'ot-advice-diagnosis' }, diagnosis),
        h('p', { className: 'ot-advice-reason' }, t('advice.reason.' + advice.action, { min: advice.min })),
        advice.learner ? h('div', { className: 'ot-advice-row' },
          h('span', { className: 'ot-advice-label' }, t('advice.learnerLabel')),
          h('span', { className: 'ot-advice-value' },
            advice.learner.name + ' · Lv.' + from + ' → Lv.' + advice.target)) : null,
        advice.mentor ? h('div', { className: 'ot-advice-row' },
          h('span', { className: 'ot-advice-label' }, t('advice.mentorLabel')),
          h('span', { className: 'ot-advice-value' },
            advice.mentor.name + ' · Lv.' + mentorLevel + ' · ' + t('advice.availability', { n: advice.mentor.available })))
          : h('div', { className: 'ot-advice-row' },
            h('span', { className: 'ot-advice-label' }, t('advice.mentorLabel')),
            h('span', { className: 'ot-advice-value' + (advice.action === 'upskill' ? '' : ' ot-warn') },
              advice.action === 'upskill' ? t('advice.selfStudy') : t('advice.noMentor', { min: advice.min }))),
        advice.weeks ? h('div', { className: 'ot-advice-row' },
          h('span', { className: 'ot-advice-label' }, t('advice.plan')),
          h('span', { className: 'ot-advice-value' }, t('advice.weeks', { n: advice.weeks }))) : null,
        h('div', { className: 'ot-advice-topics' },
          h('span', { className: 'ot-advice-label' }, t('advice.topics')),
          advice.topics.map(topic => h('span', { key: topic, className: 'ot-topic' }, topic))),
        advice.learner ? h('div', { className: 'ot-advice-actions' },
          h('button', {
            type: 'button',
            className: 'ot-link-btn ot-advice-open',
            onClick: () => { if (onPlan) onPlan(advice.learner, advice.skill) },
          }, t('train.openPlan')),
          h('button', {
            type: 'button',
            className: 'ot-link-btn ot-advice-search',
            onClick: () => { if (onSearch) onSearch(advice.learner, advice.skill) },
          }, t('search.openShort'))) : null,
      )
    }

    /* ------------------------------------------------------------------- page */

    function Page({ ctx }) {
      const localeSnapshot = React.useSyncExternalStore(
        useCallback(listener => ctx.locale.subscribe(listener), [ctx]),
        useCallback(() => ctx.locale.getSnapshot(), [ctx]),
        useCallback(() => ctx.locale.getSnapshot(), [ctx]),
      )
      const locale = (localeSnapshot && (localeSnapshot.locale || localeSnapshot.id)) || 'zh'
      const t = makeT(locale)

      const [data, setData] = useState(loadStored)
      const [tab, setTab] = useState('project')
      const [query, setQuery] = useState('')
      const [deptFilter, setDeptFilter] = useState('all')
      const [onlyAvailable, setOnlyAvailable] = useState(false)
      const [sortBy, setSortBy] = useState('name')
      const [selectedId, setSelectedId] = useState(null)
      const [compact, setCompact] = useState(false)
      const detailRef = useRef(null)
      const openerRef = useRef(null)
      const [importOpen, setImportOpen] = useState(false)
      const [importText, setImportText] = useState('')
      const [importNote, setImportNote] = useState(null)
      const [importFileName, setImportFileName] = useState('')
      const [importBusy, setImportBusy] = useState(false)
      const fileInputRef = useRef(null)
      const [resetAsk, setResetAsk] = useState(false)
      const [note, setNote] = useState(null)
      const [orgTeamName, setOrgTeamName] = useState(null)
      const [plan, setPlan] = useState(() => data.plan)
      const [result, setResult] = useState(null)
      const [expanded, setExpanded] = useState(0)
      const [skillCatalog, setSkillCatalog] = useState(null)
      const [skillCatalogStatus, setSkillCatalogStatus] = useState('idle')
      const [skillCatalogError, setSkillCatalogError] = useState('')
      const [skillCenterOpen, setSkillCenterOpen] = useState(false)
      const [skillQuery, setSkillQuery] = useState('')
      const [skillPicked, setSkillPicked] = useState([])
      const [manualSkill, setManualSkill] = useState('')
      const [trainingNote, setTrainingNote] = useState(null)
      const [statDetail, setStatDetail] = useState(null)
      const skillCenterRef = useRef(null)
      const skillSearchInputRef = useRef(null)
      const skillSearchSeq = useRef(0)
      const [skillSearchOpen, setSkillSearchOpen] = useState(false)
      const [skillSearchTargetId, setSkillSearchTargetId] = useState(null)
      const [skillSearchQuery, setSkillSearchQuery] = useState('')
      const [skillSearchStatus, setSkillSearchStatus] = useState('idle')
      const [skillSearchCenter, setSkillSearchCenter] = useState([])
      const [skillSearchGithub, setSkillSearchGithub] = useState([])
      const [skillSearchError, setSkillSearchError] = useState('')
      const [skillSearchNote, setSkillSearchNote] = useState(null)
      const [projectFormOpen, setProjectFormOpen] = useState(false)
      const [projectName, setProjectName] = useState('')
      const [projectOutcome, setProjectOutcome] = useState('')
      const [projectIssues, setProjectIssues] = useState('')
      const [projectAdjustment, setProjectAdjustment] = useState('')
      const [projectNote, setProjectNote] = useState(null)
      const [showAllRequirements, setShowAllRequirements] = useState(false)
      const [projectProgressId, setProjectProgressId] = useState(null)
      const [poolName, setPoolName] = useState('')
      const [poolMin, setPoolMin] = useState('3')
      const [poolWeight, setPoolWeight] = useState('2')
      const [poolNote, setPoolNote] = useState('')
      const [poolProjectId, setPoolProjectId] = useState('')
      const [poolStatus, setPoolStatus] = useState(null)
      const [poolStatusTone, setPoolStatusTone] = useState('good')

      const employees = data.employees
      const history = data.history
      const training = data.training || {}
      const org = useMemo(() => buildOrg(employees), [employees])
      const skillNames = useMemo(() => allSkillNames(employees).sort((a, b) => a.localeCompare(b, 'zh')), [employees])
      const teams = useMemo(() => org.flatMap(dept => dept.teams), [org])

      useEffect(() => {
        saveStored({ employees, plan, history, training, projects: data.projects || [], requirementPool: data.requirementPool || [] })
      }, [employees, plan, history, training, data.projects, data.requirementPool])

      useEffect(() => {
        if (!note) return undefined
        const timer = window.setTimeout(() => setNote(null), 4200)
        return () => window.clearTimeout(timer)
      }, [note])

      useEffect(() => {
        if (selectedId === null) return undefined
        const onKey = event => {
          if (event.key === 'Escape') setSelectedId(null)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [selectedId])

      useEffect(() => {
        if (typeof window.matchMedia !== 'function') return undefined
        const media = window.matchMedia('(max-width: 1279px)')
        const update = () => setCompact(media.matches)
        update()
        if (media.addEventListener) {
          media.addEventListener('change', update)
          return () => media.removeEventListener('change', update)
        }
        media.addListener(update)
        return () => media.removeListener(update)
      }, [])

      useEffect(() => {
        if (selectedId !== null) {
          const card = document.querySelector('.ot-card[aria-controls="ot-employee-detail"]')
          if (card) openerRef.current = card
          const node = detailRef.current
          if (node) node.focus()
          return
        }
        const opener = openerRef.current
        openerRef.current = null
        if (opener && opener.isConnected) opener.focus()
      }, [selectedId])

      const onDetailKeyDown = event => {
        if (!compact || event.key !== 'Tab' || !detailRef.current) return
        const nodes = [...detailRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === detailRef.current)) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }

      useEffect(() => {
        setResult(null)
      }, [employees])

      useEffect(() => {
        setSkillCenterOpen(false)
        setSkillQuery('')
        setSkillPicked([])
        setManualSkill('')
        setTrainingNote(null)
      }, [selectedId])

      useEffect(() => {
        setStatDetail(null)
      }, [tab])

      const stats = useMemo(() => {
        const teamSet = new Set(employees.map(employee => employee.team))
        return {
          people: employees.length,
          teams: teamSet.size,
          skills: skillNames.length,
          capacity: Math.round(employees.reduce((sum, employee) => sum + employee.available, 0) / 100 * 10) / 10,
        }
      }, [employees, skillNames])

      const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()
        const rows = employees.filter(employee => {
          if (deptFilter !== 'all' && employee.dept !== deptFilter) return false
          if (onlyAvailable && employee.available < 50) return false
          if (!needle) return true
          const haystack = [
            employee.name, employee.role, employee.dept, employee.team, employee.focus,
            ...employee.skills.map(skill => skill.name),
          ].join(' ').toLowerCase()
          return haystack.includes(needle)
        })
        if (sortBy === 'available') rows.sort((a, b) => b.available - a.available)
        else if (sortBy === 'skills') rows.sort((a, b) => b.skills.length - a.skills.length || a.name.localeCompare(b.name, 'zh'))
        else rows.sort((a, b) => a.name.localeCompare(b.name, 'zh'))
        return rows
      }, [employees, deptFilter, onlyAvailable, query, sortBy])

      const selected = selectedId === null ? null : employees.find(employee => employee.id === selectedId) || null
      const projects = Array.isArray(data.projects) ? data.projects : []
      const requirementPool = Array.isArray(data.requirementPool) ? data.requirementPool : []
      const selectedPoolProject = projects.find(project => project.id === poolProjectId) || projects[0] || null

      const activeTeam = useMemo(() => {
        if (!teams.length) return null
        return teams.find(team => team.name === orgTeamName) || teams[0]
      }, [teams, orgTeamName])

      const allDepts = org.map(dept => dept.name)

      const planSignature = useMemo(() => JSON.stringify({
        size: plan.size, maxPerTeam: plan.maxPerTeam, skills: requirementList(plan),
      }), [plan])
      const dirty = result !== null && result.signature !== planSignature
      const remainingSkills = skillNames.filter(name => !plan.skills.some(skill => skill.name === name))

      const run = (record) => {
        const requirements = requirementList(plan)
        if (!requirements.length) {
          setNote(t('match.reqEmpty'))
          return
        }
        const computed = runMatching(employees, plan)
        if (!computed) {
          setNote(t('match.noCombo'))
          return
        }
        setResult(computed)
        setExpanded(0)
        if (record) {
          const top = computed.results[0]
          const entry = {
            ts: Date.now(),
            name: plan.name || t('match.title'),
            size: computed.size,
            score: top ? top.score : 0,
            memberNames: top ? top.team.map(employee => employee.name) : [],
            plan: { ...plan, skills: plan.skills.map(skill => ({ ...skill })) },
          }
          setData(previous => ({ ...previous, history: [entry, ...previous.history].slice(0, 5) }))
        }
      }

      const updatePlan = patch => setPlan(previous => ({ ...previous, ...patch }))

      const updateSkill = (index, patch) => setPlan(previous => ({
        ...previous,
        skills: previous.skills.map((skill, position) => position === index ? { ...skill, ...patch } : skill),
      }))

      const addSkill = () => {
        const used = new Set(plan.skills.map(skill => skill.name))
        const next = skillNames.find(name => !used.has(name))
        if (!next) return
        setPlan(previous => ({ ...previous, skills: [...previous.skills, { name: next, min: 3, weight: 2 }] }))
      }

      const removeSkill = index => setPlan(previous => ({
        ...previous,
        skills: previous.skills.filter((skill, position) => position !== index),
      }))

      const openImport = () => {
        setImportOpen(true)
        setImportNote(null)
        setImportFileName('')
        setTab('talent')
      }

      const loadImportFile = async file => {
        if (!file) return
        setImportBusy(true)
        setImportNote(null)
        setImportFileName(file.name)
        try {
          const lower = String(file.name || '').toLowerCase()
          const parsed = lower.endsWith('.xlsx')
            ? await parseXlsx(await file.arrayBuffer())
            : parseEmployeeFile(file.name, await file.text())
          if (!parsed.length) throw new Error(t('import.bad'))
          setImportText(toCsv(parsed))
          setImportNote({ tone: 'good', text: t('import.fileLoaded', { name: file.name, n: parsed.length }) })
        } catch (error) {
          setImportNote({
            tone: 'bad',
            text: t('import.fileFailed', { error: error && error.message ? error.message : 'unknown' }),
          })
        } finally {
          setImportBusy(false)
        }
      }

      const handleFilePick = event => {
        const file = event.target.files && event.target.files[0]
        if (file) void loadImportFile(file)
        event.target.value = ''
      }

      const handleImportDrop = event => {
        event.preventDefault()
        const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]
        if (file) void loadImportFile(file)
      }

      const doImport = () => {
        if (importBusy) return
        const parsed = parseCsv(importText)
        if (!parsed.length) {
          setImportNote({ tone: 'bad', text: t('import.bad') })
          return
        }
        const merged = employees.slice()
        for (const employee of parsed) {
          const index = merged.findIndex(existing => existing.name === employee.name)
          if (index === -1) merged.push({ ...employee, id: 'e' + Date.now().toString(36) + merged.length })
          else merged[index] = { ...employee, id: merged[index].id }
        }
        setData(previous => ({ ...previous, employees: merged }))
        setImportText('')
        setImportFileName('')
        setImportNote({ tone: 'good', text: t('import.done', { n: parsed.length }) })
        setNote(t('import.done', { n: parsed.length }))
      }

      const doExport = () => {
        try {
          const csv = toCsv(employees)
          const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'org-talent-' + new Date().toISOString().slice(0, 10) + '.csv'
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.setTimeout(() => URL.revokeObjectURL(url), 2000)
          setNote(t('import.exported'))
        } catch (error) {
          setNote(t('import.exportFailed'))
        }
      }

      const doReset = () => {
        setData(previous => ({ ...previous, employees: seedEmployees(), history: [], training: {}, projects: [], requirementPool: seedRequirementPool() }))
        setResetAsk(false)
        setImportNote(null)
        setImportFileName('')
        setImportOpen(false)
        setSelectedId(null)
        setNote(t('import.resetDone'))
      }

      const loadHistory = entry => {
        const next = normalizePlan(entry.plan)
        setPlan(next)
        const computed = runMatching(employees, next)
        setResult(computed)
        setExpanded(0)
      }

      const trainingFor = employee => {
        if (!employee) return []
        const defaultSkill = defaultTrainingSkill(employee)
        return Array.isArray(training[employee.id])
          ? training[employee.id]
          : (defaultSkill ? [defaultSkill] : [])
      }
      const defaultTraining = selected ? defaultTrainingSkill(selected) : ''
      const trainingSkills = trainingFor(selected)

      const setTrainingSkills = next => {
        if (!selected) return
        setData(previous => ({
          ...previous,
          training: { ...(previous.training || {}), [selected.id]: next },
        }))
      }

      const addTrainingSkills = names => {
        const merged = [...trainingSkills]
        for (const rawName of names) {
          const name = String(rawName || '').trim()
          if (name && !merged.includes(name)) merged.push(name)
        }
        setTrainingSkills(merged)
      }

      const removeTrainingSkill = name => {
        setTrainingSkills(trainingSkills.filter(item => item !== name))
      }

      const useVertical = () => {
        const strongest = selected
          ? selected.skills.find(skill => skill.name === defaultTrainingSkill(selected)) || strongestSkill(selected)
          : null
        if (!strongest) {
          setTrainingNote(t('train.noBase'))
          return
        }
        setTrainingSkills([strongest.name])
        setTrainingNote(null)
      }

      const openPlan = (member, skill) => {
        if (!member) return
        if (skill) {
          setData(previous => ({
            ...previous,
            training: { ...(previous.training || {}), [member.id]: [skill] },
          }))
        }
        setSelectedId(member.id)
        setTab('talent')
      }

      const loadSkillCatalog = async () => {
        if (skillCatalog) return skillCatalog
        setSkillCatalogStatus('loading')
        setSkillCatalogError('')
        try {
          const entries = await fetchSkillCenterCatalog()
          setSkillCatalog(entries)
          setSkillCatalogStatus('ready')
          return entries
        } catch (error) {
          setSkillCatalogStatus('error')
          setSkillCatalogError(error && error.message ? error.message : 'unavailable')
          return []
        }
      }

      const openSkillCenter = () => {
        setSkillCenterOpen(true)
        setSkillPicked(trainingSkills.slice())
        if (!skillCatalog) void loadSkillCatalog()
        window.setTimeout(() => {
          if (skillCenterRef.current && typeof skillCenterRef.current.scrollIntoView === 'function') {
            skillCenterRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          }
        }, 40)
      }

      const toggleSkillPick = name => {
        setSkillPicked(previous => previous.includes(name)
          ? previous.filter(item => item !== name)
          : [...previous, name])
      }

      const addPickedSkills = () => {
        addTrainingSkills(skillPicked)
        setSkillPicked([])
        setSkillCenterOpen(false)
      }

      const addManualSkill = () => {
        const name = manualSkill.trim()
        if (!name) return
        addTrainingSkills([name])
        setManualSkill('')
      }

      const randomTraining = async () => {
        let entries = skillCatalog
        if (!entries || !entries.length) entries = await loadSkillCatalog()
        const source = entries.length ? entries.map(entry => entry.name) : trainingSkills
        if (!source.length) {
          setTrainingNote(t('train.randomEmpty'))
          return
        }
        const shuffled = source.slice()
        for (let index = shuffled.length - 1; index > 0; index -= 1) {
          const target = Math.floor(Math.random() * (index + 1))
          const swap = shuffled[index]
          shuffled[index] = shuffled[target]
          shuffled[target] = swap
        }
        const count = Math.min(shuffled.length, 1 + Math.floor(Math.random() * 3))
        setTrainingSkills(shuffled.slice(0, count))
        setTrainingNote(t('train.randomDone', { n: count }))
      }

      const runSkillSearch = async rawQuery => {
        const needle = String(rawQuery || '').trim()
        if (!needle) {
          setSkillSearchStatus('idle')
          setSkillSearchCenter([])
          setSkillSearchGithub([])
          setSkillSearchError('')
          return
        }
        const seq = ++skillSearchSeq.current
        setSkillSearchStatus('loading')
        setSkillSearchError('')
        setSkillSearchNote(null)
        setSkillSearchCenter([])
        setSkillSearchGithub([])
        const lower = needle.toLowerCase()
        let center = []
        try {
          let entries = skillCatalog
          if (!entries || !entries.length) entries = await loadSkillCatalog()
          center = entries.filter(entry => [entry.name, entry.description, entry.group].join(' ').toLowerCase().includes(lower))
        } catch (error) {
          center = []
        }
        if (seq !== skillSearchSeq.current) return
        setSkillSearchCenter(center)
        let github = []
        let githubError = ''
        try {
          github = await searchGitHubRepositories(needle)
        } catch (error) {
          githubError = error && error.message ? error.message : 'GitHub'
        }
        if (seq !== skillSearchSeq.current) return
        setSkillSearchGithub(github)
        setSkillSearchError(githubError)
        setSkillSearchStatus('ready')
      }

      const openSkillSearch = (employee, skill) => {
        const target = typeof employee === 'string'
          ? employees.find(item => item.id === employee)
          : employee
        if (!target) return
        const query = String(skill || '').trim()
        setSkillSearchTargetId(target.id)
        setSkillSearchOpen(true)
        setSkillSearchQuery(query)
        setSkillSearchNote(null)
        setSkillSearchError('')
        if (query) void runSkillSearch(query)
        else {
          setSkillSearchStatus('idle')
          setSkillSearchCenter([])
          setSkillSearchGithub([])
        }
      }

      const closeSkillSearch = () => {
        skillSearchSeq.current += 1
        setSkillSearchOpen(false)
        setSkillSearchStatus('idle')
        setSkillSearchCenter([])
        setSkillSearchGithub([])
        setSkillSearchError('')
        setSkillSearchNote(null)
      }

      useEffect(() => {
        if (!skillSearchOpen) return undefined
        const timer = window.setTimeout(() => {
          if (skillSearchInputRef.current) skillSearchInputRef.current.focus()
        }, 30)
        const onKeyDown = event => {
          if (event.key === 'Escape') setSkillSearchOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => {
          window.clearTimeout(timer)
          window.removeEventListener('keydown', onKeyDown)
        }
      }, [skillSearchOpen])

      const addSearchToTraining = name => {
        const target = employees.find(employee => employee.id === skillSearchTargetId)
        if (!target) return
        const clean = String(name || '').trim()
        if (!clean) return
        const current = trainingFor(target)
        if (current.includes(clean)) {
          setSkillSearchNote(t('search.alreadyTraining', { skill: clean }))
          return
        }
        setData(previous => ({
          ...previous,
          training: { ...(previous.training || {}), [target.id]: [...current, clean] },
        }))
        setSkillSearchNote(t('search.trainingAdded', { skill: clean, name: target.name }))
      }

      const addSearchToEmployee = name => {
        const target = employees.find(employee => employee.id === skillSearchTargetId)
        if (!target) return
        const clean = String(name || '').trim().slice(0, 80)
        if (!clean) return
        if (employeeLevel(target, clean) > 0) {
          setSkillSearchNote(t('search.alreadySkill', { skill: clean }))
          return
        }
        setData(previous => ({
          ...previous,
          employees: previous.employees.map(employee => employee.id === target.id
            ? {
              ...employee,
              updated: new Date().toISOString().slice(0, 7),
              skills: [...employee.skills, { name: clean, level: 1 }],
            }
            : employee),
        }))
        setSkillSearchNote(t('search.skillAdded', { skill: clean, name: target.name }))
      }

      const trainingStatus = (() => {
        if (!selected) return null
        const strongest = selected.skills.find(skill => skill.name === defaultTrainingSkill(selected)) || strongestSkill(selected)
        if (!trainingSkills.length) {
          return { tone: 'empty', key: 'empty', title: t('train.empty'), hint: t('train.emptyHint'), strongest }
        }
        if (trainingSkills.length > 1) {
          return { tone: 'warn', key: 'multi', title: t('train.warnMulti'), hint: t('train.warnMultiHint', { n: trainingSkills.length }), strongest }
        }
        const skill = trainingSkills[0]
        const level = employeeLevel(selected, skill)
        if (level === 0) {
          return { tone: 'warn', key: 'new', title: t('train.warnNew'), hint: t('train.warnNewHint', { skill }), strongest, skill, level }
        }
        if (level < 2) {
          return { tone: 'warn', key: 'foundation', title: t('train.warnFoundation'), hint: t('train.warnFoundationHint', { skill, level }), strongest, skill, level }
        }
        if (level >= 5) {
          return { tone: 'ok', key: 'max', title: t('train.max'), hint: t('train.maxHint', { skill }), strongest, skill, level, target: 5, weeks: 0, topics: skillTopics(skill, locale), mentor: null }
        }
        const target = Math.min(5, level + 1)
        const weeks = level >= 4 ? 5 : 4
        const mentor = pickMentor(employees, skill, target, new Set([selected.id]))
        return {
          tone: 'ok',
          key: 'vertical',
          title: t('train.vertical'),
          hint: t('train.verticalHint', { skill, from: level, to: target, n: weeks }),
          strongest,
          skill,
          level,
          target,
          weeks,
          topics: skillTopics(skill, locale),
          mentor,
        }
      })()

      const skillSearchTarget = skillSearchTargetId
        ? employees.find(employee => employee.id === skillSearchTargetId) || null
        : null
      const skillSearchTargetTraining = skillSearchTarget ? trainingFor(skillSearchTarget) : []
      const topResult = result && result.results && result.results.length ? result.results[0] : null
      const activeProjectPlan = result && result.plan ? result.plan : plan
      const projectKey = topResult ? projectKeyFor(activeProjectPlan, topResult.team) : ''
      const savedProject = projectKey ? projects.find(project => project.id === projectKey) || null : null
      const defaultProjectName = t('project.defaultName', {
        goal: (activeProjectPlan.goal || activeProjectPlan.name || t('project.untitled')).slice(0, 32),
      })
      const projectNameValue = projectName.trim() || (savedProject && savedProject.name) || defaultProjectName
      const projectMembers = topResult
        ? topResult.team.map(member => {
          const covers = requirementList(activeProjectPlan)
            .filter(requirement => employeeLevel(member, requirement.name) >= requirement.min)
            .map(requirement => requirement.name)
          return { member, covers }
        })
        : []
      const projectStatus = savedProject
        ? (!savedProject.startedAt ? 'notStarted' : savedProject.feedback.length ? 'reviewed' : 'active')
        : 'pending'

      const saveProject = withFeedback => {
        if (!topResult) return
        const name = projectName.trim() || (savedProject && savedProject.name) || defaultProjectName
        let feedback = null
        if (withFeedback) {
          const outcome = projectOutcome.trim()
          const issues = projectIssues.trim()
          const adjustment = projectAdjustment.trim()
          if (!outcome && !issues && !adjustment) {
            setProjectNote(t('project.emptyFeedback'))
            return
          }
          feedback = {
            id: 'fb-' + Date.now().toString(36),
            at: new Date().toISOString(),
            outcome: outcome.slice(0, 4000),
            issues: issues.slice(0, 4000),
            adjustment: adjustment.slice(0, 4000),
          }
        }
        const now = new Date().toISOString()
        const snapshotRequirements = (activeProjectPlan.skills || []).map(skill => ({ name: skill.name, min: skill.min }))
        setData(previous => {
          const currentProjects = Array.isArray(previous.projects) ? previous.projects : []
          const existing = currentProjects.find(project => project.id === projectKey)
          const next = existing
            ? {
              ...existing,
              name,
              goal: activeProjectPlan.goal || activeProjectPlan.name || existing.goal,
              memberIds: topResult.team.map(member => member.id),
              updatedAt: now,
              requirements: Array.isArray(existing.requirements) && existing.requirements.length ? existing.requirements : snapshotRequirements,
              feedback: feedback ? [...existing.feedback, feedback] : existing.feedback,
            }
            : {
              id: projectKey,
              name,
              goal: activeProjectPlan.goal || activeProjectPlan.name || '',
              memberIds: topResult.team.map(member => member.id),
              createdAt: now,
              updatedAt: now,
              startedAt: '',
              dueAt: '',
              requirements: snapshotRequirements,
              tasks: [],
              feedback: feedback ? [feedback] : [],
            }
          return { ...previous, projects: [next, ...currentProjects.filter(project => project.id !== projectKey)].slice(0, 20) }
        })
        setProjectNote(withFeedback ? t('project.feedbackSaved') : t('project.created'))
        if (withFeedback) {
          setProjectOutcome('')
          setProjectIssues('')
          setProjectAdjustment('')
          setProjectFormOpen(false)
        }
      }

      useEffect(() => {
        setProjectFormOpen(false)
        setProjectName('')
        setProjectOutcome('')
        setProjectIssues('')
        setProjectAdjustment('')
        setProjectNote(null)
      }, [projectKey])

      const projectRequirements = project => (Array.isArray(project.requirements) && project.requirements.length
        ? project.requirements
        : (plan.skills || []).map(skill => ({ name: skill.name, min: skill.min }))
      ).slice(0, 5)

      const buildWorkspaceTasks = project => {
        const members = (project.memberIds || [])
          .map(id => employees.find(employee => employee.id === id))
          .filter(Boolean)
        const requirements = projectRequirements(project)
        const lead = members.slice().sort((a, b) =>
          employeeLevel(b, '项目管理') - employeeLevel(a, '项目管理')
          || employeeLevel(b, '需求分析') - employeeLevel(a, '需求分析')
          || b.available - a.available)[0] || members[0] || null
        const bestFor = skill => members.slice().sort((a, b) =>
          employeeLevel(b, skill) - employeeLevel(a, skill)
          || b.available - a.available)[0] || lead
        const now = new Date().toISOString()
        const stamp = Date.now().toString(36)
        const tasks = []
        tasks.push({
          id: 'task-' + stamp + '-0',
          title: t('workspace.task.kickoff'),
          assigneeId: lead ? lead.id : '',
          assigneeName: lead ? lead.name : '',
          status: 'doing',
          createdAt: now,
        })
        requirements.forEach((requirement, index) => {
          const assignee = bestFor(requirement.name)
          tasks.push({
            id: 'task-' + stamp + '-' + (index + 1),
            title: t('workspace.task.deliver', { skill: requirement.name, min: requirement.min }),
            assigneeId: assignee ? assignee.id : '',
            assigneeName: assignee ? assignee.name : '',
            status: 'todo',
            createdAt: now,
          })
        })
        tasks.push({
          id: 'task-' + stamp + '-' + (requirements.length + 1),
          title: t('workspace.task.review'),
          assigneeId: lead ? lead.id : '',
          assigneeName: lead ? lead.name : '',
          status: 'todo',
          createdAt: now,
        })
        return tasks
      }

      const startProject = project => {
        if (!project) return
        if (project.startedAt && Array.isArray(project.tasks) && project.tasks.length) {
          setTab('workspace')
          setNote(t('workspace.already'))
          return
        }
        const tasks = buildWorkspaceTasks(project)
        const now = new Date().toISOString()
        const requirementCount = projectRequirements(project).length
        const durationDays = Math.max(7, 7 + requirementCount * 4)
        const dueAt = new Date(Date.now() + durationDays * 86400000).toISOString()
        setData(previous => ({
          ...previous,
          projects: (Array.isArray(previous.projects) ? previous.projects : []).map(item =>
            item.id === project.id
              ? { ...item, startedAt: now, dueAt, updatedAt: now, tasks }
              : item),
        }))
        setTab('workspace')
        setNote(t('workspace.started', { name: project.name || t('project.untitled') }))
      }

      const toggleTask = (projectId, taskId) => {
        const nextStatus = { todo: 'doing', doing: 'done', done: 'todo' }
        setData(previous => ({
          ...previous,
          projects: (Array.isArray(previous.projects) ? previous.projects : []).map(project =>
            project.id === projectId
              ? {
                ...project,
                updatedAt: new Date().toISOString(),
                tasks: (project.tasks || []).map(task =>
                  task.id === taskId ? { ...task, status: nextStatus[task.status] || 'todo' } : task),
              }
              : project),
        }))
      }

      const setPoolNotice = (text, tone) => {
        setPoolStatus(text)
        setPoolStatusTone(tone || 'good')
      }

      const addPoolRequirement = () => {
        const name = poolName.trim().slice(0, 80)
        if (!name) {
          setPoolNotice(t('pool.needName'), 'bad')
          return
        }
        if (requirementPool.some(item => item.name === name)) {
          setPoolNotice(t('pool.duplicate'), 'bad')
          return
        }
        const item = {
          id: 'req-' + Date.now().toString(36),
          name,
          min: clamp(Number(poolMin) || 3, 1, 5),
          weight: clamp(Number(poolWeight) || 2, 1, 3),
          note: poolNote.trim().slice(0, 800),
          createdAt: new Date().toISOString(),
        }
        setData(previous => ({
          ...previous,
          requirementPool: [...(previous.requirementPool || []), item],
        }))
        setPoolName('')
        setPoolNote('')
        setPoolNotice(t('pool.added', { name }))
      }

      const removePoolRequirement = id => {
        const item = requirementPool.find(requirement => requirement.id === id)
        setData(previous => ({
          ...previous,
          requirementPool: (previous.requirementPool || []).filter(requirement => requirement.id !== id),
        }))
        if (item) setPoolNotice(t('pool.removed', { name: item.name }))
      }

      const referencePoolToPlan = item => {
        if (plan.skills.some(skill => skill.name === item.name)) {
          setPoolNotice(t('pool.alreadyPlan', { name: item.name }), 'bad')
          return
        }
        setPlan(previous => ({
          ...previous,
          skills: [...previous.skills, { name: item.name, min: item.min, weight: item.weight }],
        }))
        setPoolNotice(t('pool.addedPlan', { name: item.name }))
      }

      const referencePoolToProject = item => {
        if (!selectedPoolProject) {
          setPoolNotice(t('pool.noProjects'), 'bad')
          return
        }
        const existing = (selectedPoolProject.requirements || []).some(requirement => requirement.name === item.name)
        if (existing) {
          setPoolNotice(t('pool.alreadyProject', { name: item.name, project: selectedPoolProject.name }), 'bad')
          return
        }
        const now = new Date().toISOString()
        setData(previous => ({
          ...previous,
          projects: (previous.projects || []).map(project =>
            project.id === selectedPoolProject.id
              ? {
                ...project,
                updatedAt: now,
                requirements: [...(project.requirements || []), { name: item.name, min: item.min, weight: item.weight }],
              }
              : project),
        }))
        setPoolNotice(t('pool.addedProject', { name: item.name, project: selectedPoolProject.name }))
      }

      const catalogEntries = (skillCatalog || []).slice()
      for (const name of trainingSkills) {
        if (!catalogEntries.some(entry => entry.name === name)) {
          catalogEntries.push({ name, description: t('train.currentHint'), group: t('train.currentGroup') })
        }
      }
      const filteredCatalog = catalogEntries.filter(entry => {
        const needle = skillQuery.trim().toLowerCase()
        if (!needle) return true
        return [entry.name, entry.description, entry.group].join(' ').toLowerCase().includes(needle)
      })
      const catalogGroups = []
      for (const entry of filteredCatalog) {
        const title = entry.group || t('train.otherGroup')
        let group = catalogGroups.find(item => item.title === title)
        if (!group) {
          group = { title, skills: [] }
          catalogGroups.push(group)
        }
        group.skills.push(entry)
      }

      /* ---------------------------------------------------------- workbench */

      const renderCard = employee => h('button', {
        key: employee.id,
        type: 'button',
        className: 'ot-card',
        style: { '--ot-dept': deptColor(employee.dept) },
        'data-on': employee.id === selectedId ? '' : undefined,
        'aria-expanded': employee.id === selectedId,
        'aria-controls': employee.id === selectedId ? 'ot-employee-detail' : undefined,
        onClick: () => setSelectedId(employee.id),
      },
        h('div', { className: 'ot-card-head' },
          h(Avatar, { employee }),
          h('div', { className: 'ot-card-id' },
            h('div', { className: 'ot-name' },
              h('span', { className: 'ot-name-text' }, employee.name),
              h('span', { className: 'ot-level-pill' }, employee.level)),
            h('div', { className: 'ot-role' }, employee.role)),
        ),
        h('div', { className: 'ot-meta' },
          h('span', { className: 'ot-dept-dot', 'aria-hidden': true }),
          h('span', null, employee.dept + ' · ' + employee.team)),
        h('div', { className: 'ot-avail-row' },
          h(Availability, { value: employee.available, label: t('org.capacity') })),
        h('div', { className: 'ot-card-skills' },
          employee.skills.slice(0, 3).map(skill => h(SkillChip, { key: skill.name, skill })),
          employee.skills.length > 3 ? h('span', { className: 'ot-more' }, '+' + (employee.skills.length - 3)) : null),
        employee.focus ? h('div', { className: 'ot-focus' }, h('span', null, t('employee.focus') + ' · '), employee.focus) : null,
      )

      const skillCenterPanel = skillCenterOpen ? h('div', { className: 'ot-skill-center', ref: skillCenterRef },
        h('div', { className: 'ot-skill-center-head' },
          h('input', {
            className: 'ot-input',
            type: 'search',
            value: skillQuery,
            placeholder: t('train.search'),
            'aria-label': t('train.search'),
            onChange: event => setSkillQuery(event.target.value),
          }),
          h('button', { type: 'button', className: 'ot-icon-btn', 'aria-label': t('common.close'), onClick: () => setSkillCenterOpen(false) },
            h(Icon, { name: 'close' }))),
        skillCatalogStatus === 'loading' ? h('p', { className: 'ot-hint' }, t('train.centerLoading')) : null,
        skillCatalogStatus === 'error' ? h('p', { className: 'ot-hint ot-bad', role: 'status' }, t('train.centerError', { error: skillCatalogError })) : null,
        skillCatalogStatus === 'ready' && !filteredCatalog.length ? h('p', { className: 'ot-hint' }, t('train.centerEmpty')) : null,
        catalogGroups.length ? h('div', { className: 'ot-skill-groups' },
          catalogGroups.map(group => h('div', { key: group.title, className: 'ot-skill-group' },
            h('div', { className: 'ot-skill-group-title' }, group.title),
            group.skills.map(entry => h('label', { key: entry.name, className: 'ot-skill-option' },
              h('input', {
                type: 'checkbox',
                checked: skillPicked.includes(entry.name),
                onChange: () => toggleSkillPick(entry.name),
              }),
              h('span', { className: 'ot-skill-option-text' },
                h('b', null, entry.name),
                entry.description ? h('small', null, entry.description) : null)))))) : null,
        h('div', { className: 'ot-skill-center-foot' },
          h('span', { className: 'ot-hint' }, t('train.picked', { n: skillPicked.length })),
          h(Btn, { small: true, disabled: !skillPicked.length, onClick: addPickedSkills }, t('train.add'))),
        h('div', { className: 'ot-manual' },
          h('input', {
            className: 'ot-input',
            value: manualSkill,
            list: 'ot-manual-skill-options',
            placeholder: t('train.manualPlaceholder'),
            onChange: event => setManualSkill(event.target.value),
            onKeyDown: event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addManualSkill()
              }
            },
          }),
          h(Btn, { small: true, onClick: addManualSkill }, t('train.addManual')),
          h('datalist', { id: 'ot-manual-skill-options' },
            [...new Set([
              ...(selected ? selected.skills.map(skill => skill.name) : []),
              ...(skillCatalog || []).map(entry => entry.name),
              ...skillNames,
            ])].slice(0, 80).map(name => h('option', { key: name, value: name })))),
      ) : null

      const trainingPanel = selected && trainingStatus ? h('section', { className: 'ot-train' },
        h('div', { className: 'ot-train-head' },
          h('div', null,
            h('div', { className: 'ot-h3' }, t('train.title')),
            h('p', { className: 'ot-hint' }, t('train.hint'))),
          h('div', { className: 'ot-train-actions' },
            h(Btn, { small: true, icon: 'upload', onClick: openSkillCenter }, t('train.importShort')),
            h(Btn, { small: true, icon: 'search', onClick: () => openSkillSearch(selected, trainingSkills[0] || '') }, t('search.openShort')),
            h(Btn, { small: true, icon: 'sparkle', onClick: randomTraining }, t('train.random')))),
        h('div', { className: 'ot-train-pool' },
          trainingSkills.length
            ? trainingSkills.map(name => h('span', { key: name, className: 'ot-train-chip' },
              h('span', null, name),
              h('button', {
                type: 'button',
                className: 'ot-train-remove',
                'aria-label': t('train.remove') + ' ' + name,
                onClick: () => removeTrainingSkill(name),
              }, h(Icon, { name: 'close', size: 11 }))))
            : h('span', { className: 'ot-train-empty' }, t('train.empty')),
          trainingSkills.length ? h('button', { type: 'button', className: 'ot-link-btn', onClick: () => setTrainingSkills([]) }, t('train.clear')) : null),
        selected && selected.skills.filter(skill => !trainingSkills.includes(skill.name)).length
          ? h('div', { className: 'ot-train-suggest' },
            h('span', { className: 'ot-train-label' }, t('train.suggest')),
            h('div', { className: 'ot-chip-wrap' },
              selected.skills
                .filter(skill => !trainingSkills.includes(skill.name))
                .slice(0, 8)
                .map(skill => h('button', {
                  key: skill.name,
                  type: 'button',
                  className: 'ot-suggest-chip',
                  onClick: () => addTrainingSkills([skill.name]),
                }, skill.name, h('small', null, 'Lv.' + skill.level)))))
          : null,
        h('div', { className: 'ot-train-status', 'data-tone': trainingStatus.tone },
          h('div', { className: 'ot-train-status-title' },
            h(Icon, { name: trainingStatus.tone === 'ok' ? 'check' : 'alert', size: 13 }),
            trainingStatus.title),
          h('p', { className: 'ot-train-status-hint' }, trainingStatus.hint)),
        trainingStatus.tone === 'ok' && trainingStatus.key === 'vertical' ? h('div', { className: 'ot-train-plan' },
          h('div', { className: 'ot-train-row' },
            h('span', { className: 'ot-train-label' }, t('train.target')),
            h('span', null, 'Lv.' + trainingStatus.target)),
          h('div', { className: 'ot-train-row' },
            h('span', { className: 'ot-train-label' }, t('train.weeks')),
            h('span', null, t('advice.weeks', { n: trainingStatus.weeks }))),
          h('div', { className: 'ot-train-row' },
            h('span', { className: 'ot-train-label' }, t('train.mentor')),
            h('span', { className: trainingStatus.mentor ? '' : 'ot-warn' },
              trainingStatus.mentor
                ? trainingStatus.mentor.name + ' · Lv.' + employeeLevel(trainingStatus.mentor, trainingStatus.skill)
                : t('train.noMentor', { n: trainingStatus.target }))),
          h('div', { className: 'ot-train-topics' },
            h('span', { className: 'ot-train-label' }, t('train.topics')),
            trainingStatus.topics.map(topic => h('span', { key: topic, className: 'ot-topic' }, topic)))) : null,
        trainingStatus.tone === 'warn' && trainingStatus.skill ? h('div', { className: 'ot-train-topics' },
          h('span', { className: 'ot-train-label' }, t('train.topics')),
          skillTopics(trainingStatus.skill, locale).map(topic => h('span', { key: topic, className: 'ot-topic' }, topic))) : null,
        (trainingStatus.tone === 'warn' || trainingStatus.tone === 'empty') && trainingStatus.strongest
          && (trainingSkills.length !== 1 || trainingSkills[0] !== trainingStatus.strongest.name)
          ? h('button', { type: 'button', className: 'ot-link-btn ot-train-fix', onClick: useVertical },
            t('train.fix', { skill: trainingStatus.strongest.name })) : null,
        trainingNote ? h('p', { className: 'ot-hint ot-note', role: 'status' }, trainingNote) : null,
        skillCenterPanel,
      ) : null

      const detail = selected ? h(React.Fragment, null,
        h('div', { className: 'ot-scrim', onClick: () => setSelectedId(null), 'aria-hidden': true }),
        h('aside', {
          className: 'ot-detail',
          id: 'ot-employee-detail',
          ref: detailRef,
          role: 'dialog',
          'aria-modal': compact ? 'true' : undefined,
          'aria-labelledby': 'ot-detail-title',
          tabIndex: -1,
          onKeyDown: onDetailKeyDown,
          style: { '--ot-dept': deptColor(selected.dept) },
        },
          h('div', { className: 'ot-detail-head' },
            h(Avatar, { employee: selected, size: 52 }),
            h('div', { className: 'ot-detail-id' },
              h('div', { className: 'ot-detail-name', id: 'ot-detail-title' }, selected.name),
              h('div', { className: 'ot-role' }, selected.role)),
            h('button', { type: 'button', className: 'ot-icon-btn', 'aria-label': t('common.close'), onClick: () => setSelectedId(null) },
              h(Icon, { name: 'close' }))),
          h('div', { className: 'ot-detail-meta' },
            [
              [t('employee.dept'), selected.dept],
              [t('employee.team'), selected.team],
              [t('employee.level'), selected.level],
              [t('employee.city'), selected.city || '—'],
              [t('employee.joined'), selected.joined || '—'],
              [t('org.capacity'), selected.available + '%'],
              [t('employee.updated'), selected.updated],
            ].map(row => h('div', { key: row[0], className: 'ot-meta-cell' },
              h('span', null, row[0]), h('b', null, row[1])))),
          selected.focus ? h('div', { className: 'ot-focus-box' },
            h('span', { className: 'ot-block-label' }, t('employee.focus')),
            h('p', null, selected.focus)) : null,
          h('div', { className: 'ot-detail-section' },
            h('div', { className: 'ot-h3' }, t('employee.skills')),
            selected.skills.length
              ? h('div', { className: 'ot-skill-list' },
                selected.skills
                  .slice()
                  .sort((a, b) => b.level - a.level)
                  .map(skill => h('div', { key: skill.name, className: 'ot-skill-row' },
                    h('span', { className: 'ot-skill-name' }, skill.name),
                    h(LevelBar, { level: skill.level }),
                    h('span', { className: 'ot-skill-lv' }, 'Lv.' + skill.level))))
              : h('p', { className: 'ot-muted' }, t('employee.none'))),
          selected.skills.some(skill => skill.level >= 4) ? h('div', { className: 'ot-detail-section' },
            h('div', { className: 'ot-h3' }, t('employee.strengths')),
            h('div', { className: 'ot-chip-wrap' },
              selected.skills.filter(skill => skill.level >= 4).map(skill => h(SkillChip, { key: skill.name, skill })))) : null,
          selected.skills.some(skill => skill.level <= 2) ? h('div', { className: 'ot-detail-section' },
            h('div', { className: 'ot-h3' }, t('employee.growth')),
            h('div', { className: 'ot-chip-wrap' },
              selected.skills.filter(skill => skill.level <= 2).map(skill => h(SkillChip, { key: skill.name, skill })))) : null,
          trainingPanel,
          h('div', { className: 'ot-detail-foot' },
            h(Btn, {
              icon: 'org',
              onClick: () => {
                setOrgTeamName(selected.team)
                setTab('org')
                setSelectedId(null)
              },
            }, t('employee.viewTeam'))),
        )) : null

      const statPanel = (() => {
        if (!statDetail) return null
        const closeButton = h('button', {
          type: 'button',
          className: 'ot-icon-btn',
          'aria-label': t('stat.detail.close'),
          onClick: () => setStatDetail(null),
        }, h(Icon, { name: 'close' }))
        let body = null
        if (statDetail === 'people') {
          body = org.map(dept => {
            const members = dept.teams.flatMap(team => team.members)
            const avg = members.length ? Math.round(members.reduce((sum, member) => sum + member.available, 0) / members.length) : 0
            return h('div', { key: dept.name, className: 'ot-stat-line' },
              h('span', { className: 'ot-dept-dot', style: { '--ot-dept': deptColor(dept.name) } }),
              h('b', null, dept.name),
              h('span', { className: 'ot-stat-meta' }, t('stat.detail.deptMeta', { teams: dept.teams.length, people: members.length, avg })))
          })
        } else if (statDetail === 'teams') {
          body = teams.map(team => {
            const members = team.members
            const avg = members.length ? Math.round(members.reduce((sum, member) => sum + member.available, 0) / members.length) : 0
            const names = new Set(members.flatMap(member => member.skills.map(skill => skill.name)))
            let singles = 0
            for (const name of names) {
              if (members.filter(member => employeeLevel(member, name) >= 3).length === 1) singles += 1
            }
            return h('button', {
              key: team.name,
              type: 'button',
              className: 'ot-stat-line',
              'aria-label': t('stat.detail.teamOpen') + ' ' + team.name,
              onClick: () => {
                setOrgTeamName(team.name)
                setTab('org')
                setStatDetail(null)
              },
            },
              h('b', null, team.name),
              h('span', { className: 'ot-stat-meta' }, t('stat.detail.teamMeta', { people: members.length, avg, singles })),
              h(Icon, { name: 'chevron', size: 14 }))
          })
        } else if (statDetail === 'skills') {
          const rows = skillNames.map(name => {
            const levels = employees.map(employee => employeeLevel(employee, name)).filter(level => level > 0)
            const holders = employees.filter(employee => employeeLevel(employee, name) >= 3)
            const top = employees.slice().sort((a, b) => employeeLevel(b, name) - employeeLevel(a, name) || a.name.localeCompare(b.name, 'zh'))[0]
            const avg = levels.length ? (levels.reduce((sum, level) => sum + level, 0) / levels.length).toFixed(1) : '0.0'
            return { name, holders: holders.length, avg, top }
          }).sort((a, b) => b.holders - a.holders || a.name.localeCompare(b.name, 'zh'))
          body = rows.map(row => h('button', {
            key: row.name,
            type: 'button',
            className: 'ot-stat-line',
            'aria-label': t('stat.detail.skillFilter') + ' ' + row.name,
            onClick: () => {
              setQuery(row.name)
              setTab('talent')
              setStatDetail(null)
            },
          },
            h('b', null, row.name),
            h('span', { className: 'ot-stat-meta' }, t('stat.detail.skillMeta', { holders: row.holders, avg: row.avg, name: row.top ? row.top.name : '—' })),
            h(Icon, { name: 'search', size: 13 })))
        } else if (statDetail === 'capacity') {
          const low = employees.filter(employee => employee.available < 50).sort((a, b) => a.available - b.available)
          body = [
            ...org.map(dept => {
              const members = dept.teams.flatMap(team => team.members)
              const fte = Math.round(members.reduce((sum, member) => sum + member.available, 0) / 100 * 10) / 10
              const avg = members.length ? Math.round(members.reduce((sum, member) => sum + member.available, 0) / members.length) : 0
              return h('div', { key: dept.name, className: 'ot-stat-line' },
                h('span', { className: 'ot-dept-dot', style: { '--ot-dept': deptColor(dept.name) } }),
                h('b', null, dept.name),
                h('span', { className: 'ot-stat-meta' }, t('stat.detail.capacityMeta', { fte, avg })))
            }),
            h('div', { key: 'low-title', className: 'ot-stat-subhead' },
              h('b', null, t('stat.detail.lowTitle')),
              h('span', { className: 'ot-hint' }, t('stat.detail.lowHint'))),
            low.length
              ? low.map(employee => h('button', {
                key: employee.id,
                type: 'button',
                className: 'ot-stat-line',
                onClick: () => {
                  setSelectedId(employee.id)
                  setTab('talent')
                  setStatDetail(null)
                },
              },
                h(Avatar, { employee, size: 22 }),
                h('b', null, employee.name),
                h('span', { className: 'ot-stat-meta' }, employee.team + ' · ' + employee.available + '%')))
              : h('p', { key: 'low-none', className: 'ot-hint' }, t('stat.detail.lowNone')),
          ]
        }
        return h('section', { className: 'ot-stat-panel', id: 'ot-stat-panel' },
          h('div', { className: 'ot-stat-panel-head' },
            h('div', null,
              h('div', { className: 'ot-h3' }, t('stat.' + statDetail)),
              h('p', { className: 'ot-hint' }, t('stat.detail.' + statDetail + 'Hint'))),
            closeButton),
          h('div', { className: 'ot-stat-panel-body' }, body))
      })()

      const skillSearchErrorText = skillSearchError && skillSearchError.includes('GitHub is unreachable')
        ? t('search.githubUnreachable')
        : t('search.error', { error: skillSearchError })

      const skillSearchDialog = skillSearchOpen ? h(React.Fragment, null,
        h('div', { className: 'ot-scrim ot-scrim-top', onClick: closeSkillSearch, 'aria-hidden': true }),
        h('section', {
          className: 'ot-skill-search',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby': 'ot-skill-search-title',
        },
          h('div', { className: 'ot-skill-search-head' },
            h('div', { className: 'ot-skill-search-title' },
              h('span', { className: 'ot-skill-search-mark' }, h(Icon, { name: 'sparkle', size: 16 })),
              h('div', null,
                h('h2', { className: 'ot-skill-search-title-text', id: 'ot-skill-search-title' }, t('search.title')),
                h('p', { className: 'ot-hint' }, t('search.hint')))),
            h('button', { type: 'button', className: 'ot-icon-btn', 'aria-label': t('common.close'), onClick: closeSkillSearch },
              h(Icon, { name: 'close' }))),
          h('div', { className: 'ot-skill-search-target' },
            skillSearchTarget ? h(Avatar, { employee: skillSearchTarget, size: 30 }) : null,
            h('div', { className: 'ot-skill-search-target-id' },
              h('span', { className: 'ot-skill-search-target-label' }, t('search.targetLabel')),
              h('b', null, skillSearchTarget ? skillSearchTarget.name : '—')),
            skillSearchTarget ? h('span', { className: 'ot-skill-search-target-meta' },
              t('search.targetMeta', {
                role: skillSearchTarget.role,
                team: skillSearchTarget.team,
                available: skillSearchTarget.available,
              })) : null),
          h('form', {
            className: 'ot-search-form',
            onSubmit: event => {
              event.preventDefault()
              void runSkillSearch(skillSearchQuery)
            },
          },
            h('label', { className: 'ot-search-field' },
              h(Icon, { name: 'search', size: 16 }),
              h('input', {
                ref: skillSearchInputRef,
                className: 'ot-search-input',
                type: 'search',
                value: skillSearchQuery,
                placeholder: t('search.placeholder'),
                'aria-label': t('search.placeholder'),
                onChange: event => setSkillSearchQuery(event.target.value),
              })),
            h('div', { className: 'ot-search-submit' },
              h(Btn, { type: 'submit', icon: 'search', tone: 'primary' }, t('search.run')))),
          h('div', { className: 'ot-search-footline' },
            h('span', { className: 'ot-hint' }, t('search.sourcesHint')),
            skillSearchQuery.trim()
              ? h('a', {
                className: 'ot-search-open-github',
                href: 'https://github.com/search?q=' + encodeURIComponent(skillSearchQuery.trim()) + '&type=repositories',
                target: '_blank',
                rel: 'noreferrer',
              }, t('search.githubSearch'))
              : null),
          skillSearchStatus === 'loading'
            ? h('div', { className: 'ot-search-state', 'data-tone': 'loading', role: 'status' },
              h(Icon, { name: 'search', size: 16 }),
              h('p', null, t('search.loading')))
            : null,
          skillSearchError
            ? h('div', { className: 'ot-search-state', 'data-tone': 'warn', role: 'status' },
              h(Icon, { name: 'alert', size: 16 }),
              h('div', null,
                h('b', null, t('search.errorTitle')),
                h('p', null, skillSearchErrorText)))
            : null,
          skillSearchStatus === 'ready' && !skillSearchError && !skillSearchCenter.length && !skillSearchGithub.length
            ? h('div', { className: 'ot-search-state', 'data-tone': 'empty' },
              h(Icon, { name: 'search', size: 16 }),
              h('div', null,
                h('b', null, t('search.empty')),
                h('p', null, t('search.emptyHint'))))
            : null,
          skillSearchCenter.length ? h('div', { className: 'ot-search-section' },
            h('div', { className: 'ot-search-source' },
              h(Icon, { name: 'sparkle', size: 12 }),
              h('span', null, t('search.centerSource')),
              h('span', { className: 'ot-search-source-count' }, skillSearchCenter.length)),
            skillSearchCenter.slice(0, 10).map(entry => {
              const clean = entry.name
              const inTraining = skillSearchTargetTraining.includes(clean)
              const inProfile = skillSearchTarget ? employeeLevel(skillSearchTarget, clean) > 0 : false
              return h('article', { key: 'center-' + clean, className: 'ot-search-result' },
                h('div', { className: 'ot-search-result-head' },
                  h('b', null, clean),
                  h('span', { className: 'ot-search-badge' }, t('search.centerBadge'))),
                entry.description ? h('p', { className: 'ot-search-desc' }, entry.description) : null,
                h('div', { className: 'ot-search-actions' },
                  h(Btn, { small: true, disabled: inTraining, onClick: () => addSearchToTraining(clean) },
                    inTraining ? t('search.inTraining') : t('search.addTraining')),
                  h(Btn, { small: true, disabled: inProfile, onClick: () => addSearchToEmployee(clean) },
                    inProfile ? t('search.inProfile') : t('search.addProfile'))))
            })) : null,
          skillSearchGithub.length ? h('div', { className: 'ot-search-section' },
            h('div', { className: 'ot-search-source' },
              h(Icon, { name: 'link', size: 12 }),
              h('span', null, t('search.githubSource')),
              h('span', { className: 'ot-search-source-count' }, skillSearchGithub.length)),
            skillSearchGithub.map(item => {
              const clean = item.name
              const inTraining = skillSearchTargetTraining.includes(clean)
              const inProfile = skillSearchTarget ? employeeLevel(skillSearchTarget, clean) > 0 : false
              return h('article', { key: 'github-' + item.fullName, className: 'ot-search-result' },
                h('div', { className: 'ot-search-result-head' },
                  h('b', null, item.name),
                  h('span', { className: 'ot-search-badge ot-search-badge-github' }, 'GitHub')),
                h('div', { className: 'ot-search-result-meta' },
                  h('span', null, '★ ' + item.stars),
                  item.language ? h('span', null, item.language) : null),
                item.description ? h('p', { className: 'ot-search-desc' }, item.description) : null,
                h('div', { className: 'ot-search-actions' },
                  h(Btn, { small: true, disabled: inTraining, onClick: () => addSearchToTraining(clean) },
                    inTraining ? t('search.inTraining') : t('search.addTraining')),
                  h(Btn, { small: true, disabled: inProfile, onClick: () => addSearchToEmployee(clean) },
                    inProfile ? t('search.inProfile') : t('search.addProfile')),
                  h('a', { className: 'ot-link-btn ot-search-link', href: item.url, target: '_blank', rel: 'noreferrer' }, t('search.openGithub'))))
            })) : null,
          h('p', { className: 'ot-hint ot-search-footer-hint' }, t('search.githubHint')),
          skillSearchNote ? h('p', { className: 'ot-hint ot-good', role: 'status' }, skillSearchNote) : null,
        )) : null

      const statTiles = h('div', { className: 'ot-stats' },
        [
          { key: 'people', value: stats.people, label: t('stat.people'), icon: 'users', color: '#8b5cf6' },
          { key: 'teams', value: stats.teams, label: t('stat.teams'), icon: 'org', color: '#4c7df0' },
          { key: 'skills', value: stats.skills, label: t('stat.skills'), icon: 'sparkle', color: '#17a398' },
          { key: 'capacity', value: stats.capacity, label: t('stat.capacity'), suffix: t('stat.capacityUnit'), icon: 'chart', color: '#e0932f' },
        ].map(item => h('button', {
          key: item.key,
          type: 'button',
          className: 'ot-stat',
          'data-on': statDetail === item.key ? '' : undefined,
          'aria-expanded': statDetail === item.key,
          'aria-controls': 'ot-stat-panel',
          title: t('stat.detail.open'),
          style: { '--ot-accent': item.color },
          onClick: () => setStatDetail(previous => previous === item.key ? null : item.key),
        },
          h('span', { className: 'ot-stat-icon' }, h(Icon, { name: item.icon, size: 16 })),
          h('div', { className: 'ot-stat-body' },
            h('b', null, item.value, item.suffix ? h('small', null, item.suffix) : null),
            h('span', null, item.label)))))

      const talentView = h('div', { className: 'ot-pane ot-wb' },
        h('div', { className: 'ot-page-head' },
          h('div', null,
            h('h2', { className: 'ot-page-title' }, t('talent.title')),
            h('p', { className: 'ot-page-sub' }, t('talent.hint'))),
          h('span', { className: 'ot-page-count' }, t('talent.count', { n: employees.length }))),
        h('div', { className: 'ot-toolbar' },
          h('label', { className: 'ot-search' },
            h(Icon, { name: 'search', size: 15 }),
            h('input', {
              className: 'ot-input',
              type: 'search',
              value: query,
              placeholder: t('workbench.search'),
              onChange: event => setQuery(event.target.value),
              'aria-label': t('workbench.search'),
            })),
          h('div', { className: 'ot-chips' },
            h('button', {
              type: 'button', className: 'ot-chip-btn', 'data-on': deptFilter === 'all' ? '' : undefined,
              onClick: () => setDeptFilter('all'),
            }, t('workbench.allDepts')),
            allDepts.map(name => h('button', {
              key: name, type: 'button', className: 'ot-chip-btn',
              'data-on': deptFilter === name ? '' : undefined,
              onClick: () => setDeptFilter(name),
            }, name))),
          h('div', { className: 'ot-toolbar-right' },
            h('label', { className: 'ot-toggle' },
              h('input', {
                type: 'checkbox', checked: onlyAvailable,
                onChange: event => setOnlyAvailable(event.target.checked),
              }),
              h('span', null, t('workbench.available'))),
            h('label', { className: 'ot-sort' },
              h('span', null, t('workbench.sort')),
              h('select', {
                className: 'ot-select', value: sortBy,
                onChange: event => setSortBy(event.target.value),
                'aria-label': t('workbench.sort'),
              },
                h('option', { value: 'name' }, t('sort.name')),
                h('option', { value: 'available' }, t('sort.available')),
                h('option', { value: 'skills' }, t('sort.skills')))),
          )),
        importOpen ? h('section', {
          className: 'ot-import ot-block',
          onDragOver: event => event.preventDefault(),
          onDrop: handleImportDrop,
        },
          h('div', { className: 'ot-import-head' },
            h('div', { className: 'ot-h3' }, t('import.title')),
            h('button', { type: 'button', className: 'ot-icon-btn', 'aria-label': t('common.close'), onClick: () => setImportOpen(false) },
              h(Icon, { name: 'close' }))),
          h('p', { className: 'ot-hint' }, t('import.hint')),
          h('p', { className: 'ot-hint' }, t('import.formats')),
          h('div', { className: 'ot-import-file' },
            h('input', {
              ref: fileInputRef,
              type: 'file',
              accept: '.csv,.tsv,.json,.md,.markdown,.txt,.xlsx',
              style: { display: 'none' },
              onChange: handleFilePick,
            }),
            h(Btn, {
              small: true,
              icon: 'upload',
              disabled: importBusy,
              onClick: () => { if (fileInputRef.current) fileInputRef.current.click() },
            }, t('import.chooseFile')),
            h('span', { className: 'ot-hint' }, importBusy ? t('import.reading') : (importFileName || t('import.dropHint')))),
          h('textarea', {
            className: 'ot-textarea',
            value: importText,
            placeholder: t('import.placeholder') + '\n' + t('import.example'),
            onChange: event => { setImportText(event.target.value); setImportNote(null) },
            rows: 4,
          }),
          h('div', { className: 'ot-import-actions' },
            h(Btn, { tone: 'primary', icon: 'check', small: true, onClick: doImport, disabled: importBusy || !importText.trim() }, t('import.confirm')),
            h(Btn, { small: true, onClick: () => setImportOpen(false) }, t('import.cancel')),
            h('span', { className: 'ot-spacer' }),
            resetAsk ? h('span', { className: 'ot-reset-ask' },
              h('span', null, t('import.resetConfirm', { n: employees.length })),
              h(Btn, { small: true, tone: 'danger', onClick: doReset }, t('import.resetYes')),
              h(Btn, { small: true, onClick: () => setResetAsk(false) }, t('import.resetNo')))
              : h(Btn, { small: true, icon: 'reset', onClick: () => setResetAsk(true) }, t('import.reset'))),
          importNote ? h('p', { className: 'ot-hint ' + (importNote.tone === 'bad' ? 'ot-bad' : 'ot-good'), role: 'status' }, importNote.text) : null,
        ) : null,
        h('div', { className: 'ot-status', role: 'status' },
          h('span', { className: 'ot-status-dot' }),
          h('span', null, t('workbench.status', { n: employees.length })),
          note ? h('span', { className: 'ot-note' }, note) : null),
        h('div', { className: 'ot-wb-body' },
          filtered.length
            ? h('div', { className: 'ot-grid' }, filtered.map(renderCard))
            : h('div', { className: 'ot-empty' },
              h(Icon, { name: 'users', size: 28 }),
              h('p', null, t('empty.employees')),
              h('p', { className: 'ot-muted' }, t('empty.employeesHint'))),
          detail,
        ),
        h('p', { className: 'ot-footnote' }, t('footer.note')),
      )

      const guideTop = result && result.results && result.results.length ? result.results[0] : null
      const guideProjects = projects.slice(0, 3)
      const guideHistory = history.slice(0, 3)
      const workspaceProjects = projects
        .filter(project => project.startedAt && Array.isArray(project.tasks) && project.tasks.length)
        .slice()
        .sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)))
      const sortedRequirements = plan.skills
        .slice()
        .sort((a, b) => b.weight - a.weight || b.min - a.min || a.name.localeCompare(b.name, 'zh'))
      const topRequirement = sortedRequirements[0] || null
      const dayMs = 86400000
      const formatProjectDate = value => value
        ? new Date(value).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—'
      const projectProgressFor = project => {
        const tasks = Array.isArray(project.tasks) ? project.tasks : []
        const done = tasks.filter(task => task.status === 'done').length
        const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0
        const started = Boolean(project.startedAt && tasks.length)
        const requirements = projectRequirements(project)
        const plannedDays = Math.max(7, 7 + requirements.length * 4)
        const startAt = started ? project.startedAt : ''
        const endAt = started
          ? (project.dueAt || new Date(new Date(project.startedAt).getTime() + plannedDays * dayMs).toISOString())
          : ''
        const cycleDays = startAt && endAt
          ? Math.max(1, Math.ceil((new Date(endAt).getTime() - new Date(startAt).getTime()) / dayMs))
          : 0
        const status = !started ? 'notStarted' : (project.feedback || []).length ? 'reviewed' : 'active'
        return { tasks, done, percent, started, startAt, endAt, cycleDays, status }
      }
      const planRequirementsSignature = JSON.stringify(plan.skills.map(skill => ({ name: skill.name, min: skill.min })).sort((a, b) => a.name.localeCompare(b.name, 'zh')))
      const projectWarnings = (() => {
        const resultWarnings = { blockers: [], difficulties: [], changes: [] }
        for (const project of projects) {
          const progress = projectProgressFor(project)
          const tasks = progress.tasks
          const members = (project.memberIds || [])
            .map(id => employees.find(employee => employee.id === id))
            .filter(Boolean)
          const projectName = project.name || t('project.untitled')
          if (progress.started && progress.endAt && new Date(progress.endAt).getTime() < Date.now() && progress.percent < 100) {
            const days = Math.max(1, Math.ceil((Date.now() - new Date(progress.endAt).getTime()) / dayMs))
            resultWarnings.blockers.push({ project, projectName, text: t('guide.warn.overdue', { n: days }) })
          }
          if (progress.started && tasks.some(task => !task.assigneeId)) {
            resultWarnings.blockers.push({ project, projectName, text: t('guide.warn.unassigned') })
          }
          if (progress.started && !members.length) {
            resultWarnings.difficulties.push({ project, projectName, text: t('guide.warn.noMembers') })
          }
          for (const requirement of projectRequirements(project)) {
            const best = members.length ? Math.max(...members.map(member => employeeLevel(member, requirement.name))) : 0
            if (best < requirement.min) {
              resultWarnings.difficulties.push({
                project,
                projectName,
                text: t('guide.warn.skillGap', { skill: requirement.name, min: requirement.min, best }),
              })
            }
          }
          for (const member of members.filter(item => item.available < 50)) {
            resultWarnings.difficulties.push({ project, projectName, text: t('guide.warn.lowCapacity', { name: member.name, n: member.available }) })
          }
          const projectSignature = JSON.stringify((project.requirements || []).map(skill => ({ name: skill.name, min: skill.min })).sort((a, b) => a.name.localeCompare(b.name, 'zh')))
          if ((project.requirements || []).length && projectSignature !== planRequirementsSignature) {
            resultWarnings.changes.push({ project, projectName, text: t('guide.warn.requirementChanged') })
          }
          const latestFeedback = (project.feedback || []).slice().sort((a, b) => String(b.at).localeCompare(String(a.at)))[0]
          if (latestFeedback && latestFeedback.adjustment) {
            resultWarnings.changes.push({ project, projectName, text: t('guide.warn.feedbackAdjust', { text: latestFeedback.adjustment.slice(0, 60) }) })
          }
        }
        return resultWarnings
      })()
      const projectWarningCount = projectWarnings.blockers.length + projectWarnings.difficulties.length + projectWarnings.changes.length
      const warningGroups = [
        { key: 'blockers', title: t('guide.warnBlockers'), tone: 'rose', items: projectWarnings.blockers },
        { key: 'difficulties', title: t('guide.warnDifficulties'), tone: 'amber', items: projectWarnings.difficulties },
        { key: 'changes', title: t('guide.warnChanges'), tone: 'blue', items: projectWarnings.changes },
      ]
      const openProjectProgress = id => {
        setProjectProgressId(previous => previous === id ? null : id)
        window.setTimeout(() => {
          const node = document.getElementById('ot-project-' + id)
          if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' })
        }, 40)
      }
      const activeProjects = projects.filter(project => projectProgressFor(project).status === 'active').length
      const averageProgress = projects.length
        ? Math.round(projects.reduce((sum, project) => sum + projectProgressFor(project).percent, 0) / projects.length)
        : 0
      const openTaskConversation = async (project, task) => {
        const sessions = typeof ctx.get === 'function' ? ctx.get('sessions') : ctx.sessions
        const uiWorkspace = typeof ctx.get === 'function' ? ctx.get('uiWorkspace') : ctx.uiWorkspace
        const workspaceService = typeof ctx.get === 'function' ? ctx.get('workspaces') : ctx.workspaces
        let workspaceId = ''
        try {
          const workspaceSnapshot = workspaceService && workspaceService.list && workspaceService.list.getSnapshot
            ? workspaceService.list.getSnapshot()
            : null
          const workspaceItems = workspaceSnapshot && Array.isArray(workspaceSnapshot.items) ? workspaceSnapshot.items : []
          const recent = workspaceItems.slice().sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0]
          workspaceId = recent && recent.workspaceId ? recent.workspaceId : ''
        } catch (error) {
          workspaceId = ''
        }
        const members = (project.memberIds || [])
          .map(id => employees.find(employee => employee.id === id))
          .filter(Boolean)
          .map(employee => employee.name)
        const message = [
          '【项目任务】' + task.title,
          t('workspace.chatProject') + '：' + (project.name || t('project.untitled')),
          t('workspace.chatOwner') + '：' + (task.assigneeName || t('workspace.unassigned')),
          t('workspace.chatStatus') + '：' + t('workspace.task.' + task.status),
          t('workspace.chatTeam') + '：' + (members.length ? members.join('、') : '—'),
          t('workspace.chatGoal') + '：' + (project.goal || t('project.noGoal')),
          '',
          t('workspace.chatInstruction'),
        ].join('\n')
        const openSession = id => {
          if (uiWorkspace && typeof uiWorkspace.openSession === 'function') uiWorkspace.openSession(id)
        }
        if (!sessions) {
          if (uiWorkspace && typeof uiWorkspace.startSession === 'function') {
            uiWorkspace.startSession(undefined, { prompt: message, whenDraftExists: 'append' })
            setNote(t('workspace.chatDraft'))
          } else {
            setNote(t('workspace.chatUnavailable'))
          }
          return
        }
        const sendTo = async id => {
          await sessions.using(id, { source: 'controllerOperation' }, async reference => {
            if (!reference.binding || !reference.binding.session) throw new Error('session unavailable')
            const result = await reference.binding.session.prompt([{ type: 'text', text: message }], 'queue')
            if (result && result.ok === false) throw new Error((result.error && result.error.message) || 'prompt failed')
          })
          openSession(id)
        }
        try {
          if (project.conversationId) {
            try {
              await sendTo(project.conversationId)
              setNote(t('workspace.chatSent', { name: project.name || t('project.untitled') }))
              return
            } catch (error) {
              /* The conversation may have been archived; create a fresh one below. */
            }
          }
          const id = await sessions.create(workspaceId ? { workspaceId } : {})
          await sendTo(id)
          setData(previous => ({
            ...previous,
            projects: (previous.projects || []).map(item =>
              item.id === project.id ? { ...item, conversationId: id, updatedAt: new Date().toISOString() } : item),
          }))
          setNote(t('workspace.chatSent', { name: project.name || t('project.untitled') }))
        } catch (error) {
          if (uiWorkspace && typeof uiWorkspace.startSession === 'function') {
            uiWorkspace.startSession(undefined, { prompt: message, whenDraftExists: 'append' })
            setNote(t('workspace.chatDraft'))
            return
          }
          setNote(t('workspace.chatFailed'))
        }
      }

      const renderProjectStage = (label, value, detail) => h('div', { className: 'ot-stage' },
        h('span', { className: 'ot-stage-label' }, label),
        h('b', { className: 'ot-stage-value' }, value),
        h('small', null, detail))

      const renderProjectDetail = (project, progress) => {
        const tasks = progress.tasks
        const kickoff = tasks[0] || null
        const review = tasks.length > 1 ? tasks[tasks.length - 1] : null
        const delivery = tasks.slice(1, -1)
        const deliveryDone = delivery.filter(task => task.status === 'done').length
        const feedback = Array.isArray(project.feedback) ? project.feedback : []
        const latestFeedback = feedback.slice().sort((a, b) => String(b.at).localeCompare(String(a.at)))[0]
        const doneTitles = tasks.filter(task => task.status === 'done').map(task => task.title)
        const outcomePreview = latestFeedback && latestFeedback.outcome
          ? latestFeedback.outcome
          : doneTitles.length ? doneTitles.slice(0, 3).join(' / ') : t('guide.noOutcome')
        const stageValue = task => task ? t('workspace.task.' + task.status) : t('guide.notStarted')
        const stageOwner = task => task ? (task.assigneeName || t('workspace.unassigned')) : '—'
        const memberGroups = new Map()
        for (const task of tasks) {
          const key = task.assigneeId || task.assigneeName || 'unassigned'
          if (!memberGroups.has(key)) {
            memberGroups.set(key, { id: task.assigneeId || '', name: task.assigneeName || t('workspace.unassigned'), done: 0, total: 0 })
          }
          const group = memberGroups.get(key)
          group.total += 1
          if (task.status === 'done') group.done += 1
        }
        return h('div', { className: 'ot-progress-detail', id: 'ot-progress-detail-' + project.id },
          h('div', { className: 'ot-progress-detail-block' },
            h('div', { className: 'ot-progress-detail-title' }, t('guide.stagePreview')),
            h('div', { className: 'ot-progress-stages' },
              renderProjectStage(t('workspace.task.kickoff'), stageValue(kickoff), stageOwner(kickoff)),
              renderProjectStage(t('guide.deliveryStage'), deliveryDone + '/' + delivery.length, t('guide.deliveryDone', { n: deliveryDone, total: delivery.length })),
              renderProjectStage(t('workspace.task.review'), stageValue(review), stageOwner(review)))),
          h('p', { className: 'ot-progress-outcome' },
            h('span', null, t('guide.outcomePreview') + '：'),
            outcomePreview),
          h('div', { className: 'ot-progress-detail-grid' },
            h('div', { className: 'ot-progress-detail-block' },
              h('div', { className: 'ot-progress-detail-title' }, t('guide.memberProgress')),
              memberGroups.size
                ? [...memberGroups.values()].map(group => {
                  const member = group.id ? employees.find(employee => employee.id === group.id) : null
                  return h('div', { key: group.id || group.name, className: 'ot-progress-member' },
                    member ? h(Avatar, { employee: member, size: 22 }) : h('span', { className: 'ot-progress-unassigned-dot' }),
                    h('span', { className: 'ot-progress-member-name' }, group.name),
                    h('span', { className: 'ot-progress-member-bar' }, h('i', { style: { width: Math.round(group.done / group.total * 100) + '%' } })),
                    h('span', { className: 'ot-progress-member-num' }, group.done + '/' + group.total))
                })
                : h('p', { className: 'ot-hint' }, t('guide.noTasks'))),
            h('div', { className: 'ot-progress-detail-block' },
              h('div', { className: 'ot-progress-detail-title' }, t('guide.feedbackPoints')),
              feedback.length
                ? feedback.slice(-2).reverse().map(entry => h('div', { key: entry.id, className: 'ot-progress-feedback' },
                  h('span', { className: 'ot-progress-feedback-date' }, new Date(entry.at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric' })),
                  entry.outcome ? h('p', null, h('b', null, t('project.outcome') + '：'), entry.outcome) : null,
                  entry.issues ? h('p', null, h('b', null, t('project.issues') + '：'), entry.issues) : null,
                  entry.adjustment ? h('p', null, h('b', null, t('project.adjustment') + '：'), entry.adjustment) : null))
                : h('p', { className: 'ot-hint' }, t('guide.noFeedback')))))
      }

      const renderProjectProgressRow = project => {
        const progress = projectProgressFor(project)
        const feedback = Array.isArray(project.feedback) ? project.feedback : []
        const open = projectProgressId === project.id
        const memberNames = (project.memberIds || [])
          .map(id => employees.find(employee => employee.id === id))
          .filter(Boolean)
          .map(employee => employee.name)
        return h('article', {
          key: project.id,
          id: 'ot-project-' + project.id,
          className: 'ot-progress-project',
          'data-open': open ? '' : undefined,
          'data-status': progress.status,
        },
          h('div', { className: 'ot-progress-head' },
            h('button', {
              type: 'button',
              className: 'ot-progress-toggle',
              'aria-expanded': open,
              'aria-controls': 'ot-progress-detail-' + project.id,
              onClick: () => openProjectProgress(project.id),
            },
              h('span', { className: 'ot-progress-title' },
                h('b', null, project.name || t('project.untitled')),
                h('small', null, memberNames.length ? memberNames.join('、') : '—')),
              h('span', { className: 'ot-progress-percent' }, progress.percent + '%')),
            h('div', { className: 'ot-progress-actions' },
              progress.started
                ? h(Btn, { small: true, icon: 'check', onClick: () => setTab('workspace') }, t('project.enterWorkspace'))
                : h(Btn, { small: true, tone: 'primary', icon: 'target', onClick: () => startProject(project) }, t('project.start')),
              h('span', { className: 'ot-project-status', 'data-status': progress.status }, t('project.status.' + progress.status)))),
          h('div', { className: 'ot-progress-track', 'aria-hidden': true }, h('i', { style: { width: progress.percent + '%' } })),
          h('div', { className: 'ot-progress-facts' },
            h('span', null, progress.started ? t('guide.cycle', { n: progress.cycleDays }) : t('guide.cyclePending')),
            h('span', null, t('guide.startAt', { date: formatProjectDate(progress.startAt) })),
            h('span', null, t('guide.endAt', { date: formatProjectDate(progress.endAt) })),
            h('span', null, t('guide.feedbackCount', { n: feedback.length }))),
          open ? renderProjectDetail(project, progress) : null)
      }

      const projectView = h('div', { className: 'ot-pane ot-guide' },
        h('div', { className: 'ot-page-head' },
          h('div', null,
            h('span', { className: 'ot-page-kicker' }, t('guide.kicker')),
            h('h2', { className: 'ot-page-title' }, t('guide.title')),
            h('p', { className: 'ot-page-sub' }, t('guide.hint')))),
        h('div', { className: 'ot-guide-hero' },
          h('div', { className: 'ot-guide-hero-main' },
            h('span', { className: 'ot-guide-kicker' }, t('guide.current')),
            h('div', { className: 'ot-guide-title' }, plan.name || t('match.title')),
            h('p', { className: 'ot-guide-desc' }, t('guide.requirements', { n: plan.skills.length, size: plan.size })),
            topRequirement
              ? h('div', { className: 'ot-guide-req-block' },
                h('div', { className: 'ot-guide-req-line' },
                  h('span', { className: 'ot-guide-req-label' }, t('guide.topRequirement')),
                  h('span', { className: 'ot-guide-req-main' },
                    h('b', null, topRequirement.name),
                    h('span', null, '≥Lv.' + topRequirement.min),
                    h('small', null, t('guide.weight', { n: topRequirement.weight }))),
                  plan.skills.length > 1
                    ? h('button', {
                      type: 'button',
                      className: 'ot-link-btn ot-guide-req-toggle',
                      onClick: () => setShowAllRequirements(previous => !previous),
                    }, showAllRequirements ? t('guide.hideAll') : t('guide.showAll', { n: plan.skills.length }))
                    : null),
                showAllRequirements
                  ? h('div', { className: 'ot-chip-wrap ot-guide-all-reqs' },
                    sortedRequirements.map(skill => h('span', { key: skill.name, className: 'ot-mini-chip' }, skill.name + ' ≥' + skill.min)))
                  : null)
              : h('p', { className: 'ot-hint' }, t('match.reqEmpty')),
            h('div', { className: 'ot-guide-actions' },
              h(Btn, { small: true, tone: 'primary', icon: 'target', onClick: () => setTab('match') },
                guideTop ? t('guide.openMatch') : t('guide.goMatch')),
              h(Btn, { small: true, icon: 'users', onClick: () => setTab('talent') }, t('guide.goTalent')),
              workspaceProjects.length
                ? h(Btn, { small: true, icon: 'check', onClick: () => setTab('workspace') }, t('workspace.title'))
                : null)),
          h('div', { className: 'ot-guide-hero-side' },
            guideTop ? h(React.Fragment, null,
              h('span', { className: 'ot-guide-side-label' }, t('guide.topTeam')),
              h('div', { className: 'ot-guide-score' },
                h('b', null, guideTop.score),
                h('span', null, t('match.score'))),
              h('p', { className: 'ot-guide-side-meta' }, t('guide.topMeta', {
                n: guideTop.team.length,
                coverage: Math.round(guideTop.coverage * 100),
              })),
              h('div', { className: 'ot-avatars' }, guideTop.team.map(member => h(Avatar, { key: member.id, employee: member, size: 24 }))))
              : h(React.Fragment, null,
                h('span', { className: 'ot-guide-side-label' }, t('guide.topTeam')),
                h('p', { className: 'ot-guide-side-empty' }, t('guide.noTop'))))),
        dirty ? h('p', { className: 'ot-hint ot-warn ot-guide-dirty' }, t('match.dirty')) : null,
        statTiles,
        statPanel,
        h('section', { className: 'ot-warnings', style: { '--ot-section': '#e0932f' } },
          h('div', { className: 'ot-warnings-head' },
            h('div', null,
              h('span', { className: 'ot-section-kicker' }, t('guide.warnings')),
              h('p', { className: 'ot-hint' }, t('guide.warningsHint'))),
            h('span', { className: 'ot-warning-total' }, t('guide.warningCount', { n: projectWarningCount }))),
          h('div', { className: 'ot-warning-cols' },
            warningGroups.map(group => h('div', { key: group.key, className: 'ot-warning-col', 'data-tone': group.tone },
              h('div', { className: 'ot-warning-col-head' },
                h('span', null, group.title),
                h('b', null, group.items.length)),
              group.items.length
                ? group.items.slice(0, 3).map((item, index) => h('button', {
                  key: group.key + '-' + item.project.id + '-' + index,
                  type: 'button',
                  className: 'ot-warning-item',
                  onClick: () => openProjectProgress(item.project.id),
                },
                  h('small', null, item.projectName),
                  h('span', null, item.text)))
                : h('p', { className: 'ot-hint ot-warning-none' }, t('guide.none')))))),
        h('div', { className: 'ot-guide-grid' },
          h('section', { className: 'ot-guide-card ot-progress-card', style: { '--ot-section': '#4c7df0' } },
            h('div', { className: 'ot-guide-card-head' },
              h('div', null,
                h('div', { className: 'ot-h3' }, t('guide.progress')),
                h('p', { className: 'ot-hint' }, t('guide.progressHint'))),
              h('span', { className: 'ot-muted' }, t('guide.projectCount', { n: projects.length }))),
            h('div', { className: 'ot-progress-summary' },
              h('div', { className: 'ot-progress-kpi' }, h('b', null, projects.length), h('span', null, t('guide.totalProjects'))),
              h('div', { className: 'ot-progress-kpi' }, h('b', null, activeProjects), h('span', null, t('guide.activeProjects'))),
              h('div', { className: 'ot-progress-kpi' }, h('b', null, averageProgress + '%'), h('span', null, t('guide.avgProgress')))),
            projects.length
              ? h('div', { className: 'ot-progress-list' }, projects.map(renderProjectProgressRow))
              : h('div', { className: 'ot-guide-empty' },
                h(Icon, { name: 'org', size: 20 }),
                h('p', null, t('guide.noProjects')),
                h('p', { className: 'ot-hint' }, t('guide.noProjectsHint')))),
          h('section', { className: 'ot-guide-card', style: { '--ot-section': '#17a398' } },
            h('div', { className: 'ot-guide-card-head' },
              h('div', { className: 'ot-h3' }, t('guide.recent')),
              h('span', { className: 'ot-muted' }, t('guide.recentHint'))),
            guideHistory.length
              ? guideHistory.map(entry => h('button', {
                key: entry.ts,
                type: 'button',
                className: 'ot-guide-history',
                onClick: () => { loadHistory(entry); setTab('match') },
              },
                h('span', { className: 'ot-guide-history-main' },
                  h('b', null, entry.name || t('match.title')),
                  h('small', null, t('guide.historyMeta', { n: entry.size, score: entry.score }))),
                h('span', { className: 'ot-guide-history-date' },
                  new Date(entry.ts).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric' }))))
              : h('div', { className: 'ot-guide-empty' },
                h(Icon, { name: 'target', size: 20 }),
                h('p', null, t('guide.noHistory'))))),
        h('p', { className: 'ot-footnote' }, t('footer.note')),
      )

      const workspaceView = h('div', { className: 'ot-pane ot-workspace' },
        h('div', { className: 'ot-page-head' },
          h('div', null,
            h('h2', { className: 'ot-page-title' }, t('workspace.title')),
            h('p', { className: 'ot-page-sub' }, t('workspace.hint'))),
          h('span', { className: 'ot-page-count' }, t('workspace.count', { n: workspaceProjects.length }))),
        workspaceProjects.length
          ? h('div', { className: 'ot-workspace-list' },
            workspaceProjects.map(project => {
              const tasks = Array.isArray(project.tasks) ? project.tasks : []
              const done = tasks.filter(task => task.status === 'done').length
              const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0
              const members = (project.memberIds || [])
                .map(id => employees.find(employee => employee.id === id))
                .filter(Boolean)
              const started = project.startedAt
                ? new Date(project.startedAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric' })
                : '—'
              return h('section', { key: project.id, className: 'ot-workspace-project' },
                h('div', { className: 'ot-workspace-head' },
                  h('div', { className: 'ot-workspace-title-wrap' },
                    h('h3', { className: 'ot-workspace-title' }, project.name || t('project.untitled')),
                    h('p', { className: 'ot-workspace-goal' }, project.goal || t('project.noGoal'))),
                  h('div', { className: 'ot-workspace-progress' },
                    h('div', { className: 'ot-workspace-progress-num' }, h('b', null, pct + '%'), h('span', null, t('workspace.progress', { done, total: tasks.length }))),
                    h('div', { className: 'ot-workspace-track', 'aria-hidden': true }, h('i', { style: { width: pct + '%' } })))),
                h('div', { className: 'ot-workspace-meta' },
                  h('div', { className: 'ot-workspace-members' },
                    members.map(member => h('span', { key: member.id, className: 'ot-workspace-person' },
                      h(Avatar, { employee: member, size: 22 }), member.name))),
                  h('span', { className: 'ot-workspace-started' }, t('workspace.startedAt', { date: started }))),
                h('div', { className: 'ot-task-list' },
                  tasks.map(task => h('div', {
                    key: task.id,
                    className: 'ot-task',
                    'data-status': task.status,
                  },
                    h('span', { className: 'ot-task-dot', 'aria-hidden': true }),
                    h('button', {
                      type: 'button',
                      className: 'ot-task-open',
                      'aria-label': t('workspace.chatOpen', { title: task.title }),
                      onClick: () => void openTaskConversation(project, task),
                    },
                      h('span', { className: 'ot-task-title' }, task.title, h(Icon, { name: 'arrow', size: 11 })),
                      h('span', { className: 'ot-task-assignee' }, (task.assigneeName || t('workspace.unassigned')) + ' · ' + t('workspace.chatHint'))),
                    h('button', {
                      type: 'button',
                      className: 'ot-task-status',
                      'aria-label': t('workspace.toggle', { title: task.title, status: t('workspace.task.' + task.status) }),
                      onClick: () => toggleTask(project.id, task.id),
                    }, t('workspace.task.' + task.status))))),
                h('div', { className: 'ot-workspace-foot' },
                  h('span', { className: 'ot-hint' }, t('workspace.taskHint')),
                  h(Btn, { small: true, onClick: () => setTab('project') }, t('workspace.back'))))
            }))
          : h('div', { className: 'ot-empty ot-workspace-empty' },
            h(Icon, { name: 'check', size: 30 }),
            h('p', null, t('workspace.empty')),
            h('p', { className: 'ot-muted' }, t('workspace.emptyHint')),
            h(Btn, { small: true, icon: 'chart', onClick: () => setTab('project') }, t('workspace.back'))),
      )

      const poolView = h('div', { className: 'ot-pane ot-pool' },
        h('div', { className: 'ot-page-head' },
          h('div', null,
            h('span', { className: 'ot-page-kicker' }, t('pool.kicker')),
            h('h2', { className: 'ot-page-title' }, t('pool.title')),
            h('p', { className: 'ot-page-sub' }, t('pool.hint'))),
          h('span', { className: 'ot-page-count' }, t('pool.count', { n: requirementPool.length }))),
        h('section', { className: 'ot-pool-add' },
          h('div', { className: 'ot-pool-add-grid' },
            h('label', { className: 'ot-pool-field ot-pool-name' },
              h('span', null, t('pool.name')),
              h('input', {
                className: 'ot-input',
                value: poolName,
                placeholder: t('pool.namePlaceholder'),
                onChange: event => setPoolName(event.target.value),
                onKeyDown: event => { if (event.key === 'Enter') { event.preventDefault(); addPoolRequirement() } },
              })),
            h('label', { className: 'ot-pool-field' },
              h('span', null, t('pool.min')),
              h('select', { className: 'ot-select', value: poolMin, onChange: event => setPoolMin(event.target.value) },
                [1, 2, 3, 4, 5].map(value => h('option', { key: value, value }, 'Lv.' + value)))),
            h('label', { className: 'ot-pool-field' },
              h('span', null, t('pool.weight')),
              h('select', { className: 'ot-select', value: poolWeight, onChange: event => setPoolWeight(event.target.value) },
                [1, 2, 3].map(value => h('option', { key: value, value }, String(value))))),
            h('label', { className: 'ot-pool-field ot-pool-note' },
              h('span', null, t('pool.note')),
              h('input', {
                className: 'ot-input',
                value: poolNote,
                placeholder: t('pool.notePlaceholder'),
                onChange: event => setPoolNote(event.target.value),
              })),
            h('div', { className: 'ot-pool-add-action' },
              h(Btn, { small: true, tone: 'primary', icon: 'plus', onClick: addPoolRequirement }, t('pool.add')))),
          poolStatus ? h('p', { className: 'ot-hint ' + (poolStatusTone === 'bad' ? 'ot-bad' : 'ot-good'), role: 'status' }, poolStatus) : null),
        h('div', { className: 'ot-pool-toolbar' },
          h('span', { className: 'ot-pool-toolbar-label' }, t('pool.referenceTarget')),
          projects.length
            ? h('select', {
              className: 'ot-select',
              value: selectedPoolProject ? selectedPoolProject.id : '',
              onChange: event => setPoolProjectId(event.target.value),
              'aria-label': t('pool.referenceTarget'),
            }, projects.map(project => h('option', { key: project.id, value: project.id }, project.name || t('project.untitled'))))
            : h('span', { className: 'ot-hint' }, t('pool.noProjects')),
          h('span', { className: 'ot-hint ot-pool-toolbar-hint' }, t('pool.referenceHint'))),
        requirementPool.length
          ? h('div', { className: 'ot-pool-list' },
            requirementPool.map(item => {
              const inPlan = plan.skills.some(skill => skill.name === item.name)
              const usedBy = projects.filter(project => (project.requirements || []).some(requirement => requirement.name === item.name)).length
              return h('article', { key: item.id, className: 'ot-pool-item' },
                h('div', { className: 'ot-pool-item-main' },
                  h('div', { className: 'ot-pool-item-title' },
                    h('b', null, item.name),
                    inPlan ? h('span', { className: 'ot-pool-badge' }, t('pool.inPlanBadge')) : null),
                  h('div', { className: 'ot-pool-item-meta' },
                    h('span', null, t('pool.levelWeight', { min: item.min, weight: item.weight })),
                    h('span', null, t('pool.usedBy', { n: usedBy }))),
                  item.note ? h('p', { className: 'ot-pool-item-note' }, item.note) : null),
                h('div', { className: 'ot-pool-item-actions' },
                  h(Btn, { small: true, disabled: inPlan, onClick: () => referencePoolToPlan(item) },
                    inPlan ? t('pool.inPlan') : t('pool.addPlan')),
                  h(Btn, { small: true, disabled: !selectedPoolProject, onClick: () => referencePoolToProject(item) },
                    t('pool.addProject')),
                  h('button', {
                    type: 'button',
                    className: 'ot-icon-btn',
                    'aria-label': t('pool.delete') + ' ' + item.name,
                    onClick: () => removePoolRequirement(item.id),
                  }, h(Icon, { name: 'close', size: 13 }))))
            }))
          : h('div', { className: 'ot-empty ot-pool-empty' },
            h(Icon, { name: 'grid', size: 30 }),
            h('p', null, t('pool.empty')),
            h('p', { className: 'ot-muted' }, t('pool.emptyHint'))),
      )

      /* ---------------------------------------------------------------- org */

      function renderOrg() {
        if (!activeTeam) {
          return h('div', { className: 'ot-empty' }, h(Icon, { name: 'org', size: 28 }), h('p', null, t('org.empty')))
        }
        const teamSkills = new Map()
        for (const member of activeTeam.members) {
          for (const skill of member.skills) {
            if (!teamSkills.has(skill.name)) teamSkills.set(skill.name, { name: skill.name, levels: [], holders: 0 })
            const row = teamSkills.get(skill.name)
            row.levels.push(skill.level)
            if (skill.level >= 3) row.holders += 1
          }
        }
        const coverage = [...teamSkills.values()]
          .map(row => ({
            ...row,
            avg: row.levels.reduce((sum, level) => sum + level, 0) / row.levels.length,
          }))
          .sort((a, b) => b.holders - a.holders || b.avg - a.avg)
        const risks = coverage.filter(row => row.holders === 1)
        const matrix = skillNames.map(name => {
          const cells = teams.map(team => team.members.filter(member => employeeLevel(member, name) > 0).length)
          return { name, cells, max: Math.max(1, ...cells) }
        })
        const teamCapacity = Math.round(activeTeam.members.reduce((sum, member) => sum + member.available, 0) / 100 * 10) / 10

        const tree = h('aside', { className: 'ot-tree' },
          org.map(dept => h('div', { key: dept.name, className: 'ot-tree-dept' },
            h('div', { className: 'ot-tree-dept-name' },
              h('span', { className: 'ot-tree-dept-label' },
                h('i', { className: 'ot-tree-dept-dot', style: { '--ot-dept': deptColor(dept.name) } }),
                dept.name),
              h('span', { className: 'ot-tree-dept-count' }, dept.teams.length)),
            dept.teams.map(team => h('button', {
              key: team.name,
              type: 'button',
              className: 'ot-tree-team',
              'data-on': team.name === activeTeam.name ? '' : undefined,
              onClick: () => setOrgTeamName(team.name),
            },
              h('span', null, team.name),
              h('span', { className: 'ot-tree-count' }, team.members.length))))))

        const head = h('div', { className: 'ot-team-head' },
          h('div', null,
            h('div', { className: 'ot-h2' }, activeTeam.name),
            h('div', { className: 'ot-muted' }, activeTeam.dept + ' · ' + t('org.members', { n: activeTeam.members.length }))),
          h('div', { className: 'ot-team-stats' },
            h('span', null, h('b', null, teamCapacity), ' ', t('stat.capacityUnit')),
            h('span', null, h('b', null, coverage.length), ' ', t('stat.skills')),
            h('span', null, h('b', null, risks.length), ' ', t('org.singlePoint'))))

        const roster = h('div', { className: 'ot-roster' },
          activeTeam.members.map(member => h('div', {
            key: member.id,
            className: 'ot-roster-row',
            style: { '--ot-dept': deptColor(member.dept) },
          },
            h(Avatar, { employee: member, size: 30 }),
            h('div', { className: 'ot-roster-id' },
              h('div', { className: 'ot-roster-name' }, member.name,
                member.lead ? h('span', { className: 'ot-lead' }, t('employee.lead')) : null),
              h('div', { className: 'ot-role' }, member.role)),
            h('div', { className: 'ot-roster-skills' },
              member.skills.slice(0, 3).map(skill => h(SkillChip, { key: skill.name, skill }))),
            h(Availability, { value: member.available, label: t('org.capacity') }),
            h('button', {
              type: 'button',
              className: 'ot-link-btn',
              onClick: () => { setSelectedId(member.id); setTab('talent') },
            }, t('org.openProfile')))))

        const coverageBlock = h('section', { className: 'ot-block' },
          h('div', { className: 'ot-h3' }, t('org.teamSkills')),
          h('p', { className: 'ot-hint' }, t('org.teamSkillsHint')),
          h('div', { className: 'ot-cov-list' },
            coverage.slice(0, 12).map(row => h('div', { key: row.name, className: 'ot-cov-row' },
              h('span', { className: 'ot-cov-name' }, row.name),
              h('span', { className: 'ot-cov-track' },
                h('i', { style: { width: Math.round(row.avg / 5 * 100) + '%' } })),
              h('span', { className: 'ot-cov-num' }, t('org.members', { n: row.holders }))))))

        const riskBlock = h('section', { className: 'ot-block' },
          h('div', { className: 'ot-h3' }, t('org.singlePoint')),
          h('p', { className: 'ot-hint' }, t('org.singlePointHint')),
          risks.length
            ? h('div', { className: 'ot-risk-list' }, risks.map(row => h('div', { key: row.name, className: 'ot-risk' },
              h(Icon, { name: 'alert', size: 14 }),
              h('span', null, row.name),
              h('span', { className: 'ot-risk-count' }, 'Lv.' + Math.round(row.avg)))))
            : h('p', { className: 'ot-good' }, t('org.noRisk')))

        const riskAdvices = risks
          .slice(0, 3)
          .map(risk => buildSoloAdvice(activeTeam.members, risk.name, 3, locale))
          .filter(Boolean)
        const adviceBlock = riskAdvices.length ? h('section', { className: 'ot-block' },
          h('div', { className: 'ot-h3' }, t('advice.section')),
          h('p', { className: 'ot-hint' }, t('advice.orgHint')),
          h('div', { className: 'ot-advice-list' },
            riskAdvices.map(advice => h(AdviceCard, { key: advice.skill, advice, t, onPlan: openPlan, onSearch: openSkillSearch }))),
          risks.length > 3 ? h('p', { className: 'ot-hint' }, t('advice.more', { n: risks.length - 3 })) : null) : null

        const matrixTable = h('table', { className: 'ot-matrix' },          h('thead', null, h('tr', null,
            h('th', { className: 'ot-matrix-skill' }, ''),
            teams.map(team => h('th', { key: team.name, title: team.name }, team.name)))),
          h('tbody', null, matrix.map(row => h('tr', { key: row.name },
            h('th', { scope: 'row' }, row.name),
            row.cells.map((count, index) => h('td', {
              key: teams[index].name,
              title: teams[index].name + ' · ' + row.name + ': ' + count,
              style: count ? { background: 'color-mix(in srgb, var(--dsw-alias-brand-primary) ' + Math.round(count / row.max * 46) + '%, transparent)' } : undefined,
            }, count || '—'))))))

        const matrixBlock = h('section', { className: 'ot-block' },
          h('div', { className: 'ot-h3' }, t('org.matrix')),
          h('p', { className: 'ot-hint' }, t('org.matrixHint')),
          h('div', { className: 'ot-matrix-wrap' }, matrixTable))

        return h('div', { className: 'ot-pane ot-org' },
          tree,
          h('div', { className: 'ot-org-main' },
            h('section', { className: 'ot-block' }, head, roster),
            h('div', { className: 'ot-two-col' }, coverageBlock, riskBlock),
            adviceBlock,
            matrixBlock))
      }

      const orgView = renderOrg()

      /* --------------------------------------------------------------- match */

      const planCard = h('section', { className: 'ot-plan ot-block' },
        h('div', { className: 'ot-plan-head' },
          h('div', { className: 'ot-h3' }, t('match.title')),
          h('span', { className: 'ot-muted' }, t('match.formula'))),
        h('label', { className: 'ot-field' },
          h('span', { className: 'ot-field-label' }, t('match.name')),
          h('input', {
            id: 'ot-plan-name',
            className: 'ot-input', value: plan.name, placeholder: t('match.namePlaceholder'),
            onChange: event => updatePlan({ name: event.target.value }),
          })),
        h('div', { className: 'ot-field-row' },
          h('label', { className: 'ot-field' },
            h('span', { className: 'ot-field-label' }, t('match.size')),
            h('input', {
              className: 'ot-input', type: 'number', min: 2, max: 8, value: plan.size,
              onChange: event => updatePlan({ size: clamp(Number(event.target.value) || 4, 2, 8) }),
            })),
          h('label', { className: 'ot-field' },
            h('span', { className: 'ot-field-label' }, t('match.maxPerTeam')),
            h('input', {
              className: 'ot-input', type: 'number', min: 1, max: 4, value: plan.maxPerTeam,
              onChange: event => updatePlan({ maxPerTeam: clamp(Number(event.target.value) || 2, 1, 4) }),
            }))),
        h('div', { className: 'ot-skills-head' },
          h('span', { className: 'ot-field-label' }, t('match.skills')),
          h('button', {
            type: 'button',
            className: 'ot-link-btn',
            onClick: addSkill,
            disabled: !remainingSkills.length,
            title: remainingSkills.length ? t('match.addSkill') : t('match.noMoreSkills'),
          }, '+ ' + t('match.addSkill'))),
        h('div', { className: 'ot-req-list' },
          plan.skills.map((skill, index) => h('div', { key: index, className: 'ot-req' },
            h('div', { className: 'ot-req-top' },
              h('select', {
                className: 'ot-select ot-req-name', value: skill.name,
                'aria-label': t('match.skills'),
                onChange: event => updateSkill(index, { name: event.target.value }),
              }, skillNames.map(name => h('option', { key: name, value: name }, name))),
              h('button', {
                type: 'button', className: 'ot-icon-btn ot-icon-btn-sm', 'aria-label': t('common.remove'),
                onClick: () => removeSkill(index),
              }, h(Icon, { name: 'close', size: 13 }))),
            h('div', { className: 'ot-req-bottom' },
              h('label', { className: 'ot-mini-field' },
                h('span', null, t('match.skillLevel')),
                h('select', {
                  className: 'ot-select ot-select-sm', value: skill.min,
                  onChange: event => updateSkill(index, { min: Number(event.target.value) }),
                }, [1, 2, 3, 4, 5].map(level => h('option', { key: level, value: level }, 'Lv.' + level)))),
              h('label', { className: 'ot-mini-field' },
                h('span', null, t('match.weight')),
                h('select', {
                  className: 'ot-select ot-select-sm', value: skill.weight,
                  onChange: event => updateSkill(index, { weight: Number(event.target.value) }),
                }, [1, 2, 3].map(weight => h('option', { key: weight, value: weight }, String(weight)))))))),
        h(Btn, { tone: 'primary', icon: 'target', onClick: () => run(true), disabled: !plan.skills.length },
          t('match.run')),
        h('div', { className: 'ot-history' },
          h('div', { className: 'ot-h3' }, t('match.saved')),
          history.length
            ? history.map((entry, index) => h('button', {
              key: index, type: 'button', className: 'ot-history-row', onClick: () => loadHistory(entry),
            },
              h('span', { className: 'ot-history-name' }, entry.name),
              h('span', { className: 'ot-history-meta' }, entry.size + ' ' + t('match.peopleUnit') + ' · ' + t('match.historyScore', { n: entry.score })),
              h('span', { className: 'ot-history-time' }, formatTime(entry.ts))))
            : h('p', { className: 'ot-muted' }, t('match.none')))),
        h('p', { className: 'ot-footnote' }, t('footer.note')),
      )

      const renderResult = (resultItem, index) => {
        const open = expanded === index
        const impact = orgImpact(resultItem.team, employees)
        const backups = backupCandidates(resultItem, employees)
        const members = resultItem.team.map(member => {
          const covers = resultItem.requirements
            .filter(requirement => {
              const providerIds = resultItem.providers[requirement.name] || []
              return providerIds.includes(member.id) && employeeLevel(member, requirement.name) >= requirement.min
            })
            .map(requirement => requirement.name)
          return { member, covers }
        })
        const solo = resultItem.requirements
          .map(requirement => {
            const holders = resultItem.team.filter(member => employeeLevel(member, requirement.name) >= requirement.min)
            return holders.length === 1 ? { name: requirement.name, min: requirement.min, member: holders[0] } : null
          })
          .filter(Boolean)
        const gapAdvices = resultItem.gaps
          .map(gap => buildGapAdvice(resultItem.team, employees, { name: gap.name, min: gap.min }, locale))
          .filter(Boolean)
        const soloAdvices = solo
          .map(item => buildSoloAdvice(resultItem.team, item.name, item.min, locale))
          .filter(Boolean)
        const advices = [...gapAdvices, ...soloAdvices]
        return h('article', { key: index, className: 'ot-result', 'data-on': open ? '' : undefined },
          h('div', { className: 'ot-result-head' },
            h('span', { className: 'ot-rank', 'data-rank': index + 1 }, index + 1),
            h('div', { className: 'ot-score', 'data-tone': scoreTone(resultItem.score) },
              h('span', { className: 'ot-score-ring', style: { '--ot-p': resultItem.score } },
                h('span', { className: 'ot-score-inner' },
                  h('b', null, resultItem.score),
                  h('span', null, t('match.score'))))),
            h('div', { className: 'ot-result-title' },
              h('div', { className: 'ot-result-name' }, t('match.result', { n: index + 1 })),
              h('div', { className: 'ot-avatars' },
                resultItem.team.map(member => h(Avatar, { key: member.id, employee: member, size: 26 })),
                h('span', { className: 'ot-result-meta' }, resultItem.team.map(member => member.name).join('、'))),
              h('div', { className: 'ot-muted' },
                resultItem.team.length + ' ' + t('match.peopleUnit') + ' · ' +
                t('match.coverage') + ' ' + Math.round(resultItem.coverage * 100) + '% · ' +
                t('match.teamCount', { n: Object.keys(resultItem.deptCounts).length }))),
            h('button', {
              type: 'button', className: 'ot-link-btn ot-result-toggle',
              onClick: () => setExpanded(open ? -1 : index),
              'aria-expanded': open,
            }, open ? t('match.hideMembers') : t('match.showMembers'))),
          h('div', { className: 'ot-breakdown' },
            [
              [t('match.coverage'), resultItem.coverage, '#8b5cf6'],
              [t('match.depth'), resultItem.depth, '#4c7df0'],
              [t('match.availability'), resultItem.availability, '#17a398'],
              [t('match.balance'), resultItem.balance, '#e0932f'],
              [t('match.synergy'), resultItem.synergy, '#e05a7d'],
            ].map(row => h('div', { key: row[0], className: 'ot-bd-row', style: { '--ot-dim': row[2] } },
              h('span', { className: 'ot-bd-label' }, row[0]),
              h('span', { className: 'ot-bd-track' }, h('i', { style: { width: Math.round(clamp(row[1], 0, 1) * 100) + '%' } })),
              h('span', { className: 'ot-bd-num' }, Math.round(clamp(row[1], 0, 1) * 100) + '%')))),
          h('div', { className: 'ot-gaps', 'data-warn': resultItem.gaps.length ? '' : undefined },
            h('span', { className: 'ot-gap-label' }, t('match.gaps')),
            resultItem.gaps.length
              ? resultItem.gaps.map(gap => h('span', { key: gap.name, className: 'ot-gap' },
                h(Icon, { name: 'alert', size: 12 }), t('match.gapItem', { skill: gap.name, min: gap.min, best: gap.best })))
              : h('span', { className: 'ot-good' }, t('match.noGaps'))),
          solo.length ? h('div', { className: 'ot-gaps', 'data-warn': '' },
            h('span', { className: 'ot-gap-label' }, t('org.singlePoint')),
            solo.map(row => h('span', { key: row.name, className: 'ot-gap' },
              h(Icon, { name: 'alert', size: 12 }), row.name + ' · ' + row.member.name))) : null,
          open ? h('div', { className: 'ot-result-body' },
            h('div', { className: 'ot-table-wrap' },
              h('table', { className: 'ot-table' },
                h('thead', null, h('tr', null,
                  h('th', null, t('match.member')),
                  h('th', null, t('match.role')),
                  h('th', null, t('match.team')),
                  h('th', null, t('match.capacity')))),
                h('tbody', null, members.map(row => h('tr', { key: row.member.id },
                  h('td', null, h('span', { className: 'ot-table-person' },
                    h(Avatar, { employee: row.member, size: 24 }), row.member.name)),
                  h('td', null, h('span', { className: 'ot-chip-wrap' },
                    row.covers.length
                      ? row.covers.map(name => h('span', { key: name, className: 'ot-mini-chip' }, name))
                      : h('span', { className: 'ot-muted' }, '—'))),
                  h('td', null, row.member.team),
                  h('td', null, row.member.available + '%')))))),
            advices.length ? h('div', { className: 'ot-advice-section' },
              h('div', { className: 'ot-h3' }, t('advice.section')),
              h('p', { className: 'ot-hint' }, t('advice.matchHint')),
              h('div', { className: 'ot-advice-list' },
                advices.slice(0, 4).map(advice => h(AdviceCard, { key: advice.skill, advice, t, onPlan: openPlan, onSearch: openSkillSearch }))),
              advices.length > 4 ? h('p', { className: 'ot-hint' }, t('advice.more', { n: advices.length - 4 })) : null) : h('p', { className: 'ot-good' }, t('advice.none')),
            h('div', { className: 'ot-impact' },
              h('div', { className: 'ot-h3' }, t('match.impact')),
              h('p', { className: 'ot-hint' }, t('match.impactHint')),
              impact.map(row => h('div', { key: row.team, className: 'ot-impact-row' },
                h('span', { className: 'ot-impact-name' }, row.team),
                h('span', { className: 'ot-impact-bar' }, h('i', { style: { width: row.afterPct + '%' } })),
                h('span', { className: 'ot-impact-num' + (row.afterPct < 50 ? ' ot-warn' : '') }, row.afterPct + '%'),
                h('span', { className: 'ot-muted' }, t('match.impactWarn', { team: row.team, n: row.drawnPct }))))),
            backups.length && resultItem.gaps.length ? h('div', { className: 'ot-impact' },
              h('div', { className: 'ot-h3' }, t('match.backup')),
              h('p', { className: 'ot-hint' }, t('match.backupHint')),
              h('div', { className: 'ot-chip-wrap' }, backups.map(row => h('button', {
                key: row.employee.id, type: 'button', className: 'ot-backup',
                onClick: () => { setSelectedId(row.employee.id); setTab('talent') },
              }, h(Icon, { name: 'plus', size: 12 }), row.employee.name + ' · ' + row.employee.team)))) : null,
          ) : null,
        )
      }

      const projectPanel = topResult ? h('section', { className: 'ot-project' },
        h('div', { className: 'ot-project-head' },
          h('div', null,
            h('div', { className: 'ot-h3' }, t('project.title')),
            h('p', { className: 'ot-hint' }, t('project.hint'))),
          h('span', { className: 'ot-project-status', 'data-status': projectStatus }, t('project.status.' + projectStatus))),
        h('div', { className: 'ot-project-meta' },
          h('label', { className: 'ot-project-field' },
            h('span', null, t('project.name')),
            h('input', {
              className: 'ot-input',
              value: projectNameValue,
              placeholder: defaultProjectName,
              onChange: event => setProjectName(event.target.value),
            })),
          h('div', { className: 'ot-project-field' },
            h('span', null, t('project.goal')),
            h('p', null, activeProjectPlan.goal || activeProjectPlan.name || t('project.noGoal')))),
        h('div', { className: 'ot-project-members' },
          projectMembers.map(row => h('div', { key: row.member.id, className: 'ot-project-member' },
            h(Avatar, { employee: row.member, size: 26 }),
            h('div', { className: 'ot-project-member-id' },
              h('b', null, row.member.name),
              h('small', null, row.member.role)),
            h('div', { className: 'ot-project-covers' },
              row.covers.length
                ? row.covers.slice(0, 3).map(name => h('span', { key: name, className: 'ot-mini-chip' }, name))
                : h('span', { className: 'ot-muted' }, '—')),
            h('span', { className: 'ot-project-avail' }, row.member.available + '%')))),
        h('div', { className: 'ot-project-actions' },
          h(Btn, { small: true, tone: savedProject ? undefined : 'primary', icon: 'check', onClick: () => saveProject(false) },
            savedProject ? t('project.save') : t('project.create')),
          savedProject
            ? (savedProject.startedAt
              ? h(Btn, { small: true, icon: 'check', onClick: () => setTab('workspace') }, t('project.enterWorkspace'))
              : h(Btn, { small: true, tone: 'primary', icon: 'target', onClick: () => startProject(savedProject) }, t('project.start')))
            : null,
          h(Btn, { small: true, icon: 'alert', onClick: () => setProjectFormOpen(previous => !previous) }, t('project.feedback')),
          h(Btn, {
            small: true,
            onClick: () => {
              const node = document.getElementById('ot-plan-name')
              if (node) {
                if (typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'center' })
                node.focus()
              }
            },
          }, t('project.adjust'))),
        projectFormOpen ? h('div', { className: 'ot-project-form' },
          h('div', { className: 'ot-project-form-head' },
            h('div', { className: 'ot-h3' }, t('project.feedbackTitle')),
            h('button', { type: 'button', className: 'ot-icon-btn', 'aria-label': t('common.close'), onClick: () => setProjectFormOpen(false) },
              h(Icon, { name: 'close', size: 13 }))),
          h('label', { className: 'ot-project-field' },
            h('span', null, t('project.outcome')),
            h('textarea', {
              className: 'ot-textarea',
              rows: 2,
              value: projectOutcome,
              placeholder: t('project.outcomePlaceholder'),
              onChange: event => setProjectOutcome(event.target.value),
            })),
          h('label', { className: 'ot-project-field' },
            h('span', null, t('project.issues')),
            h('textarea', {
              className: 'ot-textarea',
              rows: 2,
              value: projectIssues,
              placeholder: t('project.issuesPlaceholder'),
              onChange: event => setProjectIssues(event.target.value),
            })),
          h('label', { className: 'ot-project-field' },
            h('span', null, t('project.adjustment')),
            h('textarea', {
              className: 'ot-textarea',
              rows: 2,
              value: projectAdjustment,
              placeholder: t('project.adjustmentPlaceholder'),
              onChange: event => setProjectAdjustment(event.target.value),
            })),
          h('div', { className: 'ot-project-form-actions' },
            h(Btn, { small: true, tone: 'primary', icon: 'check', onClick: () => saveProject(true) }, t('project.saveFeedback')),
            h(Btn, { small: true, onClick: () => setProjectFormOpen(false) }, t('project.cancel')))) : null,
        projectNote ? h('p', { className: 'ot-hint ot-note', role: 'status' }, projectNote) : null,
        savedProject && savedProject.feedback.length ? h('div', { className: 'ot-project-history' },
          h('div', { className: 'ot-h3' }, t('project.history', { n: savedProject.feedback.length })),
          savedProject.feedback.slice().reverse().map(entry => h('article', { key: entry.id, className: 'ot-project-feedback' },
            h('div', { className: 'ot-project-feedback-head' },
              h('b', null, projectStatus === 'reviewed' ? t('project.feedbackTitle') : t('project.feedbackTitle')),
              h('span', null, new Date(entry.at).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }))),
            entry.outcome ? h('p', null, h('span', null, t('project.outcome') + '：'), entry.outcome) : null,
            entry.issues ? h('p', null, h('span', null, t('project.issues') + '：'), entry.issues) : null,
            entry.adjustment ? h('p', null, h('span', null, t('project.adjustment') + '：'), entry.adjustment) : null))) : null,
      ) : null

      const resultsPane = h('div', { className: 'ot-results' },
        result
          ? h('div', { className: 'ot-results-inner' },
            h('div', { className: 'ot-results-head' },
              h('span', { className: 'ot-h3' }, t('match.resultsHead', { n: result.results.length })),
              h('span', { className: 'ot-muted' }, t('match.summary', {
                people: employees.length, pool: result.poolSize, teams: result.evaluated, ms: result.elapsed,
              }))),
            dirty ? h('p', { className: 'ot-hint ot-warn' }, t('match.dirty')) : null,
            projectPanel,
            result.results.map(renderResult),
          )
          : h('div', { className: 'ot-empty' },
            h(Icon, { name: 'sparkle', size: 30 }),
            h('p', null, t('match.noResult')),
            h('p', { className: 'ot-muted' }, t('match.noResultHint'))))

      const matchView = h('div', { className: 'ot-pane ot-match' }, planCard, resultsPane)

      const tabs = [
        ['project', t('tab.project'), 'chart'],
        ['pool', t('tab.pool'), 'grid'],
        ['workspace', t('tab.workspace'), 'check'],
        ['talent', t('tab.talent'), 'users'],
        ['org', t('tab.org'), 'org'],
        ['match', t('tab.match'), 'target'],
      ]

      return h('div', { className: 'ot-root' },
        h('style', null, CSS),
        h('header', { className: 'ot-head' },
          h('div', { className: 'ot-brand' },
            h('span', { className: 'ot-mark' }, h(Icon, { name: 'org', size: 18 })),
            h('div', null,
              h('h1', { className: 'ot-title' }, t('page.title')),
              h('p', { className: 'ot-sub' }, t('page.subtitle')))),
          h('div', { className: 'ot-head-actions' },
            h(Btn, { icon: 'upload', small: true, onClick: openImport, title: t('workbench.import') }, t('workbench.import')),
            h(Btn, { icon: 'download', small: true, onClick: doExport, title: t('workbench.export') }, t('workbench.export')))),
        h('nav', { className: 'ot-tabs', role: 'tablist' },
          tabs.map(item => h('button', {
            key: item[0], type: 'button', role: 'tab', className: 'ot-tab',
            id: 'ot-tab-' + item[0],
            'aria-selected': tab === item[0],
            'aria-controls': 'ot-panel-' + item[0],
            tabIndex: tab === item[0] ? 0 : -1,
            'data-on': tab === item[0] ? '' : undefined,
            onClick: () => setTab(item[0]),
            onKeyDown: event => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
              event.preventDefault()
              const current = tabs.findIndex(row => row[0] === tab)
              const next = tabs[(current + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
              setTab(next[0])
              window.setTimeout(() => {
                const node = document.getElementById('ot-tab-' + next[0])
                if (node) node.focus()
              }, 0)
            },
          },
            h(Icon, { name: item[2], size: 14 }),
            h('span', null, item[1]),
            item[0] === 'project' && projects.length ? h('span', { className: 'ot-tab-num' }, projects.length)
              : item[0] === 'pool' ? h('span', { className: 'ot-tab-num' }, requirementPool.length)
                : item[0] === 'workspace' && workspaceProjects.length ? h('span', { className: 'ot-tab-num' }, workspaceProjects.length)
                  : item[0] === 'talent' ? h('span', { className: 'ot-tab-num' }, employees.length)
                    : item[0] === 'org' ? h('span', { className: 'ot-tab-num' }, teams.length)
                      : null))),
        h('div', {
          className: 'ot-body',
          role: 'tabpanel',
          id: 'ot-panel-' + tab,
          'aria-labelledby': 'ot-tab-' + tab,
        },
          tab === 'project' ? projectView : tab === 'pool' ? poolView : tab === 'workspace' ? workspaceView : tab === 'talent' ? talentView : tab === 'org' ? orgView : matchView),
        note && tab !== 'talent' ? h('div', { className: 'ot-toast', role: 'status' }, note) : null,
        skillSearchDialog,
      )
    }

    /* -------------------------------------------------------------------- css */

    const CSS = `
.ot-root{--ot-line:var(--dsw-alias-border-l1);--ot-line-2:var(--dsw-alias-border-l2);--ot-card:var(--dsw-alias-bg-layer-1);--ot-card-2:var(--dsw-alias-bg-layer-2);--ot-muted:var(--dsw-alias-label-secondary);--ot-faint:color-mix(in srgb,var(--dsw-alias-label-secondary) 88%,var(--dsw-alias-bg-base));--ot-brand:var(--dsw-alias-brand-primary);--ot-dept:var(--dsw-alias-brand-primary);height:100%;display:flex;flex-direction:column;min-width:0;overflow:hidden;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.55}
.ot-root *,.ot-root *:before,.ot-root *:after{box-sizing:border-box}
.ot-root button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:left}
.ot-root h1,.ot-root h2,.ot-root h3,.ot-root p{margin:0}
.ot-root svg{display:block}
.ot-head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:14px 20px;padding:26px 28px 0}
html[data-platform='darwin'] .ot-head{padding-top:calc(26px + var(--dsh-frame-top-clearance,0px))}
.ot-brand{display:flex;align-items:center;gap:13px;min-width:0}
.ot-mark{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;flex:none;color:var(--ot-brand);background:color-mix(in srgb,var(--ot-brand) 12%,var(--ot-card));border:1px solid color-mix(in srgb,var(--ot-brand) 26%,transparent)}
.ot-title{font-size:21px;line-height:28px;font-weight:600;letter-spacing:.005em}
.ot-sub{font-size:13px;line-height:19px;color:var(--ot-muted);margin-top:2px}
.ot-head-actions{display:flex;gap:8px;flex:none;padding-top:4px}
.ot-tabs{display:flex;gap:3px;align-self:flex-start;max-width:calc(100% - 56px);overflow-x:auto;scrollbar-width:none;margin:18px 28px 0;padding:4px;border:1px solid var(--ot-line);border-radius:999px;background:var(--ot-card)}
.ot-tabs::-webkit-scrollbar{display:none}
.ot-tab{flex:none}
.ot-tab{display:flex;align-items:center;gap:7px;height:34px;padding:0 15px;border-radius:999px;font-size:13px;color:var(--ot-muted);transition:background .15s,color .15s}
.ot-tab:hover{color:var(--dsw-alias-label-primary)}
.ot-tab[data-on]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}
.ot-tab[data-on] svg{color:var(--ot-brand)}
.ot-tab-num{display:inline-flex;align-items:center;justify-content:center;min-width:19px;height:19px;padding:0 6px;border-radius:10px;font-size:11px;background:color-mix(in srgb,var(--ot-brand) 13%,var(--ot-card));color:color-mix(in srgb,var(--ot-brand) 72%,var(--dsw-alias-label-primary))}
.ot-body{flex:1;min-height:0;display:flex;flex-direction:column;padding-top:18px}
.ot-pane{flex:1;min-height:0;display:flex;flex-direction:column;padding:0 28px 24px}
.ot-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:32px;padding:0 13px;border-radius:9px;border:1px solid var(--ot-line);background:var(--ot-card);color:var(--dsw-alias-label-primary);font-size:12.5px;white-space:nowrap;transition:background .15s,border-color .15s,opacity .15s}
.ot-btn:hover{background:var(--ot-card-2);border-color:var(--ot-line-2)}
.ot-btn:focus-visible{outline:2px solid color-mix(in srgb,var(--ot-brand) 60%,transparent);outline-offset:1px}
.ot-btn:disabled{opacity:.45;cursor:not-allowed}
.ot-btn-primary{background:var(--ot-brand);border-color:transparent;color:#fff;font-weight:500;width:100%;height:36px;margin-top:14px}
.ot-btn-primary:hover{background:var(--ot-brand);opacity:.9;border-color:transparent}
.ot-btn-danger{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 40%,transparent)}
.ot-btn-sm{height:28px;padding:0 10px;font-size:12px;border-radius:8px}
.ot-input,.ot-select{height:32px;border-radius:9px;border:1px solid var(--ot-line);background:var(--dsw-alias-bg-base);color:inherit;padding:0 9px;font:inherit;font-size:13px;outline:none;min-width:0}
.ot-input:focus,.ot-select:focus,.ot-textarea:focus{border-color:color-mix(in srgb,var(--ot-brand) 65%,var(--ot-line));box-shadow:0 0 0 2px color-mix(in srgb,var(--ot-brand) 14%,transparent)}
.ot-select{padding-right:5px}
.ot-search{position:relative;display:flex;align-items:center;gap:6px;flex:1;min-width:180px;max-width:360px}
.ot-search svg{position:absolute;left:10px;color:var(--ot-faint);pointer-events:none}
.ot-search .ot-input{width:100%;padding-left:31px}
.ot-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px}
.ot-toolbar-right{display:flex;align-items:center;gap:10px;margin-left:auto}
.ot-chips{display:flex;flex-wrap:wrap;gap:5px;min-width:0}
.ot-chip-btn{height:28px;padding:0 11px;border-radius:999px;border:1px solid transparent;color:var(--ot-muted);font-size:12.5px}
.ot-chip-btn:hover{background:var(--ot-card);color:var(--dsw-alias-label-primary)}
.ot-chip-btn[data-on]{background:color-mix(in srgb,var(--ot-brand) 12%,var(--ot-card));color:color-mix(in srgb,var(--ot-brand) 72%,var(--dsw-alias-label-primary));border-color:color-mix(in srgb,var(--ot-brand) 26%,transparent)}
.ot-toggle{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ot-muted);cursor:pointer;white-space:nowrap}
.ot-toggle input{accent-color:var(--ot-brand);margin:0}
.ot-sort{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ot-muted);white-space:nowrap}
.ot-sort .ot-select{height:30px}
.ot-import{margin-bottom:14px}
.ot-import-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.ot-import-file{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px}
.ot-import-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:10px}
.ot-spacer{flex:1}
.ot-reset-ask{display:flex;align-items:center;gap:9px;flex-wrap:wrap;font-size:12.5px;color:var(--ot-muted)}
.ot-textarea{width:100%;margin-top:9px;padding:11px 12px;border-radius:10px;border:1px solid var(--ot-line);background:var(--dsw-alias-bg-base);color:inherit;font:12px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;resize:vertical;outline:none;min-height:82px}
.ot-status{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ot-muted);padding:0 2px 14px;min-height:22px}
.ot-status-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-success-primary);flex:none}
.ot-note{color:var(--ot-brand);margin-left:4px}
.ot-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:20px}
.ot-stat{border:1px solid var(--ot-line);background:var(--ot-card);border-radius:14px;padding:14px 16px;display:grid;grid-template-columns:34px minmax(0,1fr);grid-template-rows:auto auto;gap:2px 12px;align-items:center}
.ot-stat-icon{grid-row:1/3;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;color:color-mix(in srgb,var(--ot-accent) 68%,var(--dsw-alias-label-primary));background:color-mix(in srgb,var(--ot-accent) 14%,var(--ot-card));border:1px solid color-mix(in srgb,var(--ot-accent) 26%,transparent)}
.ot-stat-body{display:flex;flex-direction:column;gap:1px;min-width:0;grid-column:2;grid-row:1/3}
.ot-stat b{font-size:26px;line-height:30px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.ot-stat b small{font-size:12px;line-height:16px;font-weight:500;color:var(--ot-muted);margin-left:4px;letter-spacing:0}
.ot-stat-body span{font-size:12px;line-height:16px;color:var(--ot-muted)}
.ot-stat{width:100%;text-align:left;cursor:pointer;transition:border-color .15s,background .15s}
.ot-stat:hover{border-color:var(--ot-line-2);background:var(--ot-card-2)}
.ot-stat[data-on]{border-color:color-mix(in srgb,var(--ot-brand) 55%,var(--ot-line));background:color-mix(in srgb,var(--ot-brand) 6%,var(--ot-card))}
.ot-stat:focus-visible{outline:2px solid color-mix(in srgb,var(--ot-brand) 55%,transparent);outline-offset:1px}
.ot-stat-panel{display:flex;flex-direction:column;gap:8px;margin:-4px 0 18px;padding:14px 16px;border:1px solid var(--ot-line-2);border-radius:14px;background:var(--ot-card)}
.ot-stat-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.ot-stat-panel-body{display:flex;flex-direction:column;gap:2px;max-height:260px;overflow:auto;min-height:0}
.ot-stat-line{display:flex;align-items:center;gap:10px;width:100%;padding:7px 7px;border-radius:8px;font-size:12px;text-align:left;color:var(--dsw-alias-label-primary)}
.ot-stat-line:hover{background:var(--ot-card-2)}
.ot-stat-line b{font-size:12.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none;max-width:190px}
.ot-stat-line .ot-stat-meta{font-size:11.5px;color:var(--ot-muted);margin-left:auto;text-align:right;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-stat-line svg{color:var(--ot-faint);flex:none}
.ot-stat-subhead{display:flex;align-items:baseline;gap:10px;margin-top:8px;padding:4px 7px 2px;border-top:1px solid var(--ot-line)}
.ot-stat-subhead b{font-size:12.5px;font-weight:600}
.ot-stat-subhead .ot-hint{font-size:11px}
.ot-stat-panel .ot-stat-line .ot-avatar{flex:none}
.ot-wb-body{position:relative;flex:1;min-height:0;display:flex}
.ot-grid{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(252px,1fr));gap:16px;padding:2px 4px 14px}
.ot-card{display:flex;flex-direction:column;gap:11px;padding:16px;border:1px solid var(--ot-line);border-radius:14px;background:var(--ot-card);box-shadow:inset 3px 0 0 color-mix(in srgb,var(--ot-dept) 70%,transparent);transition:border-color .15s,background .15s,box-shadow .15s;min-width:0}
.ot-card:hover{border-color:var(--ot-line-2);background:color-mix(in srgb,var(--ot-dept) 5%,var(--ot-card))}
.ot-card:focus-visible{outline:2px solid color-mix(in srgb,var(--ot-dept) 55%,transparent);outline-offset:1px}
.ot-card[data-on]{border-color:color-mix(in srgb,var(--ot-dept) 62%,transparent);box-shadow:inset 3px 0 0 var(--ot-dept),0 0 0 1px color-mix(in srgb,var(--ot-dept) 45%,transparent)}
.ot-card-head{display:flex;align-items:center;gap:12px;min-width:0}
.ot-avatar{display:inline-flex;align-items:center;justify-content:center;flex:none;border-radius:50%;background:color-mix(in srgb,var(--ot-dept) 16%,var(--ot-card));border:1px solid color-mix(in srgb,var(--ot-dept) 32%,transparent);color:color-mix(in srgb,var(--ot-dept) 52%,var(--dsw-alias-label-primary));font-weight:600;letter-spacing:.02em}
.ot-card-id{min-width:0;flex:1}
.ot-name{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:14px;font-weight:600;line-height:20px;min-width:0}
.ot-name-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-level-pill{flex:none;margin-left:auto;font-size:11px;font-weight:500;padding:0 6px;height:19px;line-height:19px;border-radius:6px;color:var(--ot-muted);background:var(--ot-card-2);border:1px solid var(--ot-line)}
.ot-role{font-size:12px;line-height:17px;color:var(--ot-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-meta{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ot-muted);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ot-dept-dot{width:7px;height:7px;border-radius:50%;background:var(--ot-dept);opacity:.9;flex:none}
.ot-avail-row{display:flex;align-items:center;gap:8px}
.ot-avail{display:flex;align-items:center;gap:7px;min-width:0;flex:1}
.ot-avail-track{display:block;flex:1;height:6px;border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 10%,transparent);overflow:hidden;min-width:26px}
.ot-avail-track i{display:block;height:100%;border-radius:3px;background:var(--ot-avail-color,var(--ot-brand))}
.ot-avail-dot{width:5px;height:5px;border-radius:50%;background:var(--ot-avail-color,var(--ot-brand));flex:none}
.ot-avail-num{font-size:11.5px;color:var(--ot-muted);font-variant-numeric:tabular-nums;flex:none}
.ot-avail[data-tone="high"]{--ot-avail-color:var(--dsw-alias-state-success-primary)}
.ot-avail[data-tone="mid"]{--ot-avail-color:var(--dsw-alias-state-warn-primary)}
.ot-avail[data-tone="low"]{--ot-avail-color:var(--dsw-alias-state-error-primary)}
.ot-card-skills{display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-height:22px}
.ot-chip{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 7px;border-radius:7px;border:1px solid color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent);background:var(--ot-card-2);font-size:11.5px;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.ot-chip-name{overflow:hidden;text-overflow:ellipsis;max-width:120px}
.ot-chip-meter{display:inline-flex;align-items:flex-end;gap:1px;height:8px}
.ot-chip-meter i{display:block;width:2px;height:5px;border-radius:1px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 14%,transparent)}
.ot-chip-meter i.on{height:8px;background:color-mix(in srgb,var(--ot-brand) 76%,var(--dsw-alias-label-primary))}
.ot-chip-level{font-size:11px;color:var(--ot-faint);font-variant-numeric:tabular-nums}
.ot-more{font-size:11px;color:var(--ot-faint);align-self:center}
.ot-focus{font-size:11.5px;color:var(--ot-muted);line-height:17px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}
.ot-focus span{color:var(--ot-faint)}
.ot-detail{position:absolute;top:0;right:0;bottom:0;width:min(392px,96%);z-index:6;display:flex;flex-direction:column;gap:16px;padding:20px;overflow:auto;border:1px solid var(--ot-line-2);border-top:4px solid var(--ot-dept);border-radius:14px;background:var(--ot-card)}
.ot-detail:focus{outline:none}
.ot-scrim{position:absolute;inset:0;z-index:5;background:color-mix(in srgb,var(--dsw-alias-bg-base) 52%,transparent)}
.ot-detail-head{display:flex;align-items:center;gap:12px}
.ot-detail-id{flex:1;min-width:0}
.ot-detail-name{font-size:17px;line-height:23px;font-weight:600}
.ot-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9px;color:var(--ot-muted);flex:none}
.ot-icon-btn:hover{background:var(--ot-card-2);color:var(--dsw-alias-label-primary)}
.ot-icon-btn-sm{width:24px;height:24px}
.ot-detail-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 14px;padding:14px;border-radius:11px;background:var(--dsw-alias-bg-base);border:1px solid var(--ot-line)}
.ot-meta-cell{display:flex;flex-direction:column;gap:2px;min-width:0}
.ot-meta-cell span{font-size:11px;color:var(--ot-faint)}
.ot-meta-cell b{font-size:12.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-meta-cell:last-child:nth-child(3n+1){grid-column:1/-1}
.ot-focus-box{display:flex;flex-direction:column;gap:5px}
.ot-block-label{font-size:11px;color:var(--ot-faint)}
.ot-focus-box p{font-size:13px;line-height:20px}
.ot-detail-section{display:flex;flex-direction:column;gap:9px}
.ot-h3{font-size:13px;font-weight:600;line-height:19px}
.ot-hint{font-size:12px;color:var(--ot-muted);line-height:18px}
.ot-skill-list{display:flex;flex-direction:column;gap:8px}
.ot-skill-row{display:flex;align-items:center;gap:10px;min-height:26px}
.ot-skill-name{font-size:12.5px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-level{display:inline-flex;gap:3px;flex:none}
.ot-level i{display:block;width:11px;height:6px;border-radius:2px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 10%,transparent)}
.ot-level i.on{background:color-mix(in srgb,var(--ot-brand) 82%,var(--dsw-alias-label-primary))}
.ot-level-sm i{width:7px;height:4px}
.ot-skill-lv{font-size:11px;color:var(--ot-muted);width:34px;text-align:right;font-variant-numeric:tabular-nums}
.ot-chip-wrap{display:flex;flex-wrap:wrap;gap:5px}
.ot-detail-foot{margin-top:auto;padding-top:6px}
.ot-detail-foot .ot-btn{width:100%}
.ot-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--ot-muted);padding:44px 20px;text-align:center;min-height:220px}
.ot-empty svg{opacity:.5;margin-bottom:3px}
.ot-empty p{font-size:13.5px}
.ot-empty .ot-muted{font-size:12.5px;max-width:360px}
.ot-muted{color:var(--ot-muted)}
.ot-good{color:var(--dsw-alias-state-success-primary)}
.ot-warn{color:var(--dsw-alias-state-warn-primary)}
.ot-bad{color:var(--dsw-alias-state-error-primary)}
.ot-footnote{font-size:11px;color:var(--ot-faint);padding:9px 2px 0;line-height:16px}
.ot-block{border:1px solid var(--ot-line);border-radius:14px;background:var(--ot-card);padding:16px}
.ot-org{flex-direction:row;gap:16px}
.ot-tree{width:248px;flex:none;overflow:auto;padding:2px 8px 2px 2px}
.ot-tree-dept{margin-bottom:14px}
.ot-tree-dept-name{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:0 9px 5px;font-size:11.5px;color:var(--ot-faint);letter-spacing:.02em}
.ot-tree-dept-label{display:flex;align-items:center;gap:7px}
.ot-tree-dept-dot{width:7px;height:7px;border-radius:50%;background:var(--ot-dept);flex:none}
.ot-tree-dept-count{font-size:11px;font-variant-numeric:tabular-nums}
.ot-tree-team{display:flex;align-items:center;justify-content:space-between;gap:6px;width:100%;height:34px;padding:0 10px;border-radius:9px;font-size:13px;color:var(--ot-muted)}
.ot-tree-team:hover{background:var(--ot-card);color:var(--dsw-alias-label-primary)}
.ot-tree-team[data-on]{background:color-mix(in srgb,var(--ot-brand) 12%,var(--ot-card));color:color-mix(in srgb,var(--ot-brand) 72%,var(--dsw-alias-label-primary));font-weight:500}
.ot-tree-count{font-size:11px;padding:0 6px;height:18px;line-height:18px;border-radius:6px;background:var(--ot-card);color:var(--ot-muted);font-weight:400}
.ot-org-main{flex:1;min-width:0;overflow:auto;display:flex;flex-direction:column;gap:16px;padding-right:2px}
.ot-team-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:12px}
.ot-h2{font-size:16px;line-height:22px;font-weight:600}
.ot-team-stats{display:flex;gap:16px;font-size:12px;color:var(--ot-muted);flex-wrap:wrap}
.ot-team-stats b{font-size:13.5px;color:var(--dsw-alias-label-primary);font-weight:600}
.ot-roster{display:flex;flex-direction:column;gap:2px}
.ot-roster-row{display:flex;align-items:center;gap:12px;padding:9px 8px;border-radius:9px;transition:background .15s}
.ot-roster-row:hover{background:color-mix(in srgb,var(--ot-dept) 6%,var(--ot-card))}
.ot-roster-id{width:124px;flex:none;min-width:0}
.ot-roster-name{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500}
.ot-lead{font-size:11px;font-weight:500;padding:0 5px;height:18px;line-height:18px;border-radius:5px;color:color-mix(in srgb,var(--ot-dept) 72%,var(--dsw-alias-label-primary));background:color-mix(in srgb,var(--ot-dept) 12%,var(--ot-card))}
.ot-roster-skills{display:flex;flex-wrap:wrap;gap:5px;flex:1;min-width:0}
.ot-roster-row .ot-avail{max-width:136px}
.ot-link-btn{font-size:12px;color:color-mix(in srgb,var(--ot-brand) 78%,var(--dsw-alias-label-primary));white-space:nowrap;padding:3px 5px;border-radius:6px;flex:none}
.ot-link-btn:hover{background:color-mix(in srgb,var(--ot-brand) 10%,transparent)}
.ot-link-btn:disabled{opacity:.45;cursor:default}
.ot-link-btn:disabled:hover{background:transparent}
.ot-two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ot-cov-list{display:flex;flex-direction:column;gap:8px;margin-top:9px}
.ot-cov-row{display:flex;align-items:center;gap:9px}
.ot-cov-name{width:96px;flex:none;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-cov-track{flex:1;height:6px;border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);overflow:hidden}
.ot-cov-track i{display:block;height:100%;border-radius:3px;background:var(--ot-brand);opacity:.72}
.ot-cov-num{width:58px;text-align:right;font-size:11px;color:var(--ot-muted);flex:none}
.ot-risk-list{display:flex;flex-direction:column;gap:7px;margin-top:9px}
.ot-risk{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--dsw-alias-state-warn-primary)}
.ot-risk-count{margin-left:auto;font-size:11px;color:var(--ot-muted);font-variant-numeric:tabular-nums}
.ot-advice-section{display:flex;flex-direction:column;gap:8px}
.ot-advice-list{display:flex;flex-direction:column;gap:10px}
.ot-advice{display:flex;flex-direction:column;gap:5px;padding:11px 12px;border:1px solid var(--ot-line);border-left:3px solid color-mix(in srgb,var(--ot-advice-color) 65%,var(--ot-line));border-radius:10px;background:var(--dsw-alias-bg-base)}
.ot-advice[data-action="upskill"]{--ot-advice-color:var(--dsw-alias-brand-primary)}
.ot-advice[data-action="mentor"]{--ot-advice-color:var(--dsw-alias-state-success-primary)}
.ot-advice[data-action="knowledge"]{--ot-advice-color:var(--dsw-alias-state-warn-primary)}
.ot-advice[data-action="external"]{--ot-advice-color:var(--dsw-alias-state-error-primary)}
.ot-advice-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.ot-advice-skill{font-size:13px;font-weight:600;line-height:19px}
.ot-advice-badge{font-size:11px;line-height:18px;padding:0 7px;border-radius:999px;white-space:nowrap;color:color-mix(in srgb,var(--ot-advice-color) 72%,var(--dsw-alias-label-primary));background:color-mix(in srgb,var(--ot-advice-color) 12%,transparent);border:1px solid color-mix(in srgb,var(--ot-advice-color) 28%,transparent)}
.ot-advice-diagnosis{font-size:11.5px;line-height:17px;color:var(--ot-muted)}
.ot-advice-reason{font-size:12px;line-height:18px;color:color-mix(in srgb,var(--ot-advice-color) 58%,var(--dsw-alias-label-primary))}
.ot-advice-row{display:flex;align-items:baseline;gap:8px;font-size:12px;line-height:18px}
.ot-advice-label{width:56px;flex:none;font-size:11px;color:var(--ot-faint)}
.ot-advice-value{color:var(--dsw-alias-label-primary);min-width:0}
.ot-advice-topics{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:2px}
.ot-topic{font-size:11px;line-height:18px;padding:0 6px;border-radius:5px;background:var(--ot-card-2);color:var(--ot-muted)}
.ot-train{display:flex;flex-direction:column;gap:10px;padding-top:16px;border-top:1px solid var(--ot-line)}
.ot-train-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.ot-train-actions{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}
.ot-train-pool{display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-height:24px}
.ot-train-chip{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 5px 0 8px;border-radius:7px;border:1px solid var(--ot-line);background:var(--ot-card-2);font-size:11.5px;color:var(--dsw-alias-label-primary)}
.ot-train-remove{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:4px;color:var(--ot-faint)}
.ot-train-remove:hover{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent);color:var(--dsw-alias-state-error-primary)}
.ot-train-empty{font-size:11.5px;color:var(--ot-faint)}
.ot-train-status{--ot-train-color:var(--dsw-alias-label-secondary);display:flex;flex-direction:column;gap:3px;padding:10px 11px;border-radius:9px;border:1px solid var(--ot-line);background:color-mix(in srgb,var(--ot-train-color) 6%,transparent)}
.ot-train-status[data-tone="ok"]{--ot-train-color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb,var(--ot-train-color) 30%,transparent)}
.ot-train-status[data-tone="warn"]{--ot-train-color:var(--dsw-alias-state-warn-primary);border-color:color-mix(in srgb,var(--ot-train-color) 32%,transparent)}
.ot-train-status[data-tone="empty"]{--ot-train-color:var(--dsw-alias-label-secondary);background:transparent}
.ot-train-status-title{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:color-mix(in srgb,var(--ot-train-color) 55%,var(--dsw-alias-label-primary))}
.ot-train-status-hint{font-size:11.5px;line-height:17px;color:var(--ot-muted)}
.ot-train-plan{display:flex;flex-direction:column;gap:4px}
.ot-train-row{display:flex;align-items:baseline;gap:10px;font-size:12px;line-height:18px}
.ot-train-label{width:48px;flex:none;font-size:11px;color:var(--ot-faint)}
.ot-train-topics{display:flex;flex-wrap:wrap;align-items:center;gap:5px}
.ot-train-fix{align-self:flex-start;margin-top:1px}
.ot-skill-center{display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid var(--ot-line);border-radius:10px;background:var(--dsw-alias-bg-base)}
.ot-skill-center-head{display:flex;align-items:center;gap:6px}
.ot-skill-center-head .ot-input{flex:1;height:30px;font-size:12px}
.ot-skill-groups{display:flex;flex-direction:column;gap:6px;max-height:220px;overflow:auto;padding-right:2px}
.ot-skill-group-title{font-size:11px;color:var(--ot-faint);padding:2px 2px}
.ot-skill-option{display:flex;align-items:flex-start;gap:7px;padding:5px 6px;border-radius:7px;cursor:pointer}
.ot-skill-option:hover{background:var(--ot-card-2)}
.ot-skill-option input{margin:2px 0 0;accent-color:var(--ot-brand);flex:none}
.ot-skill-option-text{display:flex;flex-direction:column;gap:1px;min-width:0}
.ot-skill-option-text b{font-size:12px;font-weight:500;line-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-skill-option-text small{font-size:11px;line-height:16px;color:var(--ot-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ot-skill-center-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid var(--ot-line);padding-top:8px}
.ot-manual{display:flex;gap:6px}
.ot-manual .ot-input{flex:1;height:28px;font-size:12px}
.ot-advice-open{align-self:flex-start;margin-top:1px}
.ot-advice-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:1px}
.ot-advice-actions .ot-advice-open{margin-top:0}
.ot-train-suggest{display:flex;flex-direction:column;gap:5px;padding:8px 9px;border:1px dashed var(--ot-line);border-radius:9px;background:color-mix(in srgb,var(--ot-brand) 3%,transparent)}
.ot-train-suggest .ot-train-label{width:auto;color:var(--ot-muted)}
.ot-suggest-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:3px 8px;border-radius:7px;border:1px solid var(--ot-line);background:var(--ot-card);color:var(--dsw-alias-label-primary)}
.ot-suggest-chip small{font-size:10.5px;color:var(--ot-faint)}
.ot-suggest-chip:hover{border-color:var(--ot-brand);color:var(--ot-brand)}
.ot-matrix-wrap{overflow:auto;margin-top:9px;border:1px solid var(--ot-line);border-radius:10px}
.ot-matrix{border-collapse:separate;border-spacing:0;width:100%;min-width:640px;font-size:12px}
.ot-matrix th,.ot-matrix td{padding:7px 8px;text-align:center;border-bottom:1px solid color-mix(in srgb,var(--ot-line) 60%,transparent);font-weight:400;white-space:nowrap;height:36px}
.ot-matrix thead th{font-size:11px;color:var(--ot-faint);position:sticky;top:0;background:var(--ot-card);z-index:2}
.ot-matrix tbody th{text-align:left;font-size:12px;color:var(--ot-muted);position:sticky;left:0;background:var(--ot-card);z-index:1;min-width:112px}
.ot-matrix thead th:first-child{left:0;z-index:3}
.ot-matrix tbody tr:last-child th,.ot-matrix tbody tr:last-child td{border-bottom:0}
.ot-matrix td{color:var(--ot-muted);font-variant-numeric:tabular-nums;min-width:56px}
.ot-match{flex-direction:row;gap:18px}
.ot-plan{width:380px;flex:none;overflow:auto;display:flex;flex-direction:column;gap:0}
.ot-plan-head{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.ot-plan-head .ot-muted{font-size:11px;line-height:16px}
.ot-field{display:flex;flex-direction:column;gap:5px;margin-bottom:10px;min-width:0}
.ot-field-label{font-size:11.5px;color:var(--ot-faint)}
.ot-field-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ot-skills-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:16px 0 8px;padding-top:16px;border-top:1px solid var(--ot-line)}
.ot-req-list{display:flex;flex-direction:column;gap:8px}
.ot-req{padding:9px 10px;border:1px solid var(--ot-line);border-radius:10px;background:var(--dsw-alias-bg-base)}
.ot-req-top{display:flex;align-items:center;gap:5px}
.ot-req-name{flex:1;min-width:0;border:0;background:transparent;height:26px;padding:0 2px;font-size:12.5px;font-weight:500}
.ot-req-name:focus{box-shadow:none;border-color:transparent}
.ot-req-bottom{display:flex;gap:12px;margin-top:4px}
.ot-mini-field{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--ot-faint)}
.ot-select-sm{height:25px;font-size:11.5px;padding:0 3px}
.ot-history{margin-top:16px;padding-top:14px;border-top:1px solid var(--ot-line);display:flex;flex-direction:column;gap:5px}
.ot-history .ot-h3{margin-bottom:3px}
.ot-history-row{display:flex;align-items:center;gap:8px;padding:8px 7px;border-radius:8px;font-size:12px;width:100%}
.ot-history-row:hover{background:var(--ot-card-2)}
.ot-history-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-history-meta{color:color-mix(in srgb,var(--ot-brand) 78%,var(--dsw-alias-label-primary));font-size:11px;white-space:nowrap}
.ot-history-time{color:var(--ot-faint);font-size:11px;font-variant-numeric:tabular-nums}
.ot-results{flex:1;min-width:0;overflow:auto;display:flex;flex-direction:column;gap:14px;padding-right:2px}
.ot-results-inner{display:flex;flex-direction:column;gap:14px}
.ot-results-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap}
.ot-results-head .ot-muted{font-size:11.5px}
.ot-result{border:1px solid var(--ot-line);border-radius:14px;background:var(--ot-card);padding:16px;display:flex;flex-direction:column;gap:12px;transition:border-color .15s}
.ot-result[data-on]{border-color:color-mix(in srgb,var(--ot-brand) 42%,var(--ot-line))}
.ot-result-head{display:flex;align-items:center;gap:14px}
.ot-rank{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9px;font-size:13px;font-weight:600;color:color-mix(in srgb,var(--ot-brand) 72%,var(--dsw-alias-label-primary));background:color-mix(in srgb,var(--ot-brand) 12%,var(--ot-card));flex:none}
.ot-rank[data-rank="1"]{color:color-mix(in srgb,#c28a1a 65%,var(--dsw-alias-label-primary));background:color-mix(in srgb,#e8b44a 18%,var(--ot-card))}
.ot-score{display:flex;align-items:center;justify-content:center;width:64px;height:64px;flex:none}
.ot-score-ring{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:conic-gradient(var(--ot-score-color) calc(var(--ot-p) * 1%),color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent) 0)}
.ot-score-inner{display:flex;flex-direction:column;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:var(--ot-card)}
.ot-score b{font-size:20px;line-height:22px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.ot-score-inner span{font-size:11px;line-height:14px;color:var(--ot-faint)}
.ot-score[data-tone="high"]{--ot-score-color:var(--dsw-alias-state-success-primary)}
.ot-score[data-tone="mid"]{--ot-score-color:var(--dsw-alias-brand-primary)}
.ot-score[data-tone="low"]{--ot-score-color:var(--dsw-alias-state-warn-primary)}
.ot-result-title{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.ot-result-name{font-size:14px;font-weight:600}
.ot-avatars{display:flex;align-items:center;gap:0;min-width:0}
.ot-avatars .ot-avatar{margin-left:-7px;box-shadow:0 0 0 2px var(--ot-card)}
.ot-avatars .ot-avatar:first-child{margin-left:0}
.ot-result-meta{margin-left:9px;font-size:12px;color:var(--ot-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-result-toggle{align-self:flex-start;margin-top:3px}
.ot-breakdown{display:grid;grid-template-columns:repeat(2,minmax(140px,1fr));gap:8px 18px}
.ot-bd-row{display:flex;align-items:center;gap:8px}
.ot-bd-label{width:56px;flex:none;font-size:11px;color:var(--ot-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-bd-track{flex:1;height:6px;border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);overflow:hidden}
.ot-bd-track i{display:block;height:100%;border-radius:3px;background:var(--ot-dim,var(--ot-brand));opacity:.9}
.ot-bd-num{width:34px;text-align:right;font-size:11px;color:var(--ot-muted);font-variant-numeric:tabular-nums}
.ot-gaps{display:flex;align-items:flex-start;gap:7px;flex-wrap:wrap;font-size:11.5px;padding:8px 10px;border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent)}
.ot-gaps[data-warn]{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 9%,transparent);box-shadow:inset 2px 0 0 color-mix(in srgb,var(--dsw-alias-state-warn-primary) 55%,transparent)}
.ot-gap-label{color:var(--ot-faint);flex:none;font-size:11px}
.ot-gap{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 10%,transparent);padding:2px 7px;border-radius:6px}
.ot-result-body{display:flex;flex-direction:column;gap:14px;border-top:1px solid var(--ot-line);padding-top:12px}
.ot-table-wrap{overflow:auto}
.ot-table{border-collapse:collapse;width:100%;font-size:12px}
.ot-table th,.ot-table td{padding:8px 9px;text-align:left;border-bottom:1px solid color-mix(in srgb,var(--ot-line) 65%,transparent);vertical-align:middle}
.ot-table th{font-size:11px;color:var(--ot-faint);font-weight:400}
.ot-table tr:last-child td{border-bottom:0}
.ot-table-person{display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
.ot-mini-chip{font-size:11px;padding:2px 6px;border-radius:5px;background:var(--ot-card-2);color:var(--ot-muted);white-space:nowrap}
.ot-impact{display:flex;flex-direction:column;gap:6px}
.ot-impact .ot-hint{margin-bottom:3px}
.ot-impact-row{display:flex;align-items:center;gap:9px;font-size:11.5px}
.ot-impact-name{width:76px;flex:none;color:var(--ot-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-impact-bar{flex:1;height:6px;border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);overflow:hidden;min-width:50px}
.ot-impact-bar i{display:block;height:100%;border-radius:3px;background:var(--ot-brand);opacity:.68}
.ot-impact-num{width:36px;text-align:right;font-variant-numeric:tabular-nums;color:var(--ot-muted)}
.ot-impact .ot-muted{font-size:11px;color:var(--ot-faint);white-space:nowrap}
.ot-backup{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;padding:4px 8px;border-radius:7px;border:1px solid var(--ot-line);color:var(--ot-muted)}
.ot-backup:hover{color:var(--dsw-alias-label-primary);border-color:var(--ot-line-2)}
.ot-project{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--ot-line-2);border-radius:14px;background:var(--ot-card);box-shadow:0 1px 0 color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent)}
.ot-project-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.ot-project-status{font-size:11px;padding:3px 9px;border-radius:999px;border:1px solid var(--ot-line);color:var(--ot-muted);background:var(--ot-card-2);white-space:nowrap}
.ot-project-status[data-status="active"]{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 35%,var(--ot-line));background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 9%,transparent)}
.ot-project-status[data-status="reviewed"]{color:var(--ot-brand);border-color:color-mix(in srgb,var(--ot-brand) 35%,var(--ot-line));background:color-mix(in srgb,var(--ot-brand) 8%,transparent)}
.ot-project-meta{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:12px}
.ot-project-field{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--ot-muted);min-width:0}
.ot-project-field .ot-input{height:30px;font-size:12px}
.ot-project-field p{font-size:12px;line-height:1.55;color:var(--dsw-alias-label-primary)}
.ot-project-members{display:flex;flex-direction:column;gap:2px;border-top:1px solid var(--ot-line);padding-top:8px}
.ot-project-member{display:flex;align-items:center;gap:8px;padding:6px 4px;border-radius:8px;min-width:0}
.ot-project-member:hover{background:var(--ot-card-2)}
.ot-project-member-id{display:flex;flex-direction:column;gap:1px;min-width:88px;max-width:160px}
.ot-project-member-id b{font-size:12.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-project-member-id small{font-size:11px;color:var(--ot-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-project-covers{display:flex;align-items:center;gap:4px;flex-wrap:wrap;flex:1;min-width:0}
.ot-project-avail{font-size:11.5px;color:var(--ot-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.ot-project-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border-top:1px solid var(--ot-line);padding-top:10px}
.ot-project-form{display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid var(--ot-line);border-radius:10px;background:var(--dsw-alias-bg-base)}
.ot-project-form-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.ot-project-form .ot-textarea{font-size:12px;min-height:52px}
.ot-project-form-actions{display:flex;align-items:center;gap:8px;justify-content:flex-end}
.ot-project-history{display:flex;flex-direction:column;gap:6px;border-top:1px solid var(--ot-line);padding-top:10px}
.ot-project-feedback{padding:8px 10px;border-radius:9px;background:var(--ot-card-2);font-size:12px;line-height:1.55}
.ot-project-feedback-head{display:flex;justify-content:space-between;gap:8px;color:var(--ot-faint);font-size:11px;margin-bottom:3px}
.ot-project-feedback-head b{font-size:11.5px;font-weight:500;color:var(--ot-muted)}
.ot-project-feedback p{margin-top:2px;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}
.ot-project-feedback p span{color:var(--ot-faint);font-size:11px}
.ot-scrim-top{position:fixed;inset:0;z-index:30;display:block!important;background:rgba(10,14,24,.42)}
.ot-skill-search{position:fixed;z-index:31;top:50%;left:50%;transform:translate(-50%,-50%);width:min(680px,calc(100vw - 32px));max-height:min(82vh,760px);display:flex;flex-direction:column;gap:12px;padding:20px;border:1px solid var(--ot-line-2);border-radius:16px;background:var(--ot-card);box-shadow:0 24px 80px rgba(0,0,0,.3);overflow:auto}
.ot-skill-search-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.ot-skill-search-title{display:flex;align-items:flex-start;gap:10px;min-width:0}
.ot-skill-search-mark{display:flex;align-items:center;justify-content:center;width:32px;height:32px;flex:none;border-radius:9px;color:var(--ot-brand);background:color-mix(in srgb,var(--ot-brand) 10%,transparent);border:1px solid color-mix(in srgb,var(--ot-brand) 22%,transparent)}
.ot-skill-search-title-text{font-size:16px;line-height:22px;font-weight:600}
.ot-skill-search-target{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid var(--ot-line);border-radius:10px;background:var(--dsw-alias-bg-base);min-width:0}
.ot-skill-search-target .ot-avatar{flex:none}
.ot-skill-search-target-id{display:flex;flex-direction:column;gap:1px;min-width:0}
.ot-skill-search-target-label{font-size:11px;color:var(--ot-faint)}
.ot-skill-search-target-id b{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-skill-search-target-meta{margin-left:auto;font-size:11px;color:var(--ot-muted);text-align:right;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-search-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:stretch}
.ot-search-field{display:flex;align-items:center;gap:8px;min-width:0;height:38px;padding:0 12px;border:1px solid var(--ot-line-2);border-radius:10px;background:var(--dsw-alias-bg-base);color:var(--ot-muted);transition:border-color .15s,box-shadow .15s}
.ot-search-field:focus-within{border-color:color-mix(in srgb,var(--ot-brand) 55%,var(--ot-line));box-shadow:0 0 0 2px color-mix(in srgb,var(--ot-brand) 12%,transparent)}
.ot-search-field svg{flex:none;color:var(--ot-faint)}
.ot-search-input{display:block;width:100%;min-width:0;height:100%;border:0;outline:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;appearance:none}
.ot-search-input::placeholder{color:var(--ot-faint)}
.ot-search-submit{display:flex}
.ot-search-submit .ot-btn{height:38px;min-width:88px;padding:0 16px}
.ot-search-footline{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ot-search-open-github{font-size:11.5px;color:var(--ot-brand);text-decoration:none;white-space:nowrap}
.ot-search-open-github:hover{text-decoration:underline}
.ot-search-state{display:flex;align-items:flex-start;gap:9px;padding:10px 11px;border-radius:10px;border:1px solid var(--ot-line);background:var(--dsw-alias-bg-base);color:var(--ot-muted);font-size:12px;line-height:1.55}
.ot-search-state svg{flex:none;margin-top:1px;color:var(--ot-faint)}
.ot-search-state b{display:block;font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary)}
.ot-search-state p{margin-top:2px;font-size:11.5px;color:var(--ot-muted)}
.ot-search-state[data-tone="warn"]{border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 30%,var(--ot-line));background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 6%,var(--dsw-alias-bg-base))}
.ot-search-state[data-tone="warn"] svg{color:var(--dsw-alias-state-warn-primary)}
.ot-search-state[data-tone="loading"]{color:var(--ot-muted)}
.ot-search-state[data-tone="empty"]{border-style:dashed}
.ot-search-section{display:flex;flex-direction:column;gap:4px;border-top:1px solid var(--ot-line);padding-top:10px;margin-top:2px}
.ot-search-source{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ot-muted);margin-bottom:2px}
.ot-search-source svg{color:var(--ot-faint)}
.ot-search-source-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 6px;margin-left:2px;border-radius:9px;background:var(--ot-card-2);color:var(--ot-faint);font-size:11px;font-variant-numeric:tabular-nums}
.ot-search-result{padding:9px 10px;border:1px solid var(--ot-line);border-radius:10px;display:flex;flex-direction:column;gap:4px;min-width:0;background:var(--dsw-alias-bg-base);margin-top:3px}
.ot-search-result:hover{border-color:var(--ot-line-2);background:var(--ot-card-2)}
.ot-search-result-head{display:flex;align-items:center;gap:7px;flex-wrap:wrap;min-width:0}
.ot-search-result-head b{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:360px}
.ot-search-result-meta{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--ot-faint)}
.ot-search-badge{font-size:11px;padding:1px 7px;border-radius:999px;color:var(--ot-brand);background:color-mix(in srgb,var(--ot-brand) 9%,transparent);white-space:nowrap}
.ot-search-badge-github{color:var(--dsw-alias-label-secondary);background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}
.ot-search-desc{font-size:11.5px;line-height:1.5;color:var(--ot-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.ot-search-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px}
.ot-search-link{font-size:11.5px;margin-left:auto;color:var(--ot-brand);text-decoration:none}
.ot-search-link:hover{text-decoration:underline}
.ot-search-footer-hint{color:var(--ot-faint)!important}
.ot-skill-search .ot-hint{margin:0}
.ot-skill-search .ot-good{color:var(--dsw-alias-state-success-primary)}
.ot-page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:2px 0 14px}
.ot-page-kicker{display:block;font-size:11px;line-height:15px;font-weight:500;color:var(--ot-brand);letter-spacing:.04em;margin-bottom:1px}
.ot-page-title{font-size:19px;line-height:26px;font-weight:600}
.ot-page-sub{font-size:12px;line-height:18px;color:var(--ot-muted);margin-top:2px}
.ot-page-count{font-size:12px;color:var(--ot-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.ot-page-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ot-guide{overflow:auto;padding-bottom:24px}
.ot-guide-hero{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.9fr);gap:14px}
.ot-guide-hero-main{position:relative;padding:20px;border:1px solid var(--ot-line-2);border-radius:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--ot-brand) 6%,var(--ot-card)),var(--ot-card) 58%);min-width:0}
.ot-guide-kicker{font-size:11px;font-weight:500;color:var(--ot-brand);letter-spacing:.02em}
.ot-guide-title{font-size:22px;line-height:29px;font-weight:600;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-guide-desc{font-size:12.5px;line-height:19px;color:var(--ot-muted);margin:3px 0 9px}
.ot-guide-req-chips{margin-bottom:1px}
.ot-guide-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:13px}
.ot-guide-hero-side{padding:16px;border:1px solid color-mix(in srgb,var(--ot-brand) 24%,var(--ot-line));border-radius:14px;background:color-mix(in srgb,var(--ot-brand) 4%,var(--ot-card));display:flex;flex-direction:column;gap:7px;justify-content:center;min-width:0}
.ot-guide-side-label{font-size:11px;color:var(--ot-muted)}
.ot-guide-score{display:flex;align-items:baseline;gap:6px}
.ot-guide-score b{font-size:32px;line-height:36px;font-weight:600;color:var(--ot-brand);font-variant-numeric:tabular-nums}
.ot-guide-score span{font-size:11px;color:var(--ot-muted)}
.ot-guide-side-meta{font-size:11.5px;color:var(--ot-muted)}
.ot-guide-side-empty{font-size:12px;line-height:18px;color:var(--ot-muted);min-height:38px}
.ot-guide-hero-side .ot-avatars .ot-avatar{box-shadow:0 0 0 2px var(--ot-card)}
.ot-guide-dirty{margin-top:8px}
.ot-guide > .ot-stats{margin-top:14px}
.ot-guide-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:14px;margin-top:16px}
.ot-guide-card{padding:14px;border:1px solid var(--ot-line);border-radius:14px;background:var(--ot-card);display:flex;flex-direction:column;gap:7px;min-width:0}
.ot-guide-card-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:2px}
.ot-guide-card-head .ot-muted{font-size:11px}
.ot-guide-project{display:flex;align-items:center;gap:8px;padding:8px 9px;border:1px solid var(--ot-line);border-radius:9px;background:var(--dsw-alias-bg-base);min-width:0}
.ot-guide-project-main{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.ot-guide-project-main b{font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-guide-project-main small{font-size:11px;color:var(--ot-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-guide-project-feedback{font-size:11px;color:var(--ot-muted);white-space:nowrap}
.ot-guide-project .ot-link-btn{flex:none;font-size:11.5px}
.ot-guide-history{display:flex;align-items:center;gap:8px;width:100%;padding:8px 9px;border:1px solid var(--ot-line);border-radius:9px;background:var(--dsw-alias-bg-base);text-align:left;min-width:0}
.ot-guide-history:hover{border-color:var(--ot-line-2);background:var(--ot-card-2)}
.ot-guide-history-main{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.ot-guide-history-main b{font-size:12.5px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-guide-history-main small{font-size:11px;color:var(--ot-faint)}
.ot-guide-history-date{font-size:11px;color:var(--ot-faint);white-space:nowrap}
.ot-guide-empty{display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:12px;border:1px dashed var(--ot-line);border-radius:9px;color:var(--ot-muted);font-size:12px;line-height:18px}
.ot-guide-empty svg{color:var(--ot-faint);margin-bottom:1px}
.ot-guide-empty .ot-btn{margin-top:2px}
.ot-guide-card{border-top:3px solid color-mix(in srgb,var(--ot-section,var(--ot-brand)) 62%,transparent)}
.ot-guide-hero-main{border-top:3px solid color-mix(in srgb,var(--ot-brand) 62%,transparent)}
.ot-section-kicker{display:block;font-size:11px;font-weight:600;letter-spacing:.02em;color:var(--ot-section,var(--ot-brand))}
.ot-guide-req-block{display:flex;flex-direction:column;gap:6px;margin-top:2px}
.ot-guide-req-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ot-guide-req-label{font-size:11px;color:var(--ot-muted)}
.ot-guide-req-main{display:inline-flex;align-items:baseline;gap:6px;padding:5px 9px;border-radius:9px;border:1px solid color-mix(in srgb,var(--ot-brand) 28%,var(--ot-line));background:color-mix(in srgb,var(--ot-brand) 8%,var(--ot-card))}
.ot-guide-req-main b{font-size:13px;font-weight:600}
.ot-guide-req-main span{font-size:11.5px;color:var(--ot-brand)}
.ot-guide-req-main small{font-size:11px;color:var(--ot-muted)}
.ot-guide-req-toggle{margin-left:auto;font-size:11.5px}
.ot-guide-all-reqs{margin-top:2px}
.ot-warnings{display:flex;flex-direction:column;gap:10px;margin-top:16px;padding:14px;border:1px solid var(--ot-line);border-top:3px solid color-mix(in srgb,var(--ot-section,var(--ot-brand)) 62%,transparent);border-radius:14px;background:color-mix(in srgb,var(--ot-section,var(--ot-brand)) 3%,var(--ot-card))}
.ot-warnings-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.ot-warnings-head .ot-hint{margin-top:2px}
.ot-warning-total{font-size:11.5px;color:var(--ot-section,var(--ot-brand));white-space:nowrap;font-variant-numeric:tabular-nums}
.ot-warning-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ot-warning-col{--ot-warning:#e0932f;display:flex;flex-direction:column;gap:4px;padding:9px;border:1px solid var(--ot-line);border-radius:10px;background:var(--dsw-alias-bg-base);min-width:0}
.ot-warning-col[data-tone="rose"]{--ot-warning:#e05a7d}
.ot-warning-col[data-tone="amber"]{--ot-warning:#e0932f}
.ot-warning-col[data-tone="blue"]{--ot-warning:#4c7df0}
.ot-warning-col-head{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11.5px;font-weight:600;color:var(--ot-warning)}
.ot-warning-col-head b{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:color-mix(in srgb,var(--ot-warning) 12%,transparent);font-size:11px;font-weight:500}
.ot-warning-item{display:flex;flex-direction:column;gap:1px;padding:6px 7px;border-radius:7px;text-align:left;background:color-mix(in srgb,var(--ot-warning) 5%,transparent);min-width:0}
.ot-warning-item:hover{background:color-mix(in srgb,var(--ot-warning) 10%,transparent)}
.ot-warning-item small{font-size:11px;color:var(--ot-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-warning-item span{font-size:11.5px;line-height:1.45;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}
.ot-warning-none{font-size:11px;color:var(--ot-faint);padding:4px 2px}
.ot-progress-summary{display:flex;align-items:center;gap:22px;flex-wrap:wrap;padding:9px 0;border-bottom:1px solid var(--ot-line);margin-bottom:2px}
.ot-progress-kpi{display:flex;flex-direction:column;gap:1px;min-width:58px}
.ot-progress-kpi b{font-size:19px;line-height:23px;font-weight:600;color:#4c7df0;font-variant-numeric:tabular-nums}
.ot-progress-kpi span{font-size:11px;color:var(--ot-muted)}
.ot-progress-list{display:flex;flex-direction:column;gap:8px;margin-top:2px}
.ot-progress-project{border:1px solid var(--ot-line);border-radius:10px;background:var(--dsw-alias-bg-base);overflow:hidden;min-width:0}
.ot-progress-project[data-open]{border-color:color-mix(in srgb,#4c7df0 42%,var(--ot-line))}
.ot-progress-head{display:flex;align-items:center;gap:8px;padding:8px 9px 6px}
.ot-progress-toggle{display:flex;align-items:center;gap:9px;flex:1;min-width:0;text-align:left}
.ot-progress-title{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.ot-progress-title b{font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-progress-title small{font-size:11px;color:var(--ot-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-progress-percent{font-size:13px;font-weight:600;color:#4c7df0;font-variant-numeric:tabular-nums;white-space:nowrap}
.ot-progress-actions{display:flex;align-items:center;gap:6px;flex:none}
.ot-progress-actions .ot-btn{padding:0 9px}
.ot-progress-actions .ot-project-status{font-size:11px;padding:2px 7px}
.ot-progress-track{height:4px;border-radius:2px;margin:0 9px 5px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent);overflow:hidden}
.ot-progress-track i{display:block;height:100%;border-radius:2px;background:#4c7df0;opacity:.8}
.ot-progress-facts{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:0 9px 8px;font-size:11px;color:var(--ot-faint)}
.ot-progress-facts span{white-space:nowrap}
.ot-progress-detail{border-top:1px solid var(--ot-line);padding:10px;display:flex;flex-direction:column;gap:9px;background:color-mix(in srgb,#4c7df0 2%,var(--dsw-alias-bg-base))}
.ot-progress-detail-block{display:flex;flex-direction:column;gap:6px;min-width:0}
.ot-progress-detail-title{font-size:11.5px;font-weight:600;color:var(--ot-muted)}
.ot-progress-stages{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
.ot-stage{display:flex;flex-direction:column;gap:2px;padding:8px 9px;border:1px solid var(--ot-line);border-radius:8px;background:var(--ot-card);min-width:0}
.ot-stage-label{font-size:11px;color:var(--ot-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-stage-value{font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary)}
.ot-stage small{font-size:11px;color:var(--ot-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-progress-outcome{font-size:11.5px;line-height:1.5;color:var(--ot-muted);padding:7px 9px;border-radius:8px;background:color-mix(in srgb,#4c7df0 5%,var(--ot-card));overflow-wrap:anywhere}
.ot-progress-outcome span{color:var(--ot-faint)}
.ot-progress-detail-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:12px}
.ot-progress-member{display:grid;grid-template-columns:auto minmax(0,1fr) 64px auto;align-items:center;gap:6px;font-size:11.5px;min-width:0}
.ot-progress-member-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-progress-member-bar{height:4px;border-radius:2px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 8%,transparent);overflow:hidden}
.ot-progress-member-bar i{display:block;height:100%;border-radius:2px;background:#17a398}
.ot-progress-member-num{font-size:11px;color:var(--ot-muted);text-align:right;font-variant-numeric:tabular-nums}
.ot-progress-unassigned-dot{width:22px;height:22px;border-radius:50%;background:var(--ot-card-2);border:1px dashed var(--ot-line-2)}
.ot-progress-feedback{padding:7px 8px;border-radius:8px;background:var(--ot-card-2);font-size:11.5px;line-height:1.5}
.ot-progress-feedback-date{display:block;font-size:11px;color:var(--ot-faint);margin-bottom:2px}
.ot-progress-feedback p{color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}
.ot-progress-feedback b{font-size:11px;font-weight:500;color:var(--ot-faint)}
.ot-workspace{overflow:auto;padding-bottom:24px}
.ot-workspace-list{display:flex;flex-direction:column;gap:14px}
.ot-workspace-project{padding:16px;border:1px solid var(--ot-line-2);border-radius:14px;background:var(--ot-card);display:flex;flex-direction:column;gap:10px}
.ot-workspace-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.ot-workspace-title-wrap{min-width:0}
.ot-workspace-title{font-size:16px;line-height:22px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-workspace-goal{font-size:12px;line-height:18px;color:var(--ot-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-workspace-progress{width:180px;flex:none;display:flex;flex-direction:column;gap:4px}
.ot-workspace-progress-num{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.ot-workspace-progress-num b{font-size:20px;line-height:24px;font-weight:600;color:var(--ot-brand);font-variant-numeric:tabular-nums}
.ot-workspace-progress-num span{font-size:11px;color:var(--ot-muted)}
.ot-workspace-track{height:5px;border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);overflow:hidden}
.ot-workspace-track i{display:block;height:100%;border-radius:3px;background:var(--ot-brand);opacity:.8}
.ot-workspace-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ot-workspace-members{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-width:0}
.ot-workspace-person{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:2px 7px 2px 3px;border-radius:999px;background:var(--ot-card-2);color:var(--ot-muted)}
.ot-workspace-started{font-size:11px;color:var(--ot-faint);white-space:nowrap}
.ot-task-list{display:flex;flex-direction:column;gap:4px}
.ot-task{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px;width:100%;padding:8px 10px;border:1px solid var(--ot-line);border-radius:8px;background:var(--dsw-alias-bg-base);text-align:left;font-size:12px;min-width:0}
.ot-task:hover{border-color:var(--ot-line-2);background:var(--ot-card-2)}
.ot-task-dot{width:8px;height:8px;border-radius:50%;background:color-mix(in srgb,var(--dsw-alias-label-primary) 22%,transparent);flex:none}
.ot-task[data-status="doing"] .ot-task-dot{background:var(--dsw-alias-state-warn-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-state-warn-primary) 12%,transparent)}
.ot-task[data-status="done"] .ot-task-dot{background:var(--dsw-alias-state-success-primary)}
.ot-task-open{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-width:0;width:100%;text-align:left}
.ot-task-title{display:flex;align-items:center;gap:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.ot-task-title svg{color:var(--ot-faint);flex:none}
.ot-task-open:hover .ot-task-title{color:var(--ot-brand)}
.ot-task-open:hover .ot-task-title svg{color:var(--ot-brand)}
.ot-task[data-status="done"] .ot-task-title{text-decoration:line-through;color:var(--ot-muted)}
.ot-task-assignee{font-size:11px;color:var(--ot-muted);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.ot-task-status{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid transparent;background:var(--ot-card-2);color:var(--ot-muted);white-space:nowrap;cursor:pointer}
.ot-task-status:hover{border-color:var(--ot-line-2);color:var(--dsw-alias-label-primary)}
.ot-task[data-status="doing"] .ot-task-status{color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 9%,transparent)}
.ot-task[data-status="done"] .ot-task-status{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 9%,transparent)}
.ot-workspace-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;border-top:1px solid var(--ot-line);padding-top:8px}
.ot-workspace-empty{min-height:320px}
.ot-pool{overflow:auto;padding-bottom:24px}
.ot-pool-add{display:flex;flex-direction:column;gap:8px;padding:14px;border:1px solid var(--ot-line-2);border-top:3px solid color-mix(in srgb,var(--ot-brand) 62%,transparent);border-radius:14px;background:color-mix(in srgb,var(--ot-brand) 3%,var(--ot-card))}
.ot-pool-add-grid{display:grid;grid-template-columns:minmax(0,1.3fr) 100px 90px minmax(0,1fr) auto;gap:8px;align-items:end}
.ot-pool-field{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--ot-muted);min-width:0}
.ot-pool-field .ot-input,.ot-pool-field .ot-select{height:30px;font-size:12px}
.ot-pool-add-action .ot-btn{height:30px}
.ot-pool-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0;font-size:11.5px;color:var(--ot-muted)}
.ot-pool-toolbar-label{font-weight:500;color:var(--dsw-alias-label-primary)}
.ot-pool-toolbar .ot-select{height:30px;min-width:170px;max-width:280px}
.ot-pool-toolbar-hint{font-size:11px}
.ot-pool-list{display:flex;flex-direction:column;gap:8px}
.ot-pool-item{display:flex;align-items:flex-start;gap:12px;padding:11px 12px;border:1px solid var(--ot-line);border-radius:10px;background:var(--ot-card);min-width:0}
.ot-pool-item:hover{border-color:var(--ot-line-2)}
.ot-pool-item-main{display:flex;flex-direction:column;gap:3px;flex:1;min-width:0}
.ot-pool-item-title{display:flex;align-items:center;gap:7px;flex-wrap:wrap;min-width:0}
.ot-pool-item-title b{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ot-pool-badge{font-size:11px;padding:1px 7px;border-radius:999px;color:var(--ot-brand);background:color-mix(in srgb,var(--ot-brand) 9%,transparent);white-space:nowrap}
.ot-pool-item-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--ot-muted)}
.ot-pool-item-note{font-size:11.5px;line-height:1.5;color:var(--ot-muted);overflow-wrap:anywhere}
.ot-pool-item-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;flex:none;padding-top:1px}
.ot-pool-empty{min-height:280px}
.ot-pool-empty .ot-muted{font-size:12px}
.ot-project-status[data-status="notStarted"]{color:var(--ot-muted);border-style:dashed}
.ot-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:20;padding:8px 15px;border-radius:10px;font-size:12.5px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);border:1px solid var(--ot-line-2)}
@media (min-width: 1280px){.ot-detail{position:relative;inset:auto;width:392px;flex:none;margin-left:16px;box-shadow:none}.ot-scrim{display:none}}
@media (max-width: 1279px){.ot-scrim{display:block}}
@media (max-width: 1100px){.ot-match{flex-direction:column;overflow:auto}.ot-plan{width:auto;overflow:visible}.ot-results{overflow:visible}.ot-two-col{grid-template-columns:1fr}.ot-team-head{flex-direction:column}.ot-guide-hero,.ot-guide-grid{grid-template-columns:1fr}}
@media (max-width: 820px){.ot-head{padding-left:16px;padding-right:16px}.ot-tabs{margin-left:16px}.ot-pane{padding-left:16px;padding-right:16px}.ot-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ot-stat{padding:12px}.ot-org{flex-direction:column}.ot-tree{width:auto;max-height:190px;display:flex;flex-wrap:wrap;gap:4px}.ot-tree-dept{margin:0}.ot-tree-dept-name{padding:4px 6px}.ot-detail{width:100%}.ot-detail-meta{grid-template-columns:repeat(2,minmax(0,1fr))}.ot-toolbar-right{width:100%;margin-left:0}.ot-search{max-width:none}.ot-breakdown{grid-template-columns:1fr}.ot-project-meta{grid-template-columns:1fr}.ot-project-head{flex-direction:column}.ot-project-member-id{max-width:120px}.ot-skill-search{max-height:88vh;padding:14px}.ot-search-form{grid-template-columns:1fr}.ot-search-submit .ot-btn{width:100%}.ot-skill-search-target{flex-wrap:wrap}.ot-skill-search-target-meta{width:100%;margin-left:0;padding-left:39px;text-align:left}.ot-search-result-head b{max-width:100%}.ot-page-head{align-items:flex-start;flex-direction:column}.ot-page-actions{width:100%}.ot-page-actions .ot-btn{flex:1}.ot-guide-title{white-space:normal}.ot-guide-actions .ot-btn{flex:1}.ot-warning-cols{grid-template-columns:1fr}.ot-warning-col{padding:8px}.ot-progress-summary{gap:14px}.ot-progress-head{flex-wrap:wrap}.ot-progress-actions{width:100%;justify-content:space-between}.ot-progress-toggle{width:100%}.ot-progress-detail-grid{grid-template-columns:1fr}.ot-progress-stages{grid-template-columns:1fr}.ot-workspace-head{flex-direction:column}.ot-workspace-progress{width:100%}.ot-workspace-project{padding:14px}.ot-task{gap:7px}.ot-task-status{justify-self:end}.ot-task-assignee{max-width:100%}.ot-pool-add-grid{grid-template-columns:1fr 1fr}.ot-pool-name,.ot-pool-note{grid-column:1 / -1}.ot-pool-add-action{grid-column:1 / -1}.ot-pool-add-action .ot-btn{width:100%}.ot-pool-item{flex-direction:column}.ot-pool-item-actions{width:100%;justify-content:flex-end}}
`

    /* ------------------------------------------------------------------ apply */

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, DICTS), 'org-talent: dictionaries')
        const translate = key => makeT(ctx.locale.getLocale().locale)(key)

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
        }, () => h(Page, { ctx })))

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 12,
          label: () => translate('panel.label'),
          locale: NS,
        }, props => h(PanelIcon, { size: props.size })))
      },
    }
  },
})
