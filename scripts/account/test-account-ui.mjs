// Synthetic DOM checks only: no browser, database, real account, payment, or network.
import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"
import { JSDOM } from "jsdom"

const require = createRequire(import.meta.url)
const temporary = await mkdtemp(join(tmpdir(), "account-ui-"))
const dom = new JSDOM("<!doctype html><html lang='en'><head><title>Account checks</title></head><body><main id='mount'></main></body></html>", { url: "https://example.test/dashboard", pretendToBeVisual: true })
for (const key of ["window", "document", "HTMLElement", "HTMLInputElement", "Event", "MouseEvent", "KeyboardEvent", "CustomEvent", "MutationObserver", "Node", "NodeFilter"]) globalThis[key] = dom.window[key]
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true })
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.fetch = async () => { throw new Error("Account UI checks must not make network requests") }
globalThis.__accountTest = { clerkProps: {}, user: { id: "synthetic-viewer", firstName: "Alex" }, stats: null, statsCalls: 0, failStats: false }

const fixtures = {
  "next/link": 'import {createElement,forwardRef} from "react"; export default forwardRef(function Link({href,children,prefetch,...rest},ref){return createElement("a",{...rest,href,ref},children)})',
  "next/navigation": 'export function redirect(destination){throw new Error("redirect:"+destination)}',
  "@clerk/nextjs/server": 'export const currentUser = async () => globalThis.__accountTest.user;',
  "@/lib/credits": 'export async function getUserStats(){const state=globalThis.__accountTest;state.statsCalls++;if(state.failStats)throw new Error("Synthetic account data failure");return state.stats;}',
  "@clerk/nextjs": `import {createElement as h} from "react";
    function form(name,props){globalThis.__accountTest.clerkProps[name]=props;return h("div",{"data-clerk-form":name},h("h1",null,name==="SignIn"?"Sign in to Accessibility.build":"Create your account"),h("form",null,h("label",{htmlFor:"synthetic-email"},"Email address"),h("input",{id:"synthetic-email",type:"email",autoComplete:"email"}),h("button",{type:"submit"},"Continue")))}
    export const SignIn = props => form("SignIn",props);
    export const SignUp = props => form("SignUp",props);
    export const UserButton = props => {globalThis.__accountTest.clerkProps.UserButton=props;return h("button",{"aria-label":"Open account menu","data-user-button":""},"Account")};`,
}

try {
  await build({
    stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
      export { safeAuthRedirect } from "./lib/auth-redirect";
      export { default as SignInPage, metadata as signInMetadata } from "./app/sign-in/[[...sign-in]]/page";
      export { default as SignUpPage, metadata as signUpMetadata } from "./app/sign-up/[[...sign-up]]/page";
      export { default as DashboardPage, metadata as dashboardMetadata } from "./app/dashboard/page";
      export { DashboardView } from "./components/dashboard/dashboard-view";
      export { AccountHeader } from "./components/account/account-header";
    ` }, bundle: true, platform: "node", format: "cjs", outfile: join(temporary, "account.cjs"), jsx: "automatic", logLevel: "silent",
    plugins: [{ name: "shared-react", setup(build) {
      build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({ path: require.resolve(args.path), external: true }))
    } }, { name: "account-fixtures", setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => fixtures[args.path] ? { path: args.path, namespace: "fixture" } : undefined)
      build.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({ contents: fixtures[args.path], loader: "js", resolveDir: process.cwd() }))
    } }],
  })
  const { act, createElement: h } = require("react")
  const { createRoot } = require("react-dom/client")
  const axe = require("axe-core")
  const { safeAuthRedirect, SignInPage, SignUpPage, DashboardPage, DashboardView, AccountHeader, signInMetadata, signUpMetadata, dashboardMetadata } = require(join(temporary, "account.cjs"))
  const mount = document.getElementById("mount")
  let root = createRoot(mount)
  const failures = []
  const state = globalThis.__accountTest
  const pause = () => new Promise((resolve) => setTimeout(resolve, 0))
  async function render(node) { await act(async () => root.render(node)) }
  async function reset() {
    await act(async () => root.unmount())
    root = createRoot(mount)
    state.clerkProps = {}; state.statsCalls = 0; state.failStats = false; state.stats = null
    state.user = { id: "synthetic-viewer", firstName: "Alex" }
  }
  async function test(name, fn) {
    try { await fn(); console.log(`Passed: ${name}`) }
    catch (error) { failures.push(name); console.error(`FAILED: ${name}: ${error.stack}`) }
    finally { await reset() }
  }
  const byText = (selector, text) => [...mount.querySelectorAll(selector)].find((node) => node.textContent.trim() === text)
  async function selectTab(label) {
    const tab = byText('[role="tab"]', label)
    assert(tab, `Missing ${label} tab`)
    await act(async () => {
      tab.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 }))
      tab.click(); await pause()
    })
    assert.equal(tab.getAttribute("aria-selected"), "true")
    return mount.querySelector('[role="tabpanel"][data-state="active"]')
  }
  async function structuralAxe() {
    const ids = [...mount.querySelectorAll("[id]")].map((node) => node.id)
    assert.equal(ids.length, new Set(ids).size, "Rendered identifiers must be unique")
    const result = await axe.run(mount, { runOnly: { type: "rule", values: ["aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value", "aria-required-attr", "aria-required-children", "aria-required-parent", "button-name", "link-name", "label", "duplicate-id-aria"] } })
    assert.deepEqual(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })), [])
  }

  await test("auth redirects preserve local destinations and reject browser-normalized external paths", async () => {
    const good = ["/dashboard", "/courses/cpacc-crash-course/learn/practice?view=flashcards#review", "/account/downloads", "/billing/return?order=synthetic&next=%2Fdashboard", "/learn/caf%C3%A9", "/"]
    for (const value of good) assert.equal(safeAuthRedirect(value, "/fallback"), value)
    assert.equal(safeAuthRedirect([good[1], "https://other.test"], "/fallback"), good[1])
    const hostile = [undefined, [], "", "https://other.test", "javascript:alert(1)", "//other.test", "///other.test", "/\\other.test", "/\\\\other.test", "/path\\nested", "/\u0000host", "/\t/other.test", "/\n/other.test", "/\r/other.test", "/\u007fhost", " dashboard"]
    for (const value of hostile) assert.equal(safeAuthRedirect(value, "/fallback"), "/fallback", JSON.stringify(value))
    assert.equal(new URL("/\\other.test", "https://example.test").origin, "https://other.test", "The regression fixture must exercise URL separator normalization")
    assert.equal(safeAuthRedirect(["//other.test", "/dashboard"], "/fallback"), "/fallback")
  })

  await test("sign-in preserves Clerk paths and course return destinations across account switching", async () => {
    const destination = "/courses/cpacc-crash-course/learn/practice?view=flashcards#review"
    await render(await SignInPage({ searchParams: Promise.resolve({ redirect_url: destination }) }))
    const props = state.clerkProps.SignIn
    assert.equal(props.path, "/sign-in"); assert.equal(props.routing, "path")
    assert.equal(props.fallbackRedirectUrl, destination)
    assert.equal(props.signUpUrl, `/sign-up?redirect_url=${encodeURIComponent(destination)}`)
    assert.equal(mount.querySelectorAll("h1").length, 1, "Clerk owns the changing form heading")
    assert.match(mount.textContent, /email you used at checkout/)
    for (const href of ["/", "/privacy", "/terms", "/contact"]) assert(mount.querySelector(`a[href="${href}"]`))
    assert(!/(^|\s)hidden(\s|$)/.test(String(props.appearance.elements.headerTitle)), "Recovery and verification headings remain available")
    await structuralAxe()
    await render(await SignInPage({ searchParams: Promise.resolve({ redirect_url: "/\\other.test" }) }))
    assert.equal(state.clerkProps.SignIn.fallbackRedirectUrl, "/dashboard")
  })

  await test("sign-up preserves onboarding and the requested purchase or course destination", async () => {
    await render(await SignUpPage({}))
    assert.equal(state.clerkProps.SignUp.path, "/sign-up")
    assert.equal(state.clerkProps.SignUp.routing, "path")
    assert.equal(state.clerkProps.SignUp.fallbackRedirectUrl, "/onboarding")
    assert.equal(state.clerkProps.SignUp.signInUrl, "/sign-in?redirect_url=%2Fdashboard")
    const destination = "/account/downloads"
    await render(await SignUpPage({ searchParams: Promise.resolve({ redirect_url: [destination, "//other.test"] }) }))
    assert.equal(state.clerkProps.SignUp.fallbackRedirectUrl, `/onboarding?next=${encodeURIComponent(destination)}`)
    assert.equal(state.clerkProps.SignUp.signInUrl, `/sign-in?redirect_url=${encodeURIComponent(destination)}`)
    assert.equal(mount.querySelectorAll("h1").length, 1)
    assert.match(mount.textContent, /Welcome credits are included/)
    for (const metadata of [signInMetadata, signUpMetadata, dashboardMetadata]) assert.equal(metadata.robots.index, false)
    await structuralAxe()
  })

  await test("dashboard route protects data and renders unavailable instead of a false zero on failure", async () => {
    state.user = null
    await assert.rejects(() => DashboardPage(), /redirect:\/sign-in\?redirect_url=%2Fdashboard/)
    assert.equal(state.statsCalls, 0, "Signed-out requests never load account data")
    state.user = { id: "synthetic-viewer", firstName: "Alex" }; state.failStats = true
    const originalError = console.error
    let logged = false
    try { console.error = () => { logged = true }; await render(await DashboardPage()) }
    finally { console.error = originalError }
    assert(logged)
    assert.equal(mount.querySelector("[data-credit-balance]").textContent, "Unavailable")
    assert(mount.querySelector('[role="alert"] a[href="/dashboard"]'))
    assert.match(mount.textContent, /Your activity is unavailable/)
    assert.doesNotMatch(mount.textContent, /No tool activity yet|No credit activity yet/)
    for (const href of ["/tools/url-accessibility-auditor", "/account/downloads", "/billing", "/courses"]) assert(mount.querySelector(`a[href="${href}"]`), "Useful destinations survive data failure")
    await structuralAxe()
  })

  await test("a known zero balance and empty histories remain distinct from an account error", async () => {
    await render(h(DashboardView, { firstName: null, stats: { currentCredits: 0, recentTransactions: [], recentUsage: [] } }))
    assert.equal(mount.querySelector("h1").textContent, "Your dashboard")
    assert.equal(mount.querySelector("[data-credit-balance]").textContent, "0")
    assert.equal(mount.querySelector('[role="alert"]'), null)
    assert.equal(byText('[role="tab"]', "Tool activity").getAttribute("aria-selected"), "true")
    assert.match(mount.textContent, /No tool activity yet/)
    assert.match(mount.textContent, /Free tools are still available/)
    const history = await selectTab("Credit history")
    assert.match(history.textContent, /No credit activity yet/)
    await structuralAxe()
  })

  await test("activity and credit history retain truthful amounts, status, dates, and safe tool links", async () => {
    const createdAt = new Date("2026-11-17T08:00:00Z")
    const stats = {
      currentCredits: 10250,
      recentUsage: [
        { id: "usage-one", tool: "url_accessibility_auditor", success: true, creditsUsed: 5, createdAt },
        { id: "usage-two", tool: "contrast_checker", success: false, creditsUsed: 0, createdAt },
        { id: "usage-three", tool: "future_tool_name", success: true, creditsUsed: 1, createdAt },
      ],
      recentTransactions: [
        { id: "credit-one", description: "Synthetic credit purchase", type: "purchase", amount: 50, balanceAfter: 100, status: "completed", createdAt },
        { id: "credit-two", description: "Synthetic tool use", type: "usage", amount: -5, balanceAfter: 95, status: "completed", createdAt },
        { id: "credit-three", description: "Synthetic pending addition", type: "purchase", amount: 25, balanceAfter: 95, status: "pending", createdAt },
      ],
    }
    state.stats = stats
    await render(await DashboardPage())
    assert.equal(mount.querySelector("[data-credit-balance]").textContent, "10,250")
    assert.match(mount.querySelector("h1").textContent, /Welcome back, Alex/)
    let panel = mount.querySelector('[role="tabpanel"][data-state="active"]')
    assert.match(panel.textContent, /Completed/); assert.match(panel.textContent, /Failed/)
    assert.match(panel.textContent, /5 credits/); assert.match(panel.textContent, /0 credits/); assert.match(panel.textContent, /1 credit/)
    assert.match(panel.textContent, /Future Tool Name/)
    assert.equal(panel.querySelectorAll('a[aria-label^="Open "]').length, 2, "Unknown legacy tool names never invent destinations")
    assert.equal(panel.querySelector("time").dateTime, createdAt.toISOString())
    panel = await selectTab("Credit history")
    assert.match(panel.textContent, /\+50 credits/); assert.match(panel.textContent, /-5 credits/)
    assert.match(panel.textContent, /pending/i); assert.match(panel.textContent, /Balance: 95/)
    await structuralAxe()
  })

  await test("compact account navigation retains an accessible account menu and clear destinations", async () => {
    await render(h(AccountHeader))
    assert(mount.querySelector('a[href="/"][aria-label="Accessibility.build home"]'))
    assert(mount.querySelector('a[href="/dashboard"][aria-current="page"]'))
    assert(mount.querySelector('nav[aria-label="Account navigation"] a[href="/tools"]'))
    assert(mount.querySelector('button[aria-label="Open account menu"]'))
    assert.equal(state.clerkProps.UserButton.afterSignOutUrl, "/")
    await structuralAxe()
  })

  await act(async () => root.unmount())
  if (failures.length) throw new Error(`${failures.length} account UI check group(s) failed`)
  console.log("Account checks passed: redirect safety, auth routing, honest dashboard states, history interaction, and structural accessibility. Clerk authentication, browser layout, contrast, and native screen-reader behavior are not exercised.")
} finally {
  dom.window.close()
  await rm(temporary, { recursive: true, force: true })
}
