export interface StatementData {
  organizationName: string
  websiteUrl: string
  contactEmail: string
  contactPhone?: string
  conformanceLevel: 'A' | 'AA' | 'AAA' | 'Partial'
  partialConformance?: string
  testingMethods: string[]
  testingDate?: string
  knownLimitations: string[]
  feedbackMechanism: 'email' | 'form' | 'phone' | 'multiple'
  feedbackUrl?: string
  lastUpdated: string
  standards: string[]
  technologies: string[]
  userAgentNotes?: string
  assistiveTechnologies?: string[]
}

export type StatementTemplate = 'basic' | 'comprehensive' | 'legal' | 'developer'

export function generateStatementHTML(data: StatementData, template: StatementTemplate): string {
  const baseHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Statement - ${data.organizationName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        h1 {
            color: #1e40af;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
        }
        h2 {
            color: #1e40af;
            margin-top: 30px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #3b82f6;
            color: white;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-left: 10px;
        }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin: 5px 0;
        }
        .contact-info {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <h1>Accessibility Statement <span class="badge">WCAG ${data.conformanceLevel}${data.conformanceLevel === 'Partial' ? ` (${data.partialConformance})` : ''}</span></h1>
    
    <p><strong>${data.organizationName}</strong> is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.</p>
    
    <h2>Conformance Status</h2>
    <p>The <a href="${data.websiteUrl}">${data.websiteUrl}</a> website is ${data.conformanceLevel === 'Partial' ? 'partially conformant' : 'conformant'} with <strong>WCAG 2.2 Level ${data.conformanceLevel}</strong>${data.conformanceLevel === 'Partial' ? ` (${data.partialConformance})` : ''}.</p>
    
    ${data.conformanceLevel === 'Partial' ? `<p><strong>Partial Conformance:</strong> ${data.partialConformance}</p>` : ''}
    
    <h2>Standards</h2>
    <p>This website aims to conform to the following accessibility standards:</p>
    <ul>
        ${data.standards.map(standard => `<li>${standard}</li>`).join('\n        ')}
    </ul>
    
    <h2>Testing</h2>
    <p>We assessed the accessibility of this website using the following methods:</p>
    <ul>
        ${data.testingMethods.map(method => `<li>${method}</li>`).join('\n        ')}
    </ul>
    ${data.testingDate ? `<p><strong>Last tested:</strong> ${data.testingDate}</p>` : ''}
    
    ${data.knownLimitations.length > 0 ? `
    <h2>Known Limitations</h2>
    <p>Despite our best efforts to ensure accessibility, there may be some limitations. Below is a description of known limitations:</p>
    <ul>
        ${data.knownLimitations.map(limitation => `<li>${limitation}</li>`).join('\n        ')}
    </ul>
    ` : ''}
    
    <h2>Feedback</h2>
    <p>We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:</p>
    <div class="contact-info">
        ${data.feedbackMechanism.includes('email') ? `<p><strong>Email:</strong> <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></p>` : ''}
        ${data.contactPhone && data.feedbackMechanism.includes('phone') ? `<p><strong>Phone:</strong> <a href="tel:${data.contactPhone}">${data.contactPhone}</a></p>` : ''}
        ${data.feedbackUrl && data.feedbackMechanism.includes('form') ? `<p><strong>Feedback Form:</strong> <a href="${data.feedbackUrl}">${data.feedbackUrl}</a></p>` : ''}
    </div>
    
    <h2>Formal Complaints</h2>
    <p>You can file a formal complaint with us if you are not satisfied with our response. We aim to respond to accessibility feedback within 5 business days.</p>
    
    <div class="footer">
        <p><strong>Last updated:</strong> ${data.lastUpdated}</p>
        <p>This statement was generated using <a href="https://accessibility.build/tools/accessibility-statement-generator">Accessibility.build Statement Generator</a>.</p>
    </div>
</body>
</html>`

  if (template === 'comprehensive') {
    return baseHTML.replace('</body>', `
    <h2>Technical Information</h2>
    <p>This website relies on the following technologies:</p>
    <ul>
        ${data.technologies.map(tech => `<li>${tech}</li>`).join('\n        ')}
    </ul>
    
    ${data.userAgentNotes ? `<p><strong>User Agent Notes:</strong> ${data.userAgentNotes}</p>` : ''}
    
    ${data.assistiveTechnologies && data.assistiveTechnologies.length > 0 ? `
    <h2>Assistive Technologies</h2>
    <p>This website has been tested with the following assistive technologies:</p>
    <ul>
        ${data.assistiveTechnologies.map(tech => `<li>${tech}</li>`).join('\n        ')}
    </ul>
    ` : ''}
    
    <h2>Improvement Plan</h2>
    <p>We are committed to continuously improving accessibility. Our ongoing efforts include:</p>
    <ul>
        <li>Regular accessibility audits and testing</li>
        <li>Training for content creators and developers</li>
        <li>Implementation of accessibility best practices in our development process</li>
        <li>Regular updates to address identified barriers</li>
    </ul>
</body>`)
  }

  if (template === 'legal') {
    return baseHTML.replace('<h2>Formal Complaints</h2>', `
    <h2>Legal Compliance</h2>
    <p>This accessibility statement is provided in accordance with:</p>
    <ul>
        <li>Americans with Disabilities Act (ADA)</li>
        <li>Section 508 of the Rehabilitation Act</li>
        <li>EN 301 549 (European Standard)</li>
        <li>Accessibility for Ontarians with Disabilities Act (AODA)</li>
    </ul>
    
    <h2>Formal Complaints</h2>`)
  }

  return baseHTML
}

export function generateStatementMarkdown(data: StatementData, template: StatementTemplate): string {
  return `# Accessibility Statement

**${data.organizationName}** is committed to ensuring digital accessibility for people with disabilities.

## Conformance Status

The ${data.websiteUrl} website is ${data.conformanceLevel === 'Partial' ? 'partially conformant' : 'conformant'} with **WCAG 2.2 Level ${data.conformanceLevel}**${data.conformanceLevel === 'Partial' ? ` (${data.partialConformance})` : ''}.

## Standards

This website aims to conform to:
${data.standards.map(s => `- ${s}`).join('\n')}

## Testing

We assessed accessibility using:
${data.testingMethods.map(m => `- ${m}`).join('\n')}

${data.knownLimitations.length > 0 ? `## Known Limitations\n\n${data.knownLimitations.map(l => `- ${l}`).join('\n')}\n` : ''}

## Feedback

Contact us:
- Email: ${data.contactEmail}
${data.contactPhone ? `- Phone: ${data.contactPhone}` : ''}

Last updated: ${data.lastUpdated}
`
}

export function generateStatementPlainText(data: StatementData): string {
  return `ACCESSIBILITY STATEMENT

${data.organizationName} is committed to ensuring digital accessibility for people with disabilities.

CONFORMANCE STATUS
The ${data.websiteUrl} website is ${data.conformanceLevel === 'Partial' ? 'partially conformant' : 'conformant'} with WCAG 2.2 Level ${data.conformanceLevel}${data.conformanceLevel === 'Partial' ? ` (${data.partialConformance})` : ''}.

STANDARDS
${data.standards.map(s => `- ${s}`).join('\n')}

TESTING
${data.testingMethods.map(m => `- ${m}`).join('\n')}

${data.knownLimitations.length > 0 ? `KNOWN LIMITATIONS\n${data.knownLimitations.map(l => `- ${l}`).join('\n')}\n` : ''}

FEEDBACK
Email: ${data.contactEmail}
${data.contactPhone ? `Phone: ${data.contactPhone}` : ''}

Last updated: ${data.lastUpdated}
`
}

