// Real layout/overlay lifecycle tests in jsdom. No browser, credentials, or network calls.
import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createRequire } from "node:module"
import { build } from "esbuild"
import { JSDOM, VirtualConsole } from "jsdom"

const require = createRequire(import.meta.url)
const temp = await mkdtemp(join(tmpdir(), "course-chrome-"))
const navigationIntents = []
const virtualConsole = new VirtualConsole()
virtualConsole.on("jsdomError", (error) => {
  // jsdom records attempts at native navigation; it cannot perform them.
  if (error.message.startsWith("Not implemented: navigation")) navigationIntents.push(error.message)
  else throw error
})
const dom = new JSDOM("<!doctype html><html lang='en'><body><div id='mount'></div></body></html>", {
  url: "https://example.test/courses/example", pretendToBeVisual: true, virtualConsole,
})
for (const name of ["window", "document", "Element", "HTMLElement", "HTMLAnchorElement", "HTMLTextAreaElement", "Event", "MouseEvent", "localStorage", "sessionStorage"]) globalThis[name] = dom.window[name]
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true })
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })
window.scrollBy = () => {}
const beacons = []
navigator.sendBeacon = (url, body) => { beacons.push({ url, body }); return true }
const observers = new Set()
let bannerHeight = 84
globalThis.ResizeObserver = class {
  constructor(callback) { this.callback = callback }
  observe(element) { this.element = element; observers.add(this) }
  disconnect() { observers.delete(this) }
}
Object.defineProperty(window.HTMLElement.prototype, "offsetHeight", { get() { return this.getAttribute("aria-labelledby") === "analytics-consent-title" ? bannerHeight : 0 } })
globalThis.__courseChromePath = "/courses/example"
globalThis.__courseChromeLife = { headerMount: 0, headerUnmount: 0, footerMount: 0, footerUnmount: 0 }
let assistantRequest
globalThis.fetch = async (url, init) => {
  assert.equal(url, "/api/assistant", "Only the synthetic assistant request is allowed")
  assistantRequest = { url, init }
  return new Promise((_resolve, reject) => init.signal.addEventListener("abort", () => reject(new DOMException("Synthetic navigation", "AbortError")), { once: true }))
}

const fixtures = {
  "next/navigation": "export const usePathname = () => globalThis.__courseChromePath;",
  "next/link": 'import {createElement,forwardRef} from "react"; export default forwardRef(function Link({href,children,prefetch,...rest},ref){return createElement("a",{...rest,href,ref},children)})',
  "next/script": 'import {createElement} from "react"; export default function Script({strategy,children,...props}){return createElement("script",{...props,"data-consent-script":""},children)}',
  "next/font/google": 'export const Mona_Sans = () => ({variable:"synthetic-font"});',
  "next-themes": 'export const useTheme = () => ({theme:"light"});',
  "posthog-js": 'export default {capture(){}};',
  "@clerk/nextjs": 'import {createElement} from "react"; export const ClerkProvider = ({children}) => children; export const UserButton = () => createElement("button", {"aria-label":"Open account menu"}, "Account");',
  "@/components/theme-provider": 'export const ThemeProvider = ({children}) => children;',
  "@vercel/analytics/react": 'export const Analytics = () => null;',
  "@vercel/speed-insights/next": 'export const SpeedInsights = () => null;',
  "@/components/browser-safety-provider": 'export const BrowserSafetyProvider = () => null;',
  "@/components/analytics/posthog-provider": 'export const PostHogProvider = () => null;',
  "@/components/header": 'import {createElement,useEffect} from "react"; export function Header(){useEffect(()=>{globalThis.__courseChromeLife.headerMount++;return()=>{globalThis.__courseChromeLife.headerUnmount++}},[]);return createElement("header",{"data-site-header":""},"Site navigation")}',
  "@/components/footer": 'import {createElement,useEffect} from "react"; export function Footer(){useEffect(()=>{globalThis.__courseChromeLife.footerMount++;return()=>{globalThis.__courseChromeLife.footerUnmount++}},[]);return createElement("footer",{"data-site-footer":""},"Site footer")}',
}

try {
  await build({
    stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
      import React from "react";
      import RootLayout from "./app/layout";
      export { default as RootLayout } from "./app/layout";
      export { isCourseLearningPath } from "./lib/courses/routes";
      export { isAuthPath, isDashboardPath, isAccountWorkspacePath } from "./lib/account-routes";
      export { isFocusedWorkspacePath } from "./lib/site-layout";
      export { focusedEntryUrl, SiteDocumentEnhancements } from "./components/site-document-enhancements";
      export { CurbSkipLink } from "./components/assistant/curb-skip-link";
      export { ANALYTICS_CONSENT_STORAGE_KEY, ANALYTICS_CONSENT_EVENT } from "./lib/analytics/consent";
      export { ASSISTANT_OPEN_EVENT } from "./lib/assistant/config";
      export { toast } from "sonner";
      // Keep the actual root layout composition while mounting its body in an existing DOM.
      export function RootBody({children}) {
        const html = RootLayout({children}).props.children;
        const body = React.Children.toArray(html.props.children).find(child => child.type === "body");
        return <>{body.props.children}</>;
      }
    ` },
    bundle: true, platform: "node", format: "cjs", outfile: join(temp, "chrome.cjs"), jsx: "automatic", loader: { ".css": "empty" }, logLevel: "silent",
    plugins: [{ name: "external-react", setup(build) {
      build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({ path: require.resolve(args.path), external: true }))
    } }, { name: "environment-fixtures", setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => fixtures[args.path] ? { path: args.path, namespace: "fixture" } : undefined)
      build.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({ contents: fixtures[args.path], loader: "js", resolveDir: process.cwd() }))
    } }],
  })
  const React = require("react")
  const { act, createElement: h } = React
  const { createRoot } = require("react-dom/client")
  const { renderToStaticMarkup } = require("react-dom/server")
  const { RootLayout, RootBody, isCourseLearningPath, isAuthPath, isDashboardPath, isAccountWorkspacePath, isFocusedWorkspacePath, focusedEntryUrl, SiteDocumentEnhancements, CurbSkipLink, ANALYTICS_CONSENT_STORAGE_KEY: consentKey, ANALYTICS_CONSENT_EVENT, ASSISTANT_OPEN_EVENT, toast } = require(join(temp, "chrome.cjs"))
  const mount = document.getElementById("mount")
  let root = createRoot(mount)
  const pause = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))
  const settle = () => act(async () => { await pause() })
  const page = () => h("article", null, h("h1", null, "Synthetic page"), h("span", { "data-development-badge": "" }, "In development"))
  async function route(path, Component = RootBody, props = { children: page() }) {
    globalThis.__courseChromePath = path == null ? path : new URL(path, "https://example.test").pathname
    dom.reconfigure({ url: `https://example.test${path ?? "/"}` })
    await act(async () => root.render(h(Component, props)))
  }
  async function reset() {
    await act(async () => root.unmount())
    toast.dismiss()
    root = createRoot(mount)
    document.getElementById("site-document-enhancements")?.remove()
    localStorage.clear(); sessionStorage.clear()
    assistantRequest = undefined; navigationIntents.length = 0; beacons.length = 0
    assert.equal(observers.size, 0, "Consent resize observers are cleaned up")
    assert.equal(document.body.style.paddingBottom, "", "Consent bottom spacing is cleaned up")
    assert.equal(document.documentElement.style.getPropertyValue("--consent-banner-height"), "")
  }
  const failures = []
  async function test(name, fn) {
    try { await fn(); console.log(`Passed: ${name}`) }
    catch (error) { failures.push({ name, error }); console.error(`FAILED: ${name}: ${error.stack}`) }
    finally { await reset() }
  }
  const button = (label) => [...mount.querySelectorAll("button")].find((element) => element.textContent.trim() === label)
  const noSiteChrome = (marker = "data-course-workspace") => {
    for (const selector of ["[data-site-header]", "[data-site-footer]", "[data-assistant]", "[data-sonner-toaster]", "#analytics-consent-title"]) assert.equal(mount.querySelector(selector), null, `${selector} must leave the learning workspace`)
    assert.equal(mount.querySelectorAll("main").length, 1)
    assert(mount.querySelector(`main#main-content[${marker}]`))
    assert.equal([...mount.querySelectorAll("button")].some((el) => el.textContent.includes("Ask Curb")), false)
  }

  await test("focused route boundaries and server-rendered public/learning layouts", async () => {
    for (const path of ["/courses/example/learn", "/courses/example/learn/", "/courses/was/learn/practice", "/courses/cpacc/learn/chapters/lesson-one", "/courses/example/learn/team", "/courses/example/learn/library"]) assert.equal(isCourseLearningPath(path), true, path)
    for (const path of [null, undefined, "", "/", "/courses", "/courses/example", "/courses/learn", "/courses/example/learning", "/courses/example/learn-more", "/courses//learn", "/courses/example/other/learn", "/other/courses/example/learn"]) assert.equal(isCourseLearningPath(path), false, String(path))
    for (const [path, focused] of [["/courses/example", false], ["/courses", false], ["/courses/example/learn", true], ["/courses/example/learn/practice", true]]) {
      globalThis.__courseChromePath = path
      const html = renderToStaticMarkup(h(RootLayout, null, page()))
      const serverDom = new JSDOM(html)
      const parsed = serverDom.window.document
      assert.equal(parsed.querySelectorAll("main").length, 1)
      assert.equal(Boolean(parsed.querySelector("[data-site-header]")), !focused)
      assert.equal(Boolean(parsed.querySelector("[data-site-footer]")), !focused)
      assert.equal(Boolean(parsed.querySelector("[data-course-workspace]")), focused)
      assert.equal(Boolean(parsed.querySelector("[data-assistant]")), !focused)
      assert(parsed.querySelector('a[href="#main-content"]'))
      assert(parsed.querySelector("[data-development-badge]"), "Layout keeps route children and development labels")
      assert.equal(parsed.querySelector("#analytics-consent-title"), null, "SSR does not invent a consent choice")
      assert.equal(parsed.querySelector('script[src*="docaccessible"]'), null, "The third-party script is never server-injected into courses")
      assert.equal(parsed.querySelector("[data-consent-script]"), null)
      serverDom.window.close()
    }
  })

  await test("account route families have isolated landmarks without matching lookalike routes", async () => {
    for (const path of ["/sign-in", "/sign-in/", "/sign-in/factor-one", "/sign-up", "/sign-up/verify-email-address"]) {
      assert.equal(isAuthPath(path), true, path)
      assert.equal(isAccountWorkspacePath(path), true, path)
      assert.equal(isFocusedWorkspacePath(path), true, path)
    }
    for (const path of ["/dashboard", "/dashboard/", "/dashboard/history"]) {
      assert.equal(isDashboardPath(path), true, path)
      assert.equal(isAccountWorkspacePath(path), true, path)
    }
    for (const path of [null, undefined, "", "/", "/sign-in-help", "/sign-updates", "/dashboard-old", "/other/sign-in", "/courses", "/account/downloads"]) {
      assert.equal(isAccountWorkspacePath(path), false, String(path))
    }
    for (const path of ["/sign-in", "/sign-up/verify-email-address", "/dashboard"]) {
      globalThis.__courseChromePath = path
      const parsed = new JSDOM(renderToStaticMarkup(h(RootLayout, null, page()))).window.document
      const marker = isAuthPath(path) ? "data-auth-workspace" : "data-account-workspace"
      assert.equal(parsed.querySelectorAll("main").length, 1)
      assert(parsed.querySelector(`main#main-content[${marker}]`))
      assert.equal(Boolean(parsed.querySelector("[data-account-header]")), isDashboardPath(path))
      for (const selector of ["[data-site-header]", "[data-site-footer]", "[data-assistant]", "[data-sonner-toaster]", "#analytics-consent-title"]) assert.equal(parsed.querySelector(selector), null, selector)
      assert(parsed.querySelector('a[href="#main-content"]'))
      parsed.defaultView.close()
    }
  })

  await test("public → auth steps → dashboard → course clears overlays and preserves undecided consent", async () => {
    await route("/tools")
    assert.equal(document.body.style.paddingBottom, "84px")
    for (const path of ["/sign-in", "/sign-in/factor-one", "/sign-up/verify-email-address", "/dashboard", "/courses/example/learn"]) {
      await route(path)
      noSiteChrome(isAuthPath(path) ? "data-auth-workspace" : isDashboardPath(path) ? "data-account-workspace" : "data-course-workspace")
      assert.equal(Boolean(mount.querySelector("[data-account-header]")), isDashboardPath(path))
      assert.equal(document.body.style.paddingBottom, "")
      assert.equal(observers.size, 0)
      assert.equal(localStorage.getItem(consentKey), null)
      await act(async () => mount.querySelector('a[href="#main-content"]').click())
      assert.equal(document.activeElement, mount.querySelector("main"))
    }
    await route("/courses")
    assert(mount.querySelector("[data-site-header]"))
    assert(mount.querySelector("[data-site-footer]"))
    assert(mount.querySelector("#analytics-consent-title"))
    assert.equal(localStorage.getItem(consentKey), null)
    for (const path of ["/sign-in/factor-one", "/dashboard"]) {
      await route(path, CurbSkipLink, {})
      assert.equal(mount.innerHTML, "", "Assistant skip controls independently exclude account routes")
    }
  })

  await test("public → lesson → practice → sales unmounts globals and restores undecided consent", async () => {
    await route("/courses/example")
    assert(mount.querySelector("[data-site-header]")); assert(mount.querySelector("[data-site-footer]"))
    assert(button("Ask Curb, the accessibility assistant"))
    assert.equal(document.body.style.paddingBottom, "84px")
    assert.equal(document.documentElement.style.getPropertyValue("--consent-banner-height"), "84px")
    assert.equal(localStorage.getItem(consentKey), null)
    assert.equal(mount.querySelector("[data-consent-script]"), null)
    bannerHeight = 128
    await act(async () => { for (const observer of observers) observer.callback() })
    assert.equal(document.body.style.paddingBottom, "128px", "Responsive banner reserve follows measured height")
    const mountsBefore = { ...globalThis.__courseChromeLife }
    await act(async () => { toast("Synthetic global notification", { duration: Infinity }); await pause(10) })
    assert(mount.querySelector("[data-sonner-toaster]"), "The actual global toaster is present before course entry")
    await route("/courses/example/learn/chapters/lesson-one")
    noSiteChrome()
    assert.equal(globalThis.__courseChromeLife.headerUnmount, mountsBefore.headerUnmount + 1)
    assert.equal(globalThis.__courseChromeLife.footerUnmount, mountsBefore.footerUnmount + 1)
    assert.equal(document.body.style.paddingBottom, "")
    assert.equal(observers.size, 0)
    assert.equal(localStorage.getItem(consentKey), null, "Entering a lesson never accepts or rejects analytics")
    const skip = mount.querySelector('a[href="#main-content"]')
    await act(async () => skip.click())
    assert.equal(document.activeElement, mount.querySelector("main"), "Ordinary skip link still moves focus")
    await route("/courses/example/learn/practice")
    noSiteChrome()
    assert.equal(document.body.style.paddingBottom, "")
    await act(async () => { toast("Synthetic background notification", { duration: Infinity }); await pause(10) })
    noSiteChrome()
    await route("/courses/example")
    assert(mount.querySelector("[data-site-header]")); assert(mount.querySelector("[data-site-footer]"))
    assert(mount.querySelector("#analytics-consent-title")); assert(mount.querySelector("[data-development-badge]"))
    assert.equal(document.body.style.paddingBottom, "128px")
    assert.equal(localStorage.getItem(consentKey), null)
    assert.equal(mount.querySelector("[data-consent-script]"), null)
    assert.equal(mount.textContent.includes("Synthetic global notification"), false)
    assert.equal(mount.textContent.includes("Synthetic background notification"), false, "Hidden course notifications are not replayed on return")
    bannerHeight = 84
  })

  await test("explicit accepted and rejected analytics choices survive course transitions", async () => {
    for (const [choice, label] of [["accepted", "Allow analytics"], ["rejected", "Decline"]]) {
      await route("/courses/example")
      await act(async () => button(label).click())
      assert.equal(localStorage.getItem(consentKey), choice)
      assert.equal(Boolean(mount.querySelector("[data-consent-script]")), choice === "accepted")
      assert.equal(document.body.style.paddingBottom, "")
      for (const path of ["/courses/example/learn/library", "/sign-in/factor-one", "/sign-up/verify-email-address", "/dashboard"]) {
        await route(path)
        noSiteChrome(isAuthPath(path) ? "data-auth-workspace" : isDashboardPath(path) ? "data-account-workspace" : "data-course-workspace")
        assert.equal(localStorage.getItem(consentKey), choice)
      }
      await route("/courses/example")
      assert.equal(localStorage.getItem(consentKey), choice)
      assert.equal(mount.querySelector("#analytics-consent-title"), null)
      assert.equal(Boolean(mount.querySelector("[data-consent-script]")), choice === "accepted")
      await reset()
    }
    // Consent cleared in another tab stays undecided while the banner is deferred.
    localStorage.setItem(consentKey, "accepted")
    await route("/courses/example/learn")
    await act(async () => { localStorage.removeItem(consentKey); window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT)) })
    noSiteChrome()
    await route("/courses/example")
    assert(mount.querySelector("#analytics-consent-title"))
    assert.equal(mount.querySelector("[data-consent-script]"), null)
  })

  await test("entering a course aborts Curb and removes its open-event/focus behavior", async () => {
    await route("/courses/example")
    await act(async () => button("Ask Curb, the accessibility assistant").click())
    await act(async () => { await pause(25) })
    const input = mount.querySelector("[data-assistant] textarea")
    assert.equal(document.activeElement, input)
    await act(async () => {
      Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set.call(input, "Synthetic question")
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    await act(async () => input.closest("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })))
    assert(assistantRequest, "The actual assistant initiates the stubbed request")
    assert.equal(assistantRequest.init.signal.aborted, false)
    await route("/courses/example/learn")
    assert.equal(assistantRequest.init.signal.aborted, true, "Unmount cancels the outstanding request")
    noSiteChrome()
    const eventCount = beacons.length
    await act(async () => window.dispatchEvent(new Event(ASSISTANT_OPEN_EVENT)))
    await settle()
    assert.equal(beacons.length, eventCount, "No hidden assistant open listener remains")
    await route("/courses/example")
    assert(mount.querySelector('[data-assistant] button[aria-expanded="false"]'))
    assert.equal(mount.querySelector('[data-assistant] [role="dialog"]').parentElement.hidden, true)
    await route("/courses/example/learn", CurbSkipLink, {})
    assert.equal(mount.innerHTML, "", "Curb skip link independently excludes the course route")
  })

  await test("course-entry links preserve URL and respect native activation semantics", async () => {
    const publicUrl = "https://example.test/courses/example"
    const target = "/courses/example/learn/practice?view=flashcards#review"
    function clickFor(href, options = {}, attributes = {}, child = true) {
      const a = document.createElement("a")
      a.href = href
      for (const [key, value] of Object.entries(attributes)) a.setAttribute(key, value)
      const span = document.createElement("span"); a.append(span)
      const event = new MouseEvent("click", { button: 0, cancelable: true, ...options })
      Object.defineProperty(event, "target", { value: child ? span : a })
      return event
    }
    assert.equal(focusedEntryUrl(clickFor(target), publicUrl), `https://example.test${target}`)
    assert.equal(focusedEntryUrl(clickFor(target, {}, { target: "_self" }), publicUrl), `https://example.test${target}`)
    for (const options of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { button: 2 }]) assert.equal(focusedEntryUrl(clickFor(target, options), publicUrl), null)
    for (const attrs of [{ target: "_blank" }, { target: "course-window" }, { download: "" }, { download: "lesson.html" }]) assert.equal(focusedEntryUrl(clickFor(target, {}, attrs), publicUrl), null)
    for (const href of ["https://other.test/courses/example/learn", "https://example.test:444/courses/example/learn", "/courses/example", "/courses/example/learning", "mailto:test@example.test", "javascript:void(0)"]) assert.equal(focusedEntryUrl(clickFor(href), publicUrl), null)
    assert.equal(focusedEntryUrl(clickFor(target), "https://example.test/courses/example/learn/chapters/one"), null, "Internal course navigation stays client-side")
    assert.equal(focusedEntryUrl(clickFor(target), "not a URL"), null)
    const prevented = clickFor(target); prevented.preventDefault()
    assert.equal(focusedEntryUrl(prevented, publicUrl), null)
    const noAnchor = new MouseEvent("click", { button: 0 })
    Object.defineProperty(noAnchor, "target", { value: document.createElement("button") })
    assert.equal(focusedEntryUrl(noAnchor, publicUrl), null)
    assert.equal(focusedEntryUrl(new MouseEvent("click"), publicUrl), null)
  })

  await test("document enhancements stay out of fresh courses and intercept public course entry", async () => {
    await route("/courses/example/learn", SiteDocumentEnhancements, {})
    assert.equal(document.getElementById("site-document-enhancements"), null)
    await route("/courses/example/learn/practice", SiteDocumentEnhancements, {})
    assert.equal(navigationIntents.length, 0, "A fresh course never triggers a reload")
    await route("/courses/example", SiteDocumentEnhancements, {})
    const script = document.getElementById("site-document-enhancements")
    assert.equal(script?.getAttribute("src"), "https://docaccessible.com/site/v1.js")
    assert.equal(script?.async, true)
    await route("/courses", SiteDocumentEnhancements, {})
    assert.equal(document.querySelectorAll("#site-document-enhancements").length, 1)
    const link = document.createElement("a")
    link.href = "/courses/example/learn?entry=public#start"
    const child = document.createElement("span"); link.append(child); mount.append(link)
    let nextLinkHandler = 0
    link.addEventListener("click", () => { nextLinkHandler++ })
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
    child.dispatchEvent(click)
    assert.equal(click.defaultPrevented, true)
    assert.equal(nextLinkHandler, 0, "Capture-phase entry runs before the client router handler")
    assert.equal(navigationIntents.length, 1, "Public entry requests native navigation")
    link.remove()
    await route("/courses/example/learn?resume=1#question-2", SiteDocumentEnhancements, {})
    assert.equal(navigationIntents.length, 2, "Programmatic entry with an already-loaded script requests a fresh document even with a fragment")
    assert.equal(window.location.href, "https://example.test/courses/example/learn?resume=1#question-2", "Reload keeps the lesson URL and fragment intact")
    await reset()
    await route("/courses/example/learn", SiteDocumentEnhancements, {})
    assert.equal(document.getElementById("site-document-enhancements"), null)
    assert.equal(navigationIntents.length, 0, "The replacement fresh course document needs no second reload")
  })

  await test("auth and dashboard entries isolate the document while internal account navigation stays client-side", async () => {
    for (const path of ["/sign-in?redirect_url=%2Fdashboard#form", "/sign-up/verify-email-address", "/dashboard"]) {
      await route(path, SiteDocumentEnhancements, {})
      assert.equal(document.getElementById("site-document-enhancements"), null)
      assert.equal(navigationIntents.length, 0, "Fresh account routes never inject or reload the document viewer")
      const anchor = document.createElement("a"); anchor.href = path
      const event = new MouseEvent("click", { button: 0, cancelable: true })
      Object.defineProperty(event, "target", { value: anchor })
      assert.equal(focusedEntryUrl(event, "https://example.test/tools"), `https://example.test${path}`)
      assert.equal(focusedEntryUrl(event, "https://example.test/sign-in"), null)
      assert.equal(focusedEntryUrl(event, "https://example.test/dashboard"), null)
      assert.equal(focusedEntryUrl(event, "https://example.test/courses/example/learn"), null)
    }
    await route("/tools", SiteDocumentEnhancements, {})
    assert(document.getElementById("site-document-enhancements"))
    await route("/sign-in/factor-one?redirect_url=%2Fdashboard#form", SiteDocumentEnhancements, {})
    assert.equal(navigationIntents.length, 1, "Programmatic authentication entry discards an already-loaded public observer")
    assert.equal(window.location.pathname, "/sign-in/factor-one")
    assert.equal(window.location.hash, "#form")
  })

  await act(async () => root.unmount())
  if (failures.length) throw new Error(`${failures.length} course chrome test group(s) failed`)
  console.log("Course chrome tests passed: real layout, consent, assistant cleanup, route boundaries, and document-entry isolation.")
} finally {
  dom.window.close()
  await rm(temp, { recursive: true, force: true })
}
