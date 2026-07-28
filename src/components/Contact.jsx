import { profile } from '../data/resume.js'
import Reveal from './Reveal.jsx'

export default function Contact() {
  return (
    <>
      <section className="contact" id="contact">
        <Reveal>
          <h2 className="contact-title">Let&apos;s talk</h2>
          <p className="contact-sub">
            Open to work on compilers, developer tooling, and payment systems — or anything
            where the interesting part is underneath.
          </p>
          <div className="contact-links">
            <a className="btn primary" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <div className="contact-links" style={{ marginTop: 16 }}>
            {profile.links.map((l) => (
              <a
                key={l.label}
                className="btn"
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} {profile.name} — built with React &amp; three.js
      </footer>
    </>
  )
}
