import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#work', label: 'work' },
  { href: '#skills', label: 'skills' },
  { href: '#projects', label: 'projects' },
  { href: '#education', label: 'education' },
  { href: '#contact', label: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" className="nav-mark">
        VKK<span>.</span>
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
