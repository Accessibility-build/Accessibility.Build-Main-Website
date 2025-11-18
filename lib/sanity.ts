import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Check if Sanity is properly configured
const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.trim() &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'dummy' &&
  process.env.NEXT_PUBLIC_SANITY_DATASET &&
  process.env.NEXT_PUBLIC_SANITY_DATASET.trim()
)

// Only create client if Sanity is configured
export const client = isSanityConfigured ? createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
}) : null

export function urlFor(source: any) {
  if (!client) {
    throw new Error('Sanity is not configured')
  }
  const builder = imageUrlBuilder(client)
  return builder.image(source)
}

// Blog post queries
export async function getBlogPosts() {
  if (!client) {
    console.warn('Sanity is not configured, returning empty blog posts')
    return []
  }
  
  try {
    return await client.fetch(`
      *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "author": author->{
          name,
          "image": image.asset->url
        },
        "mainImage": mainImage.asset->url,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
        categories[]->{
          title,
          slug
        }
      }
    `)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string) {
  if (!client) {
    console.warn('Sanity is not configured, returning null')
    return null
  }
  
  try {
    return await client.fetch(`
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        body,
        "author": author->{
          name,
          "image": image.asset->url,
          bio
        },
        "mainImage": mainImage.asset->url,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
        categories[]->{
          title,
          slug
        },
        seo {
          metaTitle,
          metaDescription,
          keywords
        }
      }
    `, { slug })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getBlogCategories() {
  if (!client) {
    console.warn('Sanity is not configured, returning empty categories')
    return []
  }
  
  try {
    return await client.fetch(`
      *[_type == "category"] | order(title asc) {
        _id,
        title,
        slug,
        description
      }
    `)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getBlogPostsByCategory(categorySlug: string) {
  if (!client) {
    console.warn('Sanity is not configured, returning empty posts')
    return []
  }
  
  try {
    return await client.fetch(`
      *[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "author": author->{
          name,
          "image": image.asset->url
        },
        "mainImage": mainImage.asset->url,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
      }
    `, { categorySlug })
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
} 
 
 