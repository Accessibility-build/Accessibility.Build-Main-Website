// Shared structural checks and public aggregate counts. No course prose belongs here.
export function courseManifest(course) {
  const questions = course.questions ?? []
  const tables = course.chapters.find((chapter) => chapter.key === "what-changed")?.blocks.filter((block) => block.type === "table") ?? []
  const changes = tables.filter((table) => /chang(?:es|ed)|slips|inconsistencies/i.test(table.caption) && !/unconfirmed|could not/i.test(table.caption)).reduce((count,table) => count + table.rows.length,0)
  return { edition:String(course.edition), questions:questions.length, mockQuestions:questions.filter((question) => question.set === "A").length, drills:questions.filter((question) => question.set === "drill").length, codeQuestions:questions.filter((question) => question.code?.trim()).length, flashcards:course.flashcards.length, changes, chapters:course.chapters.length, activityCount:course.chapters.reduce((count,chapter) => count+(chapter.activities?.length ?? 0),0) }
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
      require(["p","h2","h3","bullets","numbered","table","keyterms","callout","code"].includes(block.type),`${chapter.key}: unknown block type`)
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
  for (const set of ["A","B"]) {
    const pool=course.questions.filter((question) => question.set===set)
    const counts=[1,2,3].map((domain) => pool.filter((question)=>question.d===domain).length)
    require(pool.length>0 && counts[0]===pool.length*.4 && counts[1]===pool.length*.4 && counts[2]===pool.length*.2,`Mock ${set}: domain weighting must be 40/40/20`)
  }
  for(const section of sections) require(course.questions.some((q)=>q.set==="drill"&&q.sec===section),`No dedicated drills for ${section}`)
  return errors
}

export function blockWords(block) {
  const text = block.type === "code" ? block.caption ?? "" : [block.text,block.title,block.caption,...(block.items ?? []).map((item)=>typeof item === "string"?item:`${item.term} ${item.def}`),...(block.headers ?? []),...(block.rows ?? []).flat()].filter(Boolean).join(" ")
  return text.split(/\s+/).filter(Boolean).length
}
