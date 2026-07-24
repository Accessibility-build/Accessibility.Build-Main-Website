// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const link = (href, key, before, linkText, after) =>
  ({ _type: 'block', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

export default {
  slug: 'claude-opus-5-accessibility-tree',
  title: 'Claude Opus 5 Is Here. Its Computer-Use Score Runs on Your Accessibility Tree.',
  excerpt:
    'Anthropic shipped Opus 5 today with no accessibility claims at all. The interesting part is buried in a benchmark — and in a fallback that agents have and disabled users do not.',
  publishedAt: '2026-07-24T16:00:00Z',
  categoryTitles: ['AI & Accessibility', 'Industry News', 'Testing Tools'],
  seo: {
    metaTitle: 'Claude Opus 5 and the Accessibility Tree',
    metaDescription:
      'Opus 5 shipped with no accessibility claims. What its OSWorld computer-use score says about the accessibility tree — and the fallback blind users do not have.',
    keywords: [
      'Claude Opus 5',
      'AI accessibility',
      'accessibility tree',
      'AI agents accessibility',
      'OSWorld benchmark',
      'computer use agents',
      'AI generated code accessibility',
      'semantic accessibility gap',
      'LLM accessibility testing',
      'screen reader AI',
    ],
  },
  body: [
    p(
      span(
        'Anthropic released Claude Opus 5 today, 24 July 2026. If you search the announcement for the words "accessibility", "screen reader", "blind", or "disability", you will find nothing. Not a partnership, not a benchmark, not a sentence. That is worth stating plainly at the top, because a great deal of AI-and-accessibility writing begins by implying a connection the vendor never claimed.'
      )
    ),
    p(
      span(
        'The absence is not a criticism. It is the honest starting point. And it makes the actual connection between this release and your accessibility work more interesting, not less — because that connection is not in the marketing. It is in one of the benchmarks, and in a capability gap that has quietly inverted the argument a lot of us have been making for the last two years.'
      )
    ),

    h2('What Anthropic actually shipped'),
    p(
      span(
        'The verifiable facts, from the release itself. Opus 5 is priced at $5 per million input tokens and $25 per million output tokens, unchanged from Opus 4.8, and is available as '
      ),
      span('claude-opus-5', ['strong']),
      span(
        ' on the API. Anthropic positions it as coming close to the frontier intelligence of Claude Fable 5 at half the price, state of the art on coding and knowledge-work evaluations, and — the phrase that matters most for our purposes — "much stronger at verifying its work and iterating carefully until it succeeds."'
      )
    ),
    p(
      span(
        'Two named features ship with it. An effort setting lets you trade intelligence against token spend. A fast mode runs roughly 2.5 times faster at twice the base price. On benchmarks, Anthropic reports doubling Opus 4.8 on Frontier-Bench v0.1, landing within 0.5% of Fable 5 on CursorBench 3.2 at half the cost, scoring three times the next-best model on ARC-AGI 3, and outperforming every model at a given cost on OSWorld 2.0.'
      )
    ),
    p(
      span(
        'That last one is the one to look at. OSWorld measures whether an agent can actually operate a real computer — open applications, click through interfaces, complete multi-step tasks in software built for humans. It is the benchmark where frontier AI runs directly into the infrastructure that accessibility teams maintain.'
      )
    ),

    h2('The benchmark that runs on accessibility metadata'),
    link(
      'https://github.com/xlang-ai/OSWorld',
      'l-osworld',
      'To act on a screen, an agent needs an observation of that screen. ',
      'OSWorld',
      ' offers its agents a choice of modalities: full-resolution screenshots, accessibility trees, Set-of-Marks overlays, or combinations of them. The accessibility tree option is not a metaphor or an analogy. It is the same structural representation — roles, names, states, relationships — that a screen reader has consumed for twenty years, exposed to a model instead of to a person.'
    ),
    link(
      '/reference/aria',
      'l-aria',
      'The research finding that has held up repeatedly is that neither modality wins alone. Screenshots plus the ',
      'accessibility tree',
      ' together produce the strongest results, across model families. The tree tells the agent what things are; the pixels tell it what the screen looks like. Work on compressing that tree has found it can be cut to roughly a fifth of its original token count while improving task success — which tells you how much redundancy sits in a real accessibility tree, and how much signal survives compression.'
    ),
    p(
      span(
        'The same research line reports the other half: relying on the accessibility tree alone is inadequate where accessibility metadata is incomplete or inconsistently implemented, which is the normal condition of legacy enterprise software. Agents were, in other words, already being taught to cope with bad accessibility rather than depend on good accessibility.'
      )
    ),
    p(
      span(
        'One caveat, stated because it matters: Anthropic has not published which observation modality produced its OSWorld 2.0 figure. The point here is not that Opus 5 specifically reads your ARIA. It is that the benchmark family Anthropic chose to headline is one where accessibility metadata is a first-class input, and where the field has measured exactly what happens when that metadata is poor.'
      )
    ),

    h2('The fallback agents have and disabled users do not'),
    link(
      '/blog/web-accessible-for-ai-not-people',
      'l-prev',
      'We argued in June that ',
      'the web is being made accessible for AI rather than for people',
      ' — that businesses which ignored blind users for twenty years suddenly care about the accessibility tree now that the reader might be a paying bot. That argument still holds. But this release sharpens a limitation in it that deserves saying out loud.'
    ),
    p(
      span(
        'An agent that hits a broken accessibility tree has somewhere to go. It falls back to pixels. Opus 5 is explicitly stronger here: much stronger visual outputs, and a score on ARC-AGI 3 that is three times the next-best model. A blind user who hits the same broken tree has nowhere to go at all. There is no pixel fallback. The page is simply not there.'
      )
    ),
    p(
      span(
        'So the incentive a lot of us were quietly counting on — that commercial pressure from agent traffic would finally force companies to fix their markup — gets weaker every time vision improves, not stronger. If an agent can complete a checkout by looking at the screen, the business case for a clean accessibility tree evaporates for precisely the people who were never the business case in the first place. The alignment between what agents need and what disabled users need was always partial. It is now actively narrowing.'
      )
    ),
    p(
      span(
        'This is the part to be clear-eyed about. "Fix your accessibility so the robots can shop" was never a principled argument. It was a convenient one, and its convenience has an expiry date.'
      )
    ),

    h2('Meanwhile, the model is writing your components'),
    link(
      'https://doi.org/10.1145/3772363.3799364',
      'l-chi',
      'The second front is more immediate, because it is already in your repository. Research presented at CHI 2026 measured what it calls the ',
      'semantic accessibility gap in LLM-generated web UIs',
      ': the distance between markup that passes automated accessibility checks and markup that actually conveys meaning to someone using assistive technology.'
    ),
    p(
      span(
        'The canonical illustration is one line long. An image with '
      ),
      span('alt="image"', ['strong']),
      span(
        ' passes every automated checker ever written. The attribute is present, it is non-empty, no rule fires. A screen reader announces "image" and the user has learned precisely nothing. The check is green and the page is broken.'
      )
    ),
    p(
      span(
        'That is the exact failure mode of generated code. A frontier model produces markup that is structurally plausible and superficially correct — attributes in the right places, ARIA that looks like ARIA, alt text that exists. Whether the alt text describes the image, whether the ARIA matches what the component does, whether the focus order tracks the visual order: none of that is checkable by the tools that go green.'
      )
    ),
    link(
      '/guides/automated-vs-manual-accessibility-testing',
      'l-auto',
      'This is why the ratio matters more than ever. Automated tooling catches roughly a third of WCAG issues on a good day, and that third is the mechanical third. Generated code is unusually good at satisfying exactly that third while failing the rest, which is a genuinely new hazard: your pass rate can improve while your product gets harder to use. See ',
      'automated vs manual accessibility testing',
      ' for where each belongs.'
    ),

    h2('What "effort control" and "self-verification" mean for audit work'),
    p(
      span(
        'The two features Anthropic named are, as it happens, the two that bear directly on accessibility work — in opposite directions.'
      )
    ),
    term(
      'Self-verification helps with the mechanical layer. ',
      'A model that checks its own output and iterates will catch the unclosed element, the aria-labelledby pointing at an id that does not exist, the duplicate id, the button missing an accessible name. These are real defects and they are tedious to find. Genuine value.'
    ),
    term(
      'Effort control is a trap if you point it at judgement. ',
      'The failures that matter in accessibility are almost all judgement calls: is this alt text meaningful, is this focus order logical, is this error message actionable, does this dialog explain why it appeared. Turning effort down on a task like that does not produce a slightly worse answer. It produces a confident answer to the wrong question, and it will pass your linter.'
    ),
    p(
      span(
        'The rule of thumb that follows: spend tokens where a human would have to think, and save them where a human would have to grind. Most teams instinctively do the reverse, because grinding is where the volume is.'
      )
    ),

    h2('Where AI is genuinely helping disabled users'),
    link(
      'https://arxiv.org/abs/2601.18092',
      'l-askease',
      'None of the above should read as "AI does nothing for accessibility". The most convincing work is not in vendor announcements — it is in tools built with and for disabled users. ',
      'AskEase',
      ', for instance, is an LLM-powered NVDA add-on that offers screen reader users context-aware help in the moment, tested for robustness across a dozen applications. That is assistive technology, built where the user actually is.'
    ),
    p(
      span(
        'The pattern worth noticing is the direction of travel. Tools that help a disabled person navigate an inaccessible world are delivering real value today. Tools that promise to make the world accessible without anyone examining it remain what they were — and there is now a well-documented regulatory record of that promise not surviving contact with enforcement.'
      )
    ),
    link(
      '/blog/ai-did-not-fix-accessibility-2026',
      'l-didnt',
      'We covered that record in ',
      'AI promised to fix accessibility, and it did not',
      '. Nothing in today’s release changes it.'
    ),

    h2('What to hand a frontier model, and what never to'),
    p(
      span(
        'A practical division of labour, for teams putting Opus 5 or any comparable model into an accessibility workflow.'
      )
    ),
    plainBullet(
      'Hand it: first-pass triage of an automated scan, grouping hundreds of violations into a handful of root causes.'
    ),
    plainBullet(
      'Hand it: refactoring a div-and-click-handler component into semantic HTML, then review the result yourself.'
    ),
    plainBullet(
      'Hand it: drafting the prose of an accessibility conformance report from findings you produced.'
    ),
    plainBullet(
      'Hand it: explaining an unfamiliar success criterion, then verify against the normative text.'
    ),
    plainBullet(
      'Never: a conformance claim. Nobody can make one from a model’s output, and no certification body stands behind it.'
    ),
    plainBullet(
      'Never: alt text for images it cannot see in context, shipped without review. This is where the semantic gap lives.'
    ),
    plainBullet(
      'Never: the judgement of whether a flow is usable. That requires a person using it, ideally a person who relies on assistive technology.'
    ),
    linkBullet(
      '/guides/screen-reader-testing',
      'l-sr',
      'Never: a substitute for ',
      'testing with a real screen reader',
      '. The model does not experience your interface. It predicts text about it.'
    ),

    h2('The line that has not moved'),
    p(
      span(
        'Opus 5 is a substantially more capable model than what came before it, and the effort control is a genuinely useful knob. Neither fact tells you anything about whether your product works for a disabled person, because that question was never a capability question. It is a question about a specific human being in front of a specific interface, and the only way to answer it is still to find out.'
      )
    ),
    link(
      '/guides/accessible-dialog',
      'l-dialog',
      'If you want somewhere concrete to start, pick the component your team is least confident about and test it by hand — keyboard first, screen reader second. Our ',
      'accessible dialog guide',
      ' walks that process end to end for the pattern that breaks most often, and the WCAG 2.2 checklist covers the rest.'
    ),

    h2('Sources'),
    sourceLink(
      'https://www.anthropic.com/news/claude-opus-5',
      's1',
      'Anthropic — Introducing Claude Opus 5 (24 July 2026)'
    ),
    sourceLink(
      'https://github.com/xlang-ai/OSWorld',
      's2',
      'OSWorld — benchmark environment and agent observation modalities'
    ),
    sourceLink(
      'https://iyatomilab.github.io/a11y-compressor/',
      's3',
      'A11y-Compressor — compressing accessibility-tree observations for GUI agents'
    ),
    sourceLink(
      'https://doi.org/10.1145/3772363.3799364',
      's4',
      'CHI 2026 — Measuring the Semantic Accessibility Gap in LLM-Generated Web UIs'
    ),
    sourceLink(
      'https://arxiv.org/abs/2601.18092',
      's5',
      'AskEase — context-aware guidance for screen reader users in computer use'
    ),
  ],
}
