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
  slug: "mobile-accessibility-testing",
  title: "Mobile Accessibility Testing: iOS & Android Guide",
  excerpt:
    "Learn mobile accessibility testing with TalkBack, VoiceOver, and Switch Control. Essential guide for mobile app and responsive web accessibility.",
  publishedAt: "2025-11-15T10:00:00Z",
  categoryTitles: ["Testing Tools"],
  seo: {
    metaTitle: "Mobile Accessibility Testing: iOS & Android Guide",
    metaDescription:
      "Learn mobile accessibility testing with TalkBack, VoiceOver, and Switch Control. Essential guide for mobile app and responsive web accessibility.",
    keywords: [
      "mobile accessibility testing",
      "TalkBack testing",
      "VoiceOver mobile",
      "mobile app accessibility",
      "responsive accessibility",
      "mobile WCAG",
    ],
  },
  body: [
    h2("Why Mobile Accessibility Testing Matters"),
    p(
      span(
        "Over 60% of web traffic comes from mobile devices. Mobile accessibility testing ensures your apps and responsive websites work for users with disabilities on smartphones and tablets."
      )
    ),

    h2("Mobile Accessibility Tools"),

    h3("Android: TalkBack"),
    bl("Activation:", " Settings > Accessibility > TalkBack"),
    bl("Navigation:", " Swipe right/left to move between elements"),
    bl("Activation:", " Double-tap to activate"),
    bl("Gestures:", " Two-finger scroll, explore by touch"),

    h3("iOS: VoiceOver"),
    bl("Activation:", " Settings > Accessibility > VoiceOver"),
    bl("Quick toggle:", " Triple-click home button/side button"),
    bl("Navigation:", " Swipe right/left between elements"),
    bl("Rotor control:", " Two-finger rotation for navigation modes"),

    h3("Switch Control"),
    b("External switches or touch gestures"),
    b("Automatic scanning or manual navigation"),
    b("Essential for users with motor disabilities"),

    h2("Mobile-Specific Testing Areas"),

    h3("Touch Targets"),
    bl("Minimum size:", " 44px x 44px (iOS), 48dp x 48dp (Android)"),
    bl("Spacing:", " Adequate space between targets"),
    bl("Testing:", " Try activating with thumb or assistive devices"),

    h3("Orientation and Zoom"),
    bl("Portrait/landscape:", " Content must work in both orientations"),
    bl("Zoom support:", " Up to 200% without horizontal scrolling"),
    bl("Reflow:", " Content adapts to different screen sizes"),

    h3("Gestures and Motion"),
    bl("Alternative access:", " Provide buttons for swipe gestures"),
    bl("Motion sensitivity:", " Allow users to disable motion-triggered actions"),
    bl("Drag and drop:", " Provide alternative interaction methods"),

    h2("Testing Checklist"),

    h3("Screen Reader Testing"),
    b("✓ All content is announced clearly"),
    b("✓ Navigation order is logical"),
    b("✓ Custom components have proper labels"),
    b("✓ State changes are announced"),
    b("✓ Form errors are clearly communicated"),

    h3("Touch and Gesture Testing"),
    b("✓ All interactive elements are large enough"),
    b("✓ Touch targets don't overlap"),
    b("✓ Gestures have alternative access methods"),
    b("✓ Drag operations can be completed with simple taps"),

    h3("Visual and Motor Testing"),
    b("✓ Content remains usable at 200% zoom"),
    b("✓ Color contrast meets WCAG standards"),
    b("✓ Focus indicators are visible"),
    b("✓ Motion can be paused or disabled"),

    h2("Common Mobile Accessibility Issues"),
    bl("Tiny touch targets:", " Links and buttons too small"),
    bl("Missing labels:", " Icons without accessible names"),
    bl("Poor focus management:", " Focus lost during navigation"),
    bl("Gesture-only interactions:", " No alternative access"),
    bl("Auto-rotating content:", " Causes motion sickness"),

    h3("📱 Test Your Mobile Site"),
    {
      _type: "block",
      style: "normal",
      markDefs: [{ _key: "l1", _type: "link", href: "/tools/mobile-accessibility-checker" }],
      children: [
        span("Use our "),
        span("Mobile Accessibility Checker", ["l1"]),
        span(" to identify touch target sizes, gesture accessibility, and mobile-specific issues."),
      ],
    },

    h2("Testing Best Practices"),
    nl("Test on real devices:", " Emulators don't fully replicate the experience"),
    nl("Use actual assistive technology:", " Don't rely on keyboard-only testing"),
    nl("Test different screen sizes:", " From small phones to large tablets"),
    nl("Check both orientations:", " Portrait and landscape modes"),
    nl("Involve real users:", " Get feedback from people who use assistive technology daily"),

    h2("Mobile-First Accessibility"),
    b("Design for touch interaction from the start"),
    b("Consider one-handed use patterns"),
    b("Plan for limited screen real estate"),
    b("Optimize for slower networks and older devices"),
    b("Test with assistive technology throughout development"),

    h2("Platform-Specific Guidelines"),

    h3("iOS Accessibility"),
    b("Follow Apple's Human Interface Guidelines"),
    b("Use semantic UI elements"),
    b("Provide accessibility labels and hints"),
    b("Support Dynamic Type for text scaling"),

    h3("Android Accessibility"),
    b("Follow Material Design accessibility principles"),
    b("Use content descriptions for images"),
    b("Ensure minimum touch target sizes"),
    b("Support system accessibility settings"),

    h2("Conclusion"),
    p(
      span(
        "Mobile accessibility testing requires understanding touch interfaces, screen readers, and mobile-specific user needs. Regular testing with real devices and assistive technology ensures your mobile experiences are truly accessible."
      )
    ),
  ],
};
