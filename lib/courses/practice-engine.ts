// Practice engine for paid courses: mock exams, topic practice, missed questions and flashcards.
// Ported from the tested offline app; progress is saved to the user's account through onSave.
// Plain DOM code inside one container, so focus handling and live regions stay exactly as tested.
/* eslint-disable no-var, @typescript-eslint/ban-ts-comment -- verbatim port of the tested ES5 offline app; function hoisting and var scoping are relied on. */
// @ts-nocheck
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
var MIX = EX.weights.join("/");
/* Code snippet shown with a question. Focusable so keyboard users can scroll it. */
function codeEl(q){ return q.code ? el("pre",{"class":"q-code",tabindex:"0",role:"region","aria-label":"Code for this question"},[el("code",{text:q.code})]) : null; }
var main = root.querySelector("[data-practice-main]"), live = root.querySelector("[data-practice-live]");
var dlgEl = root.querySelector("dialog");

/* ---------- storage (works without it) ---------- */
var store = Object.assign({history:[], missed:{}, session:null, cards:{}}, opts.initial || {});
var saveTimer = null;
function save(){ if (saveTimer) clearTimeout(saveTimer); saveTimer = setTimeout(function(){ saveTimer = null; opts.onSave(store, false); }, 1200); }
function flush(){ if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; } opts.onSave(store, true); }

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
  var d = dlgEl; dlgEl.querySelector("[data-dlg-title]").textContent = title;
  var b = dlgEl.querySelector("[data-dlg-body]"); b.textContent = ""; bodyNodes.forEach(function(n){ b.appendChild(typeof n === "string" ? el("p",{text:n}) : n); });
  var bt = dlgEl.querySelector("[data-dlg-btns]"); bt.textContent = "";
  buttons.forEach(function(x){ bt.appendChild(el("button",{type:"button","class":x.primary?"primary":"quiet",text:x.label,onclick:function(){ d.close(); if (x.fn) x.fn(); }})); });
  d.showModal(); dlgEl.querySelector("[data-dlg-title]").focus();
}

/* ---------- home ---------- */
function setIds(name){ return BANK.questions.filter(function(q){ return q.set === name; }).map(function(q){ return q.id; }); }
function home(){
  stopTimer();
  var kids = [el("h1",{text:"Practice for the " + EX.name + " exam"}),
    el("p",{text:BANK.questions.length + " original questions with explanations. Two full-length mock exams follow the published exam format: " + MOCK_N + " multiple-choice questions, 2 hours, weighted " + EX.weights[0] + "% Domain One, " + EX.weights[1] + "% Domain Two and " + EX.weights[2] + "% Domain Three. The remaining questions are topic drills."})];
  if (store.session) kids.push(el("div",{"class":"feedback"},[el("p",{},[el("strong",{text:"You have an unfinished session: "}), store.session.title + ", " + answeredCount(store.session) + " of " + store.session.ids.length + " answered."]),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Resume session",onclick:function(){ resume(); }}), el("button",{type:"button","class":"quiet",text:"Discard it",onclick:function(){ store.session=null; save(); home(); }})])]));
  var cards = el("ul",{"class":"grid"});
  [["A","Mock Exam A"],["B","Mock Exam B"]].forEach(function(m){
    var best = bestScore("Mock Exam " + m[0]);
    cards.appendChild(el("li",{"class":"card"},[el("h3",{text:m[1]}), el("p",{text:MOCK_N + " questions, timed. Answers and explanations at the end."}),
      el("p",{"class":"small",text: best === null ? "Not attempted yet." : "Best score so far: " + best + "%."}),
      el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Set up " + m[1],onclick:function(){ setupMock(m[0]); }})])]));
  });
  cards.appendChild(el("li",{"class":"card"},[el("h3",{text:"Topic practice"}), el("p",{text:"Pick sections of the Body of Knowledge. See the answer and explanation after each question."}),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Choose topics",onclick:function(){ setupTopics(); }})])]));
  cards.appendChild(el("li",{"class":"card"},[el("h3",{text:"Quick quiz"}), el("p",{text:(EX.quick[0]+EX.quick[1]+EX.quick[2]) + " mixed questions in the exam's " + MIX + " weighting, with instant feedback."}),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start quick quiz",onclick:quick})])]));
  var missed = Object.keys(store.missed).filter(function(id){ return Q[id]; });
  cards.appendChild(el("li",{"class":"card"},[el("h3",{text:"Missed questions"}), el("p",{text: missed.length ? missed.length + " questions you answered wrong at least once and have not yet answered correctly." : "Questions you get wrong are collected here until you answer them correctly."}),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Practice missed questions",disabled:!missed.length,onclick:function(){ start({title:"Missed questions",mode:"study",ids:shuffle(missed).slice(0,50)}); }})])]));
  cards.appendChild(el("li",{"class":"card"},[el("h3",{text:"Flashcards"}), el("p",{text:BANK.flashcards.length + " cards for the terms, facts and lists you need to recall."}),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Open flashcards",onclick:function(){ flashSetup(); }})])]));
  kids.push(el("h2",{text:"Choose what to practice"}), cards);
  kids.push(el("h2",{text:"Your history"}));
  if (!store.history.length) kids.push(el("p",{"class":"muted",text:"Finished sessions appear here. Your progress is saved to your account."}));
  else {
    var tb = el("tbody");
    store.history.slice(-12).reverse().forEach(function(h){ tb.appendChild(el("tr",{},[el("th",{scope:"row",text:h.title}), el("td",{text:h.date}), el("td",{text:h.correct + " of " + h.total + " (" + pct(h.correct,h.total) + "%)"}), el("td",{text:[1,2,3].map(function(d){ return h.dom[d] ? "D" + d + " " + pct(h.dom[d][0],h.dom[d][1]) + "%" : ""; }).filter(Boolean).join(", ")})])); });
    kids.push(el("table",{},[el("caption",{text:"Last sessions, newest first"}), el("thead",{},[el("tr",{},[el("th",{scope:"col",text:"Session"}),el("th",{scope:"col",text:"Date"}),el("th",{scope:"col",text:"Score"}),el("th",{scope:"col",text:"By domain"})])]), tb]));
    kids.push(el("button",{type:"button","class":"quiet",text:"Erase all saved progress",onclick:function(){ dialog("Erase all saved progress?",["This removes your practice history, missed questions and flashcard marks from your account. Chapter progress is kept. It cannot be undone."],[{label:"Erase progress",primary:true,fn:function(){ store={history:[],missed:{},session:null,cards:{}}; save(); home(); }},{label:"Keep it"}]); }}));
  }
  show("Home", kids);
}
function bestScore(title){ var b = null; store.history.forEach(function(h){ if (h.title === title){ var p = pct(h.correct,h.total); if (b === null || p > b) b = p; } }); return b; }

/* ---------- setup screens ---------- */
function setupMock(letter){
  var sel = el("select",{id:"timeSel"},[["7200","Standard time: 2 hours"],["10800","Time and a half: 3 hours"],["14400","Double time: 4 hours"],["0","No timer"]].map(function(o){ return el("option",{value:o[0],text:o[1]}); }));
  show("Mock Exam " + letter, [el("h1",{text:"Mock Exam " + letter}),
    el("p",{text:"This mock follows the format IAAP publishes for the " + EX.name + " exam: " + MOCK_N + " multiple-choice questions with one best answer each, closed book, 2 hours. " + cap(num(EX.mock[0])) + " questions come from Domain One, " + num(EX.mock[1]) + " from Domain Two and " + num(EX.mock[2]) + " from Domain Three."}),
    el("ul",{},[el("li",{text:"You see no answers until you finish. You can move back and forth, change answers and flag questions to revisit."}),
      el("li",{text:"IAAP lets candidates request extra time as an accommodation. Choose the timing you expect to have on the day, or turn the timer off."}),
      el("li",{text:"You can pause at any time. If you close this page, your session is saved to your account so you can resume."})]),
    el("p",{},[el("label",{"for":"timeSel",text:"Timing "}), sel]),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start Mock Exam " + letter,onclick:function(){ start({title:"Mock Exam " + letter,mode:"exam",ids:setIds(letter),limit:parseInt(sel.value,10)}); }}), el("button",{type:"button","class":"quiet",text:"Back to home",onclick:home})])]);
}
function setupTopics(preselect){
  var fs = [1,2,3].map(function(d){
    var f = el("fieldset",{},[el("legend",{text:DOMAINS[d]})]);
    BANK.sections.filter(function(s){ return s.domain === d; }).forEach(function(s){
      var n = BANK.questions.filter(function(q){ return q.sec === s.ref; }).length;
      f.appendChild(el("label",{"class":"check"},[el("input",{type:"checkbox",name:"sec",value:s.ref,checked:!!(preselect && preselect.indexOf(s.ref) > -1)}), el("span",{text:s.title + " (" + n + " questions)"})]));
    });
    return f;
  });
  var count = el("select",{id:"cnt"},["10","20","30","50","all"].map(function(v){ return el("option",{value:v,text: v==="all" ? "All questions in the chosen topics" : v + " questions"}); }));
  var pool = el("select",{id:"pool"},[["all","Include every question"],["drill","Leave out questions used in Mock Exams A and B"]].map(function(o){ return el("option",{value:o[0],text:o[1]}); }));
  var err = el("p",{id:"topicErr",role:"alert","class":"muted"});
  show("Topic practice", [el("h1",{text:"Topic practice"}), el("p",{text:"Choose one or more sections. After each question you see the correct answer, why it is right and why the other options are not."})].concat(fs).concat([
    el("p",{},[el("label",{"for":"cnt",text:"How many "}), count]), el("p",{},[el("label",{"for":"pool",text:"Question pool "}), pool]), err,
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start practice",onclick:function(){
      var secs = Array.prototype.slice.call(main.querySelectorAll("input[name=sec]:checked")).map(function(i){ return i.value; });
      if (!secs.length){ err.textContent = "Choose at least one section."; main.querySelector("input[name=sec]").focus(); return; }
      var ids = BANK.questions.filter(function(q){ return secs.indexOf(q.sec) > -1 && (pool.value === "all" || q.set === "drill"); }).map(function(q){ return q.id; });
      if (!ids.length){ err.textContent = "No questions match. Include every question, or pick more sections."; return; }
      ids = shuffle(ids); if (count.value !== "all") ids = ids.slice(0, parseInt(count.value,10));
      start({title:"Topic practice",mode:"study",ids:ids});
    }}), el("button",{type:"button","class":"quiet",text:"Back to home",onclick:home})])]));
}
function quick(){
  function pick(d,n){ return shuffle(BANK.questions.filter(function(q){ return q.d === d; }).map(function(q){ return q.id; })).slice(0,n); }
  start({title:"Quick quiz",mode:"study",ids:shuffle(pick(1,EX.quick[0]).concat(pick(2,EX.quick[1])).concat(pick(3,EX.quick[2])))});
}

/* ---------- session ---------- */
var S = null, tick = null;
function answeredCount(s){ return s.ids.filter(function(id){ return s.ans[id] !== undefined; }).length; }
function start(cfg){ S = {title:cfg.title, mode:cfg.mode, ids:cfg.ids, i:0, ans:{}, checked:{}, flag:{}, limit:cfg.limit||0, left:cfg.limit||0, paused:false, untimed:!cfg.limit}; store.session = S; save(); render(true); startTimer(); }
function resume(){ S = store.session; S.paused = false; render(true); startTimer(); }
function startTimer(){ stopTimer(); if (!S || S.mode !== "exam" || S.untimed) return; var last = Date.now(); var marks = [1800,600,300,60];
  tick = setInterval(function(){ if (!S || S.paused) { last = Date.now(); return; } var now = Date.now(), d = (now-last)/1000; last = now; var before = S.left; S.left -= d;
    var t = document.getElementById("timer"); if (t) t.textContent = fmt(S.left);
    marks.forEach(function(m){ if (before > m && S.left <= m) say(spoken(m) + " remaining."); });
    if (Math.floor(before/15) !== Math.floor(S.left/15)) save();
    if (S.left <= 0){ stopTimer(); S.left = 0; save(); dialog("Time is up",["The time you set has run out. You can finish now and see your results, or keep going without a timer."],[{label:"Finish and see results",primary:true,fn:finish},{label:"Keep going without a timer",fn:function(){ S.untimed = true; save(); render(false); }}]); }
  }, 1000);
}
function stopTimer(){ if (tick){ clearInterval(tick); tick = null; } }
function render(focusHeading){
  var id = S.ids[S.i], q = Q[id], n = S.ids.length, exam = S.mode === "exam", done = !exam && S.checked[id];
  var bar = el("div",{"class":"bar"},[el("span",{text:S.title}), el("span",{text:answeredCount(S) + " of " + n + " answered"})]);
  if (exam && !S.untimed) bar.appendChild(el("span",{},[el("span",{text:"Time left: "}), el("span",{id:"timer","class":"timer",role:"timer","aria-live":"off",text:fmt(S.left)}), " ",
    el("button",{type:"button","class":"quiet",text:S.paused?"Resume timer":"Pause timer","aria-pressed":S.paused?"true":"false",onclick:function(){ S.paused = !S.paused; save(); render(false); say(S.paused?"Timer paused.":"Timer running."); }})]));
  var fs = el("fieldset",{"class":"q"},[el("legend",{"class":"q-legend",text:q.stem}), codeEl(q)]);
  q.options.forEach(function(o, k){
    var cls = "opt", tag = null;
    if (done){ if (k === q.answer){ cls += " correct"; tag = el("span",{"class":"tag ok",text:"Correct answer"}); } else if (S.ans[id] === k){ cls += " wrong"; tag = el("span",{"class":"tag bad",text:"Your answer"}); } }
    fs.appendChild(el("label",{"class":cls},[el("input",{type:"radio",name:"opt",value:String(k),checked:S.ans[id]===k,disabled:!!done,onchange:function(){ S.ans[id] = k; save(); var a = document.getElementById("checkBtn"); if (a) a.disabled = false; var c = bar.children[1]; c.textContent = answeredCount(S) + " of " + n + " answered"; }}), el("span",{},[o, tag])]));
  });
  var kids = [el("h1",{text:"Question " + (S.i+1) + " of " + n}), bar, el("progress",{max:String(n),value:String(S.i+1),"aria-label":"Position in this session"}),
    el("p",{"class":"small muted",text:DOMAINS[q.d] + " · " + q.secTitle + (S.flag[id] ? " · Flagged" : "")}), fs];
  if (done) kids.push(feedback(q, S.ans[id]));
  var row = el("div",{"class":"row"});
  if (!exam && !done) row.appendChild(el("button",{type:"button","class":"primary",id:"checkBtn",text:"Check answer",disabled:S.ans[id]===undefined,onclick:function(){ S.checked[id] = true; mark(id, S.ans[id] === q.answer); save(); render(false); var f = document.getElementById("fb"); if (f) f.focus(); }}));
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Previous",disabled:S.i===0,onclick:function(){ S.i--; save(); render(true); }}));
  if (S.i < n-1) row.appendChild(el("button",{type:"button","class":(exam||done)?"primary":"quiet",text:"Next",onclick:function(){ S.i++; save(); render(true); }}));
  row.appendChild(el("button",{type:"button","class":"quiet","aria-pressed":S.flag[id]?"true":"false",text:"Flag for review",onclick:function(){ S.flag[id] = !S.flag[id]; save(); render(false); say(S.flag[id]?"Flagged.":"Flag removed."); }}));
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Question list",onclick:navigator_}));
  row.appendChild(el("button",{type:"button","class":S.i===n-1?"primary":"quiet",text:exam?"Finish exam":"Finish session",onclick:confirmFinish}));
  kids.push(row);
  var keep = document.activeElement && document.activeElement.textContent;
  main.textContent = ""; kids.forEach(function(k){ main.appendChild(k); });
  document.title = "Question " + (S.i+1) + " of " + n + ", " + S.title + " | " + opts.courseTitle;
  if (focusHeading){ var h = main.querySelector("h1"); h.setAttribute("tabindex","-1"); h.focus(); window.scrollTo(0,0); }
  else if (keep){ var bs = main.querySelectorAll("button"); for (var b=0;b<bs.length;b++){ if (bs[b].textContent === keep || (/timer$/.test(keep) && /timer$/.test(bs[b].textContent))) { bs[b].focus(); break; } } }
}
function feedback(q, chosen){
  var ok = chosen === q.answer;
  return el("div",{"class":"feedback " + (ok?"ok":"bad"),id:"fb",tabindex:"-1"},[
    el("h2",{style:"margin-top:0",text: ok ? "Correct" : "Not quite"}),
    el("p",{},[el("strong",{text:"Answer: "}), q.options[q.answer]]), el("p",{text:q.exp}),
    el("p",{"class":"small muted",text:"Body of Knowledge reference: " + q.ref + ", page " + q.page + "."})]);
}
function mark(id, ok){ if (ok) delete store.missed[id]; else store.missed[id] = (store.missed[id]||0) + 1; }
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
  stopTimer();
  var dom = {}, correct = 0;
  S.ids.forEach(function(id){ var q = Q[id], ok = S.ans[id] === q.answer; dom[q.d] = dom[q.d] || [0,0]; dom[q.d][1]++; if (ok){ dom[q.d][0]++; correct++; } if (S.mode === "exam" || !S.checked[id]) { if (S.ans[id] !== undefined || S.mode === "exam") mark(id, ok); } });
  var rec = {title:S.title, date:new Date().toISOString().slice(0,10), correct:correct, total:S.ids.length, dom:dom};
  store.history.push(rec); if (store.history.length > 60) store.history = store.history.slice(-60);
  var done = S; store.session = null; S = null; save(); results(done, rec);
}
function results(s, rec){
  var tb = el("tbody");
  [1,2,3].forEach(function(d){ if (rec.dom[d]) tb.appendChild(el("tr",{},[el("th",{scope:"row",text:DOMAINS[d]}), el("td",{text:rec.dom[d][0] + " of " + rec.dom[d][1]}), el("td",{text:pct(rec.dom[d][0],rec.dom[d][1]) + "%"})])); });
  var wrong = s.ids.filter(function(id){ return s.ans[id] !== Q[id].answer; });
  var list = el("div",{id:"reviewList"});
  function fill(onlyWrong){
    list.textContent = "";
    (onlyWrong ? wrong : s.ids).forEach(function(id){
      var q = Q[id], k = s.ans[id], ok = k === q.answer;
      list.appendChild(el("div",{"class":"review-item"},[
        el("h3",{},["Question " + (s.ids.indexOf(id)+1), el("span",{"class":"tag " + (ok?"ok":"bad"),text: ok ? "Correct" : (k === undefined ? "Not answered" : "Incorrect")})]),
        el("p",{text:q.stem}), codeEl(q),
        el("ul",{},q.options.map(function(o, j){ return el("li",{},[o, j===q.answer ? el("span",{"class":"tag ok",text:"Correct answer"}) : null, (j===k && !ok) ? el("span",{"class":"tag bad",text:"Your answer"}) : null]); })),
        el("p",{text:q.exp}), el("p",{"class":"small muted",text:"Body of Knowledge reference: " + q.ref + ", page " + q.page + ". " + q.secTitle + "."})]));
    });
    if (onlyWrong && !wrong.length) list.appendChild(el("p",{text:"Nothing to review: every answer was correct."}));
  }
  var toggle = el("button",{type:"button","class":"quiet","aria-pressed":"true",text:"Show only questions I got wrong",onclick:function(){ var on = toggle.getAttribute("aria-pressed") !== "true"; toggle.setAttribute("aria-pressed", on?"true":"false"); fill(on); }});
  fill(true);
  show("Results", [el("h1",{text:"Results: " + rec.title}),
    el("p",{},[el("strong",{text:rec.correct + " of " + rec.total + " correct (" + pct(rec.correct,rec.total) + "%)."})]),
    el("table",{},[el("caption",{text:"Score by domain"}), el("thead",{},[el("tr",{},[el("th",{scope:"col",text:"Domain"}),el("th",{scope:"col",text:"Correct"}),el("th",{scope:"col",text:"Percent"})])]), tb]),
    el("p",{"class":"small muted",text:"IAAP reports results as pass or fail on a scaled score of 200 to 800, with 600 as the passing mark, and does not publish the percentage of questions needed to pass. So this app cannot tell you whether a score would pass. As our own rule of thumb, keep practicing any domain where you score under 80%."}),
    el("div",{"class":"row noprint"},[el("button",{type:"button","class":"primary",text:"Back to home",onclick:home}), wrong.length ? el("button",{type:"button","class":"quiet",text:"Practice the questions I got wrong",onclick:function(){ start({title:"Missed questions",mode:"study",ids:wrong.slice()}); }}) : null]),
    el("h2",{text:"Review"}), el("div",{"class":"row noprint"},[toggle]), list]);
}

/* ---------- flashcards ---------- */
function flashSetup(){
  var sel = el("select",{id:"fd"},[["0","All domains"],["1","Domain One"],["2","Domain Two"],["3","Domain Three"]].map(function(o){ return el("option",{value:o[0],text:o[1]}); }));
  var only = el("input",{type:"checkbox",id:"fl"});
  show("Flashcards",[el("h1",{text:"Flashcards"}), el("p",{text:"Read the prompt, answer in your head, then reveal the answer and mark whether you knew it."}),
    el("p",{},[el("label",{"for":"fd",text:"Cards from "}), sel]), el("label",{"class":"check"},[only, el("span",{text:"Only cards I marked as still learning"})]),
    el("p",{id:"flErr",role:"alert","class":"muted"}),
    el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"Start",onclick:function(){
      var d = parseInt(sel.value,10), deck = BANK.flashcards.map(function(c,i){ return i; }).filter(function(i){ var c = BANK.flashcards[i]; return (!d || c.d === d) && (!only.checked || store.cards[i] === 0); });
      if (!deck.length){ document.getElementById("flErr").textContent = "No cards match that choice."; return; }
      flash(shuffle(deck), 0, false);
    }}), el("button",{type:"button","class":"quiet",text:"Back to home",onclick:home})])]);
}
function flash(deck, i, open){
  var c = BANK.flashcards[deck[i]];
  var kids = [el("h1",{text:"Card " + (i+1) + " of " + deck.length}),
    el("div",{"class":"flash"},[el("p",{},[el("strong",{text:c.f})]), open ? el("p",{id:"back",tabindex:"-1",text:c.b}) : null])];
  var row = el("div",{"class":"row",style:"margin-top:1rem"});
  function next(){ if (i < deck.length-1) flash(deck, i+1, false); else { show("Flashcards done",[el("h1",{text:"End of the deck"}), el("p",{text:"You went through " + deck.length + " cards."}), el("div",{"class":"row"},[el("button",{type:"button","class":"primary",text:"More flashcards",onclick:flashSetup}), el("button",{type:"button","class":"quiet",text:"Back to home",onclick:home})])]); } }
  if (!open) row.appendChild(el("button",{type:"button","class":"primary",text:"Show answer",onclick:function(){ flash(deck, i, true); }}));
  else { row.appendChild(el("button",{type:"button","class":"primary",text:"I knew it",onclick:function(){ store.cards[deck[i]] = 1; save(); next(); }}));
         row.appendChild(el("button",{type:"button","class":"quiet",text:"Still learning",onclick:function(){ store.cards[deck[i]] = 0; save(); next(); }})); }
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Previous card",disabled:i===0,onclick:function(){ flash(deck, i-1, false); }}));
  row.appendChild(el("button",{type:"button","class":"quiet",text:"Stop",onclick:home}));
  kids.push(row);
  main.textContent = ""; kids.forEach(function(k){ main.appendChild(k); });
  document.title = "Card " + (i+1) + " of " + deck.length + " | " + opts.courseTitle;
  if (open) document.getElementById("back").focus(); else { var h = main.querySelector("h1"); h.setAttribute("tabindex","-1"); h.focus(); }
}

var onUnload = function(){ if (S) { store.session = S; } flush(); };
window.addEventListener("pagehide", onUnload);
/* Deep links from the course pages: ?view=flashcards, ?view=topics or ?topic=<section ref>. */
var startAt = opts.start || {};
var knownSecs = BANK.sections.map(function(x){ return x.ref; });
var startTopics = (startAt.topics || []).filter(function(t){ return knownSecs.indexOf(t) > -1; });
if (startAt.view === "flashcards" && BANK.flashcards.length) flashSetup();
else if (startTopics.length || startAt.view === "topics") setupTopics(startTopics);
else home();
return function destroy(){ stopTimer(); window.removeEventListener("pagehide", onUnload); if (S) { store.session = S; } flush(); };
}
