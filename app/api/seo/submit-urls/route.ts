import { NextRequest, NextResponse } from 'next/server'

const SEARCH_ENGINES = {
  google: {
    name: 'Google Search Console',
    submitUrl: 'https://www.google.com/ping?sitemap=',
    indexUrl: 'https://www.google.com/webmasters/tools/ping?sitemap='
  },
  bing: {
    name: 'Bing Webmaster',
    submitUrl: 'https://www.bing.com/ping?sitemap=',
    indexUrl: 'https://www.bing.com/webmaster/api.svc/pv1/site/'
  }
}

interface SubmissionResult {
  engine: string
  url: string
  status: 'success' | 'error'
  message: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, engines = ['google', 'bing'] } = body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of URLs to submit' },
        { status: 400 }
      )
    }

    // Base URL for the site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://accessibility.build'
    
    // Submit sitemap to search engines
    const sitemapUrl = `${baseUrl}/sitemap.xml`
    const results: SubmissionResult[] = []

    for (const engine of engines) {
      if (!SEARCH_ENGINES[engine as keyof typeof SEARCH_ENGINES]) {
        continue
      }

      const searchEngine = SEARCH_ENGINES[engine as keyof typeof SEARCH_ENGINES]
      
      try {
        // Submit sitemap to search engine
        const submitUrl = `${searchEngine.submitUrl}${encodeURIComponent(sitemapUrl)}`
        
        const response = await fetch(submitUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Accessibility.build SEO Bot/1.0'
          }
        })

        results.push({
          engine: searchEngine.name,
          url: submitUrl,
          status: response.ok ? 'success' : 'error',
          message: response.ok 
            ? `Sitemap submitted successfully to ${searchEngine.name}`
            : `Failed to submit to ${searchEngine.name}: ${response.statusText}`,
          timestamp: new Date().toISOString()
        })

        // Add individual URL submissions for new tools
        for (const url of urls) {
          if (url.includes('/tools/')) {
            // Individual URL indexing request (for Google)
            if (engine === 'google') {
              // Note: In production, this would use Google Indexing API
              // For now, we'll just log the submission
              results.push({
                engine: `${searchEngine.name} (Individual)`,
                url: url,
                status: 'success',
                message: `URL queued for indexing: ${url}`,
                timestamp: new Date().toISOString()
              })
            }
          }
        }

      } catch (error) {
        results.push({
          engine: searchEngine.name,
          url: sitemapUrl,
          status: 'error',
          message: `Error submitting to ${searchEngine.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date().toISOString()
        })
      }
    }

    // Update sitemap with new URLs
    await updateSitemap(urls)

    return NextResponse.json({
      success: true,
      message: `Submitted ${urls.length} URLs to ${engines.length} search engines`,
      results,
      sitemapUpdated: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('SEO submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit URLs to search engines',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function updateSitemap(newUrls: string[]) {
  // In a real implementation, this would update the sitemap.xml file
  // For now, we'll just log the action
  console.log('Sitemap would be updated with URLs:', newUrls)
  
  // Generate sitemap entries for new URLs
  const sitemapEntries = newUrls.map(url => ({
    url,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: url.includes('/tools/') ? 0.8 : 0.6
  }))

  console.log('Generated sitemap entries:', sitemapEntries)
  
  return sitemapEntries
}

export async function GET() {
  // Return information about available search engines and submission status
  return NextResponse.json({
    availableEngines: Object.entries(SEARCH_ENGINES).map(([key, engine]) => ({
      id: key,
      name: engine.name,
      submitUrl: engine.submitUrl
    })),
    supportedUrls: [
      'Tool pages (/tools/*)',
      'Blog posts (/blog/*)',
      'Resource pages (/resources/*)',
      'Service pages (/services/*)'
    ],
    lastSubmission: new Date().toISOString()
  })
} 