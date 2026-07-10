// Portable Text helpers (runner injects _key on non-markDef nodes)
const span = (text, marks) => (marks ? { _type: "span", text, marks } : { _type: "span", text });
const block = (style, children) => ({ _type: "block", style, children });
const h2 = (t) => block("h2", [span(t)]);
const h3 = (t) => block("h3", [span(t)]);
const p = (...children) => block("normal", children);
const li = (listItem, children) => ({ _type: "block", listItem, style: "normal", children });
const b = (text) => li("bullet", [span(text)]);
const bl = (label, rest) => li("bullet", [span(label, ["strong"]), span(rest)]);
const n = (text) => li("number", [span(text)]);
const nl = (label, rest) => li("number", [span(label, ["strong"]), span(rest)]);

export default {
  slug: "screen-reader-testing",
  title: "Screen Reader Testing: Complete Guide for Developers",
  excerpt:
    "Learn how to test your website with screen readers like NVDA, JAWS, and VoiceOver. Comprehensive guide with practical tips and testing strategies.",
  publishedAt: "2025-11-15T10:00:00Z",
  categoryTitles: ["Screen Readers"],
  seo: {
    metaTitle: "Screen Reader Testing: Complete Guide for Developers",
    metaDescription:
      "Learn how to test your website with screen readers like NVDA, JAWS, and VoiceOver. Comprehensive guide with practical tips and testing strategies.",
    keywords: [
      "screen reader testing",
      "NVDA testing",
      "JAWS testing",
      "VoiceOver testing",
      "accessibility testing",
      "assistive technology testing",
    ],
  },
  body: [
    h2("Why Screen Reader Testing Matters"),
    p(
      span(
        "Screen reader testing is essential for identifying accessibility barriers. Over 1.3 billion people worldwide have vision impairments, with millions relying on screen readers for web access."
      )
    ),

    h2("Popular Screen Readers"),

    h3("NVDA (Windows) - 41% market share"),
    bl("Cost:", " Free"),
    bl("Best with:", " Firefox, Chrome"),
    bl("Great for:", " Testing and development"),

    h3("JAWS (Windows) - 43% market share"),
    bl("Cost:", " $95/year"),
    bl("Best with:", " Chrome, Edge"),
    bl("Industry standard:", " Advanced features"),

    h3("VoiceOver (Mac) - 10% market share"),
    bl("Cost:", " Free (built-in)"),
    bl("Best with:", " Safari"),
    bl("Mobile testing:", " iOS integration"),

    h2("Essential Commands"),
    li("bullet", [
      span("Start/Stop: ", ["strong"]),
      span("NVDA "),
      span("Ctrl+Alt+N", ["code"]),
      span(", JAWS "),
      span("Ctrl+Alt+J", ["code"]),
      span(", VoiceOver "),
      span("Cmd+F5", ["code"]),
    ]),
    li("bullet", [
      span("Next Heading: ", ["strong"]),
      span("NVDA "),
      span("H", ["code"]),
      span(", JAWS "),
      span("H", ["code"]),
      span(", VoiceOver "),
      span("VO+Cmd+H", ["code"]),
    ]),
    li("bullet", [
      span("Elements List: ", ["strong"]),
      span("NVDA "),
      span("NVDA+F7", ["code"]),
      span(", JAWS "),
      span("Insert+F3", ["code"]),
      span(", VoiceOver "),
      span("VO+U", ["code"]),
    ]),

    h2("Testing Checklist"),

    h3("Navigation Testing"),
    b("✓ Navigate by headings (H1-H6)"),
    b("✓ Jump between landmarks"),
    b("✓ Tab through interactive elements"),
    b("✓ Test skip links functionality"),

    h3("Content Testing"),
    b("✓ All content is announced"),
    b("✓ Images have meaningful alt text"),
    b("✓ Form labels are clear"),
    b("✓ Error messages are associated"),

    h2("Getting Started Tips"),
    nl("Start with NVDA:", " It's free and excellent for testing"),
    nl("Use headphones:", " Focus on audio without disturbing others"),
    nl("Turn off monitor:", " Experience the true screen reader experience"),
    nl("Test key journeys:", " Focus on critical user paths"),
    nl("Take notes:", " Document issues as you find them"),

    h3("🎯 Quick Start"),
    p(
      span(
        "Download NVDA, enable browse mode, and navigate to your website. Use H to jump between headings and Tab to move through interactive elements. Listen to how your content is announced."
      )
    ),

    h2("Common Issues Found"),
    b("Missing or poor alt text"),
    b("Unlabeled form fields"),
    b("Poor heading structure"),
    b("Inaccessible custom components"),
    b("Missing focus management"),

    h2("Best Practices"),
    b("Test regularly during development"),
    b("Learn common browsing patterns"),
    b("Test with real content"),
    b("Focus on form interactions"),
    b("Get feedback from actual users"),
  ],
};
