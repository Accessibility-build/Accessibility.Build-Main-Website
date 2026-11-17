// Generic private-course upgrader. Pass authored activities in a PRIVATE patch file.
// node scripts/courses/upgrade-course.mjs /private/course.json /private/patch.json --write
import fs from "node:fs"
import { createHash } from "node:crypto"
import { pathToFileURL } from "node:url"

const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0,16)
const isoDate = () => new Date().toISOString().slice(0,10)
const stopWords = new Set("the and for that this with from which what when where then than does not are can has have into only should would their they its but all one two how any each may also use using used says according body knowledge accessible accessibility".split(" "))
const tokens = (text) => [...new Set((text.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []).filter((word) => !stopWords.has(word)))]
const prose = (value) => typeof value === "string" ? value : Array.isArray(value) ? value.map(prose).join(" ") : value && typeof value === "object" ? Object.values(value).map(prose).join(" ") : ""

export function upgradeCourse(course, patch) {
  const result = structuredClone(course)
  const sectionRefs = new Set(course.sections.map((section) => section.ref))
  const refsFor = (value = "") => {
    const refs = value.match(/\bI{1,3}\.[A-Z]{1,2}(?:\.\d{1,2})?\b/g) ?? []
    return [...new Set(refs.flatMap((ref) => sectionRefs.has(ref) ? [ref] : course.sections.filter((section) => ref.startsWith(section.ref + ".") || section.ref.startsWith(ref + ".")).map((section) => section.ref)))]
  }
  const source = patch.examSource
  if (!source?.url || !source.title) throw new Error("Patch requires the verified exam source title and URL")
  result.edition = patch.edition ?? "1.1"
  result.built = patch.built ?? new Date().toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
  result.chapters = result.chapters.map((chapter) => {
    const {appendBlocks,...extra} = patch.chapters?.[chapter.key] ?? {}
    const refs = extra.objectiveRefs ?? chapter.objectiveRefs ?? refsFor(chapter.outlineRef)
    const sources = extra.sources ?? chapter.sources ?? [{ ...source, ...(chapter.bokPages ? { url: source.url + "#page=" + String(chapter.bokPages).match(/\d+/)?.[0] } : {}) }]
    const updated = { ...chapter, ...extra, objectiveRefs: refs, sources }
    if(appendBlocks?.length)updated.blocks=[...updated.blocks.filter((block)=>!appendBlocks.some((addition)=>addition.type===block.type&&addition.title&&addition.title===block.title)),...appendBlocks]
    if (!updated.outcomes?.length && refs.length) updated.outcomes = refs.map((ref) => `Explain and apply ${course.sections.find((section) => section.ref === ref)?.title ?? ref}.`)
    for (const replacement of patch.replacements ?? []) {
      if (replacement.chapterKey !== chapter.key) continue
      const json = JSON.stringify(updated.blocks)
      if (json.includes(replacement.find)) updated.blocks = JSON.parse(json.replaceAll(replacement.find, replacement.replace))
      else if (!json.includes(replacement.replace)) throw new Error(`Replacement target missing in ${chapter.key}`)
    }
    return updated
  })
  const chapterWords = result.chapters.map((chapter) => ({ chapter, words:new Set(tokens(prose(chapter.blocks))), headings:new Set(tokens(chapter.title + " " + chapter.blocks.filter((block) => block.type === "h2" || block.type === "h3").map((block) => block.text).join(" "))), numbers:new Set((chapter.title + " " + chapter.blocks.filter((block) => block.type === "h2" || block.type === "h3").map((block) => block.text).join(" ")).match(/\b[1-4]\.[1-5]\.\d{1,2}\b/g) ?? []) }))
  const documentFrequency = new Map()
  for(const entry of chapterWords)for(const word of entry.words)documentFrequency.set(word,(documentFrequency.get(word)??0)+1)
  const questionChapter = (question) => {
    const candidates=chapterWords.filter((entry)=>entry.chapter.objectiveRefs?.includes(question.sec))
    if(candidates.length<2)return candidates[0]?.chapter
    const query=tokens(question.stem+" "+question.options[question.answer]+" "+question.exp)
    const targetNumbers=new Set((question.options[question.answer]+" "+question.stem).match(/\b[1-4]\.[1-5]\.\d{1,2}\b/g)??[])
    const ranked=candidates.map((entry)=>({chapter:entry.chapter,score:query.reduce((score,word)=>score+(entry.words.has(word)?Math.log(1+chapterWords.length/(documentFrequency.get(word)??1))*(entry.headings.has(word)?3:1):0),0)+[...targetNumbers].filter((number)=>entry.numbers.has(number)).length*15})).sort((a,b)=>b.score-a.score)
    // Do not invent a precise lesson association when the evidence is ambiguous.
    if(ranked[0].score < 5 || ranked[0].score-ranked[1].score < Math.max(2,ranked[0].score*.04))return undefined
    return ranked[0].chapter
  }
  result.questions = result.questions.map((question) => {
    const objectiveRefs = question.objectiveRefs ?? [question.sec]
    const chapter = patch.questionLessons?.[question.id] ? result.chapters.find((entry)=>entry.key===patch.questionLessons[question.id]) : questionChapter(question)
    const page = question.page?.match(/\d+/)?.[0]
    const sourceUrl = question.sourceUrl ?? source.url + (page ? `#page=${page}` : "")
    const {lessonKey:_previousLesson,...existing}=question
    return { ...existing, version: hash([question.stem,question.code,question.options,question.answer,question.exp]), objectiveRefs, ...(chapter ? { lessonKey: chapter.key } : {}), sourceUrl, sources: question.sources ?? [{ ...source, url: sourceUrl }] }
  })
  result.flashcards = result.flashcards.map((card, index) => {
    const refs = card.objectiveRefs ?? refsFor(card.ref)
    const chapter = refs.map((ref)=>questionChapter({sec:ref,stem:card.f,options:[card.b],answer:0,exp:card.b})).find(Boolean)
    const {lessonKey:_previousLesson,...existing}=card
    const legacyIndex = card.legacyIndex ?? (Number.parseFloat(course.edition) < 1.1 ? index : undefined)
    return { ...existing, id: card.id ?? `card-${hash([result.slug,card.f,card.ref])}`, ...(legacyIndex === undefined ? {} : {legacyIndex}), version: hash([card.f,card.b,card.ref]), objectiveRefs: refs, ...(chapter ? { lessonKey: chapter.key } : {}), sourceUrl: card.sourceUrl ?? source.url, sources: card.sources ?? [source] }
  })
  result.releaseNotes = patch.releaseNotes ?? result.releaseNotes ?? []
  result.updatedAt = patch.updatedAt ?? isoDate()
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const [input, patchFile] = args.filter((arg) => !arg.startsWith("--"))
  if (!input || !patchFile) throw new Error("usage: upgrade-course.mjs /private/course.json /private/patch.json [--write]")
  const course = JSON.parse(fs.readFileSync(input,"utf8"))
  const upgraded = upgradeCourse(course,JSON.parse(fs.readFileSync(patchFile,"utf8")))
  const activities = upgraded.chapters.flatMap((chapter) => chapter.activities ?? [])
  if (args.includes("--write")) {
    const backup = `${input}.before-${upgraded.edition}.json`
    if (!fs.existsSync(backup)) fs.copyFileSync(input,backup,fs.constants.COPYFILE_EXCL)
    fs.chmodSync(backup,0o600)
    fs.writeFileSync(input,JSON.stringify(upgraded,null,2)+"\n",{mode:0o600})
    fs.chmodSync(input,0o600)
  }
  console.log(JSON.stringify({slug:upgraded.slug,edition:upgraded.edition,chapters:upgraded.chapters.length,questions:upgraded.questions.length,flashcards:upgraded.flashcards.length,activities:activities.length,changed:args.includes("--write")},null,2))
}
