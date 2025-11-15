"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  BookOpen, 
  CheckSquare, 
  Wrench,
  FileText,
  ExternalLink,
  Star
} from "lucide-react"
import { getRelatedLinks, type InternalLink, type ContentMatch } from "@/lib/internal-linking"

interface RelatedLink {
  url: string
  title: string
  description: string
  type: 'tool' | 'article' | 'resource' | 'checklist' | 'guide'
}

interface EnhancedRelatedLink extends RelatedLink {
  relevanceScore?: number
  matchedKeywords?: string[]
}

interface RelatedContentProps {
  content?: string
  links?: RelatedLink[]
  title?: string
  maxItems?: number
  showDescriptions?: boolean
}

const typeIcons = {
  tool: Wrench,
  article: FileText,
  resource: BookOpen,
  checklist: CheckSquare,
  guide: BookOpen
}

const typeColors = {
  tool: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  article: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  resource: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  checklist: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  guide: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
}

export function RelatedContent({ 
  content,
  links, 
  title = "Related Resources", 
  maxItems = 3,
  showDescriptions = true
}: RelatedContentProps) {
  // Use smart linking if content is provided, otherwise use manual links
  const relatedItems: EnhancedRelatedLink[] = content 
    ? getRelatedLinks(content, maxItems).map(match => ({
        ...match.link,
        relevanceScore: match.relevanceScore,
        matchedKeywords: match.matchedKeywords
      }))
    : (links || []).map(link => ({ ...link }))
  
  if (relatedItems.length === 0) {
    return null
  }
  
  return (
    <div className="mt-12">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
          <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Essential Accessibility Resources
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Comprehensive tools, checklists, and guides to help you create inclusive digital experiences
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedItems.map((item, index) => {
          const IconComponent = typeIcons[item.type]
          const isHighlyRelevant = item.relevanceScore && item.relevanceScore > 8
          
          return (
            <Card key={index} className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700"></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  {isHighlyRelevant && (
                    <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                      <Star className="h-3 w-3 mr-1" />
                      Top Pick
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={item.url}>
                    {item.title}
                  </Link>
                </CardTitle>
                
                {showDescriptions && (
                  <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                {item.matchedKeywords && item.matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.matchedKeywords.slice(0, 3).map((keyword: string, kidx: number) => (
                      <Badge key={kidx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {item.matchedKeywords.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.matchedKeywords.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <Button asChild variant="outline" size="sm" className="w-full group/btn border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                  <Link href={item.url}>
                    View {item.type} 
                    <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Simplified version for sidebars
export function RelatedContentSidebar({ 
  content, 
  maxItems = 5 
}: { 
  content: string
  maxItems?: number 
}) {
  const relatedLinks = getRelatedLinks(content, maxItems)
  
  if (relatedLinks.length === 0) {
    return null
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Related Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {relatedLinks.map(({ link }, index) => {
          const IconComponent = typeIcons[link.type]
          
          return (
            <Link 
              key={index}
              href={link.url}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded">
                <IconComponent className="h-3 w-3 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {link.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {link.description}
                </p>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5" />
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Quick tools suggestions for CTAs
export function QuickToolSuggestions({ content }: { content: string }) {
  const relatedLinks = getRelatedLinks(content, 3).filter(({ link }) => link.type === 'tool')
  
  if (relatedLinks.length === 0) {
    return null
  }

  // Tool icon mapping
  const getToolIcon = (title: string) => {
    if (title.includes('Accessibility Audit')) return <Star className="h-5 w-5" />
    if (title.includes('Contrast')) return <Wrench className="h-5 w-5" />
    if (title.includes('Alt Text')) return <BookOpen className="h-5 w-5" />
    if (title.includes('Heading')) return <CheckSquare className="h-5 w-5" />
    return <Wrench className="h-5 w-5" />
  }
  
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
        <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Recommended Tools
      </h3>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
        Perfect tools to get started with accessibility
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {relatedLinks.map(({ link }, index) => (
          <Card 
            key={index} 
            className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700"></div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {getToolIcon(link.title)}
                </div>
                <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                  Popular
                </Badge>
              </div>
              
              <CardTitle className="text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {link.title}
              </CardTitle>
              
              <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2">
                {link.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button asChild variant="outline" size="sm" className="w-full group/btn border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                <Link href={link.url}>
                  Try Free
                  <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 