const span = (text, marks = []) => ({ _type: 'span', text, marks })
const block = (style, children, extra = {}) => ({ _type: 'block', style, children, ...extra })
const p = (text) => block('normal', [span(text)])
const h2 = (text) => block('h2', [span(text)])
const h3 = (text) => block('h3', [span(text)])
const item = (text, listItem = 'bullet') => block('normal', [span(text)], { listItem })
const linked = (children, markDefs) => block('normal', children, { markDefs })

export default {
  slug: 'accessible-authentication-passkeys-magic-links',
  title: 'Passkeys Are Not Automatically Accessible: Design the Whole Login Journey',
  excerpt: 'Passkeys can remove memorization, but inaccessible setup, recovery, fallback, and device-switching flows can still lock people out. Test authentication as one complete journey.',
  publishedAt: '2026-07-10T10:00:00Z',
  categoryTitles: ['Development', 'WCAG Guidelines'],
  seo: {
    metaTitle: 'Accessible Passkeys, Magic Links, and Login Flows',
    metaDescription: 'Build accessible authentication with passkeys, password managers, OTP autofill, magic links, usable recovery, and WCAG 2.2 guidance.',
    keywords: [
      'accessible authentication',
      'passkey accessibility',
      'WCAG 3.3.8',
      'passwordless accessibility',
      'magic link accessibility',
      'OTP accessibility',
      'WebAuthn accessibility',
      'accessible login form',
    ],
  },
  body: [
    p('Passkeys are one of the most promising accessibility improvements in authentication. They can replace a site-specific password with a device-supported gesture such as a fingerprint, face scan, PIN, or security key. That removes memorization and can reduce phishing. But a passkey button does not make an authentication system accessible by itself.'),
    p('People experience authentication as a chain: discover the option, understand it, create a credential, use it on another device, recover when something changes, and choose a fallback when the preferred method is unavailable. A failure anywhere in that chain is a locked door.'),
    h2('What WCAG 2.2 actually asks for'),
    linked(
      [
        span('WCAG 2.2 Success Criterion 3.3.8, '),
        span('Accessible Authentication (Minimum)', ['wcag']),
        span(', says an authentication step must not require a cognitive function test unless an allowed alternative or assistance mechanism is available. Remembering a password, solving a puzzle, or manually transcribing a one-time code can be a cognitive function test.'),
      ],
      [{ _key: 'wcag', _type: 'link', href: '/wcag/3-3-8' }],
    ),
    p('Password managers, browser autofill, copy and paste, and WebAuthn can provide the required assistance or alternative. The criterion applies to every step in a multi-step process, including account recovery. A compliant first screen does not rescue an inaccessible second factor.'),
    h2('Passkeys help with memory, not every barrier'),
    p('A well-designed passkey flow can remove password recall and code transcription. It may also let users rely on familiar device accessibility settings. Yet the surrounding interface can introduce new problems.'),
    item('The passkey option is hidden behind an unlabeled icon or an ambiguous phrase such as "Use another method."'),
    item('Instructions describe a visual location or biometric gesture without explaining alternatives.'),
    item('A QR code is the only cross-device path and has no usable fallback.'),
    item('The browser or operating-system dialog appears without prior context, leaving screen-reader users unsure why focus moved.'),
    item('Account recovery falls back to security questions, memory tests, or manual support with no accessible channel.'),
    item('The service assumes every user owns a second device, can use biometrics, or can scan a code.'),
    p('These are journey design failures, not flaws in the cryptography. Security and accessibility are strongest when users have more than one secure, understandable route.'),
    h2('Design a clear method chooser'),
    p('Present authentication methods as named actions with short explanations: "Use a passkey," "Email me a sign-in link," or "Use password and authenticator." Keep the same names through setup, login, settings, and recovery. Explain what will happen before invoking a platform dialog.'),
    p('Do not rank methods only by visual prominence. A secondary method that is technically present but difficult to find may not function as a practical alternative. Let users return to the chooser without losing their email address or restarting the entire process.'),
    h2('Make password and OTP fallback genuinely usable'),
    p('Passwords remain a valid accessible method when browsers and password managers can identify and fill the fields. Do not block paste. Use standard HTML inputs, persistent labels, and correct autocomplete tokens. For one-time codes, allow the entire code to be pasted and support autofill instead of forcing users through six separate boxes.'),
    {
      _type: 'code',
      language: 'html',
      filename: 'login.html',
      code: `<label for="email">Email address</label>
<input id="email" name="email" type="email" autocomplete="username">

<label for="password">Password</label>
<input id="password" name="password" type="password"
  autocomplete="current-password">

<label for="code">Verification code</label>
<input id="code" name="code" inputmode="numeric"
  autocomplete="one-time-code">`,
    },
    p('A segmented OTP interface can look polished while making paste, correction, and screen-reader navigation harder. One input is usually simpler. If the visual design must segment the digits, keep one semantic input underneath and test it across supported assistive technology.'),
    h2('Treat magic links as a handoff, not an escape hatch'),
    p('Magic links reduce memory demand, but they create a context switch into email. State where the link was sent, how long it remains valid, whether the user can safely open it on another device, and how to resend or change the address. Preserve the original task when the user returns.'),
    p('Avoid short time limits where security does not require them. If a link expires, explain that in text and provide a direct way to request another. Do not show a generic "invalid token" page that strands the user.'),
    h2('Build recovery before launch'),
    p('Recovery is often the least tested and most consequential path. People change phones, lose security keys, clear synced credentials, change email addresses, and cannot always use the biometric method they used during enrollment.'),
    item('Offer more than one recovery method and explain the tradeoffs before the user needs them.'),
    item('Let users register multiple passkeys or security keys where the platform supports it.'),
    item('Provide accessible recovery codes that can be copied, downloaded, printed, and regenerated.'),
    item('Avoid knowledge questions based on personal history or exact spelling.'),
    item('Make human support reachable and train support staff not to disable accessibility accommodations as suspicious behavior.'),
    h2('Test the matrix, not just the happy path'),
    p('Authentication crosses your interface, browser UI, operating-system UI, email or messaging apps, identity providers, and sometimes another device. No single browser test covers that system.'),
    item('Keyboard-only: create, use, cancel, retry, switch methods, and recover.'),
    item('Screen reader: verify labels, instructions, focus transitions, errors, timeouts, and success messages.'),
    item('Zoom and reflow: test platform prompts and method choosers at 200 and 400 percent.'),
    item('Cognitive load: test whether instructions are short, stable, and available while the user acts.'),
    item('Device change: attempt login without the original phone, biometric, or synced account.'),
    item('Failure states: expired link, wrong code, unavailable authenticator, cancelled passkey prompt, and rate limiting.'),
    linked(
      [
        span('Use our '),
        span('accessible forms guide', ['forms']),
        span(' for labels and errors, then test the complete authentication journey with the '),
        span('WCAG 2.2 checklist', ['checklist']),
        span('.'),
      ],
      [
        { _key: 'forms', _type: 'link', href: '/guides/accessible-forms' },
        { _key: 'checklist', _type: 'link', href: '/checklists/wcag-2-2' },
      ],
    ),
    h2('The bottom line'),
    p('Passkeys can make authentication more accessible, but only when they are one understandable path inside a resilient system. Preserve autofill and paste, offer secure alternatives, design recovery with the same care as login, and test every handoff. The goal is not a passwordless screen. It is an account the user can reliably enter and recover.'),
    h2('Sources'),
    linked(
      [span('W3C WAI: Understanding SC 3.3.8 Accessible Authentication (Minimum)', ['s1'])],
      [{ _key: 's1', _type: 'link', href: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html' }],
    ),
    linked(
      [span('W3C: Web Authentication Level 3', ['s2'])],
      [{ _key: 's2', _type: 'link', href: 'https://www.w3.org/TR/webauthn-3/' }],
    ),
  ],
}
