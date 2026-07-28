import { projects } from '../data/resume.js'
import TiltCard from './TiltCard.jsx'
import Reveal from './Reveal.jsx'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <Reveal className="section-head">
        <span className="section-index">03 — side work</span>
        <h2 className="section-title">Projects</h2>
      </Reveal>

      <div className="split">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 70}>
            <TiltCard>
              <span className="work-tag">{p.stack}</span>
              <h4 className="work-title">{p.title}</h4>
              <p className="work-short">{p.body}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
