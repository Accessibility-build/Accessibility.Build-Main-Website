import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"
import { JSDOM } from "jsdom"
import { courseManifest, validateCourse } from "./course-content.mjs"
import { upgradeCourse } from "./upgrade-course.mjs"

const temp = fs.mkdtempSync(path.join(os.tmpdir(),"course-activities-"))
try {
  const output = path.join(temp,"checks.mjs")
  await build({entryPoints:["lib/courses/activity-checks.ts"],outfile:output,bundle:true,platform:"node",format:"esm"})
  const helpers = await import(pathToFileURL(output).href)
  const parse = (html) => new JSDOM(html).window.document
  const activity = {id:"synthetic-label",version:"1",kind:"lab",title:"Synthetic label test",brief:"Test fixture",outcomes:["Associate a label"],objectiveRefs:["I.A"],minutes:5,steps:[{id:"identify",prompt:"Identify the control",options:[{id:"yes",text:"Associate label",feedback:"Association identifies the field"},{id:"no",text:"Remove label",feedback:"That loses information"}],answer:"yes"}],starterCode:'<p>Contact</p><input id="contact">',solutionCode:'<label for="contact">Contact</label><input id="contact">',checks:[{id:"label",label:"Associated label",selector:'label[for="contact"]',textIncludes:"Contact"}],manualChecks:["Inspect the accessible name"],reflection:{prompt:"Explain",criteria:["Named evidence"],example:"Explanation"},sources:[{title:"Source",url:"https://example.com/"}],transfer:{prompt:"New example",options:[{text:"Keep association",feedback:"Yes"},{text:"Remove it",feedback:"No"}],answer:0}}
  assert.equal(helpers.checkActivityCode(activity,activity.starterCode,parse)[0].passed,false)
  const passed=helpers.checkActivityCode(activity,activity.solutionCode,parse)
  assert.equal(passed[0].passed,true)
  const empty=helpers.initialActivityState(activity)
  assert(helpers.activityCompletionIssues(activity,empty,[]).length>=6,"Unfinished work must not count as completed")
  const complete={...empty,answers:{identify:"yes"},checked:["identify","code","transfer"],code:activity.solutionCode,manual:["0"],criteria:["0"],reflection:"I inspected the field and recorded its associated accessible name.",transfer:"0",confidence:"high"}
  assert.deepEqual(helpers.activityCompletionIssues(activity,complete,passed),[])
  assert(helpers.activityCompletionIssues(activity,{...complete,answers:{identify:"no"}},passed).length>0)
  assert(helpers.activityCompletionIssues(activity,{...complete,manual:[]},passed).length>0)
  assert(helpers.activityCompletionIssues(activity,{...complete,checked:complete.checked.filter(x=>x!=="code")},passed).length>0)
  assert(helpers.activityCompletionIssues(activity,{...complete,version:"old"},passed).length>0)
  assert.equal(helpers.initialActivityState(activity,{...complete,version:"old"}).completedAt,undefined)
  assert(helpers.activityPortfolio(activity,complete).includes("learner attestation"))
  assert(helpers.activityPortfolio(activity,complete).includes("Keep association"))
  assert(helpers.activityPortfolio(activity,empty).includes("Not answered"))
  const preview=helpers.activityPreview('<style>.test{color:red}</style><script>alert(1)</script><input autofocus onfocus="alert(1)"><a href="https://example.com">Link</a><iframe srcdoc="x"></iframe>',parse)
  const rendered=parse(preview)
  assert.equal(rendered.querySelectorAll("script,iframe,[autofocus],[onfocus],a[href]").length,0)
  assert(rendered.querySelector('meta[http-equiv="Content-Security-Policy"]').content.includes("default-src 'none'"))
  assert(preview.includes(".test{color:red}"),"Static CSS is retained within the isolated preview")

  const sections=[{ref:"I.A",domain:1,title:"One"},{ref:"II.A",domain:2,title:"Two"},{ref:"III.A",domain:3,title:"Three"}]
  const make=(id,set,d)=>({id,set,d,sec:sections[d-1].ref,secTitle:"Section",ref:sections[d-1].ref,stem:`Synthetic ${id}`,options:["one","two","three","four"],answer:0,exp:"Fixture explanation",page:"1"})
  const course={slug:"synthetic-course",edition:"1",built:"Test",sections,chapters:[{key:"one",title:"One",outlineRef:"I.A",bokPages:"1",blocks:[{type:"p",text:"Synthetic lesson"}]}],parts:[{title:"One",chapters:["one"]}],flashcards:[{f:"Prompt",b:"Answer",ref:"I.A",d:1}],questions:[...['A','B'].flatMap(set=>[1,1,1,1,2,2,2,2,3,3].map((d,i)=>make(set+i,set,d))),...sections.map((s,i)=>make('D'+i,'drill',i+1))]}
  const patch={edition:"1.1",built:"Test",updatedAt:"2026-11-17",examSource:{title:"Source",url:"https://example.com/bok",context:"exam"},chapters:{one:{activities:[activity]}}}
  const upgraded=upgradeCourse(course,patch)
  assert.deepEqual(validateCourse(upgraded),[])
  assert.deepEqual(upgradeCourse(upgraded,patch),upgraded,"Upgrades must be idempotent")
  assert(upgraded.flashcards[0].id)
  assert.equal(upgraded.flashcards[0].legacyIndex,0)
  const inserted=structuredClone(upgraded);inserted.flashcards.unshift({f:"New prompt",b:"New answer",ref:"I.A",d:1})
  const migrated=upgradeCourse(inserted,patch)
  assert.equal(migrated.flashcards[0].legacyIndex,undefined,"New cards must not inherit another card's legacy position")
  assert.equal(migrated.flashcards[1].legacyIndex,0)
  assert.equal(upgraded.questions[0].lessonKey,"one")
  assert.equal(courseManifest(upgraded).activityCount,1)
  const appendix=structuredClone(upgraded);appendix.chapters.push({key:"what-changed",blocks:[{type:"table",caption:"What has changed since the BoK",rows:[["change"]]},{type:"table",caption:"Slips and inconsistencies",rows:[["slip"]]},{type:"table",caption:"Statements we could not check",rows:[["unconfirmed"]]}]})
  assert.equal(courseManifest(appendix).changes,2,"Manifest distinguishes changes/slips from unconfirmed statements")
  const broken=structuredClone(upgraded);broken.questions[0].answer=1.5
  assert(validateCourse(broken).some(error=>error.includes("invalid answer")))
  const duplicate=structuredClone(upgraded);duplicate.flashcards.push(duplicate.flashcards[0])
  assert(validateCourse(duplicate).some(error=>error.includes("Duplicate flashcard")))
  let privateActivities=0
  for(const file of process.argv.slice(2)) {
    const data=JSON.parse(fs.readFileSync(file,"utf8"))
    assert.deepEqual(validateCourse(data),[],`${data.slug}: content validation`)
    for(const item of data.chapters.flatMap(chapter=>chapter.activities??[])) {
      if(item.starterCode!==undefined) {
        assert(helpers.checkActivityCode(item,item.starterCode,parse).some(check=>!check.passed),`${item.id}: starter must expose a problem`)
        assert(helpers.checkActivityCode(item,item.solutionCode,parse).every(check=>check.passed),`${item.id}: model repair must pass named checks`)
      }
      privateActivities++
    }
  }
  console.log(`Activity checks passed: completion gates, version reset, preview isolation, stable IDs, idempotent upgrade, content validation${privateActivities?`, ${privateActivities} private activities`:""}.`)
} finally {fs.rmSync(temp,{recursive:true,force:true})}
