import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"
import { JSDOM } from "jsdom"

const directory=fs.mkdtempSync(path.join(os.tmpdir(),"course-activity-ui-"))
const dom=new JSDOM('<!doctype html><html lang="en"><head><title>Activity test</title></head><body><main><h1>Course</h1><h2>Lesson</h2><div id="root"></div></main></body></html>',{url:"https://example.com/course"})
for(const name of ["window","document","navigator","HTMLElement","Node","DOMParser","Event","MouseEvent"])Object.defineProperty(globalThis,name,{value:dom.window[name],configurable:true,writable:true})
globalThis.IS_REACT_ACT_ENVIRONMENT=true
globalThis.requestAnimationFrame=(callback)=>setTimeout(callback,0)
globalThis.cancelAnimationFrame=(timer)=>clearTimeout(timer)
try {
  const output=path.join(directory,"component.mjs")
  await build({stdin:{contents:'export { createElement, act } from "react"; export { createRoot } from "react-dom/client"; export { LearningActivity } from "./components/courses/learning-activity";',resolveDir:process.cwd(),loader:"tsx"},outfile:output,bundle:true,platform:"node",format:"esm",define:{"process.env.NODE_ENV":'"development"'},logLevel:"silent"})
  const {createElement,act,createRoot,LearningActivity}=await import(pathToFileURL(output).href)
  const activity={id:"synthetic-ui",version:"1",kind:"lab",title:"Synthetic action lab",brief:"Test a button",outcomes:["Choose a button"],objectiveRefs:["I.A"],minutes:5,steps:[{id:"decision",prompt:"Choose the control",options:[{id:"correct",text:"Native button",feedback:"Correct choice"},{id:"wrong",text:"Plain span",feedback:"Needs behavior"}],answer:"correct"}],starterCode:'<span>Save</span>',solutionCode:'<button type="button">Save</button>',checks:[{id:"button",label:"Native save action",selector:'button[type="button"]',textIncludes:"Save"}],manualChecks:["I tested keyboard activation"],reflection:{prompt:"Record evidence",criteria:["I recorded a task outcome"],example:"Model evidence"},sources:[{title:"Source",url:"https://example.com/source"}],transfer:{prompt:"Choose for navigation",options:[{text:"Link",feedback:"Navigation uses a destination"},{text:"Span",feedback:"Not a navigation control"}],answer:0}}
  let latest
  const root=createRoot(document.getElementById("root"))
  await act(async()=>root.render(createElement(LearningActivity,{activity,onChange:(state)=>{latest=state}})))
  const button=(name)=>Array.from(document.querySelectorAll("button")).find((node)=>node.textContent===name)
  const click=async(node)=>{assert(node,"Expected UI control");await act(async()=>node.click())}
  const fill=async(node,value)=>{await act(async()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,"value").set.call(node,value);node.dispatchEvent(new dom.window.Event("input",{bubbles:true}))})}
  await click(button("Record completed practice"))
  assert(document.querySelector('[role="alert"]'))
  assert(!latest?.completedAt)
  assert(button("Compare with the model reasoning").disabled)
  await click(document.querySelector('input[name$="decision"]'))
  await click(button("Check decision"))
  assert.equal(latest.answers.decision,"correct")
  assert(latest.checked.includes("decision"))
  const editors=document.querySelectorAll("textarea")
  await fill(editors[0],activity.solutionCode)
  await click(button("Run structural checks"))
  assert(document.body.textContent.includes("Passed: Native save action"))
  await click(button("Preview markup"))
  const frame=document.querySelector("iframe")
  assert.equal(frame.getAttribute("sandbox"),"")
  assert(frame.title.includes("isolated markup preview"))
  assert(frame.srcdoc.includes("default-src 'none'"))
  await click(button("Close preview and return to activity"))
  assert.equal(document.querySelector("iframe"),null)
  await fill(editors[1],"I tested the save action using the keyboard and recorded the resulting draft status.")
  assert(!button("Compare with the model reasoning").disabled)
  for(const checkbox of document.querySelectorAll('input[type="checkbox"]'))await click(checkbox)
  await click(document.querySelector('input[name$="transfer"]'))
  await click(button("Check new situation"))
  const confidence=document.querySelectorAll('input[name$="confidence"]')
  await click(confidence[2])
  await click(button("Record completed practice"))
  assert(latest.completedAt,"A fully checked and reflected activity records completion")
  assert(document.body.textContent.includes("self-assessed"))
  await fill(editors[0],activity.starterCode)
  assert.equal(latest.completedAt,undefined,"Editing a completed repair invalidates completion")
  assert.deepEqual(latest.manual,[],"Code changes invalidate prior manual checks")
  assert(!latest.checked.includes("code"))
  const axe=(await import("axe-core")).default
  const audit=await axe.run(document,{rules:{"color-contrast":{enabled:false}}})
  assert.deepEqual(audit.violations.map((violation)=>({id:violation.id,nodes:violation.nodes.map((node)=>node.target)})),[],"Rendered activity should have no detectable structural accessibility violations")
  await act(async()=>root.unmount())
  console.log("Activity UI passed: decisions, code edits/checks, isolated preview, reflection, manual attestations, transfer, completion invalidation and structural accessibility.")
} finally {dom.window.close();fs.rmSync(directory,{recursive:true,force:true})}
// React's bundled scheduler can retain a MessagePort in this synthetic DOM process.
// All assertions and cleanup have completed; a thrown assertion never reaches here.
process.exit(0)
