import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.3.9 Accessible Authentication (Enhanced)",
  description:
    "Guide to WCAG 3.3.9 Accessible Authentication (Enhanced): no cognitive test at any login step — no object-recognition or personal-content exceptions. Code and testing.",
  keywords: [
    "WCAG 3.3.9",
    "Accessible Authentication Enhanced",
    "cognitive function test",
    "accessible login AAA",
    "CAPTCHA free authentication",
    "passkeys accessibility",
    "passwordless login",
    "object recognition exception",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/3-3-9",
  },
  openGraph: {
    title: "WCAG 3.3.9 Accessible Authentication (Enhanced) — No Cognitive Tests, No Picture Exceptions (Level AAA)",
    description:
      "The definitive guide to WCAG 3.3.9: like 3.3.8, but the object-recognition and personal-content exceptions are gone. Passkeys, magic links, paste-friendly fields, and testing.",
    url: "/wcag/3-3-9",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.9%20Accessible%20Authentication%20(Enhanced)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.3.9 Accessible Authentication (Enhanced) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.3.9 Accessible Authentication (Enhanced) — Level AAA",
    description:
      "New in WCAG 2.2: at AAA, no authentication step may be a cognitive function test — and the image-CAPTCHA exceptions of 3.3.8 no longer apply. How to conform.",
    images: [
      {
        url: "/api/og?title=WCAG%203.3.9%20Accessible%20Authentication%20(Enhanced)&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.3.9 Accessible Authentication (Enhanced) require?",
    a: "It requires that no step of an authentication process relies on a cognitive function test — remembering a secret, transcribing characters, solving a puzzle — unless one of exactly two conditions holds: an alternative authentication method exists that is not a cognitive function test, or a mechanism (like password manager support and paste) is available to assist the user through the step. It is a Level AAA success criterion, new in WCAG 2.2, sitting directly above 3.3.8 Accessible Authentication (Minimum).",
  },
  {
    q: "What is the exact difference between 3.3.9 and 3.3.8?",
    a: "The rule is word-for-word the same; the exception list shrinks. 3.3.8 (Level AA) permits four escapes: an alternative method, an assisting mechanism, tests based on recognizing common objects, and tests based on personal content the user provided (like a chosen security image). 3.3.9 (AAA) keeps only the first two. Object-recognition CAPTCHAs ('select all bicycles') and personal-content checks, which pass at AA, fail at AAA unless a non-cognitive alternative or assisting mechanism is also offered.",
  },
  {
    q: "Why does AAA remove the object-recognition exception?",
    a: "Because recognizing objects is still a cognitive task, and for some users a hard one. People with agnosia or significant visual-processing differences may be unable to identify pictured objects; images are often small, low-quality, or culturally unfamiliar ('select the American-style crosswalks'); and memory-based personal-content checks still lean on recall. The AA exceptions were a pragmatic compromise for the wide web. AAA represents the full goal: authentication that demands no test of cognitive function at all.",
  },
  {
    q: "Do passwords automatically fail 3.3.9?",
    a: "No. Remembering a password is a cognitive function test, but the 'mechanism' exception survives at AAA: if your login field works with password managers (autocomplete=\"current-password\"), never blocks paste, and doesn't force partial-character entry, the manager does the remembering and the step conforms. What fails is sabotaging that support — paste blockers, autofill-hostile fields, 'enter the 2nd, 5th and 9th character of your password' schemes — without offering a non-cognitive alternative like a passkey.",
  },
  {
    q: "What login designs satisfy 3.3.9 outright?",
    a: "Methods with no cognitive test anywhere: passkeys (WebAuthn/FIDO2) using device biometrics or PIN handled by the platform, magic sign-in links sent by email, push-approval in an authenticator app (tap to approve, not transcribe), OAuth federation to a provider that itself conforms, and hardware security keys. Any one of these as an always-available option also acts as the 'alternative' that lets you keep a traditional password path alongside.",
  },
  {
    q: "Are two-factor codes (OTP) allowed under 3.3.9?",
    a: "Yes, if no step forces recall or transcription. An SMS or TOTP code passes when the field supports autocomplete=\"one-time-code\" auto-fill and paste works, so the user can move the code without retyping it digit by digit. Cross-device flows where the user must read a code on one screen and type it on another with no copy path are transcription tests and fail. Push-based approval avoids the problem entirely.",
  },
  {
    q: "Does 3.3.9 apply to things like security questions?",
    a: "Yes. 'What was your first pet's name?' is a memory-based cognitive function test. At AAA it conforms only if an assisting mechanism applies (the answer field allows paste and password-manager fill, letting users store answers) or a non-cognitive alternative route exists. Security questions are also weak security practice; replacing them with passkeys or email-verified recovery satisfies both the accessibility and security arguments at once.",
  },
]

export default function WCAG339Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.3.9: Accessible Authentication (Enhanced)"
        description="Authentication does not rely on a cognitive function test unless an alternative or assisting mechanism is available"
        criteria="3.3.9"
        level="AAA"
        principle="Understandable"
        guideline="3.3 Input Assistance"
        url="https://accessibility.build/wcag/3-3-9"
        category="Input Assistance"
        relatedCriteria={["3.3.8", "3.3.7", "1.1.1"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb
            items={[]}
            current="3.3.9 Accessible Authentication (Enhanced)"
          />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                New in WCAG 2.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.3.9: Accessible Authentication (Enhanced)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Logging in should prove who you are, not how good your memory or puzzle
              solving is. At Level AA,{" "}
              <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                3.3.8
              </Link>{" "}
              banned cognitive function tests with four escape hatches. This AAA
              criterion keeps the same rule and{" "}
              <strong className="text-slate-900 dark:text-white">
                closes the two picture-based hatches: object-recognition tests and
                personal-content tests no longer count as exceptions
              </strong>
              . Only a true alternative or an assisting mechanism will do.
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-purple-500 pl-4">
              A cognitive function test (such as remembering a password or solving a
              puzzle) is not required for any step in an authentication process unless
              that step provides at least one of the following:
              <span className="block mt-3">
                <strong>Alternative</strong> — Another authentication method that does
                not rely on a cognitive function test.
              </span>
              <span className="block mt-2">
                <strong>Mechanism</strong> — A mechanism is available to assist the
                user in completing the cognitive function test.
              </span>
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Compare 3.3.8: identical opening, but its additional{" "}
              <em>Object Recognition</em> and <em>Personal Content</em> exceptions are
              absent here. That two-line deletion is the entire difference between AA
              and AAA authentication.
            </p>
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
                <a className="hover:underline" href="#who">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  The requirement, AA vs AAA
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code: conforming login patterns
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#failures">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#siblings">
                  Relationship to 3.3.8 and 3.3.7
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Who this helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Authentication is the front door to everything — banking, healthcare,
              email, government services. A cognitive test at that door doesn&rsquo;t
              inconvenience some users; it locks them out entirely.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with memory impairments",
                  d: "Recalling passwords, PINs, or security-question answers may be impossible. Passkeys, magic links, and password-manager support remove recall from the flow altogether.",
                },
                {
                  t: "People with dyslexia and dyscalculia",
                  d: "Transcribing a one-time code or distorted CAPTCHA string means holding and reordering characters — precisely the operation these disabilities disrupt. Paste and auto-fill eliminate the transcription.",
                },
                {
                  t: "People with visual-processing differences",
                  d: "This is who the AAA tightening protects: users who cannot reliably identify pictured objects. At AA an image-selection CAPTCHA is an allowed exception; at AAA it must have a non-cognitive alternative.",
                },
                {
                  t: "Everyone under stress",
                  d: "Cognitive capacity drops with age, fatigue, medication, and anxiety. Login friction is a leading cause of abandoned accounts and support calls — non-cognitive authentication is simply better product design.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The requirement, AA vs AAA
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A <em>cognitive function test</em> is any task requiring the user to
              remember, manipulate, or transcribe information, or to solve problems:
              memorized passwords, retyped one-time codes, CAPTCHA puzzles of every
              flavor, pattern gestures, mental arithmetic, security questions. The
              rule applies to <em>every step</em> of the process — login, two-factor,
              bot checks, and recovery included. Side-by-side, the exception lists:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">
                  Exceptions allowed in 3.3.8 versus 3.3.9
                </caption>
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700 text-left">
                    <th scope="col" className="py-3 pr-4 text-slate-900 dark:text-white">
                      Exception
                    </th>
                    <th scope="col" className="py-3 pr-4 text-slate-900 dark:text-white">
                      3.3.8 Minimum (AA)
                    </th>
                    <th scope="col" className="py-3 text-slate-900 dark:text-white">
                      3.3.9 Enhanced (AAA)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4">Alternative non-cognitive method</td>
                    <td className="py-3 pr-4">Allowed</td>
                    <td className="py-3">Allowed</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4">Assisting mechanism (paste, autofill)</td>
                    <td className="py-3 pr-4">Allowed</td>
                    <td className="py-3">Allowed</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4">Object recognition (&ldquo;select the buses&rdquo;)</td>
                    <td className="py-3 pr-4">Allowed</td>
                    <td className="py-3 font-semibold text-rose-600 dark:text-rose-400">
                      Not allowed
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4">Personal content (your uploaded photo)</td>
                    <td className="py-3 pr-4">Allowed</td>
                    <td className="py-3 font-semibold text-rose-600 dark:text-rose-400">
                      Not allowed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Practical consequence: any image-based CAPTCHA, security image check, or
              &ldquo;pick your photo&rdquo; verification that stood on its own at AA
              must, at AAA, be either replaced by a non-cognitive method or paired
              with one the user can freely choose instead.
            </p>
          </section>

          {/* Pass / fail */}
          <section aria-labelledby="pass-fail" className="mb-12">
            <h2
              id="pass-fail"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                  ✓ Passes 3.3.9
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Passkey sign-in via WebAuthn, with device biometrics handling
                    identity — no recall, no transcription.
                  </li>
                  <li>
                    Email magic link as an always-available alternative beside the
                    password form.
                  </li>
                  <li>
                    A password field with autocomplete=&quot;current-password&quot;
                    and unrestricted paste — the manager is the mechanism.
                  </li>
                  <li>
                    Two-factor via push approval (&ldquo;Tap Yes to sign in&rdquo;)
                    instead of typed codes.
                  </li>
                  <li>
                    Bot protection using risk-based, non-interactive checks rather
                    than any puzzle.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 3.3.9
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    An image-grid CAPTCHA (&ldquo;select all traffic lights&rdquo;) as
                    the only route in — passes 3.3.8, fails 3.3.9.
                  </li>
                  <li>
                    A &ldquo;click your security image&rdquo; step relying on the
                    personal-content exception that AAA removes.
                  </li>
                  <li>
                    A password field that blocks paste and autofill, with no passkey
                    or magic-link alternative.
                  </li>
                  <li>
                    Recovery flows gated solely on memorized security questions.
                  </li>
                  <li>
                    An OTP screen that disables paste and ignores
                    autocomplete=&quot;one-time-code&quot;, forcing digit-by-digit
                    transcription.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code: conforming login patterns
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Manager-friendly credentials plus a passkey alternative
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The password path conforms through the <em>mechanism</em> exception;
              the passkey button provides the <em>alternative</em> for everything
              else in the flow.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<form action="/login" method="post">
  <label for="user">Email address</label>
  <input id="user" name="user" type="email"
         autocomplete="username webauthn" />

  <label for="pass">Password</label>
  <!-- Never block paste; let managers fill it -->
  <input id="pass" name="pass" type="password"
         autocomplete="current-password" />

  <button type="submit">Sign in</button>
</form>

<button type="button" id="passkey-btn">
  Sign in with a passkey instead
</button>
<a href="/login/magic-link">Email me a sign-in link</a>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A passkey request with WebAuthn
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`document.getElementById("passkey-btn")
  .addEventListener("click", async () => {
    const options = await fetch("/webauthn/options").then(r => r.json())
    // The platform handles identity via biometric or device PIN —
    // no memory, transcription, or puzzle involved.
    const credential = await navigator.credentials.get({
      publicKey: options,
    })
    await fetch("/webauthn/verify", {
      method: "POST",
      body: JSON.stringify(credential),
    })
  })`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              One-time codes that fill themselves
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you keep OTP, make transcription unnecessary:{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">autocomplete=&quot;one-time-code&quot;</code>{" "}
              lets mobile platforms offer the received code, and paste must keep
              working.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<label for="otp">6-digit code from your authenticator app</label>
<input id="otp" name="otp" inputmode="numeric" pattern="[0-9]{6}"
       autocomplete="one-time-code" />
<!-- ✗ Never do this on an OTP or password field:
     onpaste="return false" -->`}</code>
            </pre>
          </section>

          {/* Common failures */}
          <section aria-labelledby="failures" className="mb-12">
            <h2
              id="failures"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Relying on an object-recognition CAPTCHA as the sole bot check — the exception that made this legal at AA does not exist at AAA.",
                "Security-image or 'pick the photo you uploaded' verification steps with no non-cognitive alternative offered.",
                "Blocking paste or autofill on password, OTP, or security-answer fields, destroying the assisting mechanism that would otherwise conform.",
                "Asking users to type specific characters of their password ('3rd, 6th and 9th'), which defeats password managers by design.",
                "Cross-device flows that display a code on one screen to be manually retyped on another, with no copy or push-approval path.",
                "Recovery and account-verification steps built entirely on memorized security questions.",
                "Offering a passkey alternative but hiding it behind the failed cognitive step — the alternative must be reachable without completing the test.",
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
              How to test for 3.3.9
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Map every step of every authentication flow",
                  d: "Login, registration, two-factor, bot checks, re-authentication, and recovery. The criterion applies per step — one puzzle anywhere in the chain scopes it in.",
                },
                {
                  t: "Classify each step: is it a cognitive function test?",
                  d: "Does it require remembering, transcribing, calculating, solving, or recognizing anything — including common objects and the user's own uploaded content? At AAA, image recognition counts as a cognitive test with no exemption.",
                },
                {
                  t: "Test the assisting mechanism honestly",
                  d: "Fill the login with a real password manager, and paste into every password and code field from the clipboard. Check autocomplete attributes are present and nothing intercepts paste events. If the manager can complete the step end to end, the mechanism exception is met.",
                },
                {
                  t: "Verify the alternative is real and reachable",
                  d: "Where a cognitive step remains, confirm a non-cognitive method (passkey, magic link, push approval) is offered on the same screen or earlier — not gated behind completing the very test it is meant to replace.",
                },
                {
                  t: "Run the whole flow with assistive technology",
                  d: "Complete authentication using only a keyboard and then with a screen reader. Confirm any third-party auth widgets (CAPTCHA iframes, SSO popups) are themselves operable — an inaccessible widget can fail this and several other criteria at once.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
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
              Pair this with the AA baseline in our{" "}
              <Link
                href="/wcag/3-3-8"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.3.8 guide
              </Link>{" "}
              and the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Relationship */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to 3.3.8 and 3.3.7
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              WCAG 2.2 added three criteria to Guideline 3.3, and they work as a set.{" "}
              <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.7 Redundant Entry
              </Link>{" "}
              (A) stops processes from asking for the same information twice —
              cognitive load before authentication.{" "}
              <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.3.8 Accessible Authentication (Minimum)
              </Link>{" "}
              (AA) is the compliance target most laws reference, with its four
              exceptions. 3.3.9 is the destination: authentication with no cognitive
              gate that lacks a genuine way around it.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The upgrade path is concrete: a site meeting 3.3.8 typically reaches
              3.3.9 by swapping its image CAPTCHA for a risk-based or non-interactive
              bot check and adding one non-cognitive sign-in option such as passkeys.
              Any CAPTCHA you retain also owes a text alternative under{" "}
              <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.1.1 Non-text Content
              </Link>{" "}
              (A) — accessible authentication and accessible bot defense are the same
              project.
            </p>
          </section>

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

          <CriterionLinks number="3.3.9" />
        </article>
      </div>
    </>
  )
}
