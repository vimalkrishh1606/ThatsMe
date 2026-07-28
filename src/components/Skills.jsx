import { useMemo } from 'react'
import { skills, orbitSkills } from '../data/resume.js'
import Reveal from './Reveal.jsx'

/* Seconds per revolution — shared by the spin, the billboard counter-spin, and the
 * depth fade, which only stay in sync because all three run off one duration. */
const SPIN = 34

/*
 * Tags placed on a sphere via the Fibonacci lattice, then pushed outward in 3D.
 * The parent element spins on Y, so the whole cloud reads as a rotating globe.
 *
 * Each tag sits in three nested elements because they need three different transforms:
 * the slot holds the 3D position, the billboard cancels the parent's spin so text never
 * renders mirrored, and the tag itself fades and shrinks as it swings to the back.
 */
function Orbit() {
  const placed = useMemo(() => {
    const n = orbitSkills.length
    const radius = 160
    return orbitSkills.map((label, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      // Depth is sinusoidal with the spin: z' = r·cos(a + θ), so a tag is frontmost at
      // θ = -a. A negative delay of a/2π of a cycle starts the fade at that front peak.
      const a = Math.atan2(x, z)
      const turns = ((a / (2 * Math.PI)) % 1 + 1) % 1
      return { label, x, y, z, delay: -(turns * SPIN) }
    })
  }, [])

  return (
    <div className="orbit-wrap" aria-hidden="true">
      <div className="orbit-core" />
      <div className="orbit">
        {placed.map((t) => (
          <span
            key={t.label}
            className="orbit-slot"
            style={{
              transform: `translate(-50%, -50%) translate3d(${t.x}px, ${t.y}px, ${t.z}px)`,
            }}
          >
            <span className="orbit-billboard">
              <span className="orbit-tag" style={{ animationDelay: `${t.delay}s` }}>
                {t.label}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section className="section" id="skills">
      <Reveal className="section-head">
        <span className="section-index">02 — toolkit</span>
        <h2 className="section-title">What I work with</h2>
        <p className="section-sub">
          Functional languages and compiler internals at the centre; enough frontend and
          mobile to follow a payment all the way to the screen.
        </p>
      </Reveal>

      <Orbit />

      <div className="skill-grid">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={i * 60}>
            <div className="skill-card">
              <div className="skill-group">{s.group}</div>
              <div className="chips">
                {s.items.map((it) => (
                  <span className="chip" key={it}>
                    {it}
                  </span>
                ))}
              </div>
              {s.note && <div className="skill-note">{s.note}</div>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
