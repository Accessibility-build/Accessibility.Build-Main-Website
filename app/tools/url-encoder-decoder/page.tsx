import { Metadata } from 'next'
import URLEncoderDecoder from '@/components/tools/url-encoder-decoder'

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder - Encode & Decode URLs Online | A11y Helper',
  description: 'Free online URL encoder and decoder. Handle special characters, spaces, and international characters in URLs and query parameters safely.',
  keywords: [
    'url encoder',
    'url decoder',
    'url encoding',
    'percent encoding',
    'url escape',
    'query parameters',
    'special characters',
    'international characters',
    'web development',
    'online converter'
  ],
  openGraph: {
    title: 'URL Encoder/Decoder - Encode & Decode URLs Online',
    description: 'Free online URL encoder and decoder. Handle special characters safely in URLs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Encoder/Decoder - Encode & Decode URLs Online',
    description: 'Free online URL encoder and decoder. Handle special characters safely in URLs.',
  },
}

export default function URLEncoderDecoderPage() {
  return <URLEncoderDecoder />
} 
 
 