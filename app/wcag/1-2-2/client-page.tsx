"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Volume2,
  VolumeX,
  Play,
  Pause,
  FileText,
  Eye,
  Info,
  Lightbulb,
  TestTube,
  Copy,
  Clock,
  Headphones,
  Mic,
  Subtitles,
  Users,
  PlayCircle,
  BookOpen,
  ListChecks,
  Heart,
  Brain,
  Accessibility,
  Monitor,
  Target,
  Smartphone,
  Languages,
  Settings,
  Upload,
  Timer,
  Captions,
  Film
} from "lucide-react"

interface UserGroup {
  name: string
  description: string
  impact: string
  assistiveTech: string[]
  icon: React.ComponentType<{ className?: string }>
}

interface ProcedureStep {
  step: number
  title: string
  description: string
  details: string[]
}

interface CaptionExample {
  type: 'good' | 'bad'
  title: string
  description: string
  videoDescription: string
  captionSample: string[]
  problems?: string[]
  benefits?: string[]
}

export default function WCAG122ClientPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [captionText, setCaptionText] = useState("")
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const mockCaptions = [
    { start: 0, end: 3, text: "Welcome to our accessibility workshop." },
    { start: 3, end: 6, text: "[Speaker]: Today we'll learn about video captions." },
    { start: 6, end: 9, text: "[Background music starts] Captions help deaf and hard of hearing users." },
    { start: 9, end: 12, text: "They also benefit users in noisy environments." },
    { start: 12, end: 15, text: "[Applause] Let's see how to implement them properly." }
  ]

  const getCurrentCaption = () => {
    return mockCaptions.find(caption => 
      currentTime >= caption.start && currentTime < caption.end
    )?.text || ""
  }

  const playAudio = (text: string, demoId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setActiveDemo(demoId)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.onend = () => setActiveDemo(null)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Define affected user groups
  const affectedUserGroups: UserGroup[] = [
    {
      name: "Deaf and Hard of Hearing Users",
      description: "Users who cannot hear or have difficulty hearing video audio",
      impact: "Cannot access spoken content, dialogue, or important audio information in videos",
      assistiveTech: ["Screen readers", "Captioning devices", "Hearing aids", "Cochlear implants"],
      icon: Headphones
    },
    {
      name: "Users in Noisy Environments",
      description: "Users in libraries, offices, public transport, or loud spaces",
      impact: "Cannot play audio or hear video content clearly due to environmental noise",
      assistiveTech: ["Headphones", "Noise-canceling devices", "Silent mode"],
      icon: Volume2
    },
    {
      name: "Users with Audio Processing Disorders",
      description: "Users who have difficulty processing auditory information",
      impact: "May struggle to understand speech or distinguish voices without visual text support",
      assistiveTech: ["Text-to-speech software", "Audio processing apps", "Visual learning tools"],
      icon: Brain
    },
    {
      name: "Non-Native Language Speakers",
      description: "Users learning the language or with limited language proficiency",
      impact: "Written captions can help understand spoken language and learn pronunciation",
      assistiveTech: ["Translation software", "Language learning tools", "Dictionary apps"],
      icon: Languages
    },
    {
      name: "Users with Limited Bandwidth",
      description: "Users on slow internet connections who may mute videos",
      impact: "May disable audio to save bandwidth but still need access to information",
      assistiveTech: ["Data compression tools", "Mobile browsers", "Offline reading apps"],
      icon: Smartphone
    },
    {
      name: "Users with Attention Disorders",
      description: "Users with ADHD or other attention-related challenges",
      impact: "Visual text can help maintain focus and comprehension alongside audio",
      assistiveTech: ["Focus apps", "Multi-modal learning tools", "Reading assistance software"],
      icon: Eye
    }
  ]

  // Implementation procedure steps
  const procedureSteps: ProcedureStep[] = [
    {
      step: 1,
      title: "Identify Video Content Requiring Captions",
      description: "Audit all prerecorded videos on your website that contain audio content",
      details: [
        "Scan for <video> tags with audio tracks",
        "Check embedded videos from YouTube, Vimeo, etc.",
        "Identify training videos, presentations, and tutorials",
        "Review marketing videos, testimonials, and product demos",
        "Note: Live videos have different requirements (WCAG 1.2.4)",
        "Exclude purely decorative videos without meaningful audio"
      ]
    },
    {
      step: 2,
      title: "Create Accurate Caption Scripts",
      description: "Transcribe all spoken content and identify important audio elements",
      details: [
        "Include every word spoken by every speaker",
        "Add speaker identification when multiple people talk",
        "Describe important sound effects ([applause], [phone rings], [door slams])",
        "Note background music and its emotional context",
        "Include non-speech vocalizations (sighs, laughter, gasps)",
        "Ensure accuracy - review and proofread carefully"
      ]
    },
    {
      step: 3,
      title: "Time and Synchronize Captions",
      description: "Create properly timed caption files that sync with video playback",
      details: [
        "Use WebVTT (.vtt) format for web videos",
        "Ensure captions appear exactly when words are spoken",
        "Keep caption segments to 2-3 lines maximum",
        "Limit display time to 1-6 seconds per caption",
        "Break at natural pause points in speech",
        "Test synchronization across different playback speeds"
      ]
    },
    {
      step: 4,
      title: "Format Captions for Readability",
      description: "Apply proper formatting, styling, and presentation guidelines",
      details: [
        "Use clear, readable fonts (Arial, Helvetica, or similar)",
        "Ensure high contrast (white text on black/dark background)",
        "Position captions at bottom of video, centered",
        "Use appropriate font size (at least 22px for web)",
        "Apply consistent styling for speakers and sound effects",
        "Consider multiple language tracks if needed"
      ]
    },
    {
      step: 5,
      title: "Implement Caption Tracks",
      description: "Add caption files to video players using proper HTML markup",
      details: [
        "Use <track> element with kind='captions' attribute",
        "Specify language with srclang attribute",
        "Set default caption track with default attribute",
        "Provide multiple language options when applicable",
        "Ensure caption controls are keyboard accessible",
        "Test with different video players and browsers"
      ]
    },
    {
      step: 6,
      title: "Test Caption Quality and Accessibility",
      description: "Verify that captions provide complete and accurate information",
      details: [
        "Watch videos with audio muted, captions only",
        "Test with screen readers and assistive technologies",
        "Check caption timing and synchronization",
        "Verify all important audio is included in captions",
        "Test caption controls with keyboard navigation",
        "Get feedback from deaf and hard of hearing users"
      ]
    },
    {
      step: 7,
      title: "Maintain and Update Captions",
      description: "Keep captions current and accurate as video content changes",
      details: [
        "Update captions when video content is edited",
        "Review caption quality during content audits",
        "Train video creators on caption requirements",
        "Implement automated caption review processes",
        "Monitor user feedback about caption quality",
        "Consider using AI tools with human review for scaling"
      ]
    }
  ]

  const captionExamples: CaptionExample[] = [
    {
      type: 'good',
      title: 'Educational Video with Complete Captions',
      description: 'A tutorial video with proper speaker identification and sound descriptions',
      videoDescription: '5-minute accessibility training video with one instructor and background music intro...',
      captionSample: [
        "0:00 - 0:03: Welcome to Web Accessibility 101.",
        "0:03 - 0:06: [Dr. Smith]: I'm Dr. Smith, and I'll be your instructor today.",
        "0:06 - 0:09: [Upbeat background music starts]",
        "0:09 - 0:12: We'll learn how to make websites accessible to everyone.",
        "0:12 - 0:15: [Music fades out] Let's start with the basics."
      ],
      benefits: [
        "Includes speaker identification for clarity",
        "Describes background music and sound effects",
        "Proper timing ensures synchronization",
        "Clear formatting makes text easy to read"
      ]
    },
    {
      type: 'bad',
      title: 'Marketing Video Without Captions',
      description: 'A promotional video that lacks any caption support',
      videoDescription: '2-minute product demo with music and multiple speakers',
      captionSample: [
        "No caption track available",
        "Audio-only content cannot be accessed by deaf users"
      ],
      problems: [
        "Completely inaccessible to deaf and hard of hearing users",
        "Violates WCAG 2.1 Level A requirements",
        "Excludes users in quiet environments",
        "Missing potential SEO benefits from caption text"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-orange-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Navigation */}
        <Button asChild variant="ghost" className="mb-8 hover:bg-orange-100 dark:hover:bg-orange-900/20">
          <Link href="/wcag">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Success Criteria
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl shadow-lg">
              <Subtitles className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                1.2.2 Captions (Prerecorded)
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Level A
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-800 dark:border-orange-700 dark:text-orange-300">
                  Principle 1: Perceivable
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Success Criterion Statement */}
        <Card className="mb-12 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Info className="h-6 w-6 text-orange-600" />
              Success Criterion Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border-l-4 border-orange-500">
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                Captions are provided for all prerecorded audio content in synchronized media, 
                except when the media is a media alternative for text and is clearly labeled as such.
              </p>
              <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded border">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Key Requirements:</h4>
                <ul className="text-slate-700 dark:text-slate-300 space-y-1">
                  <li>• <strong>All prerecorded video</strong> with audio must have captions</li>
                  <li>• <strong>Synchronized captions</strong> that match the timing of audio</li>
                  <li>• <strong>Complete audio information</strong> including dialogue and sound effects</li>
                  <li>• <strong>Accessible caption controls</strong> for users to enable/disable</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What This Means */}
        <Card className="mb-12 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              What This Means
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Every video with audio content on your website must include synchronized captions that provide 
              equivalent access to all audio information. Captions are not just subtitles - they include 
              dialogue, sound effects, music, and other important audio cues.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-2">
                  <Subtitles className="h-5 w-5" />
                  What Captions Must Include
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">Spoken Dialogue:</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Every word spoken by every person in the video
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Sound Effects:</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      [applause], [phone rings], [door closes], [laughter]
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Speaker Identification:</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Who is speaking when multiple people are present
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="font-medium text-purple-800 dark:text-purple-300 mb-1">Music & Atmosphere:</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      [upbeat music], [tense atmosphere], [music fades out]
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Caption Quality Standards
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-300 mb-1">Accurate Timing:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Captions appear exactly when words are spoken
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                    <p className="font-medium text-indigo-800 dark:text-indigo-300 mb-1">Readable Format:</p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Clear fonts, high contrast, appropriate size
                    </p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                    <p className="font-medium text-teal-800 dark:text-teal-300 mb-1">Complete Information:</p>
                    <p className="text-sm text-teal-700 dark:text-teal-300">
                      No important audio information is missing
                    </p>
                  </div>
                  <div className="p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                    <p className="font-medium text-pink-800 dark:text-pink-300 mb-1">User Control:</p>
                    <p className="text-sm text-pink-700 dark:text-pink-300">
                      Users can turn captions on/off as needed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <strong>Captions vs Subtitles:</strong> Captions include all audio information (dialogue, sound effects, music) 
                for deaf/hard of hearing users. Subtitles typically only include dialogue for language translation.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Why It's Important */}
        <Card className="mb-12 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Heart className="h-6 w-6 text-purple-600" />
              Why It's Important
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Accessibility className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">
                    Equal Access
                  </h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Ensures deaf and hard of hearing users can fully participate in video content, 
                  breaking down communication barriers and promoting inclusion.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-800 dark:text-orange-300">
                    Broader Audience
                  </h3>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Benefits users in noisy environments, non-native speakers, and those who 
                  prefer reading along with audio for better comprehension.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                    SEO & Searchability
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Caption text is indexed by search engines, improving discoverability 
                  and making video content searchable by keywords.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Is Affected */}
        <Card className="mb-12 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Users className="h-6 w-6 text-indigo-600" />
              Who Is Affected?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              When videos lack proper captions, it creates significant barriers for various user groups:
            </p>
            
            <div className="space-y-6">
              {affectedUserGroups.map((group, index) => (
                <Card key={index} className="border-l-4 border-indigo-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                        <group.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                          {group.name}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-3">
                          {group.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              Impact Without Captions:
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {group.impact}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              Common Assistive Technologies:
                            </h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400">
                              {group.assistiveTech.map((tech, techIndex) => (
                                <li key={techIndex}>• {tech}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Procedure */}
        <Card className="mb-12 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ListChecks className="h-6 w-6 text-green-600" />
              Implementation Procedure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              Follow these steps to ensure all prerecorded videos have proper captions:
            </p>
            
            <div className="space-y-6">
              {procedureSteps.map((step, index) => (
                <Card key={index} className="border-l-4 border-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 text-lg">
                          {step.title}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                          {step.description}
                        </p>
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                            Implementation Details:
                          </h4>
                          <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex}>• {detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Examples */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Interactive Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              Experience how video captions work and see the difference they make:
            </p>

            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setShowCaptions(!showCaptions)}
                variant={showCaptions ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {showCaptions ? <Subtitles className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {showCaptions ? "Hide Captions" : "Show Captions"}
              </Button>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Toggle to simulate deaf/hard of hearing user experience
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Video Caption Examples */}
        <div className="space-y-8">
          {/* Good Example */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
                ✅ Good Example: Video with Complete Captions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  
                  {/* Mock Video Player */}
                  <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center text-white">
                        <PlayCircle className="h-20 w-20 mx-auto mb-3 opacity-75" />
                        <p className="text-sm opacity-75">Accessibility Workshop Video</p>
                        <p className="text-xs opacity-50">With Complete Captions</p>
                      </div>
                    </div>
                    
                    {/* Caption Overlay */}
                    {showCaptions && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-90 text-white p-3 rounded border border-white/20">
                        <p className="text-center font-medium">
                          {getCurrentCaption() || "Welcome to our accessibility workshop."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="flex flex-col items-start gap-4 p-3 rounded md:!flex-row md:items-center md:justify-between bg-slate-100 dark:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isPlaying ? "default" : "outline"}
                        onClick={() => {
                          setIsPlaying(!isPlaying)
                          if (!isPlaying) {
                            const timer = setInterval(() => {
                              setCurrentTime(prev => {
                                const newTime = prev + 1
                                if (newTime >= 15) {
                                  setIsPlaying(false)
                                  clearInterval(timer)
                                  return 0
                                }
                                return newTime
                              })
                            }, 1000)
                          }
                        }}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 0:15
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playAudio(
                          getCurrentCaption() || "Screen reader reading caption: Welcome to our accessibility workshop.",
                          "caption-reader"
                        )}
                        disabled={activeDemo === "caption-reader"}
                        className="p-2 whitespace-normal h-auto text-left break-words"
                      >
                        <Volume2 className="h-4 w-4 mr-1 shrink-0" />
                        <span className="flex-1">{activeDemo === "caption-reader" ? "Reading..." : "Read Caption"}</span>
                      </Button>
                    </div>
                  </div>

                  {showCaptions && (
                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-4 rounded">
                      <h5 className="font-semibold mb-2">Complete Caption Track:</h5>
                      <div className="text-sm space-y-1 bg-white dark:bg-slate-800 p-3 rounded border max-h-32 overflow-y-auto">
                        {mockCaptions.map((caption, index) => (
                          <p key={index} className={currentTime >= caption.start && currentTime < caption.end ? "text-blue-600 font-medium" : "text-slate-600 dark:text-slate-400"}>
                            {Math.floor(caption.start / 60)}:{(caption.start % 60).toString().padStart(2, '0')} - {Math.floor(caption.end / 60)}:{(caption.end % 60).toString().padStart(2, '0')}: {caption.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      Why This Works:
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Captions are synchronized with audio timing</li>
                      <li>• Includes speaker identification ([Speaker]:)</li>
                      <li>• Describes important sound effects ([Background music starts], [Applause])</li>
                      <li>• Clear, readable formatting with high contrast</li>
                      <li>• User can control caption visibility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bad Example */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <XCircle className="h-6 w-6 text-red-600" />
                ❌ Bad Example: Video Without Captions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  
                  {/* Mock Video Player without captions */}
                  <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center text-white">
                        <VolumeX className="h-20 w-20 mx-auto mb-3 opacity-75" />
                        <p className="text-sm opacity-75">Product Demo Video</p>
                        <p className="text-xs opacity-50">No Caption Support</p>
                      </div>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="flex flex-col items-start gap-4 p-3 rounded md:!flex-row md:items-center md:justify-between bg-slate-100 dark:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">0:00 / 2:30</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" disabled className="p-2 whitespace-normal h-auto text-left break-words">
                        <Subtitles className="h-4 w-4 mr-1 shrink-0" />
                        <span className="flex-1">No Captions Available</span>
                      </Button>
                    </div>
                  </div>

                  {showCaptions && (
                    <div className="mt-4 bg-red-100 dark:bg-red-950/30 p-4 rounded border border-red-300 dark:border-red-600">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-300">No Caption Information Available</span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Deaf and hard of hearing users cannot access any of the spoken content in this video.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-300 dark:border-red-600">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                      Problems with This Approach:
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Completely excludes deaf and hard of hearing users</li>
                      <li>• Users in quiet environments cannot access content</li>
                      <li>• Violates WCAG 2.1 Level A requirements</li>
                      <li>• Missing SEO benefits from searchable caption text</li>
                      <li>• Potential legal compliance issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Caption Generator */}
        <Card className="mt-8 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Settings className="h-6 w-6 text-indigo-600" />
              Practice Creating Captions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Describe your video content:
                  </label>
                  <Textarea 
                    placeholder="Example: 3-minute tutorial showing how to use screen reader navigation, with one instructor and background music intro..."
                    className="h-24 mb-4"
                  />
                  <div className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Video file would be uploaded here</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Create your captions:
                  </label>
                  <Textarea 
                    placeholder="0:00 - 0:03: Welcome to our tutorial.
0:03 - 0:06: [Instructor]: Today we'll learn navigation.
0:06 - 0:09: [Background music starts]
0:09 - 0:12: First, let's open the screen reader..."
                    className="h-40 mb-4"
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                  />
                  <div className="mb-4">
                    {captionText.length === 0 ? (
                      <span className="text-red-600 text-sm">⚠️ Captions are required for video content</span>
                    ) : !captionText.includes(':') || !captionText.includes('-') ? (
                      <span className="text-orange-600 text-sm">⏱️ Consider adding timestamps (0:00 - 0:03)</span>
                    ) : !captionText.includes('[') || !captionText.includes(']') ? (
                      <span className="text-blue-600 text-sm">🔊 Consider adding sound effects [music], [applause]</span>
                    ) : captionText.split('\n').length < 3 ? (
                      <span className="text-orange-600 text-sm">📝 Consider breaking into shorter caption segments</span>
                    ) : (
                      <span className="text-green-600 text-sm">✅ Great captions! Include timing, speakers, and sounds</span>
                    )}
                  </div>
                  <Button 
                    onClick={() => {
                      if (captionText && 'speechSynthesis' in window) {
                        const cleanText = captionText.replace(/\d+:\d+\s*-\s*\d+:\d+:\s*/g, '').replace(/\[.*?\]/g, '')
                        playAudio(`Screen reader reading captions: ${cleanText}`, "caption-test")
                      }
                    }}
                    className="w-full"
                    disabled={!captionText || activeDemo === "caption-test"}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {activeDemo === "caption-test" ? "Testing..." : "Test with Screen Reader"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 