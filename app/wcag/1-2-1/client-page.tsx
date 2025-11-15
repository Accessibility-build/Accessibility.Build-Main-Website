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
  FileText,
  Eye,
  Info,
  Lightbulb,
  TestTube,
  Copy,
  Clock,
  Headphones,
  Mic,
  Users,
  BookOpen,
  ListChecks,
  Heart,
  Brain,
  Accessibility,
  Monitor,
  Target,
  Smartphone,
  HelpCircle,
  Languages,
  Subtitles,
  Settings
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

interface MediaExample {
  type: 'audio' | 'video'
  title: string
  hasTranscript: boolean
  transcriptQuality: 'good' | 'bad' | 'none'
  explanation: string
  example: string
}

export default function WCAG121ClientPage() {
  const [activeAudio, setActiveAudio] = useState<string | null>(null)
  const [transcriptText, setTranscriptText] = useState("")
  const [showTranscript, setShowTranscript] = useState(false)

  const playAudio = (text: string, audioId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setActiveAudio(audioId)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.onend = () => setActiveAudio(null)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Define affected user groups
  const affectedUserGroups: UserGroup[] = [
    {
      name: "Deaf and Hard of Hearing Users",
      description: "Users who cannot hear or have difficulty hearing audio content",
      impact: "Cannot access information in audio-only content without transcripts",
      assistiveTech: ["Screen readers", "Captioning devices", "Hearing aids", "Cochlear implants"],
      icon: Headphones
    },
    {
      name: "Blind and Low Vision Users",
      description: "Users who cannot see or have difficulty seeing video-only content",
      impact: "Cannot access visual information in video-only content without text descriptions",
      assistiveTech: ["Screen readers", "Braille displays", "Voice assistants"],
      icon: Eye
    },
    {
      name: "Users with Cognitive Disabilities",
      description: "Users who may have difficulty processing audio or visual information",
      impact: "May need text alternatives to better understand and process media content",
      assistiveTech: ["Text-to-speech software", "Reading comprehension tools", "Translation tools"],
      icon: Brain
    },
    {
      name: "Users in Noisy Environments",
      description: "Users who cannot play audio due to environmental constraints",
      impact: "Cannot hear audio content in libraries, offices, or public spaces",
      assistiveTech: ["Headphones", "Noise-canceling devices", "Mobile devices"],
      icon: Volume2
    },
    {
      name: "Users with Limited Bandwidth",
      description: "Users on slow internet connections who may disable media",
      impact: "May turn off audio/video to save bandwidth, missing important content",
      assistiveTech: ["Text-only browsers", "Data compression tools", "Mobile browsers"],
      icon: Smartphone
    },
    {
      name: "Non-Native Language Speakers",
      description: "Users who may understand written text better than spoken audio",
      impact: "May need transcripts to better comprehend content in non-native language",
      assistiveTech: ["Translation software", "Language learning tools", "Dictionary apps"],
      icon: Languages
    }
  ]

  // Implementation procedure steps
  const procedureSteps: ProcedureStep[] = [
    {
      step: 1,
      title: "Identify Audio-only and Video-only Content",
      description: "Audit your website to find all prerecorded audio-only and video-only media",
      details: [
        "Scan for <audio> tags and audio files (MP3, WAV, OGG)",
        "Look for <video> tags with silent content",
        "Check for embedded audio players and podcasts",
        "Identify animations, time-lapse videos, and visual demonstrations",
        "Review educational content, tutorials, and presentations",
        "Note: This applies only to prerecorded content, not live media"
      ]
    },
    {
      step: 2,
      title: "Determine Content Type and Requirements",
      description: "Classify each media file to understand what alternative is needed",
      details: [
        "Audio-only content: Podcasts, interviews, music, announcements",
        "Video-only content: Silent animations, visual processes, time-lapse",
        "Check if content is decorative or informational",
        "Identify essential information that must be conveyed",
        "Consider the context and purpose of the media"
      ]
    },
    {
      step: 3,
      title: "Create Transcripts for Audio-only Content",
      description: "Provide complete text transcripts that include all spoken content and important sounds",
      details: [
        "Include all spoken words verbatim",
        "Add speaker identification ([Host], [Guest], etc.)",
        "Describe important non-speech sounds ([music], [applause], [phone rings])",
        "Include timestamps for longer content",
        "Ensure transcript is easily findable and accessible",
        "Use proper formatting and structure"
      ]
    },
    {
      step: 4,
      title: "Create Text Alternatives for Video-only Content",
      description: "Provide text descriptions or audio tracks that convey the same information",
      details: [
        "Describe all visual elements that convey information",
        "Include action sequences and visual changes",
        "Explain relationships between visual elements",
        "Provide context for animations and demonstrations",
        "Consider creating an audio description track as alternative",
        "Ensure description follows logical sequence"
      ]
    },
    {
      step: 5,
      title: "Implement and Structure Alternatives",
      description: "Properly integrate transcripts and descriptions into your web pages",
      details: [
        "Place transcripts immediately after or near audio content",
        "Use proper HTML structure with headings and paragraphs",
        "Make transcripts collapsible if they are very long",
        "Ensure alternatives are keyboard accessible",
        "Use semantic markup for speaker identification",
        "Provide download links for offline access"
      ]
    },
    {
      step: 6,
      title: "Test and Validate",
      description: "Verify that alternatives provide equivalent information access",
      details: [
        "Test with screen readers and assistive technologies",
        "Verify transcripts include all important information",
        "Check that text alternatives convey the same meaning",
        "Test with users who have disabilities",
        "Validate HTML markup and accessibility structure",
        "Ensure alternatives work across different devices"
      ]
    },
    {
      step: 7,
      title: "Maintain and Update",
      description: "Keep transcripts and alternatives current as content changes",
      details: [
        "Update transcripts when audio content is edited",
        "Revise descriptions if video content changes",
        "Implement quality control processes",
        "Train content creators on accessibility requirements",
        "Regular audits to ensure continued compliance",
        "Monitor user feedback and accessibility issues"
      ]
    }
  ]

  const mediaExamples: MediaExample[] = [
    {
      type: 'audio',
      title: 'Podcast Episode with Full Transcript',
      hasTranscript: true,
      transcriptQuality: 'good',
      explanation: 'Complete transcript with speaker identification and sound descriptions',
      example: '[Host]: Welcome to Web Accessibility Today. I\'m Sarah Johnson.\n[Guest]: And I\'m Mike Chen from the A11y Initiative.\n[Host]: Today we\'re discussing WCAG 2.1 requirements.\n[Background music fades in for 3 seconds]\n[Host]: Let\'s start with the basics...'
    },
    {
      type: 'audio',
      title: 'Audio Announcement Without Transcript',
      hasTranscript: false,
      transcriptQuality: 'none',
      explanation: 'Missing transcript makes content inaccessible to deaf users',
      example: 'Important company announcement about new policies - no transcript provided'
    },
    {
      type: 'video',
      title: 'Silent Animation with Detailed Description',
      hasTranscript: true,
      transcriptQuality: 'good',
      explanation: 'Text description explains all visual elements and actions',
      example: 'Animation showing website navigation: User clicks menu button in top-right corner. Menu slides down revealing three options: Home, About, Contact. User hovers over About, highlighting it in blue. User clicks About, page transitions to about page with fade effect.'
    },
    {
      type: 'video',
      title: 'Time-lapse Video with Vague Description',
      hasTranscript: true,
      transcriptQuality: 'bad',
      explanation: 'Description is too vague and doesn\'t convey specific information',
      example: 'Video shows a process happening over time'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Navigation */}
        <Button asChild variant="ghost" className="mb-8 hover:bg-purple-100 dark:hover:bg-purple-900/20">
          <Link href="/wcag">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Success Criteria
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <Volume2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                1.2.1 Audio-only and Video-only (Prerecorded)
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Level A
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-800 dark:border-purple-700 dark:text-purple-300">
                  Principle 1: Perceivable
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Success Criterion Statement */}
        <Card className="mb-12 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Info className="h-6 w-6 text-purple-600" />
              Success Criterion Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg border-l-4 border-purple-500">
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                For prerecorded audio-only and prerecorded video-only media, the following are true, 
                except when the audio or video is a media alternative for text and is clearly labeled as such:
              </p>
              <ul className="mt-4 space-y-2 text-slate-700 dark:text-slate-300">
                <li>• <strong>Prerecorded Audio-only:</strong> An alternative for time-based media is provided that presents equivalent information for prerecorded audio-only content.</li>
                <li>• <strong>Prerecorded Video-only:</strong> Either an alternative for time-based media or an audio track is provided that presents equivalent information for prerecorded video-only content.</li>
              </ul>
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
              When you have prerecorded media that contains only audio or only video, you must provide an alternative 
              way for users to access the same information. This ensures that users who cannot hear audio or see video 
              can still understand the content.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Audio-only Content
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="font-medium text-purple-800 dark:text-purple-300 mb-1">Examples:</p>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• Podcasts and interviews</li>
                      <li>• Audio recordings and lectures</li>
                      <li>• Music with important lyrics</li>
                      <li>• Audio announcements</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-300 mb-1">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Provide complete transcripts with speaker identification and important sound descriptions
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Video-only Content
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Examples:</p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Silent animations and demonstrations</li>
                      <li>• Time-lapse videos</li>
                      <li>• Visual art and processes</li>
                      <li>• Charts and graphs in motion</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-300 mb-1">Solution:</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Provide text descriptions or audio tracks that explain all visual information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why It's Important */}
        <Card className="mb-12 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Heart className="h-6 w-6 text-orange-600" />
              Why It's Important
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Accessibility className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-800 dark:text-orange-300">
                    Inclusive Access
                  </h3>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Ensures that users with hearing or vision impairments can access the same information 
                  as other users, promoting equal access to digital content.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">
                    Legal Compliance
                  </h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Meets legal requirements in many jurisdictions for digital accessibility, 
                  helping organizations avoid discrimination and legal issues.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                    Better User Experience
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Improves experience for all users, including those in quiet environments, 
                  non-native speakers, and users with slow connections.
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
              When audio-only or video-only content lacks proper alternatives, it creates significant barriers for various user groups:
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
                              Impact Without Alternatives:
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
              Follow these steps to ensure all prerecorded audio-only and video-only content has appropriate alternatives:
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
              Experience how audio-only and video-only content works with and without proper alternatives:
            </p>

            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setShowTranscript(!showTranscript)}
                variant={showTranscript ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {showTranscript ? <Subtitles className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {showTranscript ? "Hide Transcripts" : "Show Transcripts"}
              </Button>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Toggle to simulate deaf/hard of hearing user experience
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Examples */}
        <Card className="mb-8 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Headphones className="h-6 w-6 text-purple-600" />
              Audio-only Content Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Good Audio Example */}
              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  ✅ Good Example: Podcast with Complete Transcript
                </h4>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Web Accessibility Podcast - Episode 5</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => playAudio(
                        "Host: Welcome to Web Accessibility Today. I'm Sarah Johnson. Guest: And I'm Mike Chen from the A11y Initiative. Host: Today we're discussing WCAG 2.1 requirements for media content.",
                        "good-audio"
                      )}
                      disabled={activeAudio === "good-audio"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {activeAudio === "good-audio" ? "Playing..." : "Play Sample"}
                    </Button>
                  </div>
                  
                  {showTranscript && (
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">📜 Complete Transcript</h5>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playAudio(
                            "Screen reader reading transcript: Host: Welcome to Web Accessibility Today. I'm Sarah Johnson. Guest: And I'm Mike Chen from the A11y Initiative. Host: Today we're discussing WCAG 2.1 requirements for media content. Background music fades in for 3 seconds then fades out.",
                            "transcript-reader"
                          )}
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          Read Aloud
                        </Button>
                      </div>
                      <div className="text-sm space-y-2 bg-white dark:bg-slate-800 p-3 rounded border">
                        <p><strong>[Host]:</strong> Welcome to Web Accessibility Today. I'm Sarah Johnson.</p>
                        <p><strong>[Guest]:</strong> And I'm Mike Chen from the A11y Initiative.</p>
                        <p><strong>[Host]:</strong> Today we're discussing WCAG 2.1 requirements for media content.</p>
                        <p><em>[Background music fades in for 3 seconds, then fades out]</em></p>
                        <p><strong>[Host]:</strong> Mike, can you tell us about the key principles?</p>
                        <p><strong>[Guest]:</strong> Absolutely. The most important thing is...</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      Why This Works:
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Includes complete transcript with speaker identification</li>
                      <li>• Describes important background sounds and music</li>
                      <li>• Transcript is properly formatted and easy to read</li>
                      <li>• Accessible to screen readers and other assistive technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bad Audio Example */}
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  ❌ Bad Example: Audio Without Transcript
                </h4>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Important Company Policy Update</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => playAudio(
                        "This is an important announcement about our new remote work policy that affects all employees. Please listen carefully to understand the new requirements and deadlines.",
                        "bad-audio"
                      )}
                      disabled={activeAudio === "bad-audio"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {activeAudio === "bad-audio" ? "Playing..." : "Play Audio"}
                    </Button>
                  </div>
                  
                  {showTranscript && (
                    <div className="bg-red-100 dark:bg-red-950/30 p-4 rounded border border-red-300 dark:border-red-600">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-300">No Transcript Available</span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Deaf and hard of hearing employees cannot access this important policy information.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-300 dark:border-red-600">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                      Problems with This Approach:
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• No transcript provided for deaf/hard of hearing users</li>
                      <li>• Critical information is completely inaccessible</li>
                      <li>• Violates WCAG 2.1 Level A requirements</li>
                      <li>• Creates potential legal and HR issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Examples */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Eye className="h-6 w-6 text-blue-600" />
              Video-only Content Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Good Video Example */}
              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  ✅ Good Example: Silent Animation with Detailed Description
                </h4>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-5 w-5 text-green-600" />
                      <span className="font-medium">How to Navigate with Keyboard</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => playAudio(
                        "This animation demonstrates keyboard navigation. The user presses Tab to move through interactive elements. First, focus moves to the search button, highlighted with a blue outline. Next, Tab moves focus to the navigation menu. Using arrow keys, the user navigates through menu items: Home, About, Services, Contact. Pressing Enter on Services opens a submenu.",
                        "good-video"
                      )}
                      disabled={activeAudio === "good-video"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {activeAudio === "good-video" ? "Playing..." : "Play Description"}
                    </Button>
                  </div>
                  
                  {/* Visual representation */}
                  <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded mb-4 border-2 border-dashed">
                    <div className="text-center text-slate-600 dark:text-slate-400">
                      <Settings className="h-20 w-20 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Silent animation would play here</p>
                      <p className="text-xs">(Keyboard navigation demonstration)</p>
                    </div>
                  </div>

                  {showTranscript && (
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">📝 Detailed Text Description</h5>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playAudio(
                            "Screen reader reading video description: This animation demonstrates keyboard navigation on a website. Step 1: User presses Tab key, focus moves to search button highlighted with blue outline. Step 2: Tab pressed again, focus moves to navigation menu. Step 3: Arrow keys used to navigate through menu items. Step 4: Enter key pressed on Services to open submenu.",
                            "video-description"
                          )}
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          Read Description
                        </Button>
                      </div>
                      <div className="text-sm space-y-2 bg-white dark:bg-slate-800 p-3 rounded border">
                        <p><strong>This animation demonstrates keyboard navigation on a website:</strong></p>
                        <p><strong>Step 1:</strong> User presses Tab key. Focus moves to the search button, which is highlighted with a blue outline.</p>
                        <p><strong>Step 2:</strong> Tab is pressed again. Focus moves to the main navigation menu.</p>
                        <p><strong>Step 3:</strong> User employs arrow keys to navigate through menu items: Home, About, Services, Contact.</p>
                        <p><strong>Step 4:</strong> Enter key is pressed on "Services" menu item, opening a submenu with additional options.</p>
                        <p><strong>Step 5:</strong> User continues using Tab and arrow keys to navigate through the submenu items.</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      Why This Works:
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Provides step-by-step description of all visual actions</li>
                      <li>• Explains the sequence and purpose of each interaction</li>
                      <li>• Includes specific details about visual feedback (blue outline)</li>
                      <li>• Conveys the same information as the visual demonstration</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bad Video Example */}
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  ❌ Bad Example: Video with Vague Description
                </h4>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Software Installation Process</span>
                    </div>
                    <Button size="sm" variant="destructive">
                      <Play className="h-4 w-4 mr-2" />
                      Play Video
                    </Button>
                  </div>
                  
                  {/* Visual representation */}
                  <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded mb-4 border-2 border-dashed">
                    <div className="text-center text-slate-600 dark:text-slate-400">
                      <Settings className="h-20 w-20 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Complex installation video would play here</p>
                      <p className="text-xs">(Multiple steps, dialog boxes, buttons)</p>
                    </div>
                  </div>

                  {showTranscript && (
                    <div className="bg-red-100 dark:bg-red-950/30 p-4 rounded border border-red-300 dark:border-red-600">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-300">Inadequate Description</span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        <strong>Current description:</strong> "Video shows the software installation process"
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-300">
                        Too vague - doesn't explain specific steps, buttons to click, or installation sequence.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-red-100 dark:bg-red-950/30 rounded-lg border border-red-300 dark:border-red-600">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">
                      Problems with This Approach:
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Description is too vague and unhelpful</li>
                      <li>• Doesn't explain specific steps or actions</li>
                      <li>• Blind users cannot follow the installation process</li>
                      <li>• Fails to provide equivalent information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Transcript Generator */}
        <Card className="mb-8 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Mic className="h-6 w-6 text-indigo-600" />
              Practice Creating Transcripts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Describe your audio content:
                  </label>
                  <Textarea 
                    placeholder="Example: 5-minute interview between host and accessibility expert, with background music intro..."
                    className="h-24 mb-4"
                  />
                  <div className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Audio file would be uploaded here</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Create your transcript:
                  </label>
                  <Textarea 
                    placeholder="[Host]: Welcome to our show...
[Guest]: Thank you for having me...
[Background music fades in for 5 seconds]"
                    className="h-40 mb-4"
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                  />
                  <div className="mb-4">
                    {transcriptText.length === 0 ? (
                      <span className="text-red-600 text-sm">⚠️ Transcript is required for audio content</span>
                    ) : !transcriptText.includes('[') || !transcriptText.includes(']') ? (
                      <span className="text-orange-600 text-sm">💡 Consider using [Speaker] labels for better clarity</span>
                    ) : transcriptText.toLowerCase().includes('music') || transcriptText.toLowerCase().includes('sound') ? (
                      <span className="text-green-600 text-sm">✅ Great! You included important sound information</span>
                    ) : (
                      <span className="text-blue-600 text-sm">🎵 Good transcript! Consider adding sound descriptions if relevant</span>
                    )}
                  </div>
                  <Button 
                    onClick={() => {
                      if (transcriptText && 'speechSynthesis' in window) {
                        playAudio(`Screen reader reading transcript: ${transcriptText}`, "transcript-test")
                      }
                    }}
                    className="w-full"
                    disabled={!transcriptText}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test with Screen Reader
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