import { Metadata } from 'next'
import Base64Converter from '@/components/tools/base64-converter'

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder - Convert Text & Files | A11y Helper',
  description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text. Support for file uploads and instant conversion.',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 converter',
    'encode base64',
    'decode base64',
    'text to base64',
    'base64 to text',
    'file to base64',
    'online converter',
    'data encoding'
  ],
  openGraph: {
    title: 'Base64 Encoder/Decoder - Convert Text & Files',
    description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder/Decoder - Convert Text & Files',
    description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text.',
  },
}

export default function Base64ConverterPage() {
  return <Base64Converter />
} 
 
 