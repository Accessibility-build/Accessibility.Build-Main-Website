export default {
  slug: 'accessible-images-alt-text',
  title: 'Accessible Images and Alt Text: Complete Guide for Web Developers',
  excerpt: 'Master alt text writing, image accessibility, and WCAG compliance. Learn when to use alt text, how to write effective descriptions, and handle complex images with practical examples.',
  publishedAt: '2024-01-08T10:00:00Z',
  categoryTitles: ['WCAG Guidelines'],
  seo: {
    metaTitle: 'Accessible Images and Alt Text: Developer Guide',
    metaDescription: 'Master alt text writing, image accessibility, and WCAG compliance. Learn when to use alt text, write effective descriptions, and handle complex images.',
    keywords: ['alt text', 'image accessibility', 'accessible images', 'alt text best practices', 'WCAG image compliance', 'screen reader images', 'image descriptions', 'alt attribute'],
  },
  body: [
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Why Image Accessibility Matters' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Images are everywhere on the web, but they can create significant barriers for users who are blind, have low vision, or use screen readers. Proper image accessibility ensures that visual content is available to everyone through alternative text descriptions.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: `According to WebAIM's screen reader survey, images without proper alt text are one of the most frustrating accessibility barriers for blind users. With over 1 billion images uploaded to the web daily, getting image accessibility right is crucial for an inclusive web.` }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Understanding Different Types of Images' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Not all images require the same accessibility treatment. Understanding the different types helps you choose the right approach:' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '1. Informative Images' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Images that convey important information need descriptive alt text that captures the essential meaning.' }] },
    { _type: 'code', language: 'html', code: `<!-- Good: Descriptive alt text -->
<img src="sales-chart.png"
     alt="Sales increased 25% from Q1 to Q2, reaching $50,000 in June">

<!-- Bad: Generic alt text -->
<img src="sales-chart.png" alt="Chart">` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '2. Decorative Images' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Purely decorative images should have empty alt attributes to hide them from screen readers.' }] },
    { _type: 'code', language: 'html', code: `<!-- Decorative image -->
<img src="decorative-border.png" alt="" role="presentation">

<!-- Using CSS for decorative images is even better -->
<div class="decorative-border"></div>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '3. Functional Images' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Images that serve as links or buttons should describe their function, not their appearance.' }] },
    { _type: 'code', language: 'html', code: `<!-- Image button -->
<button>
  <img src="search-icon.svg" alt="Search">
</button>

<!-- Image link -->
<a href="/contact">
  <img src="phone-icon.svg" alt="Contact us">
</a>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: '4. Complex Images' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Charts, graphs, and diagrams need both concise alt text and detailed descriptions.' }] },
    { _type: 'code', language: 'html', code: `<!-- Complex image with description -->
<img src="quarterly-sales.png"
     alt="Quarterly sales data showing steady growth"
     aria-describedby="chart-description">

<div id="chart-description">
  <h3>Quarterly Sales Data</h3>
  <p>Sales performance over four quarters:</p>
  <ul>
    <li>Q1 2023: $30,000 (20% increase from previous year)</li>
    <li>Q2 2023: $45,000 (50% increase from Q1)</li>
    <li>Q3 2023: $52,000 (15% increase from Q2)</li>
    <li>Q4 2023: $58,000 (12% increase from Q3)</li>
  </ul>
</div>` },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Writing Effective Alt Text' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: `Good alt text is an art that balances brevity with descriptiveness. Here's how to master it:` }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Alt Text Best Practices' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Be concise: ', marks: ['strong'] }, { _type: 'span', text: 'Aim for 125 characters or less when possible' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Be specific: ', marks: ['strong'] }, { _type: 'span', text: `Describe what's actually in the image, not what you think it represents` }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Consider context: ', marks: ['strong'] }, { _type: 'span', text: 'Alt text should complement surrounding content, not repeat it' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: `Don't say "image of": `, marks: ['strong'] }, { _type: 'span', text: `Screen readers already announce it's an image` }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Include text in images: ', marks: ['strong'] }, { _type: 'span', text: 'If the image contains important text, include it in alt text' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Describe the mood when relevant: ', marks: ['strong'] }, { _type: 'span', text: 'For artistic images, mood and style can be important' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Alt Text Examples: Good vs Bad' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Image: ', marks: ['strong'] }, { _type: 'span', text: 'A golden retriever playing fetch in a sunny park' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '❌ Poor: ', marks: ['strong'] }, { _type: 'span', text: '"Dog"' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '❌ Too generic: ', marks: ['strong'] }, { _type: 'span', text: '"Image of a dog playing"' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '✅ Good: ', marks: ['strong'] }, { _type: 'span', text: '"Golden retriever catching a tennis ball in a sunny park"' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Image: ', marks: ['strong'] }, { _type: 'span', text: 'Screenshot of a login form' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '❌ Poor: ', marks: ['strong'] }, { _type: 'span', text: '"Login screen"' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '✅ Good: ', marks: ['strong'] }, { _type: 'span', text: `"Login form with email and password fields and blue 'Sign In' button"` }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Image: ', marks: ['strong'] }, { _type: 'span', text: 'Company team photo' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '❌ Poor: ', marks: ['strong'] }, { _type: 'span', text: '"Team photo"' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '✅ Good: ', marks: ['strong'] }, { _type: 'span', text: '"Five team members smiling at camera in modern office conference room"' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Technical Implementation' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Basic HTML Implementation' }] },
    { _type: 'code', language: 'html', code: `<!-- Standard image with alt text -->
<img src="product.jpg"
     alt="Blue wireless headphones with adjustable headband and noise cancellation"
     width="300"
     height="200">

<!-- Image with caption -->
<figure>
  <img src="team-retreat.jpg"
       alt="Five team members hiking together on mountain trail">
  <figcaption>Our development team at the 2023 annual retreat</figcaption>
</figure>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Responsive Images' }] },
    { _type: 'code', language: 'html', code: `<!-- Responsive image with alt text -->
<picture>
  <source media="(min-width: 800px)" srcset="large-hero.jpg">
  <source media="(min-width: 400px)" srcset="medium-hero.jpg">
  <img src="small-hero.jpg"
       alt="Mountain landscape at sunrise with orange and purple sky reflecting in calm lake">
</picture>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'CSS Background Images' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'CSS background images are invisible to screen readers. If the image conveys important information, use HTML images instead or provide alternative content.' }] },
    { _type: 'code', language: 'html', code: `<!-- CSS background image with accessible alternative -->
<div class="hero-banner"
     role="img"
     aria-label="Snow-capped mountain peaks at sunset with village lights below">
  <h1>Welcome to Alpine Adventures</h1>
  <p>Discover breathtaking mountain experiences</p>
</div>

<style>
.hero-banner {
  background-image: url('mountain-sunset.jpg');
  background-size: cover;
  background-position: center;
}
</style>` },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Handling Special Cases' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Images with Text Overlays' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'When images contain text, include that text in the alt attribute along with relevant visual context.' }] },
    { _type: 'code', language: 'html', code: `<!-- Image with text overlay -->
<img src="sale-banner.jpg"
     alt="50% OFF SALE - Limited Time Offer - Shop Now - Bright red background with white text">` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Image Galleries' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'For image galleries, provide meaningful alt text for each image while avoiding repetition.' }] },
    { _type: 'code', language: 'html', code: `<!-- Image gallery with descriptive alt text -->
<div class="gallery" aria-label="Nature photography collection">
  <img src="sunset-lake.jpg"
       alt="Golden sunset reflecting on calm lake with silhouetted pine trees">
  <img src="morning-dew.jpg"
       alt="Close-up of water droplets on red tulip petals in morning light">
  <img src="mountain-peak.jpg"
       alt="Snow-covered mountain peak against deep blue sky with wispy clouds">
</div>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Loading States and Error Handling' }] },
    { _type: 'code', language: 'html', code: `<!-- Image with loading state and error handling -->
<img src="large-infographic.jpg"
     alt="Complete guide to web accessibility - infographic showing 10 key principles"
     loading="lazy"
     onerror="this.alt='Image unavailable: Accessibility guide infographic'">` },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Testing Image Accessibility' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Automated Testing Tools' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'axe DevTools: ', marks: ['strong'] }, { _type: 'span', text: 'Identifies missing alt text and empty images' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'WAVE: ', marks: ['strong'] }, { _type: 'span', text: 'Shows alt text content and identifies accessibility issues' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Lighthouse: ', marks: ['strong'] }, { _type: 'span', text: 'Audits image accessibility as part of overall accessibility score' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Alt Text Tester: ', marks: ['strong'] }, { _type: 'span', text: 'Browser bookmarklet to display all alt text' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Manual Testing Methods' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Turn off images: ', marks: ['strong'] }, { _type: 'span', text: 'Disable images in your browser to see if content still makes sense' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Use a screen reader: ', marks: ['strong'] }, { _type: 'span', text: 'Navigate with NVDA or VoiceOver to hear how images are announced' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Review in context: ', marks: ['strong'] }, { _type: 'span', text: 'Check that alt text provides equivalent information to the visual' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Test with users: ', marks: ['strong'] }, { _type: 'span', text: 'Get feedback from actual screen reader users when possible' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Common Alt Text Mistakes' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Redundant descriptions: ', marks: ['strong'] }, { _type: 'span', text: `Don't repeat information already in surrounding text` }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Keyword stuffing: ', marks: ['strong'] }, { _type: 'span', text: `Don't stuff keywords into alt text for SEO purposes` }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Overly long descriptions: ', marks: ['strong'] }, { _type: 'span', text: 'Keep alt text focused on essential information' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Missing alt attributes: ', marks: ['strong'] }, { _type: 'span', text: 'Every img tag should have an alt attribute (empty if decorative)' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Filename as alt text: ', marks: ['strong'] }, { _type: 'span', text: '"IMG_1234.jpg" or "screenshot.png" are not helpful' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Generic descriptions: ', marks: ['strong'] }, { _type: 'span', text: `"Photo" or "Image" don't provide useful information` }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Advanced Techniques' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Using ARIA for Complex Images' }] },
    { _type: 'code', language: 'html', code: `<!-- Complex infographic with detailed description -->
<img src="carbon-footprint-infographic.png"
     alt="5 steps to reduce carbon footprint infographic"
     aria-describedby="infographic-details"
     role="img">

<div id="infographic-details">
  <h3>5 Steps to Reduce Your Carbon Footprint</h3>
  <ol>
    <li><strong>Transportation (45% reduction):</strong> Use public transit, bike, or walk instead of driving</li>
    <li><strong>Energy (30% reduction):</strong> Switch to renewable energy sources</li>
    <li><strong>Diet (15% reduction):</strong> Reduce meat consumption, especially beef</li>
    <li><strong>Shopping (8% reduction):</strong> Buy local, seasonal products</li>
    <li><strong>Waste (5% reduction):</strong> Recycle properly and reduce single-use items</li>
  </ol>
</div>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'SVG Accessibility' }] },
    { _type: 'code', language: 'html', code: `<!-- Accessible SVG with title and description -->
<svg role="img" aria-labelledby="chart-title" aria-describedby="chart-desc" width="400" height="300">
  <title id="chart-title">Monthly Website Traffic Trends</title>
  <desc id="chart-desc">
    Bar chart showing website traffic growth from 1,000 visitors in January
    to 5,000 visitors in June, with steady monthly increases
  </desc>
  <!-- SVG chart content -->
  <rect x="0" y="250" width="50" height="50" fill="#3b82f6"/>
  <rect x="60" y="200" width="50" height="100" fill="#3b82f6"/>
  <!-- More chart elements -->
</svg>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Interactive Images' }] },
    { _type: 'code', language: 'html', code: `<!-- Image map with accessible alternatives -->
<img src="office-floor-plan.jpg"
     alt="Office floor plan with clickable room areas"
     usemap="#floor-plan">

<map name="floor-plan">
  <area shape="rect" coords="10,10,100,50"
        href="/rooms/conference"
        alt="Conference Room A - Seats 12 people">
  <area shape="rect" coords="10,60,100,100"
        href="/rooms/kitchen"
        alt="Kitchen and break area">
  <area shape="rect" coords="110,10,200,100"
        href="/rooms/open-office"
        alt="Open office workspace - 20 desks">
</map>` },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Need Help with Alt Text?' }] },
    { _type: 'block', style: 'normal', markDefs: [{ _key: 'l1', _type: 'link', href: '/tools/alt-text-generator' }], children: [{ _type: 'span', text: 'Use our ' }, { _type: 'span', text: 'AI Alt Text Generator', marks: ['l1'] }, { _type: 'span', text: ' to create descriptive, accessible alt text for your images. Upload an image and get AI-powered suggestions that follow accessibility best practices and WCAG guidelines.' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Image Accessibility in Different Contexts' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'E-commerce Product Images' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Describe the product, color, style, and key features' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Include size, material, or other relevant attributes' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'For multiple views, specify the angle or perspective' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Example: "Black leather messenger bag with silver buckles and adjustable shoulder strap, front view"' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Social Media and Marketing' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Focus on the message or call-to-action' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Include important text from the image' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Describe the emotional tone when relevant' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Keep brand voice in mind while maintaining accessibility' }] },

    { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Educational Content' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Focus on the learning objective' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Describe relationships and processes shown' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Include all text and labels' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Consider providing detailed descriptions for complex diagrams' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Alt Text and SEO' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'While alt text is primarily for accessibility, it also benefits SEO:' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Image search: ', marks: ['strong'] }, { _type: 'span', text: 'Alt text helps images appear in relevant searches' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Context for crawlers: ', marks: ['strong'] }, { _type: 'span', text: 'Search engines use alt text to understand image content' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'User experience: ', marks: ['strong'] }, { _type: 'span', text: 'Better accessibility leads to better user engagement' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Best practice: ', marks: ['strong'] }, { _type: 'span', text: 'Write alt text for users first, SEO benefits will follow naturally' }] },

    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Conclusion' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Image accessibility is fundamental to creating an inclusive web. By understanding different types of images, writing effective alt text, and implementing proper HTML techniques, you ensure that visual content is available to all users.' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Remember these key principles:' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Every image needs an alt attribute (even if empty)' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Alt text should convey the same information as the image' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Context matters - consider the surrounding content' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Test with real users and assistive technologies' }] },
    { _type: 'block', listItem: 'bullet', style: 'normal', children: [{ _type: 'span', text: 'Accessibility and good SEO go hand in hand' }] },
    { _type: 'block', style: 'normal', children: [{ _type: 'span', text: `Good image accessibility isn't just about compliance—it's about creating equivalent experiences for all users and making the web more inclusive for everyone.` }] },
  ],
}
