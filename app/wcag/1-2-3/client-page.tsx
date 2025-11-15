'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  AudioWaveform,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Eye,
  EyeOff,
  Users,
  Lightbulb,
  Target,
  Code,
  TestTube,
  Upload,
  Copy,
  Info,
  FileText,
  Settings,
  VideoIcon,
  Headphones,
  Clock,
  Zap,
  Languages,
  Wifi,
  BookOpen
} from 'lucide-react'

// TypeScript interfaces for better type safety
interface UserGroup {
  name: string
  impact: string
  assistiveTech: string[]
  percentage: string
}

interface ProcedureStep {
  step: number
  title: string
  description: string
  details: string[]
  tips: string[]
}

interface AudioDescriptionExample {
  title: string
  description: string
  isGood: boolean
  features: string[]
}

export default function WCAG123ClientPage() {
  const [currentVideo, setCurrentVideo] = useState<'good' | 'bad'>('good')
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDescriptionOn, setAudioDescriptionOn] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [showMediaAlternative, setShowMediaAlternative] = useState(false)

  // Mock audio descriptions for demo
  const mockAudioDescriptions = [
    { start: 0, end: 3, text: "A woman in a blue suit stands in front of a whiteboard with accessibility diagrams." },
    { start: 4, end: 7, text: "She points to a flowchart showing website navigation paths and user interactions." },
    { start: 8, end: 11, text: "Close-up of her hands typing on a laptop keyboard, demonstrating assistive technology." },
    { start: 12, end: 15, text: "The screen shows code examples with highlighted ARIA labels and semantic HTML." },
    { start: 16, end: 19, text: "She gestures toward the audience while explaining accessibility best practices." }
  ]

  // User groups affected by this success criterion
  const affectedUsers: UserGroup[] = [
    {
      name: "Blind Users",
      impact: "Cannot see visual content like actions, settings, gestures, or scene changes in videos",
      assistiveTech: ["Screen readers", "Braille displays", "Voice navigation"],
      percentage: "~1.3% of population"
    },
    {
      name: "Low Vision Users",
      impact: "May miss important visual details, facial expressions, or small text in videos",
      assistiveTech: ["Screen magnifiers", "High contrast displays", "Large text settings"],
      percentage: "~2.9% of population"
    },
    {
      name: "Users with Cognitive Disabilities",
      impact: "Benefit from audio descriptions to understand complex visual information and context",
      assistiveTech: ["Reading assistance software", "Focus enhancement tools", "Memory aids"],
      percentage: "~10-15% of population"
    },
    {
      name: "Users with Attention Disorders",
      impact: "Audio descriptions help maintain focus and understanding of visual content",
      assistiveTech: ["Focus apps", "Distraction blockers", "Audio processing tools"],
      percentage: "~8-12% of population"
    },
    {
      name: "Users in Audio-Only Environments",
      impact: "Cannot watch video but can listen, need audio descriptions for full understanding",
      assistiveTech: ["Headphones", "Audio players", "Podcast apps"],
      percentage: "Situational users"
    },
    {
      name: "Users with Limited Bandwidth",
      impact: "May choose audio-only or prefer text alternatives when video streaming is difficult",
      assistiveTech: ["Text-based browsers", "Audio-only players", "Bandwidth monitors"],
      percentage: "~15-20% globally"
    }
  ]

  // Implementation procedure steps
  const procedureSteps: ProcedureStep[] = [
    {
      step: 1,
      title: "Analyze Video Content",
      description: "Review your video to identify all visual elements that convey important information",
      details: [
        "List all visual actions, gestures, and movements",
        "Note facial expressions and emotional cues",
        "Identify text, graphics, and diagrams shown",
        "Document scene changes and settings",
        "Mark important visual context not in audio"
      ],
      tips: [
        "Watch the video with sound off to identify visual-only information",
        "Create a timeline of visual events",
        "Focus on information that advances the story or provides context"
      ]
    },
    {
      step: 2,
      title: "Choose Implementation Method",
      description: "Decide between audio description track or complete media alternative",
      details: [
        "Audio description: Separate audio track with visual descriptions",
        "Media alternative: Complete text document describing all content",
        "Consider your audience and technical capabilities",
        "Evaluate available natural pauses for audio descriptions",
        "Choose based on video complexity and resources"
      ],
      tips: [
        "Audio descriptions work best for videos with natural pauses",
        "Media alternatives are better for complex visual content",
        "You can provide both options for maximum accessibility"
      ]
    },
    {
      step: 3,
      title: "Write Audio Descriptions",
      description: "Create concise, objective descriptions of visual content",
      details: [
        "Use present tense and active voice",
        "Be objective and factual, avoid interpretations",
        "Keep descriptions concise to fit in natural pauses",
        "Describe actions, not thoughts or motivations",
        "Include essential visual information only"
      ],
      tips: [
        "Start with 'A woman in a blue suit' rather than 'The presenter'",
        "Use specific, concrete language",
        "Avoid redundancy with existing dialogue"
      ]
    },
    {
      step: 4,
      title: "Time Audio Descriptions",
      description: "Synchronize descriptions with video content using proper timing",
      details: [
        "Create WebVTT (.vtt) file with timestamps",
        "Place descriptions in natural pauses",
        "Ensure descriptions don't overlap with important audio",
        "Test timing with actual video playback",
        "Adjust duration based on speaking pace"
      ],
      tips: [
        "Use professional audio description software for precision",
        "Leave small gaps between dialogue and descriptions",
        "Test with different playback speeds"
      ]
    },
    {
      step: 5,
      title: "Create Media Alternative (Optional)",
      description: "Develop comprehensive text alternative describing all visual and audio content",
      details: [
        "Include complete scene descriptions",
        "Transcribe all dialogue and narration",
        "Describe all visual elements and actions",
        "Provide context and setting information",
        "Structure with clear headings and timestamps"
      ],
      tips: [
        "Make it readable as a standalone document",
        "Use clear formatting and structure",
        "Include navigation links for long content"
      ]
    },
    {
      step: 6,
      title: "Implement and Test",
      description: "Add audio descriptions to your video player and test with users",
      details: [
        "Add track elements to HTML5 video",
        "Configure video player to support description tracks",
        "Test with screen readers and assistive technology",
        "Verify descriptions are discoverable and controllable",
        "Validate WebVTT syntax and timing"
      ],
      tips: [
        "Test with actual blind and low vision users",
        "Ensure descriptions can be toggled on/off",
        "Verify compatibility across browsers and devices"
      ]
    }
  ]

  // Audio description examples
  const audioDescriptionExamples: AudioDescriptionExample[] = [
    {
      title: "Good: Effective Audio Description",
      description: "Clear, objective descriptions that enhance understanding",
      isGood: true,
      features: [
        "Describes essential visual information",
        "Uses natural pauses in dialogue",
        "Objective, factual language",
        "Proper timing and synchronization",
        "Enhances story comprehension"
      ]
    },
    {
      title: "Bad: Missing Audio Description",
      description: "Video without audio descriptions leaves visual content inaccessible",
      isGood: false,
      features: [
        "Visual actions not described",
        "Important context missing",
        "Inaccessible to blind users",
        "Incomplete understanding",
        "Fails WCAG requirements"
      ]
    }
  ]

  const getCurrentDescription = () => {
    return mockAudioDescriptions.find(desc =>
      currentTime >= desc.start && currentTime < desc.end
    )?.text || ""
  }

  // Video playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          return newTime >= 20 ? 0 : newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950">
      <div className="container-wide py-12">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/checklists/wcag-2-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Checklist
          </Link>
        </Button>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                <AudioWaveform className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    1.2.3 Audio Description or Media Alternative
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                    Level A
                  </Badge>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Ensuring prerecorded video content is accessible through audio description or media alternatives
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-900 dark:text-white">Visual Information</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Must be audio described</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900 dark:text-white">Affected Users</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">~20% of population</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <AudioWaveform className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900 dark:text-white">Implementation</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Audio track or text alternative</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-slate-900 dark:text-white">WCAG Level</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Level A (Required)</p>
            </div>
          </div>
        </div>

        {/* Success Criterion Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-emerald-600" />
              Success Criterion Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <blockquote className="text-lg font-medium text-emerald-900 dark:text-emerald-100 leading-relaxed">
                "An alternative for time-based media or audio description of the prerecorded video content is
                provided for synchronized media, except when the media is a media alternative for text and is
                clearly labeled as such."
              </blockquote>
              <footer className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">
                — WCAG 2.2, Success Criterion 1.2.3
              </footer>
            </div>
          </CardContent>
        </Card>

        {/* What This Means */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              What This Means
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                This success criterion ensures that prerecorded video content is accessible to users who cannot
                see the visual information. You must provide either:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <AudioWaveform className="h-5 w-5" />
                    Audio Description Track
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 mb-3">
                    A separate audio track that describes visual content during natural pauses in the dialogue.
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Describes actions, settings, and gestures</li>
                    <li>• Fits between dialogue and sound effects</li>
                    <li>• Uses WebVTT format for web videos</li>
                    <li>• Can be toggled on/off by users</li>
                  </ul>
                </div>

                <div className="bg-teal-50 dark:bg-teal-950/20 p-6 rounded-lg border border-teal-200 dark:border-teal-700">
                  <h3 className="font-semibold text-teal-900 dark:text-teal-100 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Complete Media Alternative
                  </h3>
                  <p className="text-teal-800 dark:text-teal-200 mb-3">
                    A comprehensive text document that describes all visual and audio content.
                  </p>
                  <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-1">
                    <li>• Includes all dialogue and narration</li>
                    <li>• Describes all visual elements</li>
                    <li>• Provides complete scene context</li>
                    <li>• Readable as standalone document</li>
                  </ul>
                </div>
              </div>

              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Choice Between Options</AlertTitle>
                <AlertDescription>
                  You can choose either audio description OR a complete media alternative. Both options meet
                  the Level A requirement, but Level AA (1.2.5) specifically requires audio description.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Why It's Important */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-orange-600" />
              Why It's Important
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visual Accessibility
                </h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  Makes visual content accessible to blind and low vision users who cannot see actions,
                  gestures, facial expressions, or other important visual information in videos.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Enhanced Understanding
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Provides comprehensive context and detailed descriptions that enhance understanding for
                  all users, including those with cognitive disabilities or learning differences.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Legal Compliance
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Required by WCAG 2.2 Level A and essential for ADA compliance, avoiding legal issues
                  and ensuring your content meets accessibility standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Is Affected */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Who Is Affected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {affectedUsers.map((user, index) => (
                <div key={index} className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      {index === 0 && <EyeOff className="h-5 w-5 text-purple-600" />}
                      {index === 1 && <Eye className="h-5 w-5 text-purple-600" />}
                      {index === 2 && <BookOpen className="h-5 w-5 text-purple-600" />}
                      {index === 3 && <Zap className="h-5 w-5 text-purple-600" />}
                      {index === 4 && <Headphones className="h-5 w-5 text-purple-600" />}
                      {index === 5 && <Wifi className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">{user.name}</h3>
                      <p className="text-sm text-purple-600 dark:text-purple-300">{user.percentage}</p>
                    </div>
                  </div>
                  <p className="text-purple-800 dark:text-purple-200 text-sm mb-3">
                    {user.impact}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.assistiveTech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Procedure */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-indigo-600" />
              Implementation Procedure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {procedureSteps.map((step, index) => (
                <div key={index} className="border border-indigo-200 dark:border-indigo-700 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">{step.title}</h3>
                      <p className="text-indigo-800 dark:text-indigo-200 mb-4">{step.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Implementation Details:</h4>
                          <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Pro Tips:</h4>
                          <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-6 w-6 text-emerald-600" />
              Interactive Examples
            </CardTitle>
            <CardDescription>
              Experience the difference between accessible and inaccessible video content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Good Example */}
              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  ✅ Good Example: Video with Audio Description
                </h4>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">

                  {/* Mock Video Player */}
                  <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center text-white">
                        <VideoIcon className="h-16 w-16 mx-auto mb-2 opacity-75" />
                        <p className="text-sm opacity-75">Accessibility Training Video</p>
                      </div>
                    </div>

                    {/* Audio Description Overlay */}
                    {audioDescriptionOn && getCurrentDescription() && (
                      <div className="absolute top-4 left-4 right-4 bg-emerald-600 bg-opacity-90 text-white p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <AudioWaveform className="h-4 w-4" />
                          <span className="text-xs font-medium">Audio Description</span>
                        </div>
                        <p className="text-sm">
                          {getCurrentDescription()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-3 rounded mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 0:20
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAudioDescriptionOn(!audioDescriptionOn)}
                      >
                        <AudioWaveform className="h-4 w-4 mr-1" />
                        {audioDescriptionOn ? 'Hide' : 'Show'} Audio Description
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const description = getCurrentDescription() || "A woman in a blue suit stands in front of a whiteboard with accessibility diagrams.";
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(`Audio description: ${description}`);
                            utterance.rate = 0.9;
                            utterance.voice = window.speechSynthesis.getVoices().find(v => v.name.includes('female')) || window.speechSynthesis.getVoices()[0];
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        Speak Description
                      </Button>
                    </div>
                  </div>

                  {/* Media Alternative Toggle */}
                  <div className="mb-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowMediaAlternative(!showMediaAlternative)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      {showMediaAlternative ? 'Hide' : 'Show'} Complete Media Alternative
                    </Button>
                  </div>

                  {/* Media Alternative Content */}
                  {showMediaAlternative && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border mb-4">
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-3">Complete Media Alternative</h5>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Scene Description:</strong> A professional training video filmed in a modern office conference room.
                          The presenter is Dr. Sarah Chen, a woman in her 30s wearing a navy blue business suit.
                        </p>

                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>0:00 - 0:03:</strong> Dr. Chen stands in front of a large wall-mounted whiteboard with
                          accessibility diagrams. She gestures toward a hand-drawn flowchart showing website navigation paths.
                        </p>

                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Audio:</strong> "Welcome to our accessibility workshop. Today we'll learn how to make
                          websites more accessible to users with disabilities."
                        </p>

                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>0:04 - 0:07:</strong> The camera zooms in on Dr. Chen's laptop screen, showing a code editor
                          with HTML markup. She points to specific lines containing ARIA labels and alt text attributes.
                        </p>

                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Audio:</strong> "Here you can see how proper semantic HTML and ARIA labels help screen
                          readers understand page content and structure."
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Good Features */}
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Good Implementation Features:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-700 dark:text-green-300">Clear audio descriptions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-700 dark:text-green-300">Proper timing and synchronization</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-700 dark:text-green-300">User-controllable descriptions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-700 dark:text-green-300">Complete media alternative available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bad Example */}
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  ❌ Bad Example: Video Without Audio Description
                </h4>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">

                  {/* Mock Video Player without descriptions */}
                  <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center text-white">
                        <EyeOff className="h-16 w-16 mx-auto mb-2 opacity-75" />
                        <p className="text-sm opacity-75">Visual Content Not Described</p>
                      </div>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-3 rounded mb-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">0:00 / 0:20</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" disabled>
                        <VolumeX className="h-4 w-4 mr-1" />
                        No Audio Description
                      </Button>
                    </div>
                  </div>

                  {/* Problems */}
                  <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded border border-red-300 dark:border-red-600">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">❌ Problems:</p>
                    <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                      <li>• Blind users cannot understand visual content</li>
                      <li>• Important actions and settings are not described</li>
                      <li>• No alternative way to access visual information</li>
                      <li>• Fails WCAG 1.2.3 requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Description Generator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-indigo-600" />
              Audio Description Generator
            </CardTitle>
            <CardDescription>
              Practice writing effective audio descriptions with real-time feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Describe your video content:
                  </label>
                  <Textarea
                    placeholder="Example: A 3-minute tutorial showing someone using keyboard navigation on a website, with close-ups of keyboard interactions and screen changes..."
                    className="h-24 mb-4"
                  />
                  <div className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                    <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Upload video file (optional)</p>
                    <Input type="file" accept="video/*" className="mt-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Create your audio descriptions:
                  </label>
                  <Textarea
                    placeholder="0:00 - 0:03: A woman in a blue suit stands at a whiteboard.
0:05 - 0:07: She points to a flowchart showing website navigation.
0:10 - 0:12: Close-up of her hands typing on a laptop keyboard.
0:15 - 0:17: The screen shows code with highlighted accessibility features."
                    className="h-40 mb-4"
                    onChange={(e) => {
                      const text = e.target.value;
                      const feedback = document.getElementById('description-feedback');
                      if (feedback) {
                        if (text.length === 0) {
                          feedback.innerHTML = '<span class="text-red-600">⚠️ Audio descriptions are required for visual content</span>';
                        } else if (!text.includes(':') || !text.includes('-')) {
                          feedback.innerHTML = '<span class="text-orange-600">⏱️ Consider adding timestamps (0:00 - 0:03)</span>';
                        } else if (text.toLowerCase().includes('beautiful') || text.toLowerCase().includes('amazing')) {
                          feedback.innerHTML = '<span class="text-blue-600">🎯 Tip: Use objective descriptions instead of subjective terms</span>';
                        } else if (text.split('\n').length < 3) {
                          feedback.innerHTML = '<span class="text-orange-600">📝 Consider breaking into shorter description segments</span>';
                        } else {
                          feedback.innerHTML = '<span class="text-green-600">✅ Good descriptions! Objective, timed, and descriptive</span>';
                        }
                      }
                    }}
                  />
                  <div id="description-feedback" className="text-sm mb-4">
                    <span className="text-slate-500">Start typing to get feedback...</span>
                  </div>
                  <Button
                    onClick={() => {
                      const textarea = document.querySelectorAll('textarea')[1] as HTMLTextAreaElement;
                      const text = textarea?.value || '';
                      if (text && 'speechSynthesis' in window) {
                        const cleanText = text.replace(/\d+:\d+\s*-\s*\d+:\d+:\s*/g, '');
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(`Audio description: ${cleanText}`);
                        utterance.rate = 0.9;
                        utterance.voice = window.speechSynthesis.getVoices().find(v => v.name.includes('female')) || window.speechSynthesis.getVoices()[0];
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="w-full"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test Audio Description
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-emerald-600" />
              Testing Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Manual Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Listen to video without watching the screen</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Test audio description timing and quality</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Verify media alternative covers all content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Test with screen reader users</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Automated Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">axe DevTools checks for missing descriptions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">WAVE identifies videos without alternatives</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Lighthouse audits video accessibility</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Pa11y reports missing audio descriptions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Code */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6 text-emerald-600" />
              Implementation Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* HTML Examples */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">HTML Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">HTML with Audio Description</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `<!-- Video with audio description track -->
<video controls width="600">
  <source src="video.mp4" type="video/mp4">
  <track kind="descriptions" src="descriptions.vtt" srclang="en" label="English Descriptions" default>
  <track kind="captions" src="captions.vtt" srclang="en" label="English Captions">
  Your browser does not support the video tag.
</video>

<!-- Audio Description WebVTT File (descriptions.vtt) -->
WEBVTT

NOTE
Audio descriptions for accessibility tutorial video

1
00:00:00.000 --> 00:00:03.000
A woman in a blue suit stands in front of a whiteboard.

2
00:00:05.000 --> 00:00:07.000
She points to a flowchart showing website navigation.

3
00:00:10.000 --> 00:00:12.000
Close-up of hands typing on a laptop keyboard.

<!-- Alternative: Media Alternative Link -->
<video controls width="600">
  <source src="video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
<p><a href="video-transcript.html">Complete text alternative for this video</a></p>`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`<!-- Video with audio description track -->
<video controls width="600">
  <source src="video.mp4" type="video/mp4">
  <track kind="descriptions" src="descriptions.vtt" srclang="en" label="English Descriptions" default>
  <track kind="captions" src="captions.vtt" srclang="en" label="English Captions">
  Your browser does not support the video tag.
</video>

<!-- Audio Description WebVTT File (descriptions.vtt) -->
WEBVTT

NOTE
Audio descriptions for accessibility tutorial video

1
00:00:00.000 --> 00:00:03.000
A woman in a blue suit stands in front of a whiteboard.

2
00:00:05.000 --> 00:00:07.000
She points to a flowchart showing website navigation.

3
00:00:10.000 --> 00:00:12.000
Close-up of hands typing on a laptop keyboard.

<!-- Alternative: Media Alternative Link -->
<video controls width="600">
  <source src="video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
<p><a href="video-transcript.html">Complete text alternative for this video</a></p>`}</code>
                  </pre>
                </div>
              </div>

              {/* React Examples */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">React Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">React Component</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `// Video with audio descriptions
function VideoWithDescriptions({ videoSrc, descriptionTrack, mediaAlternative }) {
  const [showAlternative, setShowAlternative] = useState(false);

  return (
    <div className="video-container">
      <video controls width="100%" className="max-w-2xl">
        <source src={videoSrc} type="video/mp4" />
        <track
          kind="descriptions"
          src={descriptionTrack.src}
          srcLang={descriptionTrack.lang}
          label={descriptionTrack.label}
          default={descriptionTrack.default}
        />
        Your browser does not support the video tag.
      </video>

      {/* Media Alternative Option */}
      <div className="mt-4">
        <button
          onClick={() => setShowAlternative(!showAlternative)}
          className="text-blue-600 underline"
        >
          {showAlternative ? 'Hide' : 'Show'} Complete Text Alternative
        </button>

        {showAlternative && (
          <div className="mt-2 p-4 bg-gray-100 rounded">
            <h3>Complete Media Alternative</h3>
            <div dangerouslySetInnerHTML={{ __html: mediaAlternative }} />
          </div>
        )}
      </div>
    </div>
  );
}

// Usage
<VideoWithDescriptions
  videoSrc="/accessibility-tutorial.mp4"
  descriptionTrack={{
    src: "/descriptions.vtt",
    lang: "en",
    label: "English Descriptions",
    default: true
  }}
  mediaAlternative="<p>Complete text description of all visual and audio content...</p>"
/>`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`// Video with audio descriptions
function VideoWithDescriptions({ videoSrc, descriptionTrack, mediaAlternative }) {
  const [showAlternative, setShowAlternative] = useState(false);

  return (
    <div className="video-container">
      <video controls width="100%" className="max-w-2xl">
        <source src={videoSrc} type="video/mp4" />
        <track
          kind="descriptions"
          src={descriptionTrack.src}
          srcLang={descriptionTrack.lang}
          label={descriptionTrack.label}
          default={descriptionTrack.default}
        />
        Your browser does not support the video tag.
      </video>

      {/* Media Alternative Option */}
      <div className="mt-4">
        <button
          onClick={() => setShowAlternative(!showAlternative)}
          className="text-blue-600 underline"
        >
          {showAlternative ? 'Hide' : 'Show'} Complete Text Alternative
        </button>

        {showAlternative && (
          <div className="mt-2 p-4 bg-gray-100 rounded">
            <h3>Complete Media Alternative</h3>
            <div dangerouslySetInnerHTML={{ __html: mediaAlternative }} />
          </div>
        )}
      </div>
    </div>
  );
}

// Usage
<VideoWithDescriptions
  videoSrc="/accessibility-tutorial.mp4"
  descriptionTrack={{
    src: "/descriptions.vtt",
    lang: "en",
    label: "English Descriptions",
    default: true
  }}
  mediaAlternative="<p>Complete text description of all visual and audio content...</p>"
/>`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}