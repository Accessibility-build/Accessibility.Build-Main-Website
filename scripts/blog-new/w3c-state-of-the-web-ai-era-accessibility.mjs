// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: 'span', text, marks } : { _type: 'span', text })
const block = (style, children) => ({ _type: 'block', style, children })
const p = (...children) => block('normal', children)
const h2 = (t) => block('h2', [span(t)])
const h3 = (t) => block('h3', [span(t)])
const bullet = (children) => ({ _type: 'block', listItem: 'bullet', style: 'normal', children })
const plainBullet = (t) => bullet([span(t)])
const term = (label, rest) => bullet([span(label, ['strong']), span(rest)])
const linkBullet = (href, key, before, linkText, after) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(before), span(linkText, [key]), span(after)] })
const sourceLink = (href, key, text) =>
  ({ _type: 'block', listItem: 'bullet', style: 'normal', markDefs: [{ _key: key, _type: 'link', href }],
    children: [span(text, [key])] })

// Every factual claim below was checked against primary sources fetched on 18 Nov 2026:
// - W3C news item (21 Oct 2026): author, date, purpose, TPAC presentation on 29 Oct, feedback channels.
// - The paper itself (w3.org/2026/10/w3c-and-state-of-web-in-ai-era.html), "finalized on 20 October
//   2026", CVS revision 1.7 dated 29 Oct 2026: the nine-point declaration, the risks and opportunities
//   lists, the ARIA survey remark, the AIRFOT task force, the recommendations (protect accessibility
//   semantics, Agentic Web WG scope), the ARIA WG row, the paired agent/user requirements table (APA
//   RQTF row, forms row, "person's needs win"), human handoff as a gap, the browser as a place for the
//   human to step in, Privacy WG consent and AT-fingerprinting items, the AI-assistance note.
//   Text searches of the paper's HTML: "disab" 0 hits, "WCAG" 0 hits.
// - APA WG editor's draft "Accessibility of machine learning and generative AI" (27 Oct 2026): status
//   (Editor's Draft, APA WG) and its alt text section (the paper links section 4.2).
// - W3C Ethical Web Principles (W3C Statement, 12 Dec 2024), section 2.4 on disability.
// - TPAC 2026 breakout #50 (GitHub issue, w3c/tpac2026-breakouts) on AT adaptations and fingerprinting.
// The vendor traffic figures are reported only as what the paper cites, with its own caveat.
// The Agentic Web WG is described as proposed: the paper links no charter draft.
export default {
  slug: 'w3c-state-of-the-web-ai-era-accessibility',
  authorId: 'author-accessibility-build-team',
  title: 'W3C’s Plan for the Agentic Web Puts Accessibility First on Paper. Here Is What It Leaves Open.',
  excerpt:
    'In October 2026 the W3C Strategy Team published a discussion paper on the web in the AI era, with a nine-point declaration and a proposed Agentic Web Working Group. It says accessibility for people comes first and warns against bending ARIA for agents. We read it in full: where it protects disabled users, and where consent, handoff and agent-mediated access are still unwritten.',
  publishedAt: '2026-11-18T04:10:00Z',
  categoryTitles: ['AI & Accessibility', 'Industry News'],
  seo: {
    metaTitle: 'W3C’s AI Era Paper: What It Means for Accessibility',
    metaDescription:
      'W3C’s AI-era discussion paper says accessibility for people comes first and warns against bending ARIA for agents. What it covers and what it leaves open.',
    keywords: [
      'W3C state of the web AI era',
      'W3C agentic web',
      'Agentic Web Working Group',
      'AI agents accessibility tree',
      'ARIA and AI agents',
      'prompt injection aria-label',
      'WebMCP accessibility',
      'AI agents assistive technology',
      'W3C AI declaration',
    ],
  },
  body: [
    p(
      span(
        'On 21 October 2026 the World Wide Web Consortium published a discussion paper called W3C and the State of the Web in the AI Era. It was prepared by Philippe Le Hegaret, W3C’s VP of Technical Strategy, and collects the Strategy Team’s view of how the web’s technical agenda should change now that AI agents do not just read websites but click, type and buy on them. It was written to start discussion at TPAC 2026, W3C’s annual community meeting, and was presented to the Web and AI Interest Group on 29 October.'
      )
    ),
    p(
      span(
        'We have argued on this blog that the web is being made accessible for AI agents rather than for disabled people: businesses are fixing the accessibility tree because agents read it, not because screen reader users have been asking for years. So the obvious question is which way W3C leans. We read the whole paper. The short answer is that it leans the right way in its principles and in one specific, useful recommendation about ARIA, but the parts that will decide how agents actually behave (consent, human handoff, forms, payments) are written without disabled people in view.'
      )
    ),
    p(
      span('A note on status: ', ['strong']),
      span(
        'this is a discussion paper from W3C staff, not a standard, a W3C Statement or a consensus position. Its recommendations are proposals that the Strategy Team says it will take to each group. The page has been revised since publication (its revision stamp is dated 29 October), so we describe the version online on 18 November 2026.'
      )
    ),

    h2('The paper at a glance'),
    term('What it is:', ' a Strategy Team discussion paper, finalized on 20 October 2026 and announced the next day, seeking feedback from W3C Members and the public. The paper notes it was developed with AI assistance, with its human editor taking full responsibility.'),
    term('The declaration:', ' a proposed nine-point statement of the value of the web in the AI era, meant to extend the existing Ethical Web Principles and the Ethical Principles for Web Machine Learning rather than replace them.'),
    term('The new group:', ' a proposed Agentic Web Working Group, with WebMCP, agent identity, permissions and transparency in its orbit, and an explicit brief to work out the relationship between WebMCP, HTML and ARIA.'),
    term('The central claim:', ' agents have not bypassed the browser for APIs. Services keep relying on websites because the browser already provides sandboxing, authentication, trust and a point where a human can step in.'),
    term('The accessibility recommendation:', ' guidance from the ARIA and APA groups that instructions aimed at agents must not degrade the accessibility tree, plus guidance against prompt injection through ARIA.'),
    term('How to respond:', ' the public-webai@w3.org mailing list or issues on the w3c/webai-roadmap GitHub repository.'),

    h2('Where accessibility shows up in the paper'),
    p(
      span(
        'Accessibility has no section of its own, but it appears in five places.'
      )
    ),
    h3('1. As a named risk'),
    p(
      span(
        'The risks section lists accessibility alongside security, privacy and trust. It makes four points: optimizing ARIA for agents may break the experience for humans; generated alt text may be inaccurate and should not entirely replace authored descriptions or the author’s intent; bias in training data can misrepresent what users need; and AI may amplify the accessibility debt already sitting in large codebases. The alt text point links to a draft from W3C’s Accessible Platform Architectures (APA) Working Group on the accessibility of machine learning, which gives the example of an automated description of a bar chart that is technically accurate and tells the reader nothing about the data.'
      )
    ),
    h3('2. As an opportunity'),
    p(
      span(
        'The opportunities list is generous: generated audio description and sign language, richer real-time captions, translation, read-aloud, adaptive layouts, reading inaccessible documents without OCR, and summaries for neurodivergent readers. It also lists using and improving poorly coded content, a phrase we return to below.'
      )
    ),
    h3('3. In the declaration'),
    p(
      span(
        'The first of the nine points says the web is for all people, including people who choose to use agents, and that agents serve people. The seventh is the one this site would have written: '
      ),
      span('“Accessibility for people comes first.”', ['strong']),
      span(
        ' It goes on to say that semantics, alt text and author intent are not to be repurposed for machines at the expense of humans. Other points matter for disabled users too: consequential actions need real human consent, people can see what an agent did and undo it where possible, and there should be no AI-only side channels that replace the human web.'
      )
    ),
    h3('4. In what the community said'),
    p(
      span(
        'W3C surveyed 48 groups about AI and half replied. The paper reports that ARIA participants cautioned against bending human-centred semantics to suit agents, and that the Timed Text Working Group and Media and Entertainment Interest Group set up a task force (AIRFOT) on requirements for AI-sourced captions. Nearly half of W3C groups have not answered at all.'
      )
    ),
    h3('5. In the work plan'),
    p(
      span(
        'Two concrete items follow. The ARIA Working Group is asked to draft guidance against agent-oriented misuse of ARIA, including prompts placed in aria-label. And every group whose technology agents already use is asked to write two paired lists, modelled on how APA’s Research Questions Task Force documents user requirements: what an agent needs to act reliably, and what a person needs to stay safe and in control. Where the two conflict, the paper says, the person’s needs win, and it cites the ARIA discussion as the reason. APA itself gets the row on how agents and assistive technology can share the accessibility tree without degrading it, paired with screen reader and cognitive accessibility needs in agent-mediated tasks.'
      )
    ),

    h2('Where the paper genuinely helps'),
    p(
      span(
        'The ARIA recommendation is the most important accessibility sentence in the document, and it is aimed at a real, current problem. Once teams learn that agents read the accessibility tree, the temptation is to write for the agent: stuff an aria-label with keywords or task hints, add an aria-description telling a model what to do, or hide machine-only text from sighted users with ARIA tricks. Every one of those strings is also read aloud to a screen reader user. A W3C position that agent instructions must not degrade the tree, together with a security framing (prompts in aria-label as an injection vector), gives accessibility teams something better than a style preference to point to when someone proposes it.'
      )
    ),
    p(
      span(
        'The conflict rule matters too. Saying in advance that the person’s needs win over the agent’s is a commitment, and the paper credits the ARIA discussion for it, which suggests the accessibility community’s warnings reached the strategy level. It also sits on solid ground: the Ethical Web Principles, which the declaration would extend, already say the web platform must be accessible to people with disabilities and should enable a fully accessible end-user experience.'
      )
    ),
    p(
      span(
        'And the paper takes a privacy issue seriously that disabled people rarely see named in AI policy: fingerprinting. Among the Privacy Working Group’s proposed actions is examining whether assistive technology adaptations can identify users, which picks up a TPAC breakout about people whose access needs become a tracking signal.'
      )
    ),

    h2('Where accessibility is under-specified'),
    h3('Disabled people are present by implication only'),
    p(
      span(
        'The words disability and disabled do not appear anywhere in the paper, and nor does WCAG. Accessibility is discussed as a property of semantics and content. Disabled people appear only obliquely: neurodivergent readers in the opportunities list, screen reader and cognitive needs in one row of a table, assistive technology in two passing mentions. That matters most in the sections that will turn into specifications.'
      )
    ),
    h3('Consent and handoff are written for a generic user'),
    p(
      span(
        'Human handoff is listed as a main gap for agents on the web, and the proposed Agentic Web Working Group is to own handoff and consent patterns. The paper worries, rightly, that confirmation dialogs cause prompt fatigue, and asks the Security Interest Group what makes a confirmation trustworthy. It never asks whether that confirmation can be perceived and operated by a screen reader user, a switch user or someone with a cognitive disability. If the moment an agent hands control back to a person is a modal that traps focus badly, an unlabelled approve button or a timed prompt, the safeguard fails exactly the people most likely to be using an agent in the first place. The paired user requirements for forms say review before submit and no silent autofill of sensitive data; for payments, spending caps and clear receipts. None of them says the review or the receipt must be accessible.'
      )
    ),
    p(
      span(
        'There is a structural reason for this. In the requirements table, the new Agentic Web group’s user column lists consent, visibility of what the agent did and choice of agent. Screen reader and cognitive needs are assigned to APA, a horizontal group. That is normal W3C practice, but it means accessibility reaches the new group through review, not as one of its own requirements.'
      )
    ),
    h3('The agent as a workaround'),
    p(
      span(
        'The first point of the declaration speaks of people who choose to use agents. For many disabled people an agent is less a choice than a way round a site that does not work with their assistive technology, and the opportunities list openly includes agents that use poorly coded content. That is a real benefit today. But the paper does not say whether access through an agent counts as access, or whether a site that an agent can navigate and a keyboard user cannot is acceptable. It also notes that agents prefer markdown and structured data to HTML and would benefit from explicit descriptions alongside existing accessibility information. The declaration rules out side channels that replace the human web, but a clean channel for agents that sits beside a broken human one is not addressed. That is the scenario our earlier piece warned about, and it is still open.'
      )
    ),

    h2('What to do while W3C deliberates'),
    p(span('None of this is a standard yet, but the direction is clear enough to act on now:')),
    term('Keep agent instructions out of ARIA.', ' Accessible names and descriptions are for people. If you want to give agents more context, use visible text, structured data or a separate documented mechanism, never strings a screen reader will announce.'),
    term('Do not let generated alt text replace authored alt text.', ' The paper and the APA draft agree that machine descriptions miss intent. Treat them as a draft for a human to check against success criterion 1.1.1.'),
    term('Make every confirmation step accessible.', ' Any point where an agent or your own flow asks a human to approve, review or undo should meet the same bar as checkout: proper names and roles, managed focus and error prevention for legal and financial commitments.'),
    term('Measure the human experience, not the agent’s.', ' If an agent completes a task and a screen reader user cannot, the site is not accessible. Test both, and fix the second first.'),
    term('Respond to the paper.', ' W3C is asking for feedback. Accessibility practitioners are well placed to point out where consent and handoff need explicit accessibility requirements.'),
    p(span('Our resources for the parts you can fix today:')),
    linkBullet('/research/ai-agent-readiness', 'l1', 'See how FTSE 100 and UK council home pages look through an agent’s eyes in our ', 'AI agent readiness study', '.'),
    linkBullet('/reference/aria', 'l2', 'Check what each attribute is actually for in our ', 'ARIA reference', '.'),
    linkBullet('/wcag/4-1-2', 'l3', 'Read ', 'WCAG 4.1.2 Name, Role, Value', ', the criterion that governs what both screen readers and agents receive.'),
    linkBullet('/wcag/3-3-4', 'l4', 'Apply ', 'WCAG 3.3.4 Error Prevention', ' to any step where a person confirms a consequential action.'),
    linkBullet('/guides/screen-reader-testing', 'l5', 'Test the human side with our ', 'screen reader testing guide', '.'),
    linkBullet('/tools/url-accessibility-auditor', 'l6', 'Run a first pass on a live page with the ', 'URL accessibility auditor', '.'),
    linkBullet('/blog/web-accessible-for-ai-not-people', 'l7', 'For the argument this piece builds on, read ', 'The Web Is Being Made Accessible for AI, Not People', '.'),

    h2('The verdict'),
    p(
      span(
        'On the question we started with, W3C’s strategy paper keeps people at the centre in its principles, and on ARIA it goes further than we expected, naming the exact failure the accessibility community has been warning about and proposing guidance against it. Where it falls short is in the machinery: consent, handoff, forms and payments are being designed for a user who can see the confirmation dialog. If the Agentic Web Working Group is chartered, the test of the seventh point will be whether accessible handoff is written into its own requirements rather than left for horizontal review to catch.'
      )
    ),

    h2('Sources'),
    sourceLink('https://www.w3.org/news/2026/w3c-and-the-state-of-the-web-in-the-ai-era/', 's1', 'W3C: W3C and the State of the Web in the AI Era, news item (21 October 2026)'),
    sourceLink('https://www.w3.org/2026/10/w3c-and-state-of-web-in-ai-era.html', 's2', 'W3C Strategy Team, Philippe Le Hegaret: W3C and the State of the Web in the AI Era, discussion paper (finalized 20 October 2026, revised 29 October 2026)'),
    sourceLink('https://w3c.github.io/ai-accessibility/', 's3', 'W3C Accessible Platform Architectures Working Group: Accessibility of machine learning and generative AI, Editor’s Draft (27 October 2026)'),
    sourceLink('https://www.w3.org/TR/ethical-web-principles/', 's4', 'W3C: Ethical Web Principles, W3C Statement (12 December 2024)'),
    sourceLink('https://www.w3.org/TR/webmachinelearning-ethics/', 's5', 'W3C: Ethical Principles for Web Machine Learning'),
    sourceLink('https://github.com/w3c/tpac2026-breakouts/issues/50', 's6', 'W3C TPAC 2026 breakouts: Issue 50, assistive technology adaptations and user privacy'),
    sourceLink('https://github.com/w3c/webai-roadmap/issues', 's7', 'W3C: webai-roadmap repository, issues (feedback channel)'),
  ],
}
