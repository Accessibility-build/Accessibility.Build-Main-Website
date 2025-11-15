import { Metadata } from 'next'
import ImageColorPicker from '@/components/tools/image-color-picker'

export const metadata: Metadata = {
  title: 'Image Color Picker - Extract Colors from Images | A11y Helper',
  description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly. Export color palettes in multiple formats for your design projects.',
  keywords: [
    'image color picker',
    'color extraction',
    'color palette generator',
    'hex color picker',
    'rgb color picker',
    'hsl color picker',
    'color palette export',
    'design tools',
    'color analysis',
    'web design tools'
  ],
  openGraph: {
    title: 'Image Color Picker - Extract Colors from Images',
    description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Color Picker - Extract Colors from Images',
    description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly.',
  },
}

export default function ImageColorPickerPage() {
  return <ImageColorPicker />
} 
 
 