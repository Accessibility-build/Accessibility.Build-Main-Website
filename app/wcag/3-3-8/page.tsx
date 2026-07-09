import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.8 Accessible Authentication (Minimum) Guide",
  description:
    "Complete guide to WCAG 3.3.8 Accessible Authentication (Minimum). Learn why logins must not depend on a cognitive function test, the four exceptions, why password managers and copy-paste must work, accessible CAPTCHA and passkey patterns, copy-ready code, testing, and common mistakes.",
  keywords: [
    "WCAG 3.3.8",
    "Accessible Authentication",
    "cognitive function test",
    "accessible login",
    "CAPTCHA accessibility",
    "password manager accessibility",
    "passkeys accessibility",
    "passwordless authentication",
    "autocomplete password",
    "copy paste password",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-3-8",
  },
  openGraph: {
    title:
      "WCAG 3.3.8 Accessible Authentication (Minimum) — No Cognitive Tests (Level AA)",
    description:
      "The definitive guide to WCAG 3.3.8: no login step may rely on remembering, transcribing, or solving a puzzle unless an accessible alternative exists. Patterns, code, and testing.",
    url: "https://accessibility.build/wcag/3-3-8",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%203.3.8%20Accessible%20Authentication%20%28Minimum%29&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.8 Accessible Authentication (Minimum) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "WCAG 3.3.8 Accessible Authentication (Minimum) — No Cognitive Tests",
    description:
      "New in WCAG 2.2: authentication must not require a cognitive function test unless there is an accessible alternative. The four exceptions, code, and how to test.",
  },
}

const cognitiveTests = [
  {
    name: "Remembering a password or passphrase",
    detail:
      "Recalling a memorized secret is a memory test. It is allowed only because two of the exceptions almost always apply: the field supports password managers and copy-paste, so the user never has to recall or transcribe anything themselves.",
  },
  {
    name: "Transcribing a one-time code by hand",
    detail:
      "An SMS or authenticator code that the user must read and retype is a transcription test. It passes only if the user can paste the code, or if it is auto-filled, so they are not forced to hold digits in working memory and copy them character by character.",
  },
  {
    name: "Solving a puzzle or traditional CAPTCHA",
    detail:
      "Identifying distorted text, picking every image with a traffic light, or doing arithmetic are classic cognitive function tests. These fail 3.3.8 unless an alternative authentication method that is not a puzzle is offered, or the object-recognition / personal-content exception applies.",
  },
  {
    name: "Reproducing a pattern, gesture, or spatial sequence",
    detail:
      "Redrawing a swipe pattern, clicking points in a remembered order, or repeating a gesture relies on recall and is a cognitive function test. Offer a method that does not depend on memory instead.",
  },
]

const exceptions = [
  {
    name: "Alternative",
    summary: "Another authentication method that is not a cognitive test.",
    detail:
      "If any step relies on a cognitive function test, provide a different way to authenticate that does not. Passkeys (WebAuthn), a magic email link, or a link that signs the user in on a trusted device all satisfy this — the user has a route through that never asks them to remember or solve anything.",
  },
  {
    name: "Mechanism",
    summary: "A mechanism is available to help complete the cognitive step.",
    detail:
      "The step can remain a cognitive test if a mechanism assists it. The everyday example is a password field that permits password managers to fill it and does not block paste — the manager does the remembering and typing, so the user does not. This is why never blocking paste on password and one-time-code fields is the single most important thing you can do.",
  },
  {
    name: "Object Recognition",
    summary: "The test only asks the user to recognize common objects.",
    detail:
      "A test that asks the user to identify everyday objects — 'select the pictures of a bus' — is permitted, because recognizing common things is not the kind of cognitive function this criterion protects. Note this still must meet 1.1.1 for non-text alternatives and be operable, and audio/other paths help low-vision users.",
  },
  {
    name: "Personal Content",
    summary: "The test uses non-text content the user provided.",
    detail:
      "A test based on content the user themselves uploaded — 'pick the photo you set as your security image' — is allowed, because it draws on the user's own material rather than a general memory or puzzle-solving demand.",
  },
]

const faqs = [
  {
    q: "What does WCAG 3.3.8 Accessible Authentication (Minimum) require?",
    a: "WCAG 3.3.8 requires that a cognitive function test — such as remembering a password, solving a puzzle, or transcribing a code — is not required for any step in an authentication process, unless that step provides an alternative that is not a cognitive test, or a mechanism to assist. Object recognition and personal-content tests are also exempt. It is a Level AA success criterion, new in WCAG 2.2.",
  },
  {
    q: "Is 3.3.8 saying passwords are banned?",
    a: "No. Passwords are fine, because two exceptions almost always apply. If your password field lets a password manager fill it (via autocomplete=\"current-password\") and you do not block paste, then the user is never forced to remember or transcribe the secret themselves — a mechanism is doing it. Passwords only fail 3.3.8 when you sabotage those helpers: blocking paste, disabling autofill, or forcing manual entry of characters from the password (\"type the 3rd and 7th letter\").",
  },
  {
    q: "Do traditional CAPTCHAs fail WCAG 3.3.8?",
    a: "A CAPTCHA that asks you to read distorted text, solve a puzzle, or do arithmetic is a cognitive function test and fails 3.3.8 unless you offer an alternative that is not a cognitive test. A CAPTCHA that only asks you to recognize common objects (\"select all images with a bicycle\") is allowed under the object-recognition exception, though it must still meet 1.1.1 and be operable. The most robust answer is a non-interactive or risk-based bot check (e.g. a privacy-preserving token) that presents no puzzle at all.",
  },
  {
    q: "How is 3.3.8 (Minimum, AA) different from 3.3.9 (Enhanced, AAA)?",
    a: "They share the same rule but differ in which exceptions apply. 3.3.8 Accessible Authentication (Minimum) is Level AA and allows the object-recognition and personal-content exceptions. 3.3.9 Accessible Authentication (Enhanced) is Level AAA and removes those two, so it does not permit any object-recognition test at all. Meeting AA (3.3.8) is the compliance target for most organizations, including under the European Accessibility Act and DOJ Title II.",
  },
  {
    q: "Why does allowing paste matter so much for 3.3.8?",
    a: "Because paste is what turns a memory-and-transcription task into an assisted one. If a user can paste their password from a manager, or paste a one-time code from their SMS app, they never have to hold the secret in working memory or copy it character by character — the mechanism exception is met. Blocking paste (oninput/onpaste preventDefault) removes that assistance and is one of the most common ways sites fail this criterion.",
  },
  {
    q: "Do passkeys and biometric login satisfy 3.3.8?",
    a: "Yes. Passkeys (WebAuthn/FIDO2), biometric unlock, and device-based sign-in ask the user to do nothing cognitive — no recall, no transcription, no puzzle — so they meet 3.3.8 outright and are the strongest way to satisfy it. Offering a passkey path is also the cleanest way to provide the \"alternative\" exception for any flow that does contain a cognitive step.",
  },
  {
    q: "Does a one-time passcode (OTP) sent by SMS pass 3.3.8?",
    a: "It can, but only if the user is not forced to transcribe it from memory. Support autocomplete=\"one-time-code\" so mobile browsers can auto-fill it, and never block paste, so the user can copy it directly from their messages. If the code can only be entered by reading and retyping it digit by digit with paste disabled, that is a transcription-based cognitive test and fails.",
  },
]

export default function WCAG338Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          {
            name: "WCAG Success Criteria",
            url: "https://accessibility.build/wcag",
          },
          {
            name: "3.3.8 Accessible Authentication (Minimum)",
            url: "https://accessibility.build/wcag/3-3-8",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.3.8 Accessible Authentication (Minimum): The Complete Guide to Login Without Cognitive Tests"
        description="The definitive guide to WCAG 3.3.8 Accessible Authentication (Minimum): why authentication must not rely on a cognitive function test, the four exceptions, why password managers and paste must work, accessible CAPTCHA and passkey patterns, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-01"
        dateModified="2026-07-01"
        image="https://accessibility.build/api/og?title=WCAG%203.3.8%20Accessible%20Authentication%20%28Minimum%29&section=WCAG"
        url="https://accessibility.build/wcag/3-3-8"
        wordCount={2900}
        keywords={[
          "WCAG 3.3.8",
          "Accessible Authentication",
          "cognitive function test",
          "CAPTCHA accessibility",
          "password manager accessibility",
          "passkeys",
          "Level AA",
        ]}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    3.3.8 Accessible Authentication (Minimum)
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                New in WCAG 2.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.8: Accessible Authentication (Minimum)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Signing in should never depend on your{" "}
              <strong className="text-slate-900 dark:text-white">
                memory or puzzle-solving ability
              </strong>
              . This Level AA criterion, new in WCAG 2.2, says no step of a login
              may require a{" "}
              <em>cognitive function test</em> — remembering a password,
              transcribing a code, solving a CAPTCHA — unless there is an
              accessible alternative or a mechanism to help. In practice it comes
              down to one habit: let password managers and paste do the work.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4">
              A cognitive function test (such as remembering a password or
              solving a puzzle) is not required for any step in an authentication
              process unless that step provides at least one of the following:
              an <strong>alternative</strong> authentication method that does not
              rely on a cognitive function test; a <strong>mechanism</strong>{" "}
              available to assist the user in completing the cognitive function
              test; the test is to recognize <strong>objects</strong>; or the
              test is to identify non-text content the user provided (
              <strong>personal content</strong>).
            </blockquote>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#why">
                  Why accessible authentication matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#cognitive">
                  What counts as a cognitive function test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The four exceptions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#captcha">
                  CAPTCHAs and 3.3.8
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common mistakes
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#related-criteria">
                  Related success criteria
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why accessible authentication matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Authentication is the gate to everything else — your bank, your
              health records, your government services. When that gate demands
              memory or puzzle-solving, it locks out the people least able to
              provide it. Someone with a memory impairment cannot reliably recall
              a complex password. Someone with dyslexia struggles to transcribe a
              string of characters correctly. Someone with a cognitive or
              learning disability may be unable to decode a distorted-text
              CAPTCHA at all. The task is not made harder for them — it can be
              made impossible.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              3.3.8 reframes the problem: the barrier is not the user&apos;s
              memory, it is the design that insists on testing it. The fix is
              rarely to remove security — it is to let tools carry the cognitive
              load. A password manager remembers the secret; the browser fills
              the one-time code; a passkey replaces the memory test with a device
              tap. These are wins for everyone: fewer resets, fewer lockouts, and
              faster, less error-prone sign-in across the board. It is also a
              legal target — WCAG 2.2 AA is the reference standard for the{" "}
              <Link
                href="/guides/section-504-web-accessibility-deadline"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                DOJ Title II rule
              </Link>{" "}
              and the European Accessibility Act.
            </p>
          </section>

          {/* Cognitive function test */}
          <section aria-labelledby="cognitive" className="mb-12">
            <h2
              id="cognitive"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as a cognitive function test
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A cognitive function test is any task that relies on the user
              performing a mental operation — remembering, transcribing,
              calculating, or puzzle-solving. If any single step of your sign-in
              flow requires one, that step must meet one of the exceptions below.
            </p>
            <div className="space-y-4">
              {cognitiveTests.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {c.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The four exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A step containing a cognitive function test still passes 3.3.8 if it
              provides at least one of these. Only the first two — Alternative and
              Mechanism — apply at every level; Object Recognition and Personal
              Content are the two that the AAA version (3.3.9) removes.
            </p>
            <div className="space-y-4">
              {exceptions.map((e, i) => (
                <div
                  key={e.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {e.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {e.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {e.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>The one-line takeaway:</strong> a normal password login
                already meets 3.3.8 through the <em>Mechanism</em> exception —{" "}
                <em>as long as</em> you set the right{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  autocomplete
                </code>{" "}
                value and never block paste. You break compliance by fighting the
                tools, not by using passwords.
              </p>
            </div>
          </section>

          {/* CAPTCHA */}
          <section aria-labelledby="captcha" className="mb-12">
            <h2
              id="captcha"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              CAPTCHAs and 3.3.8
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              CAPTCHAs are the most common way sites fail this criterion. Where a
              CAPTCHA lands depends entirely on what it asks the user to do:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300 mb-3">
                  Fails 3.3.8
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Reading and retyping distorted text.</li>
                  <li>Solving arithmetic or a logic puzzle.</li>
                  <li>Rotating an image to the &quot;correct&quot; angle.</li>
                  <li>Remembering and repeating a sequence.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-3">
                  Can pass 3.3.8
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Recognizing common objects (object exception).</li>
                  <li>Identifying content the user uploaded.</li>
                  <li>A non-interactive / risk-based bot check.</li>
                  <li>Any puzzle plus a non-cognitive alternative path.</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              The most robust and future-proof choice is a bot-detection method
              that presents <em>no puzzle at all</em> — a privacy-preserving
              attestation token, a risk score, or an invisible challenge that
              only escalates for suspicious traffic. That approach sidesteps the
              cognitive test entirely and avoids the object-recognition
              exception&apos;s remaining friction for low-vision users. If you
              must keep an interactive challenge, always pair it with an{" "}
              <em>alternative</em> route such as an email magic link.
            </p>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A password field that meets 3.3.8
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The right{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                autocomplete
              </code>{" "}
              tokens let password managers and browsers fill both fields, and
              nothing blocks paste — so the mechanism exception is satisfied.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="email">Email</label>
<input id="email" name="email" type="email"
       autocomplete="username" />

<label for="password">Password</label>
<input id="password" name="password" type="password"
       autocomplete="current-password" />
<!-- No onpaste="return false", no oncopy blocking,
     no "enter characters 2, 5 and 8 of your password" -->`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A one-time code field that can be pasted and auto-filled
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                autocomplete=&quot;one-time-code&quot;
              </code>{" "}
              lets mobile browsers offer the SMS code, and leaving paste enabled
              means users can copy it straight from their messages instead of
              transcribing it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="otp">Enter the 6-digit code we sent you</label>
<input id="otp" name="otp" type="text"
       inputmode="numeric" autocomplete="one-time-code"
       pattern="[0-9]*" maxlength="6" />
<!-- Do NOT split into six separate single-character boxes
     that reset on paste; a single field pastes cleanly. -->`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Offering a passkey as the non-cognitive alternative
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A passkey (WebAuthn) replaces recall with a device tap or biometric
              — no memory, no transcription, no puzzle — and provides the{" "}
              <em>alternative</em> exception for any flow that still contains a
              cognitive step.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<button type="button" id="passkey-signin">
  Sign in with a passkey
</button>

<script>
  document.getElementById("passkey-signin")
    .addEventListener("click", async () => {
      // options fetched from your server
      const credential = await navigator.credentials.get({
        publicKey: options,
      })
      // send credential to server to verify — user
      // authenticated with no cognitive function test
      await verifyOnServer(credential)
    })
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Anti-pattern: a field that blocks paste
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              This is the classic 3.3.8 failure. Disabling paste removes the
              mechanism that lets a password manager or the clipboard do the
              cognitive work, forcing manual transcription.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- DON'T: this fails WCAG 3.3.8 -->
<input id="password" type="password"
       onpaste="return false"
       oncontextmenu="return false"
       autocomplete="off" />`}</code>
            </pre>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common mistakes
            </h2>
            <ul className="space-y-3">
              {[
                "Blocking paste on password or one-time-code fields, which removes the mechanism that lets managers and the clipboard do the work.",
                "Setting autocomplete=\"off\" on the password field, stopping password managers from filling it.",
                "Asking for specific characters of a password ('enter the 2nd, 5th and 8th letters') — a password manager cannot fill this, so it becomes a pure memory test.",
                "Using a distorted-text or math CAPTCHA with no alternative authentication path.",
                "Splitting a one-time code into six single-character inputs that discard a pasted value or scatter the digits.",
                "Requiring the user to re-key a code from an email or SMS with paste disabled.",
                "Treating security questions ('your first pet's name') as accessible — they are a memory test with no mechanism.",
                "Assuming an audio CAPTCHA fixes the problem; transcribing spoken characters is still a cognitive function test.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 3.3.8
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Walk every step of the sign-in flow",
                  d: "List each step a user must complete to authenticate — password, second factor, CAPTCHA, security question. For each, ask: does this require remembering, transcribing, or solving something? Every 'yes' needs an exception.",
                },
                {
                  t: "Try to paste into every field",
                  d: "Copy some text and attempt to paste it into the password and one-time-code fields. If paste is blocked, the mechanism exception is broken and the step fails.",
                },
                {
                  t: "Check the field with a password manager",
                  d: "Use a real password manager (e.g. 1Password, Bitwarden, or the browser's built-in) and confirm it offers to fill the fields. If autocomplete=\"off\" or an odd field name stops it, fix the markup.",
                },
                {
                  t: "Look for a non-cognitive alternative",
                  d: "Where a step is genuinely a cognitive test (a puzzle CAPTCHA, an odd challenge), confirm there is an alternative route — passkey, magic link, or trusted-device sign-in — that avoids it entirely.",
                },
                {
                  t: "Classify any CAPTCHA",
                  d: "If a CAPTCHA is present, decide which bucket it is in: puzzle/transcription (fails without an alternative), object recognition (allowed at AA), or personal content (allowed). Prefer a no-puzzle bot check.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Audit a live login page with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>{" "}
              and confirm assistive-technology behavior using the{" "}
              <Link
                href="/guides/screen-reader-testing"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Screen Reader Testing Guide
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="3.3.8" />
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="accessible authentication cognitive function test login password manager paste autocomplete one-time code passkey WebAuthn CAPTCHA object recognition passwordless WCAG 3.3.8 Level AA WCAG 2.2 sign-in security"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
