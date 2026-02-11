import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Accessibility.Build',

  projectId: 'pcyg59i7',
  dataset: 'accessibilityblogs',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
