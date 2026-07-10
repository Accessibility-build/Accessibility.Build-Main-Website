export default {
  slug: 'web-accessible-for-ai-not-people',
  title: 'The Web Is Being Made Accessible for AI, Not People',
  excerpt: 'AI agents read the web through the accessibility tree, the same structure screen readers use. Businesses are finally investing in it, but for the wrong reason.',
  publishedAt: '2026-06-18T10:00:00Z',
  categoryTitles: ['Opinion', 'AI & Accessibility'],
  seo: {
    metaTitle: 'The Web Is Made Accessible for AI, Not People',
    metaDescription: 'AI agents read sites through the accessibility tree, the same structure screen readers use. Businesses now invest in it for commerce, not people.',
    keywords: [
      'accessibility tree',
      'AI agents',
      'agent readiness',
      'semantic HTML',
      'screen reader accessibility',
      'ARIA',
      'AI and accessibility',
      'web accessibility',
    ],
  },
  body: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'A striking irony has taken shape in 2026. The AI agents now browsing, comparing, and buying across the web read pages through the accessibility tree, the same stripped-down structural representation of a page that has powered screen readers for two decades. The structured, concise, well-labeled content those agents need is almost exactly the accommodation blind and low-vision users have asked developers for since the early days of the web, usually in vain. The difference now is the audience. When the reader is a paying bot rather than a disabled person, businesses are suddenly motivated to provide it.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'What the accessibility tree actually is' }],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'l1', _type: 'link', href: '/reference/aria' },
      ],
      children: [
        {
          _type: 'span',
          text: 'When a browser renders a page, it builds more than the visual layout. It also constructs an ',
        },
        { _type: 'span', text: 'accessibility tree', marks: ['l1'] },
        {
          _type: 'span',
          text: ': a parallel model of the page expressed as roles, names, states, and relationships. A button is a button with an accessible name. A form field has a label. A heading marks the start of a section. Screen readers have consumed this tree for twenty years to narrate a page to someone who cannot see it. The tree is only as good as the markup underneath it, which is why semantic HTML and correct ARIA matter so much.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'l2', _type: 'link', href: 'https://www.searchenginejournal.com/the-accessibility-tree-is-how-ai-agents-read-your-site-its-breaking/578171/' },
      ],
      children: [
        {
          _type: 'span',
          text: 'AI agents have arrived at the same door. Rather than interpret a wall of pixels, an agent that needs to complete a task reads the accessibility tree to understand what is on the page and how to act on it. As reporting from ',
        },
        { _type: 'span', text: 'Search Engine Journal', marks: ['l2'] },
        {
          _type: 'span',
          text: ' put it, the accessibility tree is how AI agents read your site, and where the markup is broken or missing, agents stumble in the same places screen reader users always have.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Bots are now the majority of the audience' }],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'l3', _type: 'link', href: 'https://www.techpolicy.press/the-web-is-being-made-accessible-for-ai-not-people/' },
      ],
      children: [
        {
          _type: 'span',
          text: 'The commercial pull is not hypothetical. Automated bots made up 57.2 percent of HTTP requests to HTML content in May and June of 2026, against 42.8 percent from humans, as documented in ',
        },
        { _type: 'span', text: 'Tech Policy Press', marks: ['l3'] },
        {
          _type: 'span',
          text: '. Shopping bots, research assistants, and task agents are, for the first time, a larger share of the traffic reading web content than people are. For a business, that reframes accessible structure from a compliance chore into a way to be found, understood, and transacted with.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'So teams are investing. The industry has a fresh vocabulary for it, and the phrases give the game away.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      children: [
        { _type: 'span', text: '"AI readiness" and "agent readiness"', marks: ['strong'] },
        { _type: 'span', text: ': shorthand for making a site legible to autonomous software.' },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The specific work: semantic HTML, correct ARIA, clear and unique labels, and structured data.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The specific motive: revenue. Agents that can navigate a checkout convert; agents that cannot move on to a competitor.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'l4', _type: 'link', href: 'https://www.thedrum.com/industry-insight/from-agentic-ai-to-the-eaa-five-accessibility-trends-to-watch-in-2026' },
      ],
      children: [
        {
          _type: 'span',
          text: 'That list is, almost line for line, the accessibility backlog. As ',
        },
        { _type: 'span', text: 'The Drum', marks: ['l4'] },
        {
          _type: 'span',
          text: ' noted in its roundup of 2026 accessibility trends, agentic AI and the maturing regulatory landscape are converging on the same technical requirements. The work that makes a site scrapable and usable by an agent is the work that makes it usable by assistive technology.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'The uncomfortable part' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The uncomfortable part is the sequencing. For roughly twenty years, disabled users asked for exactly this: give me headings I can navigate, buttons that announce themselves, form fields with labels, a page structure that makes sense without sight. The request was framed as a civil-rights obligation, and for two decades it was treated as an afterthought, a line item deferred until a lawsuit made it urgent. Now the same accommodation is being built at speed, not because a person needs it, but because a bot with a shopping cart does.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'blockquote',
      children: [
        {
          _type: 'span',
          text: 'The accommodation blind users spent twenty years requesting is being delivered the moment a paying machine asks for the same thing.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'It would be easy to be cynical about this, and some cynicism is earned. But the more useful response is to notice that the incentives have finally, accidentally, aligned. The question is what teams do with that alignment.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'The risk of optimizing for agents only' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The alignment is real, but it is not guaranteed. A team that treats agent readiness and human accessibility as two separate goals can easily make choices that serve one and betray the other. Hidden text stuffed into a page to feed a crawler does nothing for a screen reader user and can actively mislead one. Agent-only endpoints or parallel machine-readable feeds can let a business claim it is "AI ready" while the human-facing site stays as broken as ever. The moment accessibility is reframed as bot plumbing, it can drift away from the people it was meant to serve.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'l5', _type: 'link', href: '/wcag/1-3-1' },
        { _key: 'l6', _type: 'link', href: '/wcag/4-1-2' },
      ],
      children: [
        {
          _type: 'span',
          text: 'This is why standards still matter more than trends. WCAG success criteria such as ',
        },
        { _type: 'span', text: 'Info and Relationships (1.3.1)', marks: ['l5'] },
        {
          _type: 'span',
          text: ' and ',
        },
        { _type: 'span', text: 'Name, Role, Value (4.1.2)', marks: ['l6'] },
        {
          _type: 'span',
          text: ' describe a page structure that is correct for a human using assistive technology. Build to that standard and agents come along for free. Build to an agent spec alone and you have no guarantee a person can use what you shipped.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'What this means: do it for people first' }],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The constructive path is to keep the order of priorities straight. Do this work for people first, because it is a civil-rights obligation and, under the ADA and comparable laws, it is the law. Let the AI-agent benefits be the bonus, not the justification. That ordering is not just principled, it is practical: an approach anchored in real human accessibility produces markup that any agent can read, while an approach anchored in agent optimization produces markup that may leave humans behind.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Anchor the work in WCAG conformance and a real human user need, not an "agent readiness" checklist.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      markDefs: [
        { _key: 'l7', _type: 'link', href: '/guides/screen-reader-testing' },
      ],
      children: [
        {
          _type: 'span',
          text: 'Test the way a person would experience the page. ',
        },
        { _type: 'span', text: 'Screen reader testing', marks: ['l7'] },
        {
          _type: 'span',
          text: ' catches the same broken structure that trips up agents, and it keeps a human in the loop.',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'number',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Refuse the shortcut of hidden text or agent-only endpoints. If a fix does not help a screen reader user, it is not accessibility.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'normal',
      markDefs: [
        { _key: 'l8', _type: 'link', href: '/glossary' },
      ],
      children: [
        {
          _type: 'span',
          text: 'The web is being rebuilt to be legible to machines, and for once that project overlaps almost perfectly with a promise the industry made to disabled users long ago and rarely kept. If you want to understand the shared vocabulary underneath all of this, our ',
        },
        { _type: 'span', text: 'accessibility glossary', marks: ['l8'] },
        {
          _type: 'span',
          text: ' is a good starting point. Build for people, and the agents will read it fine. Build only for the agents, and you will have missed the point entirely.',
        },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Sources' }],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      markDefs: [
        { _key: 's1', _type: 'link', href: 'https://www.techpolicy.press/the-web-is-being-made-accessible-for-ai-not-people/' },
      ],
      children: [{ _type: 'span', text: 'Tech Policy Press: The Web Is Being Made Accessible for AI, Not People', marks: ['s1'] }],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      markDefs: [
        { _key: 's2', _type: 'link', href: 'https://www.searchenginejournal.com/the-accessibility-tree-is-how-ai-agents-read-your-site-its-breaking/578171/' },
      ],
      children: [{ _type: 'span', text: 'Search Engine Journal: The Accessibility Tree Is How AI Agents Read Your Site', marks: ['s2'] }],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      style: 'normal',
      markDefs: [
        { _key: 's3', _type: 'link', href: 'https://www.thedrum.com/industry-insight/from-agentic-ai-to-the-eaa-five-accessibility-trends-to-watch-in-2026' },
      ],
      children: [{ _type: 'span', text: 'The Drum: From Agentic AI to the EAA, Five Accessibility Trends to Watch in 2026', marks: ['s3'] }],
    },
  ],
}
