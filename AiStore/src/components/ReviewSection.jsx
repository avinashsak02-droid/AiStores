import { useState } from 'react'
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { signInWithPopup } from 'firebase/auth'
import { db, auth, googleProvider } from '../firebase'
import './ReviewSection.css'

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= value ? 'filled' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ tool, user, reviews }) {
  const myReview = user ? reviews.find((r) => r.userId === user.uid) : null
  const [rating, setRating] = useState(myReview?.rating || 0)
  const [text, setText] = useState(myReview?.text || '')
  const [saving, setSaving] = useState(false)

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Sign-in error:', error)
      alert('Sign-in failed. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    if (rating < 1) {
      alert('Please select a star rating.')
      return
    }
    if (!text.trim()) {
      alert('Please write a short review.')
      return
    }
    setSaving(true)
    try {
      const reviewId = `${tool.id}_${user.uid}`
      await setDoc(doc(db, 'reviews', reviewId), {
        toolId: tool.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || null,
        rating,
        text: text.trim(),
        createdAt: myReview?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      console.error('Error saving review:', error)
      alert('Error saving your review. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user || !myReview) return
    if (!window.confirm('Delete your review?')) return
    try {
      await deleteDoc(doc(db, 'reviews', `${tool.id}_${user.uid}`))
      setRating(0)
      setText('')
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Error deleting your review. Please try again.')
    }
  }

  return (
    <>
      <h2 className="section-title">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      <div className="rv-form-wrap">
        {user ? (
          <form className="rv-form" onSubmit={handleSubmit}>
            <StarPicker value={rating} onChange={setRating} />
            <textarea
              className="rv-textarea"
              placeholder="Share your experience with this tool..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
            />
            <div className="rv-form-actions">
              <button type="submit" className="btn btn--sm" disabled={saving}>
                {saving ? 'Saving...' : myReview ? 'Update Review' : 'Post Review'}
              </button>
              {myReview && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </form>
        ) : (
          <button type="button" className="btn btn--ghost btn--sm" onClick={handleSignIn}>
            Sign in with Google to write a review
          </button>
        )}
      </div>

      {reviews.length > 0 ? (
        <ul className="rv-list">
          {reviews.map((r) => (
            <li key={r.id} className="rv-item">
              <div className="rv-item-head">
                {r.userPhoto ? (
                  <img src={r.userPhoto} alt="" className="rv-avatar" />
                ) : (
                  <div className="rv-avatar rv-avatar-fallback">{(r.userName || '?')[0]}</div>
                )}
                <div className="rv-item-meta">
                  <span className="rv-item-name">{r.userName}</span>
                  <span className="rv-item-stars">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                </div>
              </div>
              <p className="rv-item-text">{r.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rv-empty">No reviews yet. Be the first to share your thoughts.</p>
      )}
    </>
  )
}