// Fetches AI news from a handful of free RSS feeds and writes a static
// JSON file the site reads directly (no runtime API calls, no backend).
//
// Run manually:  node scripts/fetch-weekly-report.js
// Run weekly by: .github/workflows/weekly-ai-report.yml

import Parser from 'rss-parser'
import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'weekly-report.json')
const MAX_STORIES = 8
const EXCERPT_LENGTH = 220

const FEEDS = [
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Technology Review' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge' },
  { url: 'https://news.google.com/rss/search?q=artificial%20intelligence&hl=en-US&gl=US&ceid=US:en', source: 'Google News' },
]

const parser = new Parser()

function truncate(text, length) {
  if (!text) return ''
  const clean = text.replace(/<[^>]*>/g, '').trim()
  return clean.length > length ? clean.slice(0, length).trim() + '…' : clean
}

function mondayOfCurrentWeek() {
  const now = new Date()
  const day = now.getUTCDay() // 0 = Sunday
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

async function fetchFeed({ url, source }) {
  try {
    const feed = await parser.parseURL(url)
    return (feed.items || []).map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '#',
      source,
      publishedDate: item.isoDate || item.pubDate || null,
      excerpt: truncate(item.contentSnippet || item.content || '', EXCERPT_LENGTH),
    }))
  } catch (err) {
    console.warn(`⚠️  Could not fetch feed "${source}" (${url}): ${err.message}`)
    return []
  }
}

function dedupe(stories) {
  const seen = new Set()
  return stories.filter((story) => {
    const key = story.title.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function main() {
  console.log('🗞️  Fetching weekly AI report...')
  const results = await Promise.all(FEEDS.map(fetchFeed))
  const allStories = dedupe(results.flat())
    .filter((s) => s.publishedDate)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, MAX_STORIES)

  if (allStories.length === 0) {
    console.error('❌ No stories fetched from any feed. Leaving existing weekly-report.json unchanged.')
    process.exit(1)
  }

  const report = {
    weekOf: mondayOfCurrentWeek(),
    generatedAt: new Date().toISOString(),
    stories: allStories,
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')
  console.log(`✅ Wrote ${allStories.length} stories to ${OUTPUT_PATH}`)
}

main()