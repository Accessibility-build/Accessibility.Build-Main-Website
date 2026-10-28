/**
 * Wordy words and phrases with a plainer alternative, written for this tool. Keys are lower case
 * and match a word with its surrounding punctuation removed, so "e.g." is stored as "e.g".
 *
 * Every pair here is our own judgement of what a general reader understands faster, not a copy
 * of a published list. The alternative is a suggestion: "commence" and "start" mean the same,
 * but "terminate" can mean "end" or "fire", so the checker shows the swap and leaves the choice
 * to the writer. Verbs are listed once in their base form and expanded to their inflections
 * (and to both -ise and -ize spellings) below.
 */

type Entry = readonly [term: string, plain: string]

/** Verbs: expanded to -s, -ed and -ing forms. */
const VERBS: Entry[] = [
  ["accompany", "go with"],
  ["accomplish", "do, finish"],
  ["acquire", "get, buy"],
  ["advise", "tell"],
  ["allocate", "give, share out"],
  ["ameliorate", "improve"],
  ["anticipate", "expect"],
  ["apprise", "tell"],
  ["ascertain", "find out"],
  ["assist", "help"],
  ["attain", "reach, get"],
  ["cease", "stop"],
  ["commence", "start"],
  ["communicate", "tell, talk"],
  ["comprise", "include, be made of"],
  ["constitute", "make up, be"],
  ["deem", "treat as, think"],
  ["demonstrate", "show"],
  ["designate", "name, choose"],
  ["disburse", "pay"],
  ["discontinue", "stop"],
  ["disseminate", "share, spread"],
  ["elucidate", "explain"],
  ["eliminate", "remove, cut"],
  ["endeavour", "try"],
  ["endeavor", "try"],
  ["enquire", "ask"],
  ["inquire", "ask"],
  ["exemplify", "show"],
  ["expedite", "speed up"],
  ["facilitate", "help, make easier"],
  ["finalise", "finish"],
  ["formulate", "draw up, make"],
  ["implement", "carry out, put in place"],
  ["indicate", "show, say"],
  ["initiate", "start"],
  ["leverage", "use"],
  ["locate", "find"],
  ["mitigate", "reduce, ease"],
  ["modify", "change"],
  ["necessitate", "need"],
  ["notify", "tell"],
  ["obtain", "get"],
  ["optimise", "improve"],
  ["participate", "take part"],
  ["peruse", "read"],
  ["possess", "have, own"],
  ["preclude", "prevent, rule out"],
  ["procure", "buy, get"],
  ["promulgate", "publish"],
  ["purchase", "buy"],
  ["rectify", "fix, put right"],
  ["reimburse", "pay back"],
  ["remit", "send, pay"],
  ["remunerate", "pay"],
  ["require", "need"],
  ["reside", "live"],
  ["retain", "keep"],
  ["solicit", "ask for"],
  ["supersede", "replace"],
  ["terminate", "end"],
  ["transmit", "send"],
  ["transpire", "happen"],
  ["utilise", "use"],
]

/** Nouns, adjectives, adverbs and fixed phrases: matched as written, plus a plural for nouns. */
const WORDS: Entry[] = [
  ["accordingly", "so"],
  ["additional", "more, extra"],
  ["adjacent to", "next to"],
  ["aforementioned", "this, these"],
  ["aggregate", "total"],
  ["alternatively", "or"],
  ["approximately", "about"],
  ["assistance", "help"],
  ["beneficial", "helpful"],
  ["capability", "ability"],
  ["cognisant", "aware"],
  ["commencement", "start"],
  ["commensurate with", "in line with"],
  ["component", "part"],
  ["concerning", "about"],
  ["consequently", "so"],
  ["deficiency", "lack, gap"],
  ["e.g", "for example"],
  ["eg", "for example"],
  ["equivalent", "equal, the same"],
  ["erroneous", "wrong"],
  ["etc", "and so on, or list everything"],
  ["expenditure", "spending"],
  ["expiration", "end"],
  ["feasible", "possible"],
  ["forthwith", "now, at once"],
  ["frequently", "often"],
  ["functionality", "features"],
  ["henceforth", "from now on"],
  ["herein", "here, in this"],
  ["i.e", "that is"],
  ["ie", "that is"],
  ["inasmuch as", "because, since"],
  ["inception", "start"],
  ["individuals", "people"],
  ["initial", "first"],
  ["initially", "at first"],
  ["inter alia", "among other things"],
  ["locality", "area"],
  ["magnitude", "size"],
  ["methodology", "method"],
  ["notwithstanding", "despite"],
  ["numerous", "many"],
  ["objective", "aim"],
  ["obligatory", "required"],
  ["operational", "working"],
  ["optimal", "best"],
  ["per annum", "a year"],
  ["personnel", "staff"],
  ["predominantly", "mostly"],
  ["preliminary", "first, early"],
  ["principal", "main"],
  ["proficiency", "skill"],
  ["proximity", "nearness"],
  ["regarding", "about"],
  ["remainder", "rest"],
  ["remuneration", "pay"],
  ["requisite", "needed"],
  ["residence", "home"],
  ["subsequently", "later, then"],
  ["substantial", "large"],
  ["sufficient", "enough"],
  ["supplementary", "extra"],
  ["thereafter", "after that"],
  ["thereby", "so, by doing this"],
  ["ultimately", "in the end"],
  ["utilisation", "use"],
  ["utilization", "use"],
  ["viable", "workable"],
  ["whereby", "by which"],
  ["whilst", "while"],
  ["a number of", "some, several"],
  ["at the present time", "now"],
  ["at this point in time", "now"],
  ["due to the fact that", "because"],
  ["for the purpose of", "to, for"],
  ["has the ability to", "can"],
  ["have the ability to", "can"],
  ["in accordance with", "under, following"],
  ["in addition to", "as well as"],
  ["in conjunction with", "with"],
  ["in excess of", "more than"],
  ["in lieu of", "instead of"],
  ["in order to", "to"],
  ["in relation to", "about"],
  ["in respect of", "about, for"],
  ["in the event that", "if"],
  ["in the vicinity of", "near"],
  ["is able to", "can"],
  ["are able to", "can"],
  ["on a regular basis", "regularly"],
  ["prior to", "before"],
  ["pursuant to", "under"],
  ["subsequent to", "after"],
  ["the majority of", "most"],
  ["with regard to", "about"],
  ["with reference to", "about"],
  ["with the exception of", "except"],
]

/** Nouns in WORDS that also take a plural we should catch. */
const PLURAL_NOUNS = new Set(["component", "deficiency", "expenditure", "objective", "residence"])

/** Verbs that double their last consonant: remit, remitted. */
const DOUBLES_CONSONANT = new Set(["remit", "transmit"])

function verbForms(base: string): string[] {
  const forms = new Set([base])
  const stem = base.endsWith("e") ? base.slice(0, -1) : base
  if (base.endsWith("y") && !/[aeiou]y$/.test(base)) {
    const root = base.slice(0, -1)
    forms.add(`${root}ies`).add(`${root}ied`).add(`${base}ing`)
  } else if (DOUBLES_CONSONANT.has(base)) {
    const doubled = `${base}${base.slice(-1)}`
    forms.add(`${base}s`).add(`${doubled}ed`).add(`${doubled}ing`)
  } else {
    forms.add(base.endsWith("s") ? `${base}es` : `${base}s`)
    forms.add(base.endsWith("e") ? `${base}d` : `${base}ed`)
    forms.add(`${stem}ing`)
  }
  // British and American spellings of -ise verbs both appear in real text.
  for (const form of [...forms]) {
    if (/is(e|es|ed|ing)$/.test(form)) forms.add(form.replace(/is(e|es|ed|ing)$/, "iz$1"))
  }
  return [...forms]
}

/** Lower-case term (single word or phrase) to its plainer alternative. */
export const PLAIN_ALTERNATIVES: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>()
  for (const [base, plain] of VERBS) for (const form of verbForms(base)) map.set(form, plain)
  for (const [term, plain] of WORDS) {
    map.set(term, plain)
    if (PLURAL_NOUNS.has(term)) map.set(term.endsWith("y") ? `${term.slice(0, -1)}ies` : `${term}s`, plain)
  }
  return map
})()

/** Longest phrase in the list, in words, so the matcher knows how far to look ahead. */
export const LONGEST_PHRASE = Math.max(...[...PLAIN_ALTERNATIVES.keys()].map((term) => term.split(" ").length))
