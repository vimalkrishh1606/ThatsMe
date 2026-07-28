import { useRef } from 'react'

/*
 * Pointer-tracked 3D tilt. Rotation is derived from cursor offset within the
 * card, and a CSS custom property feeds the radial sheen in global.css.
 */
export default function TiltCard({ children, max = 11, className = '' }) {
  const ref = useRef(null)
  const raf = useRef(0)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const rx = (0.5 - py) * max * 2
      const ry = (px - 0.5) * max * 2
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
    setTimeout(() => {
      if (el) el.style.transition = ''
    }, 550)
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="tilt-inner">{children}</div>
    </div>
  )
}
