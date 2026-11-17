// Practice engine for paid courses: mock exams, topic practice, missed questions and flashcards.
// DOM ownership stays within one container. State transitions and scheduling use typed,
// independently tested helpers; persistence is supplied by the account-scoped controller.
/* eslint-disable no-var, @typescript-eslint/ban-ts-comment -- legacy DOM renderer uses function-scoped vars; tested through synthetic DOM interactions. */
// @ts-nocheck
import { makeSession, reconcileSession, finishSnapshot, historyEntry, scheduleReview, isReviewDue, flashcardId, migrateCardMarks, selectQuickQuestions, timingLabel } from "./practice-state"
export function mountPractice(opts) {
"use strict";
var BANK = opts.bank;
var root = opts.root;
var Q = {}; BANK.questions.forEach(function(q){ Q[q.id] = q; });
var EX = opts.exam;
var DOMAINS = EX.domains;
var WORDS = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
function cap(w){ return w.charAt(0).toUpperCase() + w.slice(1); }
function num(n){ if (n <= 20) return WORDS[n]; var t = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"][Math.floor(n/10)]; return n % 10 ? t + "-" + WORDS[n%10] : t; }
var MOCK_N = EX.mock[0] + EX.mock[1] + EX.mock[2];
/* Code snippet shown with a question. Focusable so keyboard users can scroll it. */
function codeEl(q){ return q.code ? el("pre",{"class":"q-code",tabindex:"0",role:"region","aria-label":"Code for this question"},[el("code",{text:q.code})]) : null; }
var main = root.querySelector("[data-practice-main]"), live = root.querySelector("[data-practice-live]");
var dlgEl = root.querySelector("dialog");

/* ---------- storage (works without it) ---------- */
function normalize(value){ return Object.assign({history:[],missed:{},session:null,cards:{},sessions:{},exposure:{},cardReview:{},questionReview:{},edition:opts.edition},value||{}, {cards:migrateCardMarks(value?.cards,BANK.flashcards)}); }
var store = normalize(opts.initial), destroyed = false, navigating = false, screenToken = 0;
function route(start){ if (!navigating) opts.onRoute?.(start); }
function examMode(active){ window.dispatchEvent(new CustomEvent("course:practice-mode",{detail:{exam:active}})); }
function leaveQuestion(){ stopTimer(); if (S && !S.paused) { S.paused=true; if(S.mode==="exam") S.everPaused=true; save(); } examMode(false); }
function download(value,name){ var url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:"application/json"})); el("a",{href:url,download:name}).click(); setTimeout(function(){URL.revokeObjectURL(url);},1000); }
function sourceLinks(q){ var nodes=[el("p",{"class":"small muted",text:"Body of Knowledge: "+q.ref+", page "+q.page+"."})];
 if(q.lessonKey) nodes.push(el("p",{},[el("a",{href:"/courses/"+opts.slug+"/learn/chapters/"+encodeURIComponent(q.lessonKey),text:"Review this concept in the lesson"})]));
 if(q.sources?.length) nodes.push(el("ul",{"class":"small"},q.sources.filter(function(s){return s.url?.startsWith("https://");}).map(function(s){return el("li",{},[el("a",{href:s.url,target:"_blank",rel:"noopener noreferrer",text:s.title}),s.version?" · "+s.version:null]);}))); return nodes; }
function wrapTable(table){return el("div",{"class":"table-scroll",tabindex:"0",role:"region","aria-label":table.caption?.textContent||"Practice results"},[table]);}
var saveTimer = null,lastEmitted="";
function emitSave(final){var snapshot=JSON.stringify(store);if(snapshot===lastEmitted)return;lastEmitted=snapshot;opts.onSave(JSON.parse(snapshot),final);}
function save(){ if (saveTimer) clearTimeout(saveTimer); saveTimer = setTimeout(function(){ saveTimer = null; emitSave(false); }, 350); }
function flush(){ if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; } emitSave(true); }

/* ---------- helpers ---------- */
function el(tag, attrs, kids){
  var n = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function(k){
    var v = attrs[k];
    if (v === null || v === undefined || v === false) return;
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
    else if (k.slice(0,2) === "on") n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, ""); else n.setAttribute(k, v);
  });
  (kids || []).forEach(function(c){ if (c === null || c === undefined || c === false) return; n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return n;
}
function say(msg){ live.textContent = ""; setTimeout(function(){ live.textContent = msg; }, 60); }
function show(title, nodes){
  screenToken++; main.removeAttribute("data-attempt");
  main.textContent = "";
  nodes.forEach(function(n){ if (n) main.appendChild(n); });
  document.title = title + " | " + opts.courseTitle;
  var h = main.querySelector("h1"); if (h) { h.setAttribute("tabindex","-1"); h.focus(); }
  window.scrollTo(0,0);
}
function shuffle(a, seed){ var r = a.slice(), s = seed || Math.floor(Math.random()*1e9); for (var i=r.length-1;i>0;i--){ s = (s*1103515245+12345) & 0x7fffffff; var j = s % (i+1); var t=r[i]; r[i]=r[j]; r[j]=t; } return r; }
function pct(a,b){ return b ? Math.round(100*a/b) : 0; }
function fmt(sec){ var s = Math.max(0, Math.floor(sec)), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), x = s%60; return (h? h+":" : "") + (h && m<10 ? "0":"") + m + ":" + (x<10?"0":"") + x; }
function spoken(sec){ var m = Math.ceil(sec/60); if (m >= 60){ var h = Math.floor(m/60), r = m%60; return h + (h===1?" hour":" hours") + (r? " " + r + (r===1?" minute":" minutes"):""); } return m + (m===1?" minute":" minutes"); }
function dialog(title, bodyNodes, buttons){
  var opener=document.activeElement; dlgEl.addEventListener("close",function(){if(opener?.isConnected) opener.focus();},{once:true});
  var d = dlgEl; dlgEl.querySelector("[data-dlg-title]").textContent = title;
  var b = dlgEl.querySelector("[data-dlg-body]"); b.textContent = ""; bodyNodes.forEach(function(n){ b.appendChild(typeof n === "string" ? el("p",{text:n}) : n); });
  var bt = dlgEl.querySelector("[data-dlg-btns]"); bt.textContent = "";
  buttons.forEach(function(x){ bt.appendChild(el("button",{type:"button","class":x.primary?"primary":"quiet",text:x.label,onclick:function(){ d.close(); if (x.fn) x.fn(); }})); });
  d.showModal(); dlgEl.querySelector("[data-dlg-title]").focus();
}

/* ---------- home ---------- */
function setIds(name){ return BANK.questions.filter(function(q){ return q.set === name; }).map(function(q){ return q.id; }); }
function home(){
  leaveQuestion(); route({});
  var kids=[el("h1",{text:"Practice for the "+EX.name+" exam"}),el("p",{text:"Use topic drills to learn, spaced review to revisit concepts, and reserved mocks to check understanding under your chosen exam conditions."})];
  var saved=(store.session?[store.session]:[]).concat(Object.values(store.sessions||{}).filter(function(x){return x.id!==store.session?.id;}));
  if(saved.length) kids.push(el("section",{"aria-label":"Unfinished sessions"},[el("h2",{text:"Continue a saved session"})].concat(saved.map(function(x){return el("div",{"class":"saved-session"},[el("p",{},[el("strong",{text:x.title})," · "+answeredCount(x)+" of "+x.ids.length+" answered"]),el("div",{"class":"row"},[
    el("button",{type:"button","class":"primary",text:"Resume",onclick:function(){resume(x);}}),
    el("button",{type:"button","class":"quiet",text:"Discard",onclick:function(){dialog("Discard this session?",["This removes this unfinished session only. Completed attempts are kept."],[{label:"Keep session"},{label:"Discard session",fn:function(){if(store.session?.id===x.id){store.session=null;S=null;}delete store.sessions[x.id];save();home();}}]);}})])]);}))));
  var cards=el("ul",{"class":"grid"});
  [["A","Mock Exam A"],["B","Mock Exam B"]].forEach(function(m){var first=store.history.find(function(h){return h.title===m[1];}); var seen=setIds(m[0]).filter(function(id){return store.exposure[id];}).length;
    cards.appendChild(el("li",{"class":"card"},[el("h3",{text:m[1]}),el("p",{text:MOCK_N+" reserved questions. Explanations appear after submission."}),el("p",{"class":"small",text:first?"Oldest result in recent history: "+pct(first.correct,first.total)+"%. "+(first.timingLabel||"Timing was not recorded."):"No result in recent history."}),el("p",{"class":"small",text:seen?seen+" questions have been seen before.":"No recorded prior exposure. Older activity may not have exposure records."}),el("button",{type:"button","class":"primary",text:"Set up "+m[1],onclick:function(){setupMock(m[0]);}})]));});
  function card(title,body,label,fn){cards.appendChild(el("li",{"class":"card"},[el("h3",{text:title}),el("p",{text:body}),el("button",{type:"button","class":"primary",text:label,onclick:fn})]));}
  card("Topic practice","Choose sections; mock questions stay reserved by default.","Choose topics",function(){setupTopics();});
  card("Quick quiz",(EX.quick[0]+EX.quick[1]+EX.quick[2])+" mixed drill questions, prioritizing those seen least often.","Start quick quiz",quick);
  var due=BANK.questions.filter(function(q){return q.set==="drill" && store.questionReview[q.id] && isReviewDue(store.questionReview[q.id]);});
  card("Spaced review",due.length+" drill questions are due. Uncertain answers return for another look.","Open review queue",reviewSetup);
  card("Flashcards",BANK.flashcards.length+" cards. Recall first, then reveal; known cards return after a delay.","Open flashcards",flashSetup);
  kids.push(el("h2",{text:"Choose what to practise"}),cards,el("h2",{text:"Your attempts"}));
  if(!store.history.length) kids.push(el("p",{text:"Completed attempts appear here with their conditions and a detailed review."}));
  else kids.push(wrapTable(el("table",{},[el("caption",{text:"Recent attempt summaries, newest first"}),el("thead",{},[el("tr",{},["Attempt","Score","Conditions","Review"].map(function(t){return el("th",{scope:"col",text:t});}))]),el("tbody",{},store.history.slice().reverse().map(function(h){return el("tr",{},[el("th",{scope:"row"},[h.title,el("div",{"class":"small",text:h.date})]),el("td",{text:h.correct+" / "+h.total+" ("+pct(h.correct,h.total)+"%)"}),el("td",{"class":"small",text:(h.timingLabel||"Conditions not recorded")+(h.repeatedQuestions===undefined?"":" · "+h.repeatedQuestions+" previously seen")}),el("td",{},[h.id?el("button",{type:"button","class":"quiet",text:h.detailSaved?"Review attempt":"Review / retry saving",onclick:function(){openAttempt(h.id);}}):el("span",{"class":"small",text:"Older score only; answers were not retained."})])]);}))])));
  kids.push(el("p",{"class":"small muted",text:"Recent history keeps up to 60 attempt summaries. Earlier detailed reviews remain available under All saved reviews; this summary cannot establish your first-ever attempt."}),el("button",{type:"button","class":"quiet",text:"All saved reviews",onclick:allAttempts}));
  show("Practice overview",kids);
}
function reviewSetup(){ leaveQuestion();route({view:"review"});
 var due=BANK.questions.filter(function(q){return q.set==="drill" && store.questionReview[q.id] && isReviewDue(store.questionReview[q.id]);}).map(function(q){return q.id;});
 var missed=BANK.questions.filter(function(q){return q.set==="drill" && store.missed[q.id];}).map(function(q){return q.id;});
 show("Review queue",[el("h1",{text:"Review queue"}),el("p",{text:"A confident correct answer returns after a delay. Two spaced, confident successes move a missed concept out of the missed list. Repeating it immediately does not count as delayed recall."}),el("p",{text:due.length+" questions due. "+missed.length+" drill questions still need practice."}),el("div",{"class":"row"},[
 el("button",{type:"button","class":"primary",text:"Review due questions",disabled:!due.length,onclick:function(){start({title:"Spaced review",mode:"study",ids:shuffle(due).slice(0,20)});}}),
 el("button",{type:"button","class":"quiet",text:"Practise missed questions now",disabled:!missed.length,onclick:function(){start({title:"Missed questions",mode:"study",ids:shuffle(missed).slice(0,20)});}}),el("button",{type:"button","class":"quiet",text:"Practice overview",onclick:home})]),el("p",{"class":"small muted",text:"Reserved mock questions stay out of this queue. Review a completed mock through its saved attempt."})]);
}

/* ---------- setup screens ---------- */
function setupMock(letter){
  leaveQuestion(); route({mock:letter});
  var sel = el("select",{id:"timeSel"},[["7200","Standard time: 2 hours"],["10800","Time and a half: 3 hours"],["14400","Double time: 4 hours"],["0","No timer"]].map(function(o){ return el("option",{value:o[0],text:o[1]}); }));
  show("Mock Exam " + letter, [el("h1",{text:"Mock Exam " + letter}),
    el("p",{text:"This mock follows the format IAAP publishes for the " + EX.name + " exam: " + MOCK_N + " multiple-choice questions with one best answer each, closed book, 2 hours. " + cap(num(EX.mock[0])) + " questions come from Domain One, " + num(EX.mock[1]) + " from Domain Two and " + num(EX.mock[2]) + " from Domain Three."}),
    el("ul",{},[el("li",{text:"You see no answers until you finish. You can move back and forth, change answers and flag questions to revisit."}),
      el("li",{text:"IAAP lets candidates request extra time as an accommodation. Choose the timing you expect to have on the day, or turn the timer off."}),
      el("li",{text:"Pauses and continuing after time runs out are recorded with your result. Questions are hidden while paused. Save and resume your session when needed."})]),
    el("p",{"class":"feedback",text:setIds(letter).filter(function(id){return store.exposure[id];}).length+" questions have recorded prior exposure. Activity before exposure tracking was introduced cannot be reconstructed."}),
    el("p",{},[el("label",{"for":"timeSel",text:"Timing "}), sel]),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start Mock Exam " + letter,onclick:function(){ start({title:"Mock Exam " + letter,mode:"exam",ids:setIds(letter),limit:parseInt(sel.value,10)}); }}), el("button",{type:"button","class":"quiet",text:"Back to home",onclick:home})])]);
}
function setupTopics(preselect){
  leaveQuestion(); route({view:"topics",topics:preselect||[]});
  var fs = [1,2,3].map(function(d){
    var f = el("fieldset",{},[el("legend",{text:DOMAINS[d]})]);
    BANK.sections.filter(function(s){ return s.domain === d; }).forEach(function(s){
      var n = BANK.questions.filter(function(q){ return q.sec === s.ref && q.set === "drill"; }).length;
      f.appendChild(el("label",{"class":"check"},[el("input",{type:"checkbox",name:"sec",value:s.ref,checked:!!(preselect && preselect.indexOf(s.ref) > -1)}), el("span",{text:s.title + " (" + n + " drills)"})]));
    });
    return f;
  });
  var count = el("select",{id:"cnt"},["10","20","30","50","all"].map(function(v){ return el("option",{value:v,text: v==="all" ? "All questions in the chosen topics" : v + " questions"}); }));
  var pool = el("select",{id:"pool"},[["drill","Drills only — keep mock questions unseen"],["all","Include reserved mocks (reduces unseen exam questions)"]].map(function(o){ return el("option",{value:o[0],text:o[1]}); }));
  var err = el("p",{id:"topicErr",role:"alert","class":"muted"});
  show("Topic practice", [el("h1",{text:"Topic practice"}), el("p",{text:"Choose one or more sections. After each question you see the correct answer, why it is right and why the other options are not."})].concat(fs).concat([
    el("p",{},[el("label",{"for":"cnt",text:"How many "}), count]), el("p",{},[el("label",{"for":"pool",text:"Question pool "}), pool]), err,
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start practice",onclick:function(){
      var secs = Array.prototype.slice.call(main.querySelectorAll("input[name=sec]:checked")).map(function(i){ return i.value; });
      if (!secs.length){ err.textContent = "Choose at least one section."; main.querySelector("input[name=sec]").focus(); return; }
      var ids = BANK.questions.filter(function(q){ return secs.indexOf(q.sec) > -1 && (pool.value === "all" || q.set === "drill"); }).map(function(q){ return q.id; });
      if (!ids.length){ err.textContent = "No questions match. Include every question, or pick more sections."; return; }
      ids = shuffle(ids).sort(function(a,b){return (store.exposure[a]||0)-(store.exposure[b]||0);}); if (count.value !== "all") ids = ids.slice(0, parseInt(count.value,10));
      start({title:"Topic practice",mode:"study",ids:ids});
    }}), el("button",{type:"button","class":"quiet",text:"Back to home",onclick:home})])]));
}
function quick(){ start({title:"Quick quiz",mode:"study",ids:selectQuickQuestions(BANK.questions,EX.quick,store.exposure)}); }

/* ---------- session ---------- */
var S = reconcileSession(store.session,BANK.questions,opts.edition).session, tick = null;
if(S) store.session=S;
function answeredCount(s){ return s.ids.filter(function(id){ return s.ans[id] !== undefined; }).length; }
function start(cfg){
 function begin(){ S=makeSession(Object.assign({},cfg,{edition:opts.edition,questions:BANK.questions,exposure:store.exposure})); if(!S.ids.length){S=null;say("No questions match this selection.");return;} store.session=S;save();route({session:S.id});render(true);startTimer(); }
 if(!store.session){begin();return;}
 var old=store.session, actions=[{label:"Resume current session",fn:function(){resume(old);}}];
 if(Object.keys(store.sessions).length<8) actions.push({label:"Save it and start another",primary:true,fn:function(){store.sessions[old.id]=old;begin();}});
 actions.push({label:"Discard it and start another",fn:function(){store.session=null;S=null;begin();}},{label:"Keep working here"});
 dialog("Keep your unfinished session?",[old.title+" has "+answeredCount(old)+" of "+old.ids.length+" questions answered. Choose what to do before starting another activity."+(Object.keys(store.sessions).length>=8?" Eight other sessions are already saved; finish or discard one to make space.":"")],actions);
}
function resume(candidate){
 candidate=candidate||store.session;var checked=reconcileSession(candidate,BANK.questions,opts.edition);
 if(!checked.session){say("This saved session cannot be read. Other progress is still available.");return;}
 if(checked.changed.length){dialog("This course has been updated",[checked.changed.length+" questions in this session changed or were retired. The saved work is kept, but cannot be resumed as the same assessment. Download it or start a fresh activity."],[{label:"Download saved work",fn:function(){download(candidate,"saved-practice-session.json");}},{label:"Keep session"}]);return;}
 if(store.session && store.session.id!==candidate.id){if(Object.keys(store.sessions).length>=8 && !store.sessions[candidate.id] && !store.sessions[store.session.id]){say("Finish or discard a saved session before switching.");return;}store.sessions[store.session.id]=store.session;}
 delete store.sessions[checked.session.id];S=checked.session;store.session=S;S.paused=false;save();route({session:S.id});render(true);startTimer();
}
function startTimer(){stopTimer();if(!S)return;var last=Date.now(),marks=[1800,600,300,60];
 tick=setInterval(function(){if(!S||S.paused){last=Date.now();return;}var now=Date.now(),d=Math.max(0,(now-last)/1000);last=now;S.elapsedSeconds+=d;
 if(S.mode==="exam"&&!S.untimed){var before=S.left;S.left=Math.max(0,S.left-d);var t=root.querySelector("#timer");if(t)t.textContent=fmt(S.left);
 marks.forEach(function(m){if(before>m&&S.left<=m)say(spoken(m)+" remaining.");});
 if(S.left<=0){stopTimer();S.paused=true;save();render(false);dialog("Time is up",["Finish now or continue without a timer. Continuing will be recorded with your result."],[{label:"Finish and see results",primary:true,fn:finish},{label:"Continue without timer",fn:function(){S.untimed=true;S.continuedUntimed=true;S.paused=false;save();render(false);startTimer();}}]);}}
 if(Math.floor(S.elapsedSeconds)%15===0)save();},1000);
}
function stopTimer(){ if (tick){ clearInterval(tick); tick = null; } }
function render(focusHeading){
  screenToken++; main.removeAttribute("data-attempt");
  if(!S){home();return;} examMode(S.mode==="exam");
  if(S.paused){show("Session paused",[el("h1",{text:"Session paused"}),el("p",{text:"Questions are hidden while paused. The pause is recorded with your result."}),el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Resume",onclick:function(){S.paused=false;save();render(true);startTimer();}}),el("button",{type:"button","class":"quiet",text:"Practice overview",onclick:home})])]);return;}
  if(!Q[S.ids[S.i]]){home();say("A saved question is no longer available. Your session has been kept.");return;}
  if(!S.seen[S.ids[S.i]]){S.seen[S.ids[S.i]]=true;store.exposure[S.ids[S.i]]=(store.exposure[S.ids[S.i]]||0)+1;save();}
  var id = S.ids[S.i], q = Q[id], n = S.ids.length, exam = S.mode === "exam", done = !exam && S.checked[id];
  var bar = el("div",{"class":"bar"},[el("span",{text:S.title}), el("span",{text:answeredCount(S) + " of " + n + " answered"})]);
  if (exam && !S.untimed) bar.appendChild(el("span",{},[el("span",{text:"Time left: "}), el("span",{id:"timer","class":"timer",role:"timer","aria-live":"off",text:fmt(S.left)}), " ",
    el("button",{type:"button","class":"quiet",text:S.paused?"Resume timer":"Pause timer","aria-pressed":S.paused?"true":"false",onclick:function(){ S.paused = !S.paused; S.everPaused=true; save(); render(false); say(S.paused?"Timer paused.":"Timer running."); }})]));
  var fs = el("fieldset",{"class":"q"},[el("legend",{"class":"q-legend",text:q.stem}), codeEl(q)]);
  q.options.forEach(function(o, k){
    var cls = "opt", tag = null;
    if (done){ if (k === q.answer){ cls += " correct"; tag = el("span",{"class":"tag ok",text:"Correct answer"}); } else if (S.ans[id] === k){ cls += " wrong"; tag = el("span",{"class":"tag bad",text:"Your answer"}); } }
    fs.appendChild(el("label",{"class":cls},[el("input",{type:"radio",name:"opt",value:String(k),checked:S.ans[id]===k,disabled:!!done,onchange:function(){ S.ans[id] = k; save(); var a = document.getElementById("checkBtn"); if (a) a.disabled = false; var c = bar.children[1]; c.textContent = answeredCount(S) + " of " + n + " answered"; }}), el("span",{},[o, tag])]));
  });
  var kids = [el("h1",{text:"Question " + (S.i+1) + " of " + n}), bar, el("progress",{max:String(n),value:String(S.i+1),"aria-label":"Position in this session"}),
    el("p",{"class":"small muted",text:DOMAINS[q.d] + " · " + q.secTitle + (S.flag[id] ? " · Flagged" : "")}), fs];
  var confidence=el("select",{id:"answerConfidence",disabled:!!done,onchange:function(){S.confidence[id]=confidence.value;save();}},[["medium","Not sure yet"],["low","A guess"],["high","I can explain why"]].map(function(o){return el("option",{value:o[0],text:o[1],selected:(S.confidence[id]||"medium")===o[0]});}));
  kids.push(el("p",{},[el("label",{"for":"answerConfidence",text:"How confident are you? "}),confidence]));
  if (done) kids.push(feedback(q, S.ans[id]));
  var row = el("div",{"class":"row"});
  if (!exam && !done) row.appendChild(el("button",{type:"button","class":"primary",id:"checkBtn",text:"Check answer",disabled:S.ans[id]===undefined,onclick:function(){ S.checked[id] = true; mark(id, S.ans[id] === q.answer, S.confidence[id]||"medium"); save(); render(false); var f = document.getElementById("fb"); if (f) f.focus(); }}));
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Previous",disabled:S.i===0,onclick:function(){ S.i--; save(); render(true); }}));
  if (S.i < n-1) row.appendChild(el("button",{type:"button","class":(exam||done)?"primary":"quiet",text:"Next",onclick:function(){ S.i++; save(); render(true); }}));
  row.appendChild(el("button",{type:"button","class":"quiet","aria-pressed":S.flag[id]?"true":"false",text:"Flag for review",onclick:function(){ S.flag[id] = !S.flag[id]; save(); render(false); say(S.flag[id]?"Flagged.":"Flag removed."); }}));
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Question list",onclick:navigator_}));
  row.appendChild(el("button",{type:"button","class":S.i===n-1?"primary":"quiet",text:exam?"Finish exam":"Finish session",onclick:confirmFinish}));
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Save and leave",onclick:home}));
  kids.push(row);
  var keep = document.activeElement && document.activeElement.textContent;
  main.textContent = ""; kids.forEach(function(k){ main.appendChild(k); });
  document.title = "Question " + (S.i+1) + " of " + n + ", " + S.title + " | " + opts.courseTitle;
  if (focusHeading){ var h = main.querySelector("h1"); h.setAttribute("tabindex","-1"); h.focus(); window.scrollTo(0,0); }
  else if (keep){ var bs = main.querySelectorAll("button"); for (var b=0;b<bs.length;b++){ if (bs[b].textContent === keep || (/timer$/.test(keep) && /timer$/.test(bs[b].textContent))) { bs[b].focus(); break; } } }
}
function feedback(q, chosen){
 var ok=chosen===q.answer;return el("div",{"class":"feedback "+(ok?"ok":"bad"),id:"fb",tabindex:"-1"},[el("h2",{text:ok?"Correct":"Not quite"}),el("p",{},[el("strong",{text:"Answer: "}),q.options[q.answer]]),el("p",{text:q.exp}),el("p",{"class":"small",text:"Explain the deciding distinction before continuing. Uncertain answers return for review, including correct guesses."})].concat(sourceLinks(q)));
}
function mark(id,ok,confidence){if(Q[id]?.set!=="drill")return;var review=scheduleReview(store.questionReview[id],ok,confidence||"medium");store.questionReview[id]=review;
 if(ok&&confidence==="high"&&review.successes>=2)delete store.missed[id];else if(!ok||confidence!=="high")store.missed[id]=(store.missed[id]||0)+(ok?0:1)||1;
}
function navigator_(){
  var ul = el("ul",{"class":"navlist"});
  S.ids.forEach(function(id, k){
    var st = [], cls = "";
    if (S.ans[id] !== undefined){ st.push("answered"); cls += " answered"; } else st.push("not answered");
    if (S.flag[id]){ st.push("flagged"); cls += " flagged"; }
    ul.appendChild(el("li",{},[el("button",{type:"button","class":cls.trim(),"aria-current":k===S.i?"true":null,"aria-label":"Question " + (k+1) + ", " + st.join(", "),text:String(k+1) + (S.flag[id]?" ⚑":""),onclick:function(){ dlgEl.close(); S.i = k; save(); render(true); }})]));
  });
  dialog("Question list",[el("p",{"class":"small",text:"Filled border: answered. Dashed border with a flag: flagged for review."}), ul],[{label:"Close"}]);
}
function confirmFinish(){
  var n = S.ids.length, a = answeredCount(S), fl = S.ids.filter(function(id){ return S.flag[id]; }).length, msg = [];
  if (a < n) msg.push((n-a) + " of " + n + " questions are not answered. Unanswered questions count as wrong.");
  if (fl) msg.push(fl + (fl===1?" question is":" questions are") + " still flagged for review.");
  if (!msg.length) msg.push("You answered every question.");
  dialog(S.mode==="exam"?"Finish the exam?":"Finish this session?", msg, [{label:"Finish and see results",primary:true,fn:finish},{label:"Keep working"}]);
}
function finish(){
 if(!S)return;stopTimer();var done=S,attempt=finishSnapshot(done,BANK.questions);
 done.ids.forEach(function(id){if(!done.seen[id]){store.exposure[id]=(store.exposure[id]||0)+1;done.seen[id]=true;}if(done.mode==="exam"||!done.checked[id])mark(id,done.ans[id]===Q[id]?.answer,done.confidence[id]||"medium");});
 var rec=historyEntry(attempt,store.history);store.history.push(rec);store.history=store.history.slice(-60);delete store.sessions[done.id];store.session=null;S=null;flush();examMode(false);route({attempt:attempt.id});results(attempt,false);
 Promise.resolve(opts.onAttempt(attempt)).then(function(saved){if(destroyed)return;var h=store.history.find(function(x){return x.id===attempt.id;});if(h){h.detailSaved=saved;save();}if(!destroyed&&main.dataset.attempt===attempt.id)attemptStatus(saved);}).catch(function(){attemptStatus(false);});
}
function attemptStatus(saved){var p=main.querySelector("[data-attempt-status]");if(p)p.textContent=saved?"Detailed review saved to your account.":"Detailed review has not reached your account. Use Retry saving above; keep this page open or download your review until it is saved.";}
async function openAttempt(id){leaveQuestion();route({attempt:id});show("Loading review",[el("h1",{text:"Loading your attempt"}),el("p",{role:"status",text:"Retrieving the original questions and your answers…"})]);var token=screenToken;
 try{var attempt=await opts.onLoadAttempt(id);if(!destroyed&&token===screenToken)results(attempt,true);}catch{if(!destroyed&&token===screenToken)show("Review unavailable",[el("h1",{text:"This review is not available yet"}),el("p",{text:"Check your connection and retry. An attempt completed on another device may still be waiting to save there."}),el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Retry loading review",onclick:function(){openAttempt(id);}}),el("button",{type:"button","class":"quiet",text:"Practice overview",onclick:home})])]);}
}
function allAttempts(){
 leaveQuestion();route({view:"history"});
 var body=el("tbody"),status=el("p",{role:"status",tabindex:"-1",text:"Loading saved reviews…"}),offset=0,seen=new Set();
 var more=el("button",{type:"button","class":"quiet",text:"Load more reviews",disabled:true,onclick:function(){load(offset);}});
 var table=el("table",{},[el("caption",{text:"Retained attempts"}),el("thead",{},[el("tr",{},["Attempt","Score","Conditions","Review"].map(function(t){return el("th",{scope:"col",text:t});}))]),body]);
 show("Saved reviews",[el("h1",{text:"All saved reviews"}),el("p",{text:"Reviews retain the original questions, answers and conditions, including attempts from earlier editions. Load more to see earlier attempts."}),status,wrapTable(table),el("div",{"class":"row"},[more,el("button",{type:"button","class":"quiet",text:"Practice overview",onclick:home})])]);var token=screenToken;
 async function load(next){more.disabled=true;status.textContent="Loading saved reviews…";
 try{var page=await opts.onListAttempts(next);if(destroyed||token!==screenToken)return;
 page.attempts.forEach(function(h){if(seen.has(h.id))return;seen.add(h.id);body.appendChild(el("tr",{},[el("th",{scope:"row"},[h.title,el("div",{"class":"small",text:h.date})]),el("td",{text:h.correct+" / "+h.total+" ("+pct(h.correct,h.total)+"%)"}),el("td",{"class":"small",text:h.timingLabel||(h.timing?timingLabel(h.timing):"Conditions not recorded")}),el("td",{},[el("button",{type:"button","class":"quiet",text:"Review attempt",onclick:function(){openAttempt(h.id);}})])]));});
 status.textContent=seen.size?seen.size+" saved reviews loaded."+(page.nextOffset===null?" All saved reviews are shown.":""):"No detailed reviews have been saved yet. Older score-only records remain on the practice overview.";
 offset=page.nextOffset;more.hidden=offset===null;more.textContent="Load more reviews";if(more.hidden&&document.activeElement===more)status.focus();
 }catch{if(!destroyed&&token===screenToken){status.textContent="Could not load reviews. Check your connection and retry. Your saved work has not changed.";more.textContent="Retry loading reviews";more.hidden=false;}}
 finally{if(!destroyed&&token===screenToken)more.disabled=false;}}
 load(0);
}
function results(attempt,saved){
 examMode(false);var wrong=attempt.questions.filter(function(q){return attempt.answers[q.id]!==q.answer;}),list=el("div",{id:"reviewList"});
 function fill(onlyWrong){list.textContent="";(onlyWrong?wrong:attempt.questions).forEach(function(q){var chosen=attempt.answers[q.id],ok=chosen===q.answer;
 list.appendChild(el("article",{"class":"review-item"},[el("h3",{text:"Question "+(attempt.ids.indexOf(q.id)+1)+": "+(ok?"correct":chosen===undefined?"not answered":"incorrect")}),el("p",{text:q.stem}),codeEl(q),el("ul",{},q.options.map(function(o,j){return el("li",{},[o,j===q.answer?el("span",{"class":"tag ok",text:"Correct answer"}):null,j===chosen?el("span",{"class":"tag",text:"Your answer"}):null]);})),el("p",{text:q.exp}),el("p",{"class":"small",text:"Confidence: "+(attempt.confidence[q.id]==="high"?"could explain why":attempt.confidence[q.id]==="low"?"guess":"uncertain")+"."})].concat(sourceLinks(q))));});
 if(onlyWrong&&!wrong.length)list.appendChild(el("p",{text:"Every answer was correct. Show all questions to review explanations and uncertain answers."}));}
 var toggle=el("button",{type:"button","class":"quiet","aria-pressed":"false",text:"Show all questions",onclick:function(){var all=toggle.getAttribute("aria-pressed")!=="true";toggle.setAttribute("aria-pressed",String(all));toggle.textContent=all?"Show only incorrect questions":"Show all questions";fill(!all);}});fill(true);
 var table=el("table",{},[el("caption",{text:"Score by domain"}),el("thead",{},[el("tr",{},["Domain","Correct","Score"].map(function(t){return el("th",{scope:"col",text:t});}))]),el("tbody",{},[1,2,3].filter(function(d){return attempt.dom[d];}).map(function(d){return el("tr",{},[el("th",{scope:"row",text:DOMAINS[d]}),el("td",{text:attempt.dom[d][0]+" of "+attempt.dom[d][1]}),el("td",{text:pct(attempt.dom[d][0],attempt.dom[d][1])+"%"})]);}))]);
 show("Attempt review",[el("h1",{text:"Review: "+attempt.title}),el("p",{},[el("strong",{text:attempt.correct+" of "+attempt.total+" correct ("+pct(attempt.correct,attempt.total)+"%)."})]),el("p",{"class":"small",text:timingLabel(attempt.timing)+" · "+Math.ceil(attempt.timing.elapsedSeconds/60)+" active minutes · "+attempt.repeatedQuestions+" previously seen · Edition "+attempt.edition}),wrapTable(table),el("p",{"class":"small muted",text:"This score is a study signal, not a prediction of passing IAAP. Repeated questions and different timing conditions affect how to interpret it. Use the domain breakdown to decide what to practise next."}),el("p",{"data-attempt-status":true,role:"status","class":"small",text:saved?"Showing your retained attempt.":"Saving the detailed review…"}),el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Practice overview",onclick:home}),el("button",{type:"button","class":"quiet",text:"Download this review",onclick:function(){download(attempt,opts.slug+"-attempt-"+attempt.id+".json");}}),el("button",{type:"button","class":"quiet",text:"Review due concepts",onclick:reviewSetup})]),el("h2",{text:"Answers and explanations"}),toggle,list]);main.dataset.attempt=attempt.id;
}

/* ---------- flashcards ---------- */
function flashSetup(){
 leaveQuestion();route({view:"flashcards"});
 var domain=el("select",{id:"flashDomain"},[[0,"All domains"],[1,"Domain One"],[2,"Domain Two"],[3,"Domain Three"]].map(function(o){return el("option",{value:o[0],text:o[1]});}));
 var mode=el("select",{id:"flashMode"},[["due","Due and new cards"],["learning","Cards still learning"],["all","All cards"]].map(function(o){return el("option",{value:o[0],text:o[1]});}));
 var length=el("select",{id:"flashLength"},[10,20,30,50].map(function(n){return el("option",{value:n,text:n+" cards",selected:n===20});})),err=el("p",{role:"alert"});
 show("Flashcards",[el("h1",{text:"Flashcards"}),el("p",{text:"Recall before revealing. Confident answers schedule later reviews; difficult cards return sooner. Repeating a card immediately does not count as delayed recall."}),el("p",{},[el("label",{"for":"flashDomain",text:"Cards from "}),domain]),el("p",{},[el("label",{"for":"flashMode",text:"Review "}),mode]),el("p",{},[el("label",{"for":"flashLength",text:"Session length "}),length]),err,el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start flashcards",onclick:function(){
 var deck=BANK.flashcards.map(function(c,i){return {card:c,id:flashcardId(c,i)};}).filter(function(x){return (!Number(domain.value)||x.card.d===Number(domain.value))&&(mode.value==="all"||(mode.value==="learning"?store.cards[x.id]===0:isReviewDue(store.cardReview[x.id])));});
 deck=shuffle(deck).sort(function(a,b){return (store.cardReview[a.id]?0:1)-(store.cardReview[b.id]?0:1);});
 if(!deck.length){err.textContent="No cards match. Choose another domain or all cards.";return;}flash(deck.slice(0,Number(length.value)),0,false);
 }}),el("button",{type:"button","class":"quiet",text:"Practice overview",onclick:home})])]);
}
function flash(deck,i,open){var c=deck[i].card,id=deck[i].id;
 function next(correct,confidence){store.cardReview[id]=scheduleReview(store.cardReview[id],correct,confidence);store.cards[id]=correct&&confidence==="high"?1:0;save();
 if(i+1<deck.length)flash(deck,i+1,false);else show("Review complete",[el("h1",{text:"Review complete"}),el("p",{text:"You reviewed "+deck.length+" cards. They return when due; one known mark is not a guarantee of lasting recall."}),el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Choose another deck",onclick:flashSetup}),el("button",{type:"button","class":"quiet",text:"Practice overview",onclick:home})])]);}
 var row=el("div",{"class":"row"});if(!open)row.appendChild(el("button",{type:"button","class":"primary",text:"Reveal answer",onclick:function(){flash(deck,i,true);}}));
 else [["Recalled and can explain",true,"high"],["Partly recalled / guessed",true,"low"],["Still learning",false,"low"]].forEach(function(o){row.appendChild(el("button",{type:"button","class":o[2]==="high"?"primary":"quiet",text:o[0],onclick:function(){next(o[1],o[2]);}}));});
 row.appendChild(el("button",{type:"button","class":"quiet",text:"Stop",onclick:flashSetup}));
 var kids=[el("h1",{text:"Card "+(i+1)+" of "+deck.length}),el("div",{"class":"flash"},[el("p",{},[el("strong",{text:c.f})]),open?el("p",{id:"cardAnswer",tabindex:"-1",text:c.b}):null])];
 if(open){kids.push(el("p",{"class":"small muted",text:"Reference: "+c.ref}));if(c.sources?.length)kids.push(el("ul",{"class":"small"},c.sources.filter(function(s){return s.url?.startsWith("https://");}).map(function(s){return el("li",{},[el("a",{href:s.url,target:"_blank",rel:"noopener noreferrer",text:s.title})]);})));}
 kids.push(row);show("Flashcard "+(i+1),kids);if(open)root.querySelector("#cardAnswer")?.focus();
}
function navigate(start){navigating=true;try{start=start||{};
 if(start.attempt){openAttempt(start.attempt);return;}
 if(start.session){var candidate=store.session?.id===start.session?store.session:store.sessions[start.session];if(candidate){resume(candidate);return;}}
 if(start.mock){setupMock(start.mock);return;}
 if(start.view==="flashcards"){flashSetup();return;}
 if(start.view==="review"){reviewSetup();return;}
 if(start.view==="history"){allAttempts();return;}
 var topics=(start.topics||[]).filter(function(t){return BANK.sections.some(function(s){return s.ref===t;});});
 if(start.view==="topics"||topics.length){setupTopics(topics);return;}home();
 }finally{navigating=false;}}
var onUnload=function(){leaveQuestion();flush();};window.addEventListener("pagehide",onUnload);
lastEmitted=JSON.stringify(store);navigate(opts.start);
return {navigate:navigate,suspend:function(){leaveQuestion();flush();},replaceState:function(value){stopTimer();store=normalize(value);S=reconcileSession(store.session,BANK.questions,opts.edition).session;if(S)store.session=S;lastEmitted=JSON.stringify(store);home();},markAttemptSaved:function(id){var h=store.history.find(function(x){return x.id===id;});if(h){h.detailSaved=true;save();}if(main.dataset.attempt===id)attemptStatus(true);},destroy:function(){destroyed=true;window.removeEventListener("pagehide",onUnload);leaveQuestion();flush();examMode(false);}};
}
