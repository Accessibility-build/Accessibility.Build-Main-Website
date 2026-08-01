import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ListChecks,
  GitBranch,
  Captions,
  FileText,
  AudioLines,
  Keyboard,
  Code2,
  Globe,
  Film,
  AlertTriangle,
  Sparkles,
} from "lucide-react"

const pageTitle =
  "Accessible Video & Media Player Guide (Captions, Transcripts, Audio Description, WCAG 2.2)"
const pageDescription =
  "Make video and audio accessible: decide which alternatives your media owes (captions, transcript, audio description) based on prerecorded-vs-live and where the information lives, write real captions instead of auto-captions, provide a descriptive transcript, add audio description for on-screen-only information, build a keyboard-operable player that never autoplays sound, wire the HTML <video> and <track> elements, handle embedded YouTube and Vimeo players, and do it in React — mapped to WCAG 2.2 (1.2.1–1.2.5, 1.4.2, 2.1.1, 2.2.2, 4.1.2)."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible video player",
    "accessible media",
    "video accessibility",
    "captions vs subtitles",
    "closed captions",
    "webvtt",
    "track element",
    "html5 video accessibility",
    "audio description",
    "video transcript accessibility",
    "descriptive transcript",
    "live captions",
    "accessible audio player",
    "podcast transcript accessibility",
    "autoplay accessibility",
    "keyboard accessible video controls",
    "youtube video accessibility",
    "vimeo accessibility",
    "media accessibility wcag",
    "wcag 1.2.2 captions",
    "wcag 1.2.5 audio description",
    "react accessible video",
  ],
  alternates: {
    canonical: "/guides/accessible-video-player",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-video-player",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Video & Media Players")}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Video & Media Players")}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Video & Media Player",
    url: "https://accessibility.build/guides/accessible-video-player",
  },
]

const faqs = [
  {
    question: "What is the difference between captions and subtitles?",
    answer:
      "They look similar and are often confused, but they solve different problems for different people. Subtitles assume you can hear the audio and only need the dialogue in another language — they translate speech and nothing else. Captions assume you cannot hear the audio at all, so they carry everything the soundtrack does: the dialogue in the same language, who is speaking when it is not obvious, and the non-speech sounds that carry meaning — [phone rings], [ominous music], [laughter]. WCAG 1.2.2 requires captions, not subtitles. A common failure is shipping a same-language subtitle file, calling it captions, and leaving a deaf viewer to wonder why the tense scene has no explanation — because the [footsteps approaching] that a hearing viewer relies on was never written down. If your file only contains spoken words, it is subtitles; captions also describe the sounds.",
  },
  {
    question: "Do auto-generated (YouTube) captions meet WCAG?",
    answer:
      "Not on their own. Automatic speech recognition has improved enormously, but WCAG 1.2.2 requires captions that are accurate and complete, and auto-captions routinely mishear technical terms, names, and homophones, drop punctuation that changes meaning, omit speaker identification entirely, and never transcribe the non-speech sounds captions are supposed to include. They are also often out of sync. Treat auto-captions as a first draft that saves you typing, not as a compliant caption track: review every line, fix the errors, add speaker labels and sound descriptions, and correct the timing. The nickname the disability community gives uncorrected machine captions — 'craptions' — exists for a reason. Upload your corrected file rather than leaving the automatic track live.",
  },
  {
    question: "What is audio description and when do I actually need it?",
    answer:
      "Audio description is a narration, inserted into the natural pauses between dialogue, that describes the essential visual information a blind or low-vision viewer would otherwise miss — an on-screen chart, a character's reaction, text that appears without being read aloud, a demonstration that is shown but not narrated. You need it whenever the video conveys information visually that is not already in the soundtrack. The test is simple: close your eyes and listen. If you can still follow everything that matters, you do not need audio description for that video. If you find yourself thinking 'wait, what just happened?' at any point, that gap is exactly what audio description fills. A talking-head interview where everything important is spoken usually needs no description; a software demo where the presenter says 'and then you click here' while clicking silently absolutely does.",
  },
  {
    question: "Do I need both captions and a transcript?",
    answer:
      "For a video with sound, captions are required (1.2.2) and a transcript is strongly recommended; for audio-only content like a podcast, a transcript is the requirement (1.2.1) and there are no captions to add. They serve overlapping but different audiences. Captions are synchronized with the video, so they work for someone watching in real time who cannot hear. A transcript is a single block of text on the page, which serves people who are deafblind and read it in Braille, people who want to skim or search the content, people on a slow connection or in a sound-off environment, and search engines — none of whom are served by a caption track locked inside the player. The most powerful single artifact is a descriptive transcript: the dialogue plus the important visual information, written out as text. That one document can satisfy the transcript need, act as the text alternative for audio description under 1.2.3, and give you SEO-friendly content for free.",
  },
  {
    question: "Is the HTML <track kind=\"descriptions\"> element enough for audio description?",
    answer:
      "It is the standards-based mechanism, but in practice its support is not yet dependable enough to rely on alone. The idea is elegant — a WebVTT file marked kind=\"descriptions\" whose cues a screen reader speaks in the gaps — but browser and screen-reader support for actually announcing that track has historically been patchy and inconsistent, and browsers do not pause the video to fit a description that is too long for the gap. So while you can and should include a descriptions track, the reliable ways to deliver audio description today are to script the description into the production so it is part of the main soundtrack, or to offer a separate described version of the video (an alternate source or a second player) that the user can choose. Whichever you use, verify it in your target screen readers rather than assuming the track is read.",
  },
  {
    question: "Does WCAG allow autoplaying video?",
    answer:
      "It allows it only under tight conditions, and the safest answer is: do not autoplay with sound, ever. Two criteria apply. WCAG 1.4.2 Audio Control says that if any audio plays automatically for more than three seconds, the user must be able to pause or stop it or control its volume independently of the system volume — autoplaying sound with no off switch is a straight failure. WCAG 2.2.2 Pause, Stop, Hide says that auto-playing, moving content lasting more than five seconds — which includes a silently looping background video — must be pausable, stoppable, or hideable. Autoplaying audio is also simply hostile: it talks over screen readers, startles people, and competes with whatever else the user is listening to. Start paused, let the user press play, and if you must autoplay a decorative background video, mute it and give it a visible pause control.",
  },
  {
    question: "How do I make an embedded YouTube or Vimeo video accessible?",
    answer:
      "You are responsible for the alternatives even though you do not control the player. Three things are on you. First, give the embedding <iframe> a descriptive title attribute so screen reader users know what the frame contains rather than hearing 'video player, frame'. Second, do not trust the platform's automatic captions — upload your own reviewed caption file to the video so the captions are accurate and complete. Third, put a transcript on your own page near the embed, because the platform will not, and a transcript is the alternative that serves the most people. Beyond that, the platform's player controls and their keyboard support are outside your control, so test them: tab through the player, confirm play, volume, captions, and fullscreen are reachable and operable, and if the player is badly broken, consider hosting the video yourself with a native <video> element you can make accessible.",
  },
  {
    question: "Are captions required for live video?",
    answer:
      "Yes. WCAG 1.2.4 Captions (Live) is a level AA requirement that live audio in synchronized media — a live webinar, a streamed conference talk, a town-hall broadcast — must be captioned in real time. In practice this is usually delivered by CART (Communication Access Real-time Translation), where a trained human captioner types or re-speaks the audio into a live caption stream, because automatic speech recognition rarely reaches the accuracy WCAG requires, especially with multiple speakers, cross-talk, accents, or specialist vocabulary. Live audio description is not required at any WCAG level, which is a deliberate acknowledgement of how hard it is to produce in real time. Plan live captioning before the event, not after — you cannot retrofit real-time captions once the stream has ended, though you should also publish a corrected transcript or captioned recording afterward.",
  },
]

const antiPatterns = [
  {
    bad: "Auto-generated captions are left on as the caption solution.",
    why: "Machine captions mishear words, omit speaker IDs and sound effects, and drift out of sync — they are not accurate or complete captions (1.2.2).",
    fix: "Treat auto-captions as a draft: review every line, add speaker labels and non-speech sounds, fix timing, and upload the corrected file.",
  },
  {
    bad: "A same-language subtitle file is offered and labelled \"captions\".",
    why: "Subtitles carry only dialogue; a deaf viewer misses the [door slams] and [tense music] that hearing viewers rely on to follow the scene (1.2.2).",
    fix: "Write true captions — dialogue plus speaker identification plus meaningful non-speech sounds — using kind=\"captions\", not kind=\"subtitles\".",
  },
  {
    bad: "The video autoplays with sound, or a background video loops with no pause control.",
    why: "Autoplaying audio talks over screen readers and has no off switch (1.4.2); a moving background over five seconds cannot be paused (2.2.2).",
    fix: "Start paused. If a decorative background video must autoplay, mute it and provide a visible, keyboard-reachable pause control.",
  },
  {
    bad: "Custom player controls are icon-only <div>s with onclick handlers.",
    why: "They have no accessible name, no role, no state, and cannot be reached or operated by keyboard (2.1.1, 4.1.2).",
    fix: "Use real <button> elements with text accessible names, keyboard operation, visible focus, and state exposed (playing/paused, muted, captions on).",
  },
  {
    bad: "A video with essential on-screen-only information ships with no audio description.",
    why: "A blind viewer cannot access the chart, the silent demonstration, or the on-screen text that the soundtrack never mentions (1.2.3, 1.2.5).",
    fix: "Add audio description of the essential visuals — scripted into the soundtrack or as a described version — or, at level A only, a full text alternative.",
  },
  {
    bad: "A podcast or audio-only recording is published with no transcript.",
    why: "Deaf and deafblind users, skimmers, and search engines get nothing; audio-only content has no captions to fall back on (1.2.1).",
    fix: "Publish a full text transcript on the page, with speaker labels, near the audio player — not only as an off-site or downloadable file.",
  },
]

export default function AccessibleVideoPlayerGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessible Video &amp; Media Player
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Time-based Media &amp; WCAG Guide &bull; Updated August 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Video &amp; Media Players
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A single video can fail three different groups at once — deaf
                viewers who cannot hear it, blind viewers who cannot see it, and
                keyboard users who cannot operate the player. Accessible media is{" "}
                <strong className="text-slate-900 dark:text-white">
                  a stack of parallel alternatives
                </strong>{" "}
                delivered through a second channel: captions, a transcript, audio
                description, and a player everyone can drive. This guide covers
                which ones your media owes, how to build each one properly, the
                HTML <code>&lt;video&gt;</code> and <code>&lt;track&gt;</code>{" "}
                elements, embedded YouTube and Vimeo players, and React — mapped
                to WCAG&nbsp;2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Media Is Where So Many Sites Fail
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Text has one channel and it is easy to make accessible. Media
                  has two channels running at once — a picture and a sound — and
                  each one excludes a different group when it is the only way to
                  get the information. The audio is unavailable to a deaf viewer.
                  The picture is unavailable to a blind viewer. The controls are
                  unavailable to anyone who cannot use a mouse. A video is, in
                  effect, three accessibility problems wearing one costume, which
                  is exactly why media is one of the most consistently failed
                  areas of WCAG.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The way to keep it straight is to stop thinking about &ldquo;the
                  video&rdquo; and start thinking about{" "}
                  <strong className="text-slate-900 dark:text-white">
                    the information inside it, and the channels it travels
                    through
                  </strong>
                  . Every piece of meaning in a video arrives as either sound or
                  picture. Accessibility is the practice of making sure each of
                  those pieces also arrives through a second channel for whoever
                  cannot use the first: the audio becomes text (captions and
                  transcripts), the essential picture becomes audio (audio
                  description), and everything becomes text for people who use
                  neither (a descriptive transcript).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This guide is framework-agnostic and works whether you drop in
                  a native <code>&lt;video&gt;</code>, embed a YouTube player, or
                  ship a React component. The requirements cluster around WCAG&apos;s{" "}
                  <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2 Time-based Media
                  </Link>{" "}
                  guideline, plus{" "}
                  <Link href="/wcag/1-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.2 Audio Control
                  </Link>
                  ,{" "}
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1 Keyboard
                  </Link>
                  , and{" "}
                  <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.2 Pause, Stop, Hide
                  </Link>{" "}
                  for the player. We will start where you should always start:
                  deciding what this particular piece of media actually owes.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria Your Media Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that accessible video and audio
                    media must satisfy and what each requires
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        What your media must do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.2.1 Audio-only &amp; Video-only
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Provide a text transcript for prerecorded audio-only content, and an audio track or transcript for prerecorded video-only content.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.2.2 Captions (Prerecorded)
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Synchronized captions for all prerecorded audio in video — dialogue, speaker identification, and meaningful non-speech sounds.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-2-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.2.3 Audio Description or Media Alternative
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Either audio description of the essential visuals, or a full text alternative that conveys the whole video.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-2-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.2.4 Captions (Live)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Real-time captions for live audio in synchronized media — live webinars, streams, and broadcasts.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.2.5 Audio Description (Prerecorded)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Audio description for prerecorded video; at AA the text-alternative escape allowed by 1.2.3 no longer applies.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.2 Audio Control
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Any audio that plays automatically for more than 3 seconds can be paused or stopped, or has a volume control independent of the system.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every player control — play, pause, seek, volume, captions, fullscreen — is fully operable by keyboard.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.2.2 Pause, Stop, Hide
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Auto-playing video that lasts more than 5 seconds — including a muted, looping background video — can be paused, stopped, or hidden.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Custom player controls expose a name, a role, and their current state (playing or paused, muted, captions on or off) to assistive technology.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>The AAA tier goes further.</strong> Beyond AA, WCAG
                    adds{" "}
                    <Link href="/wcag/1-2-6" className="underline">
                      1.2.6 Sign Language
                    </Link>{" "}
                    (a sign-language interpretation track),{" "}
                    <Link href="/wcag/1-2-7" className="underline">
                      1.2.7 Extended Audio Description
                    </Link>{" "}
                    (pausing the video to fit description when the gaps are too
                    short),{" "}
                    <Link href="/wcag/1-2-8" className="underline">
                      1.2.8 Media Alternative
                    </Link>{" "}
                    (a full text alternative for all prerecorded media), and{" "}
                    <Link href="/wcag/1-2-9" className="underline">
                      1.2.9 Audio-only (Live)
                    </Link>
                    . Most teams target AA, but a descriptive transcript — covered
                    below — quietly gets you most of 1.2.8 for free.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Two criteria are failed far more than the rest. Captions (
                <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.2.2
                </Link>
                ) are the most often <em>attempted but wrong</em> — an
                auto-generated track left uncorrected — and audio description (
                <Link href="/wcag/1-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.2.5
                </Link>
                ) is the most often <em>skipped entirely</em>, because teams do
                not realise their video carries information only the eyes can
                reach. This guide spends most of its length on those two.
              </p>
            </div>
          </section>

          {/* 1. Decide what this media owes */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Decide What This Media Owes
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before you write a caption or record a description, work out which
                alternatives this specific piece of media actually needs. The
                obligations are not one-size-fits-all — they fall out of two
                questions, and answering them turns a vague &ldquo;make the video
                accessible&rdquo; into a concrete checklist.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Question 1: Prerecorded or live?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Prerecorded media can be captioned, transcribed, and
                      described in advance — so it owes the most. Live media can
                      only realistically be captioned in real time (1.2.4);
                      live audio description is not required at any level because
                      it is so hard to produce on the fly.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Question 2: Where is the information?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Information in the <strong>audio</strong> needs a text
                      equivalent (captions, transcript). Information in the{" "}
                      <strong>picture</strong> that is not spoken needs an audio
                      equivalent (audio description). Most videos carry some of
                      both — so most videos owe both.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Run those two questions against what kind of media you have, and
                the requirements are mechanical:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Which accessibility alternatives each type of media owes at
                    WCAG level A and AA
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Media type</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Example</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it owes (A / AA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Audio-only (prerecorded)
                      </th>
                      <td className="px-4 py-3 align-top">Podcast, audio interview</td>
                      <td className="px-4 py-3 align-top">A full text <strong>transcript</strong> (1.2.1). No captions and no description apply.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Video-only (prerecorded)
                      </th>
                      <td className="px-4 py-3 align-top">Silent animation, screen recording with no narration</td>
                      <td className="px-4 py-3 align-top">A <strong>transcript</strong> or an <strong>audio track</strong> describing it (1.2.1).</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Synchronized media (prerecorded)
                      </th>
                      <td className="px-4 py-3 align-top">A normal video with sound</td>
                      <td className="px-4 py-3 align-top"><strong>Captions</strong> (1.2.2) + <strong>audio description</strong> (1.2.3 at A, 1.2.5 at AA). A transcript is strongly recommended.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Live synchronized media
                      </th>
                      <td className="px-4 py-3 align-top">Live webinar, streamed talk</td>
                      <td className="px-4 py-3 align-top">Real-time <strong>captions</strong> (1.2.4 at AA). Live audio description is not required.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>The audio-description escape hatch — use it honestly.</strong>{" "}
                    If a video carries <em>no</em> essential information visually
                    that is not already in the soundtrack — a talking head who
                    says everything they show — then no audio description is
                    needed, and you have satisfied 1.2.3 and 1.2.5 with nothing to
                    add. The test is: close your eyes and listen. If you can still
                    follow everything that matters, you are done. Do not gold-plate
                    a description onto a video that does not need one — but be
                    ruthlessly honest about &ldquo;essential.&rdquo; On-screen text,
                    charts, and silent demonstrations almost always count.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Captions */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Captions className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Captions: More Than the Words
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Captions are the synchronized text of everything the soundtrack
                carries, shown in time with the video for someone who cannot hear
                it. The single most important thing to understand about captions
                is what separates them from subtitles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Subtitles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Assume you <strong>can</strong> hear, and translate the
                      dialogue into another language. Speech only. A same-language
                      subtitle file is <em>not</em> captions and does not satisfy
                      1.2.2.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Captions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Assume you <strong>cannot</strong> hear, and carry
                      everything the audio does: dialogue, who is speaking, and
                      meaningful non-speech sounds — <code>[phone rings]</code>,{" "}
                      <code>[ominous music]</code>. This is what WCAG requires.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Good captions are verbatim, synchronized to the audio, identify
                the speaker when it is not obvious on screen, and describe the
                sounds that carry meaning — a knock at the door the characters
                react to, the sarcasm in a tone, the music that sets the mood.
                They are also paced to be readable: broken into short lines that
                stay on screen long enough to read.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Closed vs open captions
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-slate-900 dark:text-white">Closed captions</strong>{" "}
                are a separate track the viewer can turn on and off — the modern
                default, delivered as a WebVTT file via the{" "}
                <code>&lt;track&gt;</code> element or through a hosting platform.{" "}
                <strong className="text-slate-900 dark:text-white">Open captions</strong>{" "}
                are burned permanently into the video pixels; they always show and
                cannot be styled or turned off, but they survive any player that
                lacks caption support. Prefer closed captions for the control they
                give the viewer; reach for open captions only when you cannot rely
                on the player to render a track.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                The caption file: WebVTT
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Closed captions are usually a WebVTT (<code>.vtt</code>) file — a
                plain-text list of time-stamped cues. It is readable and
                hand-editable, which is exactly how you fix an auto-generated
                draft.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`WEBVTT

00:00:01.000 --> 00:00:04.000
[upbeat music]

00:00:04.500 --> 00:00:08.000
<v Dana>Welcome back. Today we're fixing
the checkout flow.</v>

00:00:08.500 --> 00:00:11.000
[keyboard clicking]

00:00:11.500 --> 00:00:14.000
<v Dana>Notice the error appears here —
right under the field.</v>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The <code>&lt;v Speaker&gt;</code> voice tag identifies who is
                talking; square-bracket cues carry the non-speech sounds. This is
                the difference between a caption track and a subtitle track written
                out in a file.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Auto-captions are a draft, not compliance.</strong>{" "}
                    Automatic speech recognition mishears names and technical
                    terms, drops punctuation that changes meaning, never adds
                    speaker labels or sound descriptions, and often drifts out of
                    sync. WCAG 1.2.2 asks for captions that are accurate and
                    complete. Use the machine track to save typing, then review
                    every line, add the speaker IDs and the sounds, fix the
                    timing, and upload the corrected file. Live captions (
                    <Link href="/wcag/1-2-4" className="underline">
                      1.2.4
                    </Link>
                    ) usually need a human real-time captioner (CART) for the same
                    reason.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 3. Transcripts */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Transcripts: The Underrated Hero
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Captions get the attention, but the transcript is the alternative
                that serves the most people for the least effort — and for
                audio-only content it is the <em>requirement</em>, not an extra.
                A transcript is a single block of text on the page containing
                everything the media conveys, readable without pressing play.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Look at who a transcript reaches that a caption track does not:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Deafblind users</strong>{" "}
                  who cannot see captions or hear audio, and read the transcript
                  through a Braille display — the only channel that reaches them.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">People who cannot play media</strong>{" "}
                  — on a locked-down work network, a slow connection, or a quiet
                  room where sound is not an option.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Skimmers and searchers</strong>{" "}
                  who want to scan for one fact, quote a line, or Ctrl+F the
                  content rather than scrub through a timeline.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Search engines,</strong>{" "}
                  which cannot watch a video but happily index a transcript — so
                  the accessible choice is also the discoverable one.
                </li>
              </ul>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>The descriptive transcript is the one artifact that covers everything.</strong>{" "}
                    A plain transcript captures the words; a{" "}
                    <em>descriptive</em> transcript also writes out the essential
                    visual information — the on-screen chart, the demonstration,
                    the reaction. That single document serves as the transcript
                    (1.2.1), as the full text alternative that satisfies audio
                    description at level A (
                    <Link href="/wcag/1-2-3" className="underline">
                      1.2.3
                    </Link>
                    ), and as the media alternative at AAA (
                    <Link href="/wcag/1-2-8" className="underline">
                      1.2.8
                    </Link>
                    ). For a short explainer video, writing one good descriptive
                    transcript is often less work than producing a separate audio
                    description track.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Put the transcript on the page — visible, or one click away in a{" "}
                <code>&lt;details&gt;</code> disclosure right beside the player —
                not buried in a downloadable PDF or hosted off-site. It should
                carry speaker labels and, for a descriptive transcript, the visual
                notes clearly marked. The disclosure pattern is the same one the{" "}
                <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accordion &amp; disclosure guide
                </Link>{" "}
                covers if you want it collapsible.
              </p>
            </div>
          </section>

          {/* 4. Audio description */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AudioLines className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Audio Description: The Picture as Sound
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Audio description is the mirror image of captions. Where captions
                turn the sound into text for people who cannot hear, audio
                description turns the essential picture into sound for people who
                cannot see. It is a narration, slotted into the natural pauses
                between dialogue, that describes the visual information the
                soundtrack leaves out — a graph that appears, a facial reaction, a
                caption on screen that no one reads aloud, a click that is shown
                but not narrated.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The trigger for needing it is the test from §1, restated: is there
                information in the picture that is not in the audio? A cooking
                video where the host narrates every step needs little or none; the
                same video where they silently add an unnamed ingredient needs a
                description of what went in. On-screen text, data, and
                demonstrations are the usual culprits.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                1.2.3 at level A gives you a choice; 1.2.5 at AA takes it away
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the part teams miss.{" "}
                <Link href="/wcag/1-2-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.2.3 Audio Description <em>or</em> Media Alternative
                </Link>{" "}
                (level A) lets you satisfy the requirement <em>either</em> by
                adding audio description <em>or</em> by providing a full text
                alternative — a descriptive transcript — for the whole video. But{" "}
                <Link href="/wcag/1-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.2.5 Audio Description
                </Link>{" "}
                (level AA) removes the text-alternative escape:{" "}
                <strong className="text-slate-900 dark:text-white">
                  at AA, actual audio description is required
                </strong>
                . So if your target is AA — as most legal frameworks and
                procurement requirements demand — a descriptive transcript alone
                is not enough for a video with essential visuals; you owe a real
                described version.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Standard vs extended description
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Standard audio description fits inside the existing gaps between
                dialogue. Sometimes the gaps are too short to describe everything
                that matters — a fast, visually dense sequence. That is what{" "}
                <Link href="/wcag/1-2-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.2.7 Extended Audio Description
                </Link>{" "}
                (AAA) addresses: the video pauses to let a longer description play,
                then resumes. You rarely need extended description if you plan the
                content to leave room for it — which is the real lesson.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                How to deliver it in practice
              </h3>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Script it into the production.</strong>{" "}
                  The cheapest, most robust option: write the narration so the
                  presenter says what they show (&ldquo;I&apos;m clicking the blue
                  Save button in the top right&rdquo;). Now the main soundtrack{" "}
                  <em>is</em> the description and no extra track is needed.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Offer a described version.</strong>{" "}
                  Produce a second copy of the video with description mixed into
                  the audio, and let the user choose it — a separate source, a
                  toggle, or a second player.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Add a descriptions track — with eyes open.</strong>{" "}
                  A <code>&lt;track kind=&quot;descriptions&quot;&gt;</code> WebVTT
                  file is the standards-based route, but support for browsers and
                  screen readers actually speaking it is still unreliable, and
                  browsers will not pause the video for an over-long cue. Include
                  it, but do not rely on it as your only delivery — verify in real
                  assistive technology.
                </li>
              </ul>
            </div>
          </section>

          {/* 5. The player */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. The Player: Keyboard, Autoplay, and Controls
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Alternatives get the information out of the media; the player is
                how everyone <em>operates</em> it. The single best decision you
                can make here is to{" "}
                <strong className="text-slate-900 dark:text-white">
                  start with the native controls
                </strong>
                . A plain <code>&lt;video controls&gt;</code> gives you a
                play/pause button, a seek bar, volume, a captions menu, and
                fullscreen — all keyboard operable, all labelled, all maintained
                by the browser. You throw that away the moment you hide the native
                controls to build your own, and then you owe every piece of it
                back by hand.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                If you build a custom player, you owe all of this
              </h3>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Real buttons with accessible names.</strong>{" "}
                  Every control is a <code>&lt;button&gt;</code> with a text name —
                  an icon alone is not a name. &ldquo;Play&rdquo;, &ldquo;Mute&rdquo;,
                  &ldquo;Captions&rdquo;, &ldquo;Fullscreen&rdquo; (
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Full keyboard operation.</strong>{" "}
                  Every control is reachable by Tab and operable with
                  Enter/Space; the seek bar is a real slider with arrow-key
                  support. Nothing is mouse-only, and focus is never trapped (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Visible focus.</strong>{" "}
                  A clear focus indicator on each control, including over the video
                  where contrast is unpredictable — see the{" "}
                  <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                    focus management guide
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State exposed, not just drawn.</strong>{" "}
                  The play button announces whether it is playing or paused — swap
                  the accessible name (&ldquo;Play&rdquo; ↔ &ldquo;Pause&rdquo;) or
                  use <code>aria-pressed</code>; the mute and captions toggles do
                  the same. A colour or icon change alone is invisible to a screen
                  reader (
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ,{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">A captions toggle.</strong>{" "}
                  If you replace the native controls, you also replace the native
                  captions menu — so the player must offer its own way to turn
                  captions on and off.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                The keyboard mechanics — roving focus, a slider seek bar, managing
                focus as menus open — are the same disciplines covered in the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility
                </Link>{" "}
                and{" "}
                <Link href="/guides/accessible-slider" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible slider
                </Link>{" "}
                guides. A custom player is one of the most control-heavy widgets
                you can build, which is the best argument for keeping the native
                one.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Autoplay: the two rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-amber-200 dark:border-amber-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">1.4.2 Audio Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      If audio plays automatically for more than 3 seconds, the
                      user must be able to pause/stop it or control its volume
                      independently. Autoplaying sound with no off switch is a
                      failure — and it talks over screen readers.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 dark:border-amber-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">2.2.2 Pause, Stop, Hide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Auto-playing, moving content over 5 seconds — including a{" "}
                      <em>muted</em> looping background video — must be pausable,
                      stoppable, or hideable, because motion alone is a barrier for
                      some users.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The simplest way to pass both: don&apos;t autoplay. Start paused
                and let the user press play. If a decorative background video must
                autoplay, mute it and give it a visible, keyboard-reachable pause
                control. Respect{" "}
                <code>prefers-reduced-motion</code> and don&apos;t autoplay for
                users who have asked the system to reduce motion.
              </p>
            </div>
          </section>

          {/* 6. The video element in practice */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Film className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. The <code>&lt;video&gt;</code> Element in Practice
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is a self-hosted video wired up the accessible way: native
                controls, a caption track, a descriptions track, no autoplay, and
                a transcript one click away.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<figure>
  <video
    controls
    preload="metadata"
    poster="/thumbnails/checkout-fix.jpg"
    width="960"
    playsinline
  >
    <source src="/video/checkout-fix.mp4" type="video/mp4" />
    <source src="/video/checkout-fix.webm" type="video/webm" />

    <!-- Reviewed, corrected captions (dialogue + sounds + speaker IDs) -->
    <track
      kind="captions"
      src="/captions/checkout-fix.en.vtt"
      srclang="en"
      label="English"
      default
    />

    <!-- Audio description cues (support varies — verify in AT) -->
    <track
      kind="descriptions"
      src="/descriptions/checkout-fix.en.vtt"
      srclang="en"
      label="English descriptions"
    />

    <!-- Fallback for browsers with no video support -->
    <p>
      Your browser can't play this video.
      <a href="/video/checkout-fix.mp4">Download it</a> or read the
      <a href="#checkout-fix-transcript">transcript</a> below.
    </p>
  </video>

  <figcaption>Fixing the checkout error flow (4:12).</figcaption>
</figure>

<!-- The transcript lives on the page, one click away -->
<details id="checkout-fix-transcript">
  <summary>Read the transcript</summary>
  <!-- Descriptive transcript: dialogue + on-screen visuals -->
</details>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                A few details earn their place. <code>controls</code> hands you the
                accessible native player. <code>preload=&quot;metadata&quot;</code>{" "}
                and no <code>autoplay</code> keep the page quiet until the user
                acts. <code>poster</code> gives a still frame before play. The
                fallback content between the tags is a real text alternative for
                the rare browser that cannot play the video at all.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                The <code>&lt;track&gt;</code> kinds
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The kind values of the HTML track element and what each is for
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold"><code>kind</code></th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it carries</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>captions</code></th>
                      <td className="px-4 py-3 align-top">Dialogue + speaker IDs + non-speech sounds, same language.</td>
                      <td className="px-4 py-3 align-top">What 1.2.2 requires. For people who cannot hear.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>subtitles</code></th>
                      <td className="px-4 py-3 align-top">Dialogue translated to another language.</td>
                      <td className="px-4 py-3 align-top">Assumes the viewer can hear; not a substitute for captions.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>descriptions</code></th>
                      <td className="px-4 py-3 align-top">Text of the audio description, meant to be spoken by AT.</td>
                      <td className="px-4 py-3 align-top">Standards-based but unreliably supported — verify; don&apos;t rely on it alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>chapters</code></th>
                      <td className="px-4 py-3 align-top">Named sections for navigating the timeline.</td>
                      <td className="px-4 py-3 align-top">Helpful for orientation and long videos.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>metadata</code></th>
                      <td className="px-4 py-3 align-top">Data for scripts, not shown to users.</td>
                      <td className="px-4 py-3 align-top">Not an accessibility feature by itself.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Get the <code>kind</code> right — <code>captions</code>, not{" "}
                <code>subtitles</code>, for same-language text that includes the
                sounds — and set <code>label</code> and <code>srclang</code> so the
                player&apos;s menu names each track. The <code>default</code>{" "}
                attribute turns a track on by default; use it thoughtfully.
              </p>
            </div>
          </section>

          {/* 7. Embedded players */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Embedded Players: YouTube, Vimeo, and Friends
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most teams do not host their own video — they embed a YouTube or
                Vimeo <code>&lt;iframe&gt;</code>. You do not control the
                platform&apos;s player chrome, but{" "}
                <strong className="text-slate-900 dark:text-white">
                  you are still responsible for the alternatives
                </strong>
                . Three things are squarely on you.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Title the iframe.</strong>{" "}
                  Give the embedding <code>&lt;iframe&gt;</code> a descriptive{" "}
                  <code>title</code> — &ldquo;Video: fixing the checkout error
                  flow&rdquo; — so a screen reader user hears what the frame
                  contains instead of &ldquo;video player, frame&rdquo;.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Upload your own captions.</strong>{" "}
                  Do not trust the platform&apos;s automatic captions. Upload a
                  reviewed caption file to the video so the captions are accurate
                  and complete — the platform will happily serve your file instead
                  of the machine one.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Put the transcript on your page.</strong>{" "}
                  The platform will not add a transcript to <em>your</em> page, and
                  it is the alternative that serves the most people. Place a
                  descriptive transcript near the embed.
                </li>
              </ol>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<iframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="Video: fixing the checkout error flow"
  allow="fullscreen"
  loading="lazy"
></iframe>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Beyond that, the player&apos;s own keyboard support is out of your
                hands, so <strong className="text-slate-900 dark:text-white">test it</strong>:
                Tab into the embed and confirm play, volume, captions, and
                fullscreen are reachable and operable. If a platform&apos;s player
                is badly broken for keyboard or screen-reader users, the honest
                fallback is to self-host with a native{" "}
                <code>&lt;video&gt;</code> element you can fully control.
              </p>
            </div>
          </section>

          {/* 8. React */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Accessible Media in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In React the winning move is the same: render a native{" "}
                <code>&lt;video controls&gt;</code>, add the tracks, and pair it
                with a transcript disclosure generated from the same data — rather
                than rebuilding the player. Use <code>useId</code> to tie the
                figure and its transcript together without hard-coded ids.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function AccessibleVideo({ sources, captionsSrc, poster, caption, transcript }) {
  const id = useId()
  const transcriptId = id + "-transcript"

  return (
    <figure>
      <video controls preload="metadata" poster={poster} playsInline width={960}>
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}

        {/* Reviewed captions — never the platform's auto track */}
        <track
          kind="captions"
          src={captionsSrc}
          srcLang="en"
          label="English"
          default
        />

        <p>
          Your browser can't play this video.{" "}
          <a href={sources[0].src}>Download it</a> or read the{" "}
          <a href={"#" + transcriptId}>transcript</a>.
        </p>
      </video>

      <figcaption>{caption}</figcaption>

      <details id={transcriptId}>
        <summary>Read the transcript</summary>
        {/* Descriptive transcript: dialogue + on-screen visuals */}
        {transcript}
      </details>
    </figure>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two rules keep a React media component honest. First, do not
                mount the <code>controls</code>-less player and try to recreate the
                browser&apos;s work unless you truly must — and if you must, reach
                for a maintained accessible player (Vidstack, Plyr, or a wrapper
                around the native element) and still verify it. Second, keep the
                caption file and the transcript authored from the same reviewed
                source so they never disagree. The broader framework patterns are
                in the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React
                </Link>
                ,{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>
                , and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                accessibility guides.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test Accessible Media
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A scanner can tell you a <code>&lt;track&gt;</code> element exists;
                it cannot tell you whether the captions are accurate or whether a
                blind user could follow the video. These hands-on checks are what
                actually matter, and each takes only a couple of minutes.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Turn the sound off and watch.</strong>{" "}
                  Read only the captions. Do they carry the dialogue, tell you who
                  is speaking, and describe the meaningful sounds — or are they
                  just the words, out of sync, with obvious errors? (
                  <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.2
                  </Link>
                  )
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Close your eyes and listen.</strong>{" "}
                  Can you follow everything that matters from the soundtrack alone?
                  If a visual moment leaves you lost, that is a missing audio
                  description (
                  <Link href="/wcag/1-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.5
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Find the transcript.</strong>{" "}
                  Is there one, on the page, near the player — and for a
                  podcast or audio-only file, is it complete? (
                  <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.1
                  </Link>
                  )
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Put the mouse away.</strong>{" "}
                  Tab to the player and operate every control — play, pause, seek,
                  volume, captions, fullscreen — with the keyboard alone, with a
                  visible focus indicator throughout (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Run a screen reader over the controls.</strong>{" "}
                  Each control should announce a name and its state — &ldquo;Pause,
                  button&rdquo; when playing, &ldquo;Captions on&rdquo; when
                  enabled — not &ldquo;button&rdquo; with no label. Use the{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  or{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>{" "}
                  guides (
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Load the page and wait.</strong>{" "}
                  Confirm nothing autoplays with sound, and any auto-playing
                  motion can be paused (
                  <Link href="/wcag/1-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.2
                  </Link>
                  ,{" "}
                  <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.2
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer automated checks on top for the mechanical issues — a missing
                iframe title, an unlabelled control — see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>
                , and scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>
                . But the caption-quality and audio-description checks above are
                human judgement calls no tool can make for you.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Media Accessibility Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common video and audio accessibility anti-patterns, why they
                    fail, and the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Accessible Media Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Alternatives scoped.</strong>{" "}
                  You have decided what this media owes from its type
                  (prerecorded/live) and where its information lives (audio/picture).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Captions, done right.</strong>{" "}
                  Prerecorded video has accurate, synchronized captions with
                  speaker IDs and non-speech sounds — not raw auto-captions, not
                  same-language subtitles (
                  <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Transcript on the page.</strong>{" "}
                  A text transcript is available near the media; audio-only content
                  has one as its primary alternative (
                  <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Audio description where needed.</strong>{" "}
                  Video with essential on-screen-only information has audio
                  description; at AA that means a real described version, not just
                  a text alternative (
                  <Link href="/wcag/1-2-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.5
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Live media captioned.</strong>{" "}
                  Live audio in synchronized media has real-time captions, planned
                  before the event (
                  <Link href="/wcag/1-2-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.2.4
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keyboard-operable player.</strong>{" "}
                  Every control works by keyboard with visible focus; custom
                  controls expose a name and state (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ,{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No hostile autoplay.</strong>{" "}
                  Nothing autoplays with sound; any auto-playing motion over five
                  seconds can be paused (
                  <Link href="/wcag/1-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.2
                  </Link>
                  ,{" "}
                  <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Embeds titled and tested.</strong>{" "}
                  Any <code>&lt;iframe&gt;</code> has a descriptive title, uses your
                  own reviewed captions, and its keyboard support has been checked.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see media alongside every other requirement, and the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>{" "}
                for the player controls in depth.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Media on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch an
                  untitled video iframe, an unlabelled player control, or a{" "}
                  <code>&lt;video&gt;</code> with no caption track — then run the
                  sound-off and eyes-closed tests above for the things no scanner
                  can judge.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/wcag/1-2-2">
                      WCAG 1.2.2 Captions
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible video player accessible media video accessibility captions vs subtitles closed captions open captions webvtt track element html5 video accessibility audio description descriptive transcript video transcript accessibility live captions cart accessible audio player podcast transcript autoplay accessibility keyboard accessible video controls youtube video accessibility vimeo accessibility iframe title media accessibility wcag 1.2.1 1.2.2 1.2.3 1.2.4 1.2.5 1.4.2 2.1.1 2.2.2 4.1.2 time-based media react accessible video keyboard accessibility focus management"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-video-player"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
