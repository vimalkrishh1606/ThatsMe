import { useEffect, useMemo, useRef, useState } from 'react'
import { skills, orbitSkills } from '../data/resume.js'
import Reveal from './Reveal.jsx'

const IDLE_SPIN = 0.18  // rad/s the cloud drifts at when nobody is touching it
const FRICTION = 2.6    // e-folds per second a throw decays over, back to that drift
const SENS = 0.0065     // radians of rotation per pixel dragged
const MAX_PITCH = 1.05  // rad; keeps a drag from tipping the sphere past its poles
const SLOP = 6          // px of travel below which a press still counts as a tap
const PERSP = 3.2       // camera distance in radii — sets how hard the depth falloff bites

/* Perspective makes the widest point of the cloud sit off the equator, in front of it.
 * Maximising √(1−z²)·PERSP/(PERSP−z) puts it at z = 1/PERSP, which for PERSP = 3.2 reaches
 * REACH radii out and is drawn at REACH_SCALE. Both are what the fitting maths has to
 * clear — the equator alone would leave the outermost labels hanging over the edge. */
const REACH = 1.053
const REACH_SCALE = 1.109

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Read per use rather than cached: nothing here rebuilds if the setting changes mid-visit,
// but the next drag or mount then honours it.
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Fibonacci lattice: near-uniform points on a sphere, so no two tags clump. Left as unit
 * vectors because the radius is a function of the viewport and changes on every resize. */
function lattice(n) {
  return Array.from({ length: n }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
    }
  })
}

/*
 * A tag sphere you can throw around. Rotation lives in two angles held in refs and the
 * points are projected to 2D in JS every frame — no CSS 3D, so labels can never render
 * mirrored or edge-on, and the whole thing responds to a finger mid-flight.
 *
 * The React tree renders the tags once; the animation loop writes transforms straight to
 * the nodes. Only selection (a rare event) goes through state.
 */
function Orbit({ active, onSelect }) {
  const stageRef = useRef(null)
  const fieldRef = useRef(null)
  const tagRefs = useRef([])

  const rot = useRef({ yaw: 0.6, pitch: -0.12 })
  const vel = useRef({ yaw: reducedMotion() ? 0 : IDLE_SPIN, pitch: 0 })
  const glide = useRef(null)   // easing target while a chosen tag flies to the front
  const drag = useRef(null)
  const dragged = useRef(false)  // swallows the click that ends a drag
  const size = useRef({ r: 180, ry: 180 })  // sphere radius, and how far y is allowed to spread
  const activeRef = useRef(-1)  // the frame loop reads this without re-subscribing
  const dirty = useRef(true)    // forces a redraw when something other than rotation changed

  // A phone-sized sphere cannot hold the full set without the labels piling up.
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = (e) => setCompact(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const cloud = useMemo(() => (compact ? orbitSkills.filter((s) => !s.dense) : orbitSkills), [compact])
  const points = useMemo(() => lattice(cloud.length), [cloud])
  // Selection travels by label, so it survives the set changing under a resize.
  const activeIndex = cloud.findIndex((s) => s.label === active)

  useEffect(() => {
    activeRef.current = activeIndex
    dirty.current = true  // the selected tag is drawn brighter than its depth alone
  }, [activeIndex])

  // Yaw/pitch that put point i dead centre: yaw kills its x, pitch then kills its y.
  const spinTo = (i) => {
    const p = points[i]
    const h = Math.hypot(p.x, p.z)
    glide.current = {
      yaw: Math.atan2(-p.x, p.z),
      pitch: clamp(Math.atan2(p.y, h), -MAX_PITCH, MAX_PITCH),
    }
  }

  // Size comes off the rendered box, so the cloud fills whatever space it is given: the
  // biggest sphere whose outermost label still clears the edges. Where the box is much
  // taller than the sphere it allows — a phone, where width binds — the projection is
  // stretched vertically rather than leaving the card half empty.
  useEffect(() => {
    const el = fieldRef.current
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      const pills = tagRefs.current.filter(Boolean)
      const pw = pills.length ? Math.max(...pills.map((p) => p.offsetWidth)) : 130
      const ph = pills.length ? pills[0].offsetHeight : 34
      const fitX = (width / 2 - 6 - (pw / 2) * REACH_SCALE) / REACH
      const fitY = (height / 2 - 6 - (ph / 2) * REACH_SCALE) / REACH
      const r = clamp(Math.min(fitX, fitY), 90, 300)
      size.current = { r, ry: r * clamp(fitY / r, 1, 1.35) }
      dirty.current = true
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cloud])

  useEffect(() => {
    const reduced = reducedMotion()

    const project = () => {
      const { r, ry } = size.current
      const persp = r * PERSP
      const { yaw, pitch } = rot.current
      const cy = Math.cos(yaw)
      const sy = Math.sin(yaw)
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)

      for (let i = 0; i < points.length; i++) {
        const el = tagRefs.current[i]
        if (!el) continue
        const p = points[i]
        const x1 = p.x * cy + p.z * sy
        const z1 = p.z * cy - p.x * sy
        const y2 = p.y * cp - z1 * sp
        const z2 = p.y * sp + z1 * cp

        const s = persp / (persp - z2 * r)  // near tags grow, far ones shrink
        const depth = (z2 + 1) / 2          // 0 at the back of the sphere, 1 at the front
        // transform-origin is 0 0, so the -50% centring has to come last to stay exact.
        el.style.transform = `translate3d(${(x1 * r * s).toFixed(1)}px, ${(y2 * ry * s).toFixed(1)}px, 0) scale(${s.toFixed(3)}) translate(-50%, -50%)`
        el.style.opacity = (i === activeRef.current ? Math.max(0.9, 0.25 + depth * 0.75) : 0.25 + depth * 0.75).toFixed(3)
        el.style.zIndex = (depth * 100) | 0
        // Back-half tags stop stealing pointers from the readable ones in front.
        el.style.pointerEvents = depth > 0.32 ? 'auto' : 'none'
      }
    }

    let frame = 0
    let prev = 0

    const step = (now) => {
      const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0
      prev = now
      const r = rot.current

      let moving = true
      if (glide.current) {
        const k = reduced ? 1 : 1 - Math.exp(-7 * dt)
        // Shortest way round: yaw accumulates unbounded, the target is in [-π, π].
        const dy = Math.atan2(Math.sin(glide.current.yaw - r.yaw), Math.cos(glide.current.yaw - r.yaw))
        const dp = glide.current.pitch - r.pitch
        r.yaw += dy * k
        r.pitch += dp * k
        vel.current.yaw = 0
        vel.current.pitch = 0
        if (Math.abs(dy) < 0.002 && Math.abs(dp) < 0.002) glide.current = null
      } else if (!drag.current) {
        // A throw decays toward the idle drift — or toward a standstill while a tag is
        // selected, so whatever the visitor picked stays legible in front.
        const rest = reduced || activeRef.current >= 0 ? 0 : IDLE_SPIN
        const decay = Math.exp(-FRICTION * dt)
        vel.current.yaw = rest + (vel.current.yaw - rest) * decay
        vel.current.pitch *= decay
        // Snap the tail of the decay so a standstill really is one, and the loop can idle.
        if (Math.abs(vel.current.yaw - rest) < 1e-4) vel.current.yaw = rest
        if (Math.abs(vel.current.pitch) < 1e-4) vel.current.pitch = 0
        moving = vel.current.yaw !== 0 || vel.current.pitch !== 0
        r.yaw += vel.current.yaw * dt
        r.pitch = clamp(r.pitch + vel.current.pitch * dt, -MAX_PITCH, MAX_PITCH)
      }

      // Nothing turning and nothing resized means the last frame is still correct.
      if (moving || dirty.current) {
        project()
        dirty.current = false
      }
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (!frame) {
        prev = 0
        frame = requestAnimationFrame(step)
      }
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    project()
    // No point spinning a sphere nobody is looking at.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      rootMargin: '120px',
    })
    io.observe(stageRef.current)
    return () => {
      io.disconnect()
      stop()
    }
  }, [points])

  // Drag anywhere on the stage — the tags are small targets, the card is not.
  useEffect(() => {
    const stage = stageRef.current
    const reduced = reducedMotion()

    const onMove = (e) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      const dt = Math.max((e.timeStamp - d.t) / 1000, 0.004)
      d.x = e.clientX
      d.y = e.clientY
      d.t = e.timeStamp
      d.dist += Math.abs(dx) + Math.abs(dy)

      rot.current.yaw += dx * SENS
      rot.current.pitch = clamp(rot.current.pitch - dy * SENS, -MAX_PITCH, MAX_PITCH)
      // Smoothed, so the throw follows the gesture rather than whichever sample landed last.
      d.vy = d.vy * 0.6 + ((dx * SENS) / dt) * 0.4
      d.vp = d.vp * 0.6 + ((-dy * SENS) / dt) * 0.4
    }

    const onUp = () => {
      const d = drag.current
      drag.current = null
      stage.classList.remove('is-dragging')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      if (!d) return
      dragged.current = d.dist > SLOP
      vel.current = reduced
        ? { yaw: 0, pitch: 0 }
        : { yaw: clamp(d.vy, -7, 7), pitch: clamp(d.vp, -5, 5) }
    }

    const onDown = (e) => {
      if (e.button > 0) return
      drag.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, dist: 0, vy: 0, vp: 0 }
      dragged.current = false
      glide.current = null
      vel.current = { yaw: 0, pitch: 0 }
      stage.classList.add('is-dragging')
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    }

    stage.addEventListener('pointerdown', onDown)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      onUp()  // drops the window listeners if the component goes mid-drag
    }
  }, [])

  const choose = (i) => {
    const wasDrag = dragged.current
    dragged.current = false
    if (wasDrag) return
    const next = activeIndex === i ? null : cloud[i].label
    onSelect(next)
    if (next) spinTo(i)
  }

  const chosen = cloud[activeIndex] ?? null

  return (
    <div className="orbit-stage" ref={stageRef}>
      <div className="orbit-core" />
      <div
        className="orbit-field"
        ref={fieldRef}
        role="group"
        aria-label="Skills cloud — drag to rotate, select a tag to see its group"
      >
        {cloud.map((s, i) => (
          <button
            key={s.label}
            type="button"
            ref={(el) => (tagRefs.current[i] = el)}
            className={`orbit-tag${activeIndex === i ? ' is-active' : ''}`}
            aria-pressed={activeIndex === i}
            onFocus={() => spinTo(i)}
            onClick={() => choose(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="orbit-caption" aria-live="polite">
        {chosen ? (
          <>
            <span className="orbit-caption-key">{chosen.label}</span>
            <span className="orbit-caption-sep">/</span>
            <span>{chosen.group}</span>
          </>
        ) : (
          <span>drag to rotate · tap a tag</span>
        )}
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(null)  // label of the selected tag, if any
  const activeGroup = orbitSkills.find((s) => s.label === active)?.group ?? null

  return (
    <section className="section" id="skills">
      <Reveal className="section-head">
        <span className="section-index">02 — toolkit</span>
        <h2 className="section-title">What I work with</h2>
        <p className="section-sub">
          Functional languages and compiler internals at the centre; enough frontend and
          mobile to follow a payment all the way to the screen. Spin the cloud, pick a tag —
          it points at where that tool lives below.
        </p>
      </Reveal>

      <Orbit active={active} onSelect={setActive} />

      <div className="skill-grid">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={i * 60}>
            <div className={`skill-card${activeGroup === s.group ? ' is-linked' : ''}`}>
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
