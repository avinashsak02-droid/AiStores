import { useEffect, useRef, useState } from 'react'

// Returns [ref, inView]. Attach ref to an element; inView becomes true
// once it scrolls into the viewport (and stays true after that).
export default function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true) // no observer support — just show it
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect() // animate once, then stop watching
        }
      },
      { threshold: 0.2, ...options }
    )

    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}