export interface ReportData {
  organizationName: string
  websiteUrl: string
  reportDate: string
  reportType: 'executive' | 'technical' | 'compliance' | 'progress'
  overallScore?: number
  totalViolations: number
  violations: Array<{
    id: string
    description: string
    impact: 'critical' | 'serious' | 'moderate' | 'minor'
    wcagCriteria: string[]
    elementCount?: number
    fixSuggestion?: string
  }>
  summary: {
    critical: number
    serious: number
    moderate: number
    minor: number
  }
  recommendations: string[]
  nextSteps: string[]
  customBranding?: {
    companyName?: string
    logoUrl?: string
    colorScheme?: string
  }
}

export function generateReportHTML(data: ReportData): string {
  const scoreColor = data.overallScore 
    ? data.overallScore >= 90 ? '#10b981' 
    : data.overallScore >= 70 ? '#f59e0b' 
    : '#ef4444'
    : '#6b7280'

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - ${data.organizationName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
            padding: 40px 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1e40af;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        h2 {
            color: #1e40af;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-card.critical { background: #fee2e2; border-left: 4px solid #ef4444; }
        .summary-card.serious { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .summary-card.moderate { background: #dbeafe; border-left: 4px solid #3b82f6; }
        .summary-card.minor { background: #f3f4f6; border-left: 4px solid #6b7280; }
        .summary-card.score {
            background: linear-gradient(135deg, ${scoreColor}15, ${scoreColor}05);
            border-left: 4px solid ${scoreColor};
        }
        .summary-card h3 {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .summary-card p {
            color: #6b7280;
            font-size: 0.875rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
        }
        .impact-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .impact-critical { background: #fee2e2; color: #991b1b; }
        .impact-serious { background: #fef3c7; color: #92400e; }
        .impact-moderate { background: #dbeafe; color: #1e40af; }
        .impact-minor { background: #f3f4f6; color: #374151; }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin: 5px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Accessibility Audit Report</h1>
        
        <div style="margin-bottom: 30px;">
            <p><strong>Organization:</strong> ${data.organizationName}</p>
            <p><strong>Website:</strong> <a href="${data.websiteUrl}">${data.websiteUrl}</a></p>
            <p><strong>Report Date:</strong> ${data.reportDate}</p>
            <p><strong>Report Type:</strong> ${data.reportType.charAt(0).toUpperCase() + data.reportType.slice(1)}</p>
        </div>

        <div class="summary-grid">
            ${data.overallScore ? `
            <div class="summary-card score">
                <h3 style="color: ${scoreColor};">${data.overallScore}</h3>
                <p>Overall Score</p>
            </div>
            ` : ''}
            <div class="summary-card critical">
                <h3>${data.summary.critical}</h3>
                <p>Critical Issues</p>
            </div>
            <div class="summary-card serious">
                <h3>${data.summary.serious}</h3>
                <p>Serious Issues</p>
            </div>
            <div class="summary-card moderate">
                <h3>${data.summary.moderate}</h3>
                <p>Moderate Issues</p>
            </div>
            <div class="summary-card minor">
                <h3>${data.summary.minor}</h3>
                <p>Minor Issues</p>
            </div>
        </div>

        <h2>Executive Summary</h2>
        <p>This accessibility audit identified <strong>${data.totalViolations}</strong> accessibility violations across the website. 
        The audit was conducted on ${data.reportDate} and covers WCAG 2.2 compliance requirements.</p>

        <h2>Violations</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Impact</th>
                    <th>WCAG Criteria</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                ${data.violations.map(v => `
                <tr>
                    <td>${v.id}</td>
                    <td>${v.description}</td>
                    <td><span class="impact-badge impact-${v.impact}">${v.impact.toUpperCase()}</span></td>
                    <td>${v.wcagCriteria.join(', ')}</td>
                    <td>${v.elementCount || 1}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        ${data.recommendations.length > 0 ? `
        <h2>Recommendations</h2>
        <ul>
            ${data.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
        ` : ''}

        ${data.nextSteps.length > 0 ? `
        <h2>Next Steps</h2>
        <ol>
            ${data.nextSteps.map(s => `<li>${s}</li>`).join('')}
        </ol>
        ` : ''}

        <div class="footer">
            <p>Generated by <a href="https://accessibility.build">Accessibility.build</a> Report Generator</p>
            <p>Report Date: ${data.reportDate}</p>
        </div>
    </div>
</body>
</html>`
}

export function generateReportMarkdown(data: ReportData): string {
  return `# Accessibility Audit Report

**Organization:** ${data.organizationName}  
**Website:** ${data.websiteUrl}  
**Report Date:** ${data.reportDate}  
**Report Type:** ${data.reportType}

## Summary

${data.overallScore ? `**Overall Score:** ${data.overallScore}/100\n` : ''}
- **Total Violations:** ${data.totalViolations}
- **Critical:** ${data.summary.critical}
- **Serious:** ${data.summary.serious}
- **Moderate:** ${data.summary.moderate}
- **Minor:** ${data.summary.minor}

## Violations

${data.violations.map(v => `
### ${v.id}: ${v.description}

- **Impact:** ${v.impact.toUpperCase()}
- **WCAG Criteria:** ${v.wcagCriteria.join(', ')}
- **Element Count:** ${v.elementCount || 1}
${v.fixSuggestion ? `- **Fix Suggestion:** ${v.fixSuggestion}` : ''}
`).join('\n')}

${data.recommendations.length > 0 ? `## Recommendations\n\n${data.recommendations.map(r => `- ${r}`).join('\n')}\n` : ''}

${data.nextSteps.length > 0 ? `## Next Steps\n\n${data.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` : ''}

---
*Generated by Accessibility.build Report Generator*
`
}

