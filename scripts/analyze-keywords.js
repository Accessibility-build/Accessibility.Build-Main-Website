import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function extractKeywords(content, tags = []) {
  const textContent = content.replace(/<[^>]*>/g, ' ')
  const stopWords = [
    'a','an','the','and','or','but','is','are','was','were','in','on','at','to','for','with','by','about','as','of'
  ]
  const words = textContent
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))

  const wordCounts = {}
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  }

  const sortedWords = Object.entries(wordCounts)
    .sort((a,b) => b[1]-a[1])
    .map(entry => entry[0])

  return [...new Set([...tags, ...sortedWords])].slice(0,10)
}

function analyzeKeywords() {
  const blogDir = path.join(process.cwd(), 'content', 'blog')
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'))
  const keywordCounts = {}
  for (const file of files) {
    const filePath = path.join(blogDir, file)
    const { data, content } = matter.read(filePath)
    const keywords = extractKeywords(content, data.tags || [])
    for (const kw of keywords) {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1
    }
  }
  const sorted = Object.entries(keywordCounts).sort((a,b) => b[1]-a[1])
  console.log('Keyword Frequency:')
  for (const [kw,count] of sorted) {
    console.log(`${kw}: ${count}`)
  }
  console.log('\nTop Keywords:')
  console.log(sorted.slice(0,10).map(([kw])=>kw).join(', '))
}

analyzeKeywords()
