import { useEffect, useRef } from 'react'
import { profile, focus } from '../data/resume.js'

export default function Hero() {
  const inner = useRef(null)

  // Gentle counter-tilt of the whole hero block against the pointer.
  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return
    const onMove = (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 2
      const y = (e.clientY / innerHeight - 0.5) * 2
      if (inner.current) {
        inner.current.style.transform =
          `rotateY(${x * 3.4}deg) rotateX(${-y * 2.4}deg) translateZ(0)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <header className="hero" id="top">
      <div className="hero-inner" ref={inner}>
        <p className="hero-eyebrow">{profile.location} · available for work</p>

        <h1 className="hero-name">
          <span className="line">
            <span className="word">Vimaleshwar</span>
          </span>
          <span className="line">
            <span className="word b">K K</span>
          </span>
        </h1>

        <p className="hero-role">&lt; {profile.role} /&gt;</p>
        <p className="hero-tagline">{profile.tagline}</p>

        <div className="hero-actions">
          <a className="btn primary" href="#work">
            View work <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
        </div>

        <div className="hero-focus">
          {focus.map((f) => (
            <div className="focus" key={f.title}>
              <div className="focus-kicker">{f.kicker}</div>
              <div className="focus-title">{f.title}</div>
              <p className="focus-note">{f.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-hint">scroll</div>
    </header>
  )
}
