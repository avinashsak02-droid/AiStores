import { useEffect, useState } from 'react'
import CoverArt from '../components/CoverArt'
import useInView from '../hooks/useInView'
import './WeeklyReport.css'

const MOTION_KEY = 'aistore-reduce-motion'
const REPORT_CACHE_KEY = 'aistore-weekly-report-cache'

function formatWeekOf(dateStr) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T00:00:00Z`)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function formatPublished(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function GazetteStory({ story, index, motionEnabled }) {
  const [ref, inView] = useInView()
  const animate = motionEnabled && inView

  return (
    <li className="gz-story reveal" style={{ '--d': index % 6 }}>
      <div ref={ref} className={`gz-art ${animate ? 'is-live' : ''}`}>
        <CoverArt seed={story.link || story.title} showIcon={false} />
      </div>
      <div className="gz-story-body">
        <p className="eyebrow gz-story-meta">
          {story.source}
          {story.publishedDate && ` / ${formatPublished(story.publishedDate)}`}
        </p>
        <a href={story.link} target="_blank" rel="noopener noreferrer" className="gz-story-title">
          {story.title}
        </a>
        {story.excerpt && <p className="gz-story-excerpt">{story.excerpt}</p>}
      </div>
    </li>
  )
}

export default function WeeklyReport() {
  const [report, setReport] = useState(null)
  const [motionEnabled, setMotionEnabled] = useState(true)

  // Load a cached copy instantly if we have one, then refresh in the background.
  useEffect(() => {
    const cached = sessionStorage.getItem(REPORT_CACHE_KEY)
    if (cached) {
      try {
        setReport(JSON.parse(cached))
      } catch {
        // ignore corrupt cache
      }
    }

    fetch('/weekly-report.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        setReport(data)
        sessionStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(data))
      })
      .catch((err) => console.warn('Could not load weekly report:', err))
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(MOTION_KEY)
    if (stored !== null) {
      setMotionEnabled(stored === 'on')
      return
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMotionEnabled(!prefersReduced)
  }, [])

  const toggleMotion = () => {
    setMotionEnabled((prev) => {
      const next = !prev
      localStorage.setItem(MOTION_KEY, next ? 'on' : 'off')
      return next
    })
  }

  const stories = report?.stories || []

  return (
    <main className="gazette">
      <section className="gz-hero">
        <div>
          <p className="eyebrow reveal">
            <span className="accent">The Weekly AI Gazette</span>
          </p>
          <h1 className="gz-title reveal" style={{ '--d': 1 }}>
            This week in <em>artificial intelligence</em>
          </h1>
          <p className="gz-lede reveal" style={{ '--d': 2 }}>
            {report ? `Issue for the week of ${formatWeekOf(report.weekOf)}.` : 'Loading this week’s issue…'} Refreshed every Monday.
          </p>
        </div>
        <button type="button" className="btn btn--ghost btn--sm gz-motion-toggle" onClick={toggleMotion}>
          {motionEnabled ? 'Reduce motion' : 'Enable motion'}
        </button>
      </section>

      <div className="divider-heavy"></div>

      {stories.length > 0 ? (
        <ul className="gz-index">
          {stories.map((story, index) => (
            <GazetteStory
              key={story.link || story.title}
              story={story}
              index={index}
              motionEnabled={motionEnabled}
            />
          ))}
        </ul>
      ) : (
        <div className="gz-empty">
          <h3>{report ? 'No stories in this issue.' : 'Loading…'}</h3>
          <p>Check back after the next weekly update.</p>
        </div>
      )}

      <footer className="mk-footer">
        <span>AIStore / Weekly AI Gazette</span>
        <span>{report?.generatedAt ? `Generated ${new Date(report.generatedAt).toLocaleDateString()}` : ''}</span>
      </footer>
    </main>
  )
}