import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { company } from "@/lib/company"

// Keep these sections in step with the policy bundled in Android app version 1.0.0.
export const metadata = createMetadata({
  title: "Android App Privacy Policy | Accessibility.build",
  path: "/android/privacy",
  description:
    "How Build with Accessibility for Android handles screen access, local audit storage, exports, permissions, and deletion without accounts or telemetry.",
  keywords: ["Build with Accessibility privacy", "Android accessibility auditor privacy", "offline accessibility audit"],
})

const sections = [
  {
    "heading": "Your audit stays on your device",
    "text": "Build with Accessibility has no account, internet permission, advertising, analytics, telemetry, or crash-reporting service. The app does not send your screen contents, audit data, device details, or installed-app list to us or any server. OCR and accessibility checks run locally with bundled models."
  },
  {
    "heading": "Screen access is optional",
    "text": "After your explicit consent, you can enable the Android accessibility service. While enabled, it observes window changes to identify the foreground app; recent activity names are held in memory. It reads the focused app's accessible screen contents and layout, and requests a screenshot, only when you trigger a capture. The floating button, accessibility shortcut, Quick Settings tile, and notification are optional controls. You can decline screen access and still browse saved audits and guidance."
  },
  {
    "heading": "What an audit stores",
    "text": "A capture can contain visible text, accessible names, control states, positions, reading-order predictions, findings, a screenshot, and your notes. The app also records the audited app's package/version and device test conditions, including Android version, device model, locale, display settings, and enabled accessibility-service names. The app chooser lists launchable apps locally. Captured content may include personal or confidential information shown by the app you are auditing."
  },
  {
    "heading": "Screenshots and sensitive content",
    "text": "Android secure-window restrictions are respected. Password fields and sensitive controls that Android identifies are excluded or masked before local OCR and image storage. This does not identify every kind of private information. Review captures before exporting them. Screens can change during capture; incomplete captures are marked for review. You can turn off OCR, omit saved screenshots, or save them at half resolution. Choosing not to retain screenshots does not prevent temporary in-memory image analysis."
  },
  {
    "heading": "Storage, retention and deletion",
    "text": "Audit records and evidence are stored in the app's private Android storage. Cloud backup and device-transfer backup are disabled. Records remain until you delete a session, use Delete all audit data, clear the app's storage, or uninstall it. There is no account to delete. Temporary files created for sharing are kept in private cache and pruned after seven days when an export is generated. Reports you saved or shared outside the app are separate copies; delete those at their destination."
  },
  {
    "heading": "Exports and clipboard",
    "text": "Only your action saves or shares a report, copies finding text, or shares a highlighted evidence image. Review the export summary and image choice first. Android's document picker, clipboard, and share sheet handle the destination. A destination app or service may upload the file under its own policy. Support links open your browser, which has its own network and privacy behavior. We do not receive an export automatically."
  },
  {
    "heading": "Optional device settings",
    "text": "Changing text size requires Android's separate Modify system settings permission. Reducing animations and testing magnification use public accessibility APIs when available. These controls operate only when requested and offer restoration of the previous values. Other device conditions open the appropriate Android Settings page. Notification permission is optional. The app does not request contacts, camera, microphone, location, or broad storage access."
  },
  {
    "heading": "Your choices",
    "text": "Turn off screen access in this app's Settings or in Android Accessibility settings. Revoking access stops new captures and leaves existing audits available. You can review the disclosure, change screenshot retention, and delete audit data in Settings. Manual tests and findings help an auditor make a decision; they are not a certification of accessibility conformance."
  },
  {
    "heading": "Policy changes and support",
    "text": "Any change to these practices will be reflected in the policy bundled with that app version and in its published privacy policy. Contact Accessibility.build through contact@accessibility.build or https://accessibility.build/contact for questions about this app."
  }
] as const

const linkClass = "font-medium text-primary underline underline-offset-2 hover:decoration-2"

export default function AndroidPrivacyPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Build with Accessibility for Android</p>
          <h1 className="mt-3 text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            This policy applies to the Build with Accessibility Android app,
            version 1.0.0, published by {company.legalOperator}, who operates {company.brandName}.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective <time dateTime="2026-10-30">30 October 2026</time> · Policy version 1.0
          </p>
          <p className="mt-2 break-words text-sm text-muted-foreground">
            Android package: <code>build.accessibility.auditor</code>
          </p>
        </header>

        <div className="prose prose-lg mt-10 max-w-none break-words dark:prose-invert">
          {sections.map(({ heading, text }) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}

          <h2>This website and support</h2>
          <p>
            Visiting this website or contacting us is covered by the{" "}
            <Link href="/privacy" className={linkClass}>website privacy policy</Link>.
            The Android app's offline operation and local audit storage are described above.
          </p>
          <p>
            Privacy questions can be sent to{" "}
            <a href={`mailto:${company.privacyEmail}`} className={linkClass}>{company.privacyEmail}</a>{" "}
            or through the <Link href="/contact" className={linkClass}>Accessibility.build contact page</Link>.
          </p>
        </div>
      </article>
    </div>
  )
}
