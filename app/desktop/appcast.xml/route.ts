import { desktopDmgUrl, desktopReleases } from '@/lib/desktop-release'

// Sparkle update feed for the macOS app (SUFeedURL in its Info.plist).
// Generated from lib/desktop-release.ts so the feed, the /desktop page and
// the download redirect always describe the same build. Each enclosure is
// verified by the app against its EdDSA signature before installing.
export const dynamic = 'force-static'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function GET() {
  const items = desktopReleases
    .map(
      (r) => `
    <item>
      <title>Version ${escapeXml(r.version)}</title>
      <pubDate>${new Date(`${r.date}T12:00:00Z`).toUTCString()}</pubDate>
      <sparkle:version>${escapeXml(r.build)}</sparkle:version>
      <sparkle:shortVersionString>${escapeXml(r.version)}</sparkle:shortVersionString>
      <sparkle:minimumSystemVersion>${escapeXml(r.minimumSystemVersion)}</sparkle:minimumSystemVersion>
      <description><![CDATA[<ul>${r.notes.map((n) => `<li>${escapeXml(n)}</li>`).join('')}</ul>]]></description>
      <enclosure url="${escapeXml(desktopDmgUrl(r))}" length="${r.length}" type="application/octet-stream" sparkle:edSignature="${escapeXml(r.edSignature)}"/>
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
  <channel>
    <title>Accessibility Build for Mac</title>
    <link>https://accessibility.build/desktop</link>
    <description>Updates for the Accessibility Build macOS app.</description>
    <language>en</language>${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Installed apps must see a new release promptly.
      'Cache-Control': 'public, max-age=0, s-maxage=300, must-revalidate',
      // Machine-read update feed, not a page.
      'X-Robots-Tag': 'noindex',
    },
  })
}
