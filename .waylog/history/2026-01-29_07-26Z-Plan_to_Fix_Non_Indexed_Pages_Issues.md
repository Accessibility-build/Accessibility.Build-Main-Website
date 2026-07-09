# Plan to Fix Non-Indexed Pages Issues
_Exported on 07/09/2026 at 20:55:20 GMT+5:30 from Copilot Chat via WayLog_


**User**

Why pages aren’t indexed
Pages that aren’t indexed can’t be served on Google
Reason	Source

Validation	Trend	Pages
Alternate page with proper canonical tag	Website	

Not Started
13
Page with redirect	Website	

Not Started
8
Blocked by robots.txt	Website	

Not Started
4
Excluded by ‘noindex’ tag	Website	

Not Started
1
Not found (404)	Website	

Not Started
1
Crawled - currently not indexed	Google systems	

Not Started
17
Discovered - currently not indexed	Google systems	

Not Started
12
Soft 404	Website	
N/A
0
Rows per page:
1-8 of 8
 I want you analyse all the pages causing this unecessary issues and create a detailed plan to fix this 

---


**User**

@agent Enable: "Enable GPT-5.2-Codex for all clients"

---


**Copilot Chat**

## Plan: Fix Google Search Console Indexing Issues

The site has critical SEO configuration problems causing 56 pages to fail indexing: wrong canonical domains on WCAG pages, robots.txt blocking user-facing routes, authentication redirects confusing crawlers, and sitemap conflicts with robots.txt rules.

### Steps

1. **Fix canonical URL domain inconsistency** - Update all WCAG pages (wcag/1-1-1-non-text-content/page.tsx, wcag/1-3-1-info-and-relationships/page.tsx, wcag/1-4-3-contrast-minimum/page.tsx, wcag/2-1-1-keyboard/page.tsx, wcag/4-1-2-name-role-value/page.tsx) to use `accessibility.build` instead of `accessibilitybuild.com`, and standardize all metadata base URLs across layout files to use the correct domain.

2. **Remove user routes from robots.txt disallow list** - Update 
 to remove `/dashboard*`, `/profile*`, `/sign-in*`, `/sign-up*` from disallow array, and add conditional logic to block crawling only for authenticated session routes while allowing public visibility of these URLs.

3. **Exclude auth-protected routes from sitemap** - Modify 
 to remove admin routes (`/admin/*`), dashboard pages, sign-in/sign-up, profile, billing, and onboarding pages that require authentication and shouldn't be indexed.

4. **Add redirect handling for changed/moved pages** - Create redirect rules in 
 or 
 for the 404 page and any 8 redirect-causing URLs, implementing 301 permanent redirects to consolidated canonical URLs.

5. **Implement server-side rendering for homepage** - Convert 
 from `"use client"` to server component to improve crawlability and remove client-side rendering barriers for SEO.

6. **Create static robots.txt file** - Add `public/robots.txt` file as fallback to programmatic generation in 
, ensuring proper sitemap URL and consistent crawler directives.

### Further Considerations

1. **Domain migration strategy** - Do you need 301 redirects from `accessibilitybuild.com` to `accessibility.build`, or is this a typo? Should we set up domain consolidation in DNS/hosting?

2. **Crawled but not indexed pages** - The 17 pages Google crawled but didn't index may need content improvements, internal linking enhancements, or higher sitemap priority. Should we audit these for thin content?

3. **Discovered but not indexed pages** - The 12 discovered pages may benefit from forcing re-indexing via Google Search Console after fixes, or adding more prominent internal links to improve crawl priority.

---


**User**

we don't own accessibilitybuild.com

---


**Copilot Chat**

## Plan: Fix Google Search Console Indexing Issues

**CRITICAL:** 13+ WCAG pages have canonical URLs pointing to `accessibilitybuild.com` (which you don't own), telling Google those pages belong to another domain. This is causing Google to skip indexing your actual pages on `accessibility.build`. Additional issues include robots.txt blocking legitimate routes, sitemap conflicts, and authentication redirects.

### Steps

1. **URGENT: Fix canonical URLs pointing to wrong domain** - Immediately update all WCAG pages (wcag/1-1-1-non-text-content/page.tsx, wcag/1-3-1-info-and-relationships/page.tsx, wcag/1-4-3-contrast-minimum/page.tsx, wcag/2-1-1-keyboard/page.tsx, wcag/4-1-2-name-role-value/page.tsx) to replace `https://accessibilitybuild.com` with `https://accessibility.build`, and audit all other metadata base URLs across the site for the same typo.

2. **Remove user routes from robots.txt disallow list** - Update 
 to remove `/dashboard*`, `/profile*`, `/sign-in*`, `/sign-up*` from disallow array, keeping only truly private routes like `/api/*` and `/admin/*` blocked.

3. **Exclude auth-protected routes from sitemap** - Modify 
 to remove admin, dashboard, billing, profile, onboarding, sign-in, and sign-up pages that require authentication and shouldn't appear in search results.

4. **Add redirect handling for moved pages** - Create redirect rules in 
 or 
 for the 404 page and implement 301 permanent redirects to prevent broken links.

5. **Implement server-side rendering for homepage** - Convert 
 from `"use client"` to server component to improve SEO crawlability.

6. **Create static robots.txt file** - Add `public/robots.txt` as backup to programmatic 
 for crawler reliability.

### Further Considerations

1. **Check for content theft** - Should we verify if `accessibilitybuild.com` exists and is using your content? This could be a copyright/SEO attack requiring DMCA action or reporting to Google.

2. **Force re-indexing after canonical fix** - After fixing canonical URLs, should we submit URLs for re-indexing via Google Search Console API to speed up recovery?

3. **Audit all hardcoded URLs** - Should we search the entire codebase for `accessibilitybuild.com` to catch any other instances in links, structured data, or configurations?

---


**User**

@cli Start implementation

---


**Copilot Chat**

Background Agent has begun working on your request. Follow its progress in the Agents View.

---
