import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Blog post queries
export async function getBlogPosts() {
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
}

export async function getBlogPost(slug: string) {
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
}

export async function getBlogCategories() {
  return await client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }
  `)
}

export async function getBlogPostsByCategory(categorySlug: string) {
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
} 
 
 