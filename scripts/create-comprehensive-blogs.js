const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2023-05-03',
    token: process.env.SANITY_API_TOKEN,
})

// Author: Khushwant Parihar
const author = {
    _type: 'author',
    name: 'Khushwant Parihar',
    slug: { _type: 'slug', current: 'khushwant-parihar' },
    bio: [{
        _type: 'block',
        children: [{
            _type: 'span',
            text: 'Khushwant Parihar is a passionate accessibility advocate and developer with over 5 years of experience in creating inclusive digital experiences. He specializes in WCAG compliance, accessibility auditing, and building tools that help organizations make their websites more accessible to everyone.',
        }, ],
    }, ],
}

// Categories
const categories = [{
        _type: 'category',
        title: 'WCAG Guidelines',
        slug: { _type: 'slug', current: 'wcag-guidelines' },
        description: 'Articles about Web Content Accessibility Guidelines',
    },
    {
        _type: 'category',
        title: 'Accessibility Auditing',
        slug: { _type: 'slug', current: 'accessibility-auditing' },
        description: 'Tools and techniques for accessibility auditing',
    },
    {
        _type: 'category',
        title: 'Accessibility Remediation',
        slug: { _type: 'slug', current: 'accessibility-remediation' },
        description: 'Fixing accessibility issues and implementing solutions',
    },
    {
        _type: 'category',
        title: 'Screen Readers',
        slug: { _type: 'slug', current: 'screen-readers' },
        description: 'Screen reader compatibility and testing',
    },
    {
        _type: 'category',
        title: 'Inclusive Design',
        slug: { _type: 'slug', current: 'inclusive-design' },
        description: 'Design principles for inclusive experiences',
    },
    {
        _type: 'category',
        title: 'Legal Compliance',
        slug: { _type: 'slug', current: 'legal-compliance' },
        description: 'ADA, Section 508, and legal accessibility requirements',
    },
]

// Comprehensive blog posts
const posts = [{
        _type: 'post',
        title: 'The Complete Guide to Web Accessibility Auditing in 2024',
        slug: { _type: 'slug', current: 'complete-guide-web-accessibility-auditing-2024' },
        excerpt: 'Master the art of accessibility auditing with comprehensive tools, techniques, and methodologies that ensure WCAG compliance and inclusive user experiences.',
        publishedAt: '2024-01-20T10:00:00Z',
        estimatedReadingTime: 12,
        body: [{
                _type: 'block',
                children: [{
                    _type: 'span',
                    text: 'Web accessibility auditing is a critical process that ensures digital experiences are inclusive and usable by everyone, including people with disabilities. This comprehensive guide will walk you through the essential tools, techniques, and methodologies for conducting thorough accessibility audits.',
                }, ],
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Understanding Accessibility Auditing' }],
            },
            {
                _type: 'block',
                children: [{
                    _type: 'span',
                    text: 'Accessibility auditing involves systematically evaluating digital content against established guidelines like WCAG 2.1 and 2.2. The process combines automated testing tools with manual evaluation techniques to identify barriers that might prevent users with disabilities from accessing your content.',
                }, ],
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'Key Components of an Accessibility Audit' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Automated scanning with tools like axe-core, WAVE, and Lighthouse' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Manual testing with screen readers (NVDA, JAWS, VoiceOver)' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Keyboard navigation testing' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Color contrast analysis' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Focus management evaluation' }],
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Essential Auditing Tools' }],
            },
            {
                _type: 'block',
                children: [{
                    _type: 'span',
                    text: 'The right tools can significantly streamline your auditing process. Here are the must-have tools for comprehensive accessibility testing:',
                }, ],
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'Automated Testing Tools' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'axe DevTools - Industry-standard automated testing' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'WAVE Web Accessibility Evaluator - Visual feedback tool' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Lighthouse Accessibility Audit - Built into Chrome DevTools' }],
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: 'Pa11y - Command line accessibility testing' }],
            },
        ],
        seo: {
            metaTitle: 'Complete Web Accessibility Auditing Guide 2024 - Tools & Techniques',
            metaDescription: 'Master web accessibility auditing with our comprehensive guide covering automated tools, manual testing, WCAG compliance, and remediation strategies.',
            keywords: ['accessibility auditing', 'WCAG compliance', 'web accessibility testing', 'accessibility tools', 'inclusive design'],
        },
        accessibility: {
            wcagLevel: 'AA',
            topics: ['accessibility-auditing', 'wcag-guidelines', 'screen-readers', 'keyboard-navigation'],
        },
    },
    {
        _type: 'post',
        title: 'Accessibility Remediation: From Audit to Implementation',
        slug: { _type: 'slug', current: 'accessibility-remediation-audit-to-implementation' },
        excerpt: 'Transform accessibility audit findings into actionable remediation strategies. Learn prioritization techniques, implementation approaches, and validation methods.',
        publishedAt: '2024-01-18T14:30:00Z',
        estimatedReadingTime: 10,
        body: [{
                _type: 'block',
                children: [{
                    _type: 'span',
                    text: 'Accessibility remediation is the crucial bridge between identifying accessibility issues and creating truly inclusive digital experiences. This guide provides a systematic approach to transforming audit findings into implemented solutions.',
                }, ],
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Understanding Remediation Priorities' }],
            },
            {
                _type: 'block',
                children: [{
                    _type: 'span',
                    text: 'Not all accessibility issues are created equal. Effective remediation starts with understanding which issues to tackle first based on impact, effort, and legal compliance requirements.',
                }, ],
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'Priority Matrix for Remediation' }],
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: 'Critical barriers (complete blockers for assistive technology users)' }],
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: 'High-impact issues (significantly impair user experience)' }],
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: 'Moderate issues (create friction but workarounds exist)' }],
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: 'Low-impact enhancements (improve overall experience)' }],
            },
        ],
        seo: {
            metaTitle: 'Accessibility Remediation Guide - From Audit to Implementation',
            metaDescription: 'Learn effective accessibility remediation strategies, prioritization techniques, and implementation approaches for WCAG compliance.',
            keywords: ['accessibility remediation', 'accessibility fixes', 'WCAG implementation', 'accessibility strategy'],
        },
        accessibility: {
            wcagLevel: 'AA',
            topics: ['accessibility-remediation', 'wcag-guidelines', 'implementation-strategies'],
        },
    },
    // Add more posts here...
]

async function createComprehensiveBlogs() {
    try {
        console.log('Creating author...')
        const createdAuthor = await client.create(author)
        console.log(`✓ Created author: ${createdAuthor.name}`)

        console.log('Creating categories...')
        const createdCategories = await Promise.all(
            categories.map(category => client.create(category))
        )
        console.log(`✓ Created ${createdCategories.length} categories`)

        console.log('Creating comprehensive blog posts...')
        const postsWithReferences = posts.map((post) => ({
            ...post,
            author: {
                _type: 'reference',
                _ref: createdAuthor._id,
            },
            categories: [{
                _type: 'reference',
                _ref: createdCategories[0]._id, // Default to first category
            }, ],
        }))

        const createdPosts = await Promise.all(
            postsWithReferences.map(post => client.create(post))
        )
        console.log(`✓ Created ${createdPosts.length} comprehensive blog posts`)

        console.log('\n🎉 Successfully created comprehensive accessibility blog content!')
        console.log('You can now view your posts in the Sanity Studio at http://localhost:3333')
        console.log('Or visit your blog at http://localhost:3002/blog')

    } catch (error) {
        console.error('Error creating comprehensive blogs:', error)
    }
}

createComprehensiveBlogs()