import { useEffect, useRef } from 'react'

/* Custom cursor: a hard dot that tracks exactly, and a ring that lags behind. */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { ...pos }
    let frame

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x - 3}px, ${pos.y - 3}px)`
      }
      // .orbit-stage included so the ring opens over the whole skill cloud, not just its
      // tags — with the page cursor hidden, that ring is the only "this is grabbable" cue.
      const interactive = e.target.closest('a, button, .tilt, .chip, .orbit-stage')
      ring.current?.classList.toggle('active', !!interactive)
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      if (ring.current) {
        const half = ring.current.offsetWidth / 2
        ring.current.style.transform = `translate(${ringPos.x - half}px, ${ringPos.y - half}px)`
      }
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    loop()
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  )
}
