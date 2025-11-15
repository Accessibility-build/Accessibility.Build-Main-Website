import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Accessibility.Build',

  projectId: 'pcyg59i7',
  dataset: 'accessibilityblogs',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
