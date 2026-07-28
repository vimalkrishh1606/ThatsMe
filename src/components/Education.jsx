import { education } from '../data/resume.js'
import Reveal from './Reveal.jsx'

export default function Education() {
  return (
    <section className="section" id="education">
      <Reveal className="section-head">
        <span className="section-index">04 — background</span>
        <h2 className="section-title">Education</h2>
      </Reveal>

      <div className="split">
        {education.map((e, i) => (
          <Reveal key={e.school} delay={i * 80}>
            <div className="edu-card">
              <div className="edu-school">{e.school}</div>
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-meta">
                <span>
                  {e.period} · {e.location}
                </span>
                <span className="edu-score">{e.score}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
