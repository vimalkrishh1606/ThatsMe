import { useState } from 'react'
import { experience } from '../data/resume.js'
import TiltCard from './TiltCard.jsx'
import Reveal from './Reveal.jsx'

function WorkCard({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <TiltCard>
      <span className="work-tag">{item.tag}</span>
      <h4 className="work-title">{item.title}</h4>
      <p className="work-short">{item.short}</p>
      {item.metrics && (
        <div className="work-metrics">
          {item.metrics.map((m) => (
            <span className="metric" key={m}>{m}</span>
          ))}
        </div>
      )}
      {open && <p className="work-full">{item.full}</p>}
      <button className="work-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? 'less' : 'read more'} <span aria-hidden="true">{open ? '↑' : '↓'}</span>
      </button>
    </TiltCard>
  )
}

export default function Work() {
  return (
    <section className="section" id="work">
      <Reveal className="section-head">
        <span className="section-index">01 — experience</span>
        <h2 className="section-title">Things I&apos;ve built</h2>
        <p className="section-sub">
          Mostly below the application layer: compilers, build systems, and the payment
          infrastructure they compile.
        </p>
      </Reveal>

      {experience.map((job) => (
        <div className="job" key={job.company}>
          <Reveal className="job-head">
            <div>
              <div className="job-company">
                {job.current && <span className="pulse" />}
                {job.company}
              </div>
              <div className="job-role">{job.role}</div>
            </div>
            <div className="job-meta">
              {job.period}
              <br />
              {job.location}
            </div>
          </Reveal>

          <div className="work-grid">
            {job.work.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <WorkCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
