import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief description of the post for previews and SEO',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title for search engines (max 60 characters)',
          validation: Rule => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Description for search engines (max 160 characters)',
          rows: 3,
          validation: Rule => Rule.max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          description: 'SEO keywords for this post',
        }),
      ],
    }),
    defineField({
      name: 'accessibility',
      title: 'Accessibility',
      type: 'object',
      fields: [
        defineField({
          name: 'wcagLevel',
          title: 'WCAG Level',
          type: 'string',
          options: {
            list: [
              {title: 'A', value: 'A'},
              {title: 'AA', value: 'AA'},
              {title: 'AAA', value: 'AAA'},
            ],
          },
        }),
        defineField({
          name: 'topics',
          title: 'Accessibility Topics',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Screen Readers', value: 'screen-readers'},
              {title: 'Color Contrast', value: 'color-contrast'},
              {title: 'Keyboard Navigation', value: 'keyboard-navigation'},
              {title: 'ARIA Labels', value: 'aria-labels'},
              {title: 'Form Accessibility', value: 'form-accessibility'},
              {title: 'Image Alt Text', value: 'image-alt-text'},
              {title: 'Heading Structure', value: 'heading-structure'},
              {title: 'Focus Management', value: 'focus-management'},
            ],
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
