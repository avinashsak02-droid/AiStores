import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CoverArt from '../components/CoverArt'
import { ArrowUpRight } from '../components/Icons'
import useInView from '../hooks/useInView'
import './WeeklyReport.css'

const MOTION_KEY = 'aistore-reduce-motion'
const REPORT_CACHE_KEY = 'aistore-weekly-report-cache'
const OPENED_KEY = 'aistore-gazette-opened'

// Set to false if you want NO imagery on the page until real photos/videos exist.
const SHOW_GENERATED_PLATE = true

// Lead story = most recent story whose headline is short enough to run as giant type.
const MAX_LEAD_HEADLINE = 80
const PAGE_ONE_SIDE_STORIES = 3

/* ---------- Small helpers ---------- */

function formatWeekOf(dateStr) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T00:00:00Z`)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function formatPublished(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function issueNumber(weekOf) {
  if (!weekOf) return ''
  const d = new Date(`${weekOf}T00:00:00Z`)
  const start = Date.UTC(d.getUTCFullYear(), 0, 1)
  return Math.floor((d - start) / (7 * 864e5)) + 1
}

function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')

// Google News titles end in " - Publisher". Split that off, and drop excerpts
// that are only the headline repeated.
function prepareStory(story) {
  let headline = story.title || 'Untitled'
  let publisher = story.source
  if (story.source === 'Google News') {
    const cut = headline.lastIndexOf(' - ')
    if (cut > 0) {
      publisher = headline.slice(cut + 3).trim() || publisher
      headline = headline.slice(0, cut).trim()
    }
  }
  const redundant = !story.excerpt || norm(story.excerpt).includes(norm(headline).slice(0, 40))
  return { ...story, headline, publisher, blurb: redundant ? '' : story.excerpt }
}

function arrangeStories(stories) {
  const prepared = stories.map(prepareStory)
  if (prepared.length === 0) return { lead: null, rest: [] }
  let leadIndex = prepared.findIndex((s) => s.headline.length <= MAX_LEAD_HEADLINE)
  if (leadIndex < 0) leadIndex = 0
  return { lead: prepared[leadIndex], rest: prepared.filter((_, i) => i !== leadIndex) }
}

function hasPlate(story) {
  return SHOW_GENERATED_PLATE || Boolean(story.image || story.video)
}

function readMotionPref() {
  try {
    const stored = localStorage.getItem(MOTION_KEY)
    if (stored !== null) return stored === 'on'
  } catch {
    // storage blocked — fall through to the OS preference
  }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function readCachedReport() {
  try {
    const cached = sessionStorage.getItem(REPORT_CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

/* ---------- Living type ---------- */

// Each letter is its own span so CSS can "print" it in. Words stay unbroken.
function PrintedHeadline({ text }) {
  let offset = 0
  return text.split(' ').map((word, w) => {
    const start = offset
    offset += word.length + 1
    return (
      <Fragment key={w}>
        <span className="gz-word">
          {[...word].map((ch, i) => (
            <span className="gz-char" key={i} style={{ '--i': start + i }}>
              {ch}
            </span>
          ))}
        </span>{' '}
      </Fragment>
    )
  })
}

/* ---------- Photographs (plates) ---------- */

// Uses a real video/image if the story ever has one; otherwise generated cover art.
function Media({ story, play }) {
  const [failed, setFailed] = useState(false)
  if (story.video && !failed && play) {
    return (
      <video
        className="gz-media"
        src={story.video}
        poster={story.image || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      />
    )
  }
  if (story.image && !failed) {
    return <img className="gz-media" src={story.image} alt="" loading="lazy" onError={() => setFailed(true)} />
  }
  return <CoverArt seed={story.link || story.headline} showIcon={false} />
}

function Plate({ story, motion, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.25 })
  const live = motion && inView
  const move = hashSeed(story.link || story.headline) % 3 // each plate moves differently
  const className = `gz-plate gz-mv-${move} ${live ? 'is-live' : ''}`
  const media = (
    <span className="gz-plate-media">
      <Media story={story} play={live} />
    </span>
  )

  if (onOpen) {
    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={() => onOpen(story)}
        aria-label={`Open story: ${story.headline}`}
      >
        {media}
      </button>
    )
  }
  return (
    <div ref={ref} className={className}>
      {media}
    </div>
  )
}

/* ---------- Newspaper pieces ---------- */

function Masthead() {
  return (
    <header className="gz-masthead">
      <svg className="gz-emblem" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M8 6h48v26c0 14-10 22-24 26C18 54 8 46 8 32z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M16 14h32v18c0 9-7 15-16 18-9-3-16-9-16-18z" fill="currentColor" />
        <text x="32" y="39" textAnchor="middle" fontFamily="'Alfa Slab One', serif" fontSize="17" fill="#e7d9b8">
          AI
        </text>
      </svg>

      <div className="gz-nameplate">
        <span className="gz-the">The Weekly</span>
        <h1 className="gz-name">
          AI <span className="gz-cap">G</span>azette
        </h1>
        <p className="gz-tagline">All the intelligence that’s fit to print</p>
      </div>

      <svg className="gz-sun" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <g className="gz-sun-rays" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1="32" y1="3" x2="32" y2={i % 2 ? 9 : 12} transform={`rotate(${i * 22.5} 32 32)`} />
          ))}
        </g>
        <circle cx="32" cy="32" r="14" fill="currentColor" />
        <circle cx="32" cy="32" r="9" fill="none" stroke="#e7d9b8" strokeWidth="2" />
      </svg>
    </header>
  )
}

function InfoBar({ report, storyCount }) {
  const sources = report ? [...new Set((report.stories || []).map((s) => s.source))].join(', ') : ''
  return (
    <div className="gz-infobar">
      <div>
        <strong>Weekly edition</strong>
        <br />
        {report ? `Week of ${formatWeekOf(report.weekOf)}` : 'Loading this week’s issue…'}
      </div>
      <div>
        <strong>Vol. I{report ? `, No. ${issueNumber(report.weekOf)}` : ''}</strong>
        <br />
        {storyCount} {storyCount === 1 ? 'story' : 'stories'} in this issue
      </div>
      <div>
        <strong>Sources</strong>
        <br />
        {sources || '—'} · Refreshed every Monday
      </div>
    </div>
  )
}

function Lead({ story, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const len = story.headline.length
  const size = len <= 40 ? 'xl' : len <= 60 ? 'lg' : 'md'
  return (
    <section ref={ref} className={`gz-lead ${inView ? 'is-in' : ''}`}>
      <div className="gz-lead-tag">
        <span className="gz-lead-flag">
          <span className="gz-pointer" aria-hidden="true">
            ☞
          </span>
          <span className="gz-stamp">Breaking</span>
        </span>
        <span className="gz-kicker">
          {story.publisher}
          {story.publishedDate && ` / ${formatPublished(story.publishedDate)}`}
        </span>
      </div>
      <h2 className="gz-lead-title" data-size={size}>
        <button type="button" onClick={() => onOpen(story)}>
          <PrintedHeadline text={story.headline} />
        </button>
      </h2>
    </section>
  )
}

// variant: 'stack' (narrow bold column) | 'block' (inverted headline) | 'drop' (boxed initial)
function Story({ story, variant, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.15 })
  const lines = 9 + (hashSeed(story.link || story.headline) % 9)
  return (
    <article ref={ref} className={`gz-story gz-story--${variant} ${inView ? 'is-in' : ''}`}>
      <p className="gz-kicker">
        {story.publisher}
        {story.publishedDate && ` / ${formatPublished(story.publishedDate)}`}
      </p>
      <h3 className="gz-story-title">
        <button type="button" onClick={() => onOpen(story)}>
          <span className="gz-title-text">
            {variant === 'drop' ? (
              <>
                <span className="gz-initial">{story.headline.charAt(0)}</span>
                {story.headline.slice(1)}
              </>
            ) : (
              story.headline
            )}
          </span>
          <span className="gz-readtag" aria-hidden="true">
            Read ▸
          </span>
        </button>
      </h3>
      {story.blurb && <p className="gz-blurb">{story.blurb}</p>}
      {/* Decorative "small print" texture — not real text. */}
      <div className="gz-greek" aria-hidden="true" style={{ '--lines': lines }} />
    </article>
  )
}

function SectionHead({ children }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  return (
    <div ref={ref} className={`gz-sechead ${inView ? 'is-in' : ''}`}>
      <h2 className="gz-sechead-text">{children}</h2>
    </div>
  )
}

/* ---------- Story panel (click a headline or plate) ---------- */

function StoryPanel({ story, motion, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="gz-overlay" onClick={onClose}>
      <article
        className="gz-clipping"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gz-clip-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="gz-clip-close" onClick={onClose} aria-label="Close story">
          ×
        </button>
        <p className="gz-clip-flag">Extra! Extra!</p>
        <p className="gz-kicker">
          {story.publisher}
          {story.publishedDate && ` / ${formatPublished(story.publishedDate)}`}
        </p>
        <h2 id="gz-clip-title" className="gz-clip-title">
          {story.headline}
        </h2>
        {hasPlate(story) && (
          <div className="gz-clip-plate">
            <Plate story={story} motion={motion} />
          </div>
        )}
        {story.blurb && <p className="gz-clip-blurb">{story.blurb}</p>}
        <a className="btn btn--sm" href={story.link} target="_blank" rel="noopener noreferrer">
          Read the full story at {story.publisher} <ArrowUpRight />
        </a>
      </article>
    </div>
  )
}

/* ---------- Page ---------- */

export default function WeeklyReport() {
  const [report, setReport] = useState(readCachedReport)
  const [loadFailed, setLoadFailed] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(readMotionPref)
  const [page, setPage] = useState(1)
  const [turning, setTurning] = useState(false)
  const [openedStory, setOpenedStory] = useState(null)
  const sheetRef = useRef(null)
  const timers = useRef([])

  // Unfold the newspaper only on the first visit of a browser session.
  const [opening] = useState(() => {
    try {
      return !sessionStorage.getItem(OPENED_KEY)
    } catch {
      return false
    }
  })
  useEffect(() => {
    try {
      sessionStorage.setItem(OPENED_KEY, '1')
    } catch {
      // storage blocked — the unfold may replay next visit, which is harmless
    }
  }, [])

  // Show the cached issue instantly (see useState above), then refresh in the background.
  useEffect(() => {
    let cancelled = false
    fetch('/weekly-report.json', { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled || !data) return
        setReport(data)
        setLoadFailed(false)
        try {
          sessionStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(data))
        } catch {
          // cache is optional
        }
      })
      .catch((err) => {
        console.warn('Could not load weekly report:', err)
        if (!cancelled) setLoadFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const toggleMotion = () => {
    const next = !motionEnabled
    setMotionEnabled(next)
    try {
      localStorage.setItem(MOTION_KEY, next ? 'on' : 'off')
    } catch {
      // preference just won't persist
    }
  }

  const { lead, rest } = useMemo(() => arrangeStories(report?.stories || []), [report])
  const pageOne = rest.slice(0, PAGE_ONE_SIDE_STORIES)
  const pageTwo = rest.slice(PAGE_ONE_SIDE_STORIES)
  const hasPageTwo = pageTwo.length > 0
  const shownPage = page === 2 && hasPageTwo ? 2 : 1
  const [left, right, band] = pageOne
  const storyCount = (lead ? 1 : 0) + rest.length

  const openStory = useCallback((story) => setOpenedStory(story), [])
  const closeStory = useCallback(() => setOpenedStory(null), [])

  const scrollToSheet = () =>
    sheetRef.current?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto', block: 'start' })

  const turnTo = (next) => {
    if (turning || next === shownPage) return
    if (!motionEnabled) {
      setPage(next)
      scrollToSheet()
      return
    }
    setTurning(true)
    timers.current.push(
      setTimeout(() => {
        setPage(next)
        scrollToSheet()
      }, 380),
      setTimeout(() => setTurning(false), 1000)
    )
  }

  // Columns of the middle band on page one (only the parts that exist).
  const showPlate = lead && hasPlate(lead)
  const cols = [left && '1fr', showPlate && '2.2fr', right && '1fr'].filter(Boolean).join(' ')

  return (
    <main
      className={`gazette ${motionEnabled ? 'is-motion' : 'is-still'} ${opening ? 'is-opening' : ''}`}
      style={{ '--print-delay': opening ? '1.3s' : '0.25s' }}
    >
      <div className="gz-paper-wrap">
        <div className="gz-sheet" ref={sheetRef}>
          {turning && <div className="gz-curl" aria-hidden="true" />}

          <div key={shownPage} className={`gz-page ${turning ? 'is-turning' : ''}`}>
            {shownPage === 1 ? (
              <>
                <Masthead />
                <InfoBar report={report} storyCount={storyCount} />

                {lead ? (
                  <>
                    <Lead story={lead} onOpen={openStory} />

                    {cols && (
                      <div className="gz-triptych" style={{ '--cols': cols }}>
                        {left && <Story story={left} variant="stack" onOpen={openStory} />}
                        {showPlate && (
                          <figure className="gz-figure gz-plate-cell">
                            <Plate story={lead} motion={motionEnabled} onOpen={openStory} />
                            <figcaption className="gz-figcap">
                              <span>Plate I</span>
                              <span>{lead.publisher}</span>
                            </figcaption>
                          </figure>
                        )}
                        {right && <Story story={right} variant="block" onOpen={openStory} />}
                      </div>
                    )}

                    {band && (
                      <div className="gz-band">
                        <Story story={band} variant="drop" onOpen={openStory} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="gz-empty">
                    <h2>{loadFailed && !report ? 'The presses are down.' : 'Setting the type…'}</h2>
                    <p>
                      {loadFailed && !report
                        ? 'We couldn’t load this week’s issue. Please try again shortly.'
                        : report
                          ? 'No stories in this issue yet. Check back after the next Monday update.'
                          : 'One moment while today’s edition is printed.'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="gz-runhead">
                  <span className="gz-runhead-name">The AI Gazette</span>
                  <span className="gz-kicker">
                    Page 2 / Week of {formatWeekOf(report?.weekOf)} / No. {issueNumber(report?.weekOf)}
                  </span>
                </div>
                <SectionHead>The Wire — more from this week</SectionHead>
                <div className="gz-wire">
                  {pageTwo.map((story, i) => (
                    <Story
                      key={story.link || story.headline}
                      story={story}
                      variant={i % 2 === 0 ? 'drop' : 'block'}
                      onOpen={openStory}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <footer className="gz-foot">
            <button type="button" className="gz-foot-btn" onClick={toggleMotion}>
              {motionEnabled ? 'Reduce motion' : 'Enable motion'}
            </button>
            <span className="gz-foot-item">
              Page <b>{shownPage}</b> of <b>{hasPageTwo ? 2 : 1}</b>
            </span>
            {hasPageTwo && (
              <button
                type="button"
                className="gz-foot-btn gz-foot-btn--turn"
                onClick={() => turnTo(shownPage === 1 ? 2 : 1)}
                disabled={turning}
              >
                {shownPage === 1 ? `The Wire · ${pageTwo.length} more ▸` : '◂ Front page'}
              </button>
            )}
          </footer>
        </div>
      </div>

      {openedStory && <StoryPanel story={openedStory} motion={motionEnabled} onClose={closeStory} />}
    </main>
  )
}