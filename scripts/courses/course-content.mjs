// Shared structural checks and public aggregate counts. No course prose belongs here.
export function courseManifest(course) {
  const questions = course.questions ?? []
  const tables = course.chapters.find((chapter) => chapter.key === "what-changed")?.blocks.filter((block) => block.type === "table") ?? []
  const changes = tables.filter((table) => /chang(?:es|ed)|slips|inconsistencies/i.test(table.caption) && !/unconfirmed|could not/i.test(table.caption)).reduce((count,table) => count + table.rows.length,0)
  return { edition:String(course.edition), examQuestions:(course.examQuestions ?? []).length, questions:questions.length, mockQuestions:questions.filter((question) => question.set === "A").length, drills:questions.filter((question) => question.set === "drill").length, codeQuestions:questions.filter((question) => question.code?.trim()).length, flashcards:course.flashcards.length, changes, chapters:course.chapters.length, activityCount:course.chapters.reduce((count,chapter) => count+(chapter.activities?.length ?? 0),0), ...learningTotals(course) }
}

// Totals a sales page may state: study time and what the course contains. Counts only, never content.
function learningTotals(course) {
  const blocks = course.chapters.flatMap((chapter) => chapter.blocks ?? [])
  const questions = course.questions ?? []
  return {
    readingMinutes: course.chapters.reduce((total,chapter) => total + lessonMinutes(chapter),0),
    activityMinutes: course.chapters.reduce((total,chapter) => total + (chapter.activities ?? []).reduce((sum,activity) => sum + (Number(activity.minutes) || 0),0),0),
    lessonChecks: questions.filter((question) => question.use !== "readiness").length,
    readinessQuestions: questions.filter((question) => question.use === "readiness").length,
    sections: (course.sections ?? []).length,
    tools: new Set(blocks.filter((block) => block.type === "widget").map((block) => block.widget)).size,
    audits: blocks.filter((block) => block.type === "audit").length,
    videos: blocks.filter((block) => block.type === "video").length,
  }
}

/** Estimated time for a lesson's own content: about 200 words a minute, at least one minute. */
export function lessonMinutes(chapter) {
  return Math.max(1, Math.round((chapter.blocks ?? []).reduce((count, block) => count + blockWords(block), 0) / 200))
}

const WIDGETS = ["text-scaling","caption-styler","screen-reader-preview","alt-text-writer","form-error-designer","component-states","heading-outline","link-text","contrast-checker","color-vision","focus-indicator","target-size","text-spacing","reflow","reduced-motion","focus-order","annotation-overlay"]
// Course SVG is owner-authored but is rendered as markup, so only plain drawing content is accepted.
export function safeSvg(svg) {
  return typeof svg === "string" && svg.length <= 16000 && /^<svg\b[^>]*\bviewBox=/.test(svg.trim()) && !/<(script|foreignObject|style|image|iframe|a)\b|\son[a-z]+\s*=|javascript:|(?:xlink:)?href\s*=\s*["'](?!#)|@import|url\((?!#)/i.test(svg)
}
const validUrl = (value) => { try { return new URL(value).protocol === "https:" } catch { return false } }
const unique = (values) => new Set(values).size === values.length
export function validateCourse(course) {
  const errors = []
  const require = (condition,message) => {if(!condition)errors.push(message)}
  require(typeof course.slug === "string" && /^[a-z0-9-]+$/.test(course.slug),"Invalid course slug")
  require(Array.isArray(course.chapters) && course.chapters.length>0,"No chapters")
  require(Array.isArray(course.questions),"Missing questions")
  require(Array.isArray(course.flashcards),"Missing flashcards")
  if (errors.length) return errors
  const sections = new Set((course.sections ?? []).map((section) => section.ref))
  const chapters = new Set(course.chapters.map((chapter) => chapter.key))
  require(chapters.size === course.chapters.length,"Duplicate chapter key")
  const sources = (items,label) => (items ?? []).forEach((source) => require(source.title && validUrl(source.url),`${label}: invalid source`))
  const refs = (items,label) => (items ?? []).forEach((ref) => require(sections.has(ref),`${label}: unknown objective ${ref}`))
  const activityIds = []
  for (const chapter of course.chapters) {
    require(Array.isArray(chapter.blocks),`${chapter.key}: missing blocks`)
    for(const block of chapter.blocks ?? []) {
      require(["p","h2","h3","bullets","numbered","table","keyterms","callout","code","figure","compare","widget","audit","video"].includes(block.type),`${chapter.key}: unknown block type`)
      if(block.type==="figure")require(block.caption&&block.alt&&safeSvg(block.svg),`${chapter.key}: invalid figure`)
      if(block.type==="compare")require(block.caption&&Array.isArray(block.items)&&block.items.length>=2&&block.items.every((item)=>["avoid","prefer"].includes(item.verdict)&&item.label&&item.alt&&item.note&&safeSvg(item.svg)),`${chapter.key}: invalid comparison`)
      if(block.type==="video")require(block.provider==="youtube"&&/^[A-Za-z0-9_-]{11}$/.test(block.videoId ?? "")&&/^\d{1,2}:\d{2}(:\d{2})?$/.test(block.duration ?? "")&&block.title&&block.credit&&block.license&&block.summary&&validUrl(block.url)&&validUrl(block.sourceUrl),`${chapter.key}: invalid video`)
      if(block.type==="widget")require(WIDGETS.includes(block.widget)&&block.title&&block.intro,`${chapter.key}: invalid widget`)
      if(block.type==="audit"){
        const els=block.elements ?? []
        require(block.title&&block.intro&&block.alt&&block.canvas?.w>0&&block.canvas?.h>0&&Array.isArray(els)&&els.length>0,`${chapter.key}: invalid audit`)
        require(unique(els.map((e)=>e.id)),`${chapter.key}: duplicate audit element`)
        require(els.some((e)=>e.issue)&&els.every((e)=>["box","text","button","input","icon","image","bar","line"].includes(e.kind)&&[e.x,e.y,e.w,e.h].every(Number.isFinite)&&(e.selectable===false||typeof e.name==="string")),`${chapter.key}: invalid audit element`)
        require(els.every((e)=>!e.issue||(e.issue.title&&e.issue.sc&&e.issue.explanation)),`${chapter.key}: incomplete audit issue`)
      }
      if(["p","h2","h3","callout","code"].includes(block.type))require(typeof block.text==="string",`${chapter.key}: missing block text`)
      if(["bullets","numbered"].includes(block.type))require(Array.isArray(block.items)&&block.items.every((item)=>typeof item==="string"),`${chapter.key}: invalid list`)
      if(block.type==="table")require(Array.isArray(block.headers)&&block.headers.length>0&&Array.isArray(block.rows)&&block.rows.every((row)=>Array.isArray(row)&&row.length===block.headers.length&&row.every((cell)=>typeof cell==="string")),`${chapter.key}: invalid table structure`)
      if(block.type==="keyterms")require(Array.isArray(block.items)&&block.items.every((item)=>item.term&&item.def),`${chapter.key}: invalid key terms`)
    }
    refs(chapter.objectiveRefs,chapter.key);sources(chapter.sources,chapter.key)
    for (const activity of chapter.activities ?? []) {
      activityIds.push(activity.id)
      require(typeof activity.id === "string" && /^[a-z0-9-]+$/.test(activity.id),`${chapter.key}: invalid activity ID`)
      require(activity.version && ["case","lab"].includes(activity.kind) && activity.title && activity.brief,`${activity.id}: incomplete activity`)
      refs(activity.objectiveRefs,activity.id);sources(activity.sources,activity.id)
      require(activity.steps?.length>0 && unique(activity.steps.map((step) => step.id)),`${activity.id}: invalid decision steps`)
      for (const step of activity.steps ?? []) {
        require(step.options?.length>=2 && unique(step.options.map((option) => option.id)) && step.options.some((option) => option.id===step.answer),`${activity.id}/${step.id}: invalid choices`)
        require(step.options.every((option) => option.text && option.feedback),`${activity.id}/${step.id}: missing feedback`)
      }
      require(activity.reflection?.prompt && activity.reflection?.criteria?.length>0 && activity.reflection?.example,`${activity.id}: missing reflection rubric`)
      require(activity.transfer?.options?.length>=2 && Number.isInteger(activity.transfer?.answer) && activity.transfer.answer>=0 && activity.transfer.answer<activity.transfer.options.length,`${activity.id}: invalid transfer question`)
      if(activity.figure)require(activity.figure.alt&&activity.figure.caption&&safeSvg(activity.figure.svg),`${activity.id}: invalid activity figure`)
      require((activity.starterCode?.length ?? 0)<=20000 && (activity.solutionCode?.length ?? 0)<=20000,`${activity.id}: oversized code`)
      if (activity.starterCode!==undefined) require(activity.checks?.length>0,`${activity.id}: code lab needs checks`)
      for (const check of activity.checks ?? []) {
        require(check.id && check.label && (check.selector || check.pattern),`${activity.id}: invalid lab check`)
        if(check.pattern)try{new RegExp(check.pattern,"im")}catch{errors.push(`${activity.id}: invalid pattern`)}
      }
    }
  }
  require(unique(activityIds),"Duplicate activity ID")
  require(unique(course.questions.map((question) => question.id)),"Duplicate question ID")
  for (const q of course.questions) {
    require(typeof q.stem === "string" && q.stem.trim() && typeof q.exp === "string" && q.exp.trim(),`${q.id}: missing question/explanation`)
    require(Array.isArray(q.options) && q.options.length===4 && unique(q.options.map((option) => option.trim().toLowerCase())) && Number.isInteger(q.answer) && q.answer>=0 && q.answer<4,`${q.id}: invalid answer/options`)
    require([1,2,3].includes(q.d) && sections.has(q.sec),`${q.id}: invalid domain/section`)
    require(course.sections.find((section)=>section.ref===q.sec)?.domain===q.d,`${q.id}: domain does not match section`)
    require(["A","B","drill"].includes(q.set),`${q.id}: invalid set`)
    if(q.lessonKey) require(chapters.has(q.lessonKey),`${q.id}: unknown lesson`)
    refs(q.objectiveRefs,q.id);sources(q.sources,q.id)
  }
  require(unique(course.flashcards.map((card,index) => card.id ?? String(index))),"Duplicate flashcard ID")
  require(unique(course.flashcards.filter((card)=>card.legacyIndex!==undefined).map((card)=>card.legacyIndex)),"Duplicate legacy flashcard index")
  for (const card of course.flashcards) {
    require(typeof card.f === "string" && card.f.trim() && typeof card.b === "string" && card.b.trim(),"Empty flashcard")
    require([1,2,3].includes(card.d),`${card.id ?? "card"}: invalid flashcard domain`)
    refs(card.objectiveRefs,card.id ?? "card");sources(card.sources,card.id ?? "card")
  }
  // Skills courses have no mock sets; exam-prep courses must weight both sets 40/40/20.
  const hasMocks = course.questions.some((question) => question.set === "A" || question.set === "B")
  for (const set of hasMocks ? ["A","B"] : []) {
    const pool=course.questions.filter((question) => question.set===set)
    const counts=[1,2,3].map((domain) => pool.filter((question)=>question.d===domain).length)
    require(pool.length>0 && counts[0]===pool.length*.4 && counts[1]===pool.length*.4 && counts[2]===pool.length*.2,`Mock ${set}: domain weighting must be 40/40/20`)
  }
  for(const section of sections) require(course.questions.some((q)=>q.set==="drill"&&q.sec===section),`No dedicated drills for ${section}`)
  // Final exam bank: exam-only questions, enough per section for random papers, never shared with lesson checks.
  const exam = course.examQuestions ?? []
  if (exam.length) {
    require(unique(exam.map((q) => q.id)),"Duplicate exam question ID")
    const drillStems = new Set(course.questions.map((q) => q.stem.trim().toLowerCase()))
    for (const q of exam) {
      require(typeof q.stem === "string" && q.stem.trim() && Array.isArray(q.options) && q.options.length===4 && unique(q.options.map((o) => String(o).trim().toLowerCase())) && Number.isInteger(q.answer) && q.answer>=0 && q.answer<4,`${q.id}: invalid exam question`)
      require(sections.has(q.sec),`${q.id}: unknown exam section`)
      require(!drillStems.has(String(q.stem).trim().toLowerCase()),`${q.id}: also used as a lesson check`)
    }
    for (const section of sections) require(exam.filter((q) => q.sec===section).length>=6,`Exam bank has fewer than 6 questions for ${section}`)
  }
  return errors
}

export function blockWords(block) {
  if (block.type === "figure") return `${block.caption} ${block.alt}`.split(/\s+/).filter(Boolean).length
  if (block.type === "compare") return [block.caption, ...block.items.flatMap((item) => [item.label, item.note])].join(" ").split(/\s+/).filter(Boolean).length
  if (block.type === "widget") return `${block.title} ${block.intro}`.split(/\s+/).filter(Boolean).length + 300
  if (block.type === "video") { const [minutes, seconds] = String(block.duration).split(":").map(Number); return `${block.title} ${block.summary}`.split(/\s+/).filter(Boolean).length + Math.round((minutes + (seconds || 0) / 60) * 200) }
  if (block.type === "audit") return `${block.title} ${block.intro}`.split(/\s+/).filter(Boolean).length + 800
  const text = block.type === "code" ? block.caption ?? "" : [block.text,block.title,block.caption,...(block.items ?? []).map((item)=>typeof item === "string"?item:`${item.term} ${item.def}`),...(block.headers ?? []),...(block.rows ?? []).flat()].filter(Boolean).join(" ")
  return text.split(/\s+/).filter(Boolean).length
}
