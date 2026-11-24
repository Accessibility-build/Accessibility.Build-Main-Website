import Link from "next/link"
import { GuideShell, GuideTable, GuideCode, guideMetadata } from "@/components/guides/guide-shell"
import type { FaqItem } from "@/components/seo/faq-section"

// Search Console, Nov 2026: a cluster of long questions about accessibility testing in CI/CD
// pipelines ("best accessibility testing tools github ci/cd integration", "which accessibility
// testing tools work best in ci/cd pipelines") ranked 5 to 10 with no page about the topic.
// Versions from the npm registry, checked 24 Nov 2026. Snippets follow each project's own
// README or docs. Restamp when axe-core, pa11y-ci or @lhci/cli change major version.

const route = "/guides/accessibility-testing-ci-cd"
const title = "Accessibility Testing in CI/CD: axe, Pa11y, Lighthouse"
const description =
  "Add automated accessibility tests to CI/CD with axe-core, Playwright, Cypress, Pa11y CI or Lighthouse CI: working configs, GitHub Actions, and what automation misses."
const datePublished = "2026-11-24"

export const metadata = guideMetadata({
  route,
  title,
  description,
  datePublished,
  keywords: [
    "accessibility testing ci/cd",
    "accessibility ci cd",
    "axe playwright",
    "pa11y-ci",
    "lighthouse ci accessibility",
    "cypress-axe",
    "github actions accessibility testing",
    "automated accessibility testing pipeline",
  ],
})

const faqs: FaqItem[] = [
  {
    question: "What is the best accessibility testing tool for CI/CD?",
    answer:
      "For most teams, axe-core run inside the end-to-end tests you already have: @axe-core/playwright for Playwright or cypress-axe for Cypress. It is free, open source, has few false positives and fails a build with a normal test assertion. If you have no browser tests, Pa11y CI scans a list of URLs with one config file, and Lighthouse CI is useful when you also want performance budgets.",
  },
  {
    question: "How much of WCAG can automated tests catch?",
    answer:
      "A minority of criteria, but a large share of the issues on a typical page. Deque's 2021 study of over 2,000 audits found axe fully covered 57% of issues by volume, yet those issues fell under only 16 of 50 success criteria. Keyboard operation, focus order, meaningful alt text and most content questions still need people.",
  },
  {
    question: "Should accessibility failures block a merge?",
    answer:
      "Yes, for violations of WCAG A and AA rules on the pages a change touches, once you have cleared the existing backlog. A common rollout is to report only for a sprint, fix or baseline the existing issues, then fail the build on any new violation.",
  },
  {
    question: "Is there an official GitHub Action for axe?",
    answer:
      "Deque publishes dequelabs/axe-linter-action, which lints changed files in pull requests and needs an axe Linter API key. For page-level tests, run axe through Playwright or Cypress in an ordinary workflow step, or run Pa11y CI or Lighthouse CI as a step. Lighthouse CI documents an official workflow; Pa11y has no official action.",
  },
  {
    question: "Does jest-axe test color contrast?",
    answer:
      "No. jest-axe runs in jsdom, which does not render pages, so color contrast checks are turned off. Use it for component markup and run contrast checks in a real browser with Playwright or Cypress.",
  },
]

const sections = [
  { id: "choose", title: "Choosing a tool" },
  { id: "playwright", title: "axe with Playwright" },
  { id: "cypress", title: "axe with Cypress" },
  { id: "components", title: "Component tests with jest-axe" },
  { id: "pa11y", title: "Pa11y CI for URL lists" },
  { id: "lighthouse", title: "Lighthouse CI" },
  { id: "github-actions", title: "A GitHub Actions workflow" },
  { id: "rollout", title: "Rolling it out without blocking everyone" },
  { id: "limits", title: "What automation will not catch" },
]

export default function AccessibilityTestingCiCdPage() {
  return (
    <GuideShell
      route={route}
      crumb="Accessibility testing in CI/CD"
      badge="Developer guide"
      title={title}
      h1="Accessibility testing in CI/CD pipelines"
      description={description}
      datePublished={datePublished}
      sections={sections}
      faqs={faqs}
      relatedContent="automated accessibility testing ci cd axe-core playwright cypress pa11y lighthouse github actions automated vs manual testing axe vs wave testing tools benchmark"
      intro={
        <p>
          Automated accessibility checks in your pipeline stop the easy regressions, such as a missing label, an empty
          button or a contrast drop, before they reach production. This guide gives working setups for the free tools
          teams actually use, and is honest about what they cannot see.
        </p>
      }
    >
      <h2 id="choose">Choosing a tool</h2>
      <GuideTable caption="Free accessibility testing tools for CI, versions on npm in November 2026">
        <thead>
          <tr>
            <th scope="col">Tool</th>
            <th scope="col">Latest (Nov 2026)</th>
            <th scope="col">Best when</th>
            <th scope="col">Engine</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>@axe-core/playwright</code></td><td>4.14.0</td><td>You have Playwright tests</td><td>axe-core 4.14</td></tr>
          <tr><td><code>cypress-axe</code></td><td>1.7.0</td><td>You have Cypress tests</td><td>axe-core (you install it)</td></tr>
          <tr><td><code>jest-axe</code></td><td>11.0.0</td><td>Testing components in isolation</td><td>axe-core, in jsdom</td></tr>
          <tr><td><code>pa11y-ci</code></td><td>5.0.0</td><td>You want to scan a list of URLs</td><td>HTML_CodeSniffer and/or axe</td></tr>
          <tr><td><code>@lhci/cli</code></td><td>0.16.1</td><td>You also track performance and SEO</td><td>A subset of axe rules</td></tr>
          <tr><td><code>@axe-core/cli</code></td><td>4.14.0</td><td>Quick scripted scans</td><td>axe-core</td></tr>
        </tbody>
      </GuideTable>
      <p>
        Skip <code>@axe-core/react</code>: its README says it does not support React 18 and above. For a deeper comparison
        of engines see <Link href="/guides/axe-vs-wave">axe vs WAVE</Link> and our{" "}
        <Link href="/research/accessibility-testing-tools-benchmark">testing tools benchmark</Link>.
      </p>

      <h2 id="playwright">axe with Playwright</h2>
      <GuideCode label="Install for Playwright">{`npm install --save-dev @playwright/test @axe-core/playwright`}</GuideCode>
      <GuideCode label="Playwright accessibility test">{`// tests/a11y.spec.ts
import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const pages = ["/", "/pricing", "/contact"]

for (const path of pages) {
  test(\`no WCAG A/AA violations on \${path}\`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze()
    expect(results.violations).toEqual([])
  })
}`}</GuideCode>
      <p>
        The tags limit the run to WCAG A and AA rules. There is no <code>wcag22a</code> tag because the new Level A
        criteria in WCAG 2.2 have no automated axe rule. Test interactive states too: open the menu or dialog in the test,
        then call <code>analyze()</code> again, and scope with <code>.include(&quot;#dialog&quot;)</code> if needed.
      </p>

      <h2 id="cypress">axe with Cypress</h2>
      <GuideCode label="Install for Cypress">{`npm install --save-dev cypress axe-core cypress-axe`}</GuideCode>
      <GuideCode label="Cypress accessibility test">{`// cypress/support/e2e.js
import "cypress-axe"

// cypress/e2e/a11y.cy.js
describe("accessibility", () => {
  it("home page has no WCAG A/AA violations", () => {
    cy.visit("/")
    cy.injectAxe()
    cy.checkA11y(null, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    })
  })
})`}</GuideCode>

      <h2 id="components">Component tests with jest-axe</h2>
      <GuideCode label="jest-axe component test">{`import { render } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"
import { SignupForm } from "./SignupForm"

expect.extend(toHaveNoViolations)

it("SignupForm has no detectable violations", async () => {
  const { container } = render(<SignupForm />)
  expect(await axe(container)).toHaveNoViolations()
})`}</GuideCode>
      <p>
        jest-axe needs the jsdom test environment. Because jsdom does not render, colour contrast checks are off; cover
        contrast in browser tests or with the <Link href="/tools/contrast-checker">contrast checker</Link> during design.
      </p>

      <h2 id="pa11y">Pa11y CI for URL lists</h2>
      <GuideCode label="Pa11y CI config file">{`// .pa11yci
{
  "defaults": {
    "standard": "WCAG2AA",
    "runners": ["axe", "htmlcs"],
    "timeout": 30000
  },
  "urls": [
    "http://localhost:3000/",
    "http://localhost:3000/pricing",
    "http://localhost:3000/contact"
  ]
}`}</GuideCode>
      <GuideCode label="Run Pa11y CI">{`npx pa11y-ci`}</GuideCode>
      <p>
        Running both runners catches a few more issues than either alone. Pa11y CI exits with a non-zero code when any URL
        has errors, which fails the job. Point it at a sitemap with <code>--sitemap</code> for broader coverage.
      </p>

      <h2 id="lighthouse">Lighthouse CI</h2>
      <GuideCode label="Lighthouse CI config with an accessibility gate">{`// lighthouserc.js
module.exports = {
  ci: {
    collect: { url: ["http://localhost:3000/"], startServerCommand: "npm run start" },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.95 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
}`}</GuideCode>
      <p>
        Lighthouse runs only a subset of axe rules and turns them into a score. A score of 100 means those rules passed,
        not that the page is accessible. Use it as a trend line alongside axe, not instead of it.
      </p>

      <h2 id="github-actions">A GitHub Actions workflow</h2>
      <GuideCode label="GitHub Actions workflow running Playwright accessibility tests">{`# .github/workflows/accessibility.yml
name: Accessibility
on: [pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test tests/a11y.spec.ts
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report`}</GuideCode>
      <p>
        Configure Playwright&rsquo;s <code>webServer</code> option to start your app, or swap the last steps for{" "}
        <code>npx pa11y-ci</code> or <code>npx @lhci/cli autorun</code>. The same commands work in GitLab CI, Azure
        Pipelines or Jenkins.
      </p>

      <h2 id="rollout">Rolling it out without blocking everyone</h2>
      <ol>
        <li><strong>Report only</strong> for the first week or two. Publish the violations as an artifact.</li>
        <li><strong>Fix or baseline</strong> what exists. axe lets you disable a rule for a known, ticketed issue with <code>.disableRules([...])</code>; keep that list short and dated.</li>
        <li><strong>Fail on new violations</strong> in A and AA rules for the pages each change touches.</li>
        <li><strong>Add interaction states</strong>: open menus, dialogs, error states and dark mode, because many failures only exist after an interaction.</li>
        <li><strong>Review the gate</strong> each quarter as axe adds rules.</li>
      </ol>

      <h2 id="limits">What automation will not catch</h2>
      <p>
        Deque&rsquo;s <a href="https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/">2021 study</a>{" "}
        found automated axe testing covered 57% of issues by volume across more than 2,000 audits, but those issues sat
        under only 16 of 50 success criteria. A green pipeline still needs people to check:
      </p>
      <ul>
        <li>Keyboard operation and <Link href="/guides/focus-management">focus management</Link> in custom widgets.</li>
        <li>Whether alt text, labels and headings are meaningful, not just present.</li>
        <li>Screen reader announcements for dynamic updates.</li>
        <li>Reflow at 400% zoom, captions, and anything in video or PDF.</li>
      </ul>
      <p>
        Our guide to <Link href="/guides/automated-vs-manual-accessibility-testing">automated vs manual testing</Link> shows
        how to split the work, and the <Link href="/checklists/wcag-2-2">WCAG 2.2 checklist</Link> covers the manual
        criteria.
      </p>
    </GuideShell>
  )
}
