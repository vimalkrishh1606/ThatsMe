import { Suspense, lazy } from 'react'
// three.js is ~700kB — split it out so text paints before WebGL arrives.
const Scene3D = lazy(() => import('./components/Scene3D.jsx'))
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  return (
    <>
      {/* WebGL layer is decorative — the page reads fine if it never loads. */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <div className="grain" />
      <Cursor />

      <div className="app">
        <Nav />
        <Hero />
        <main>
          <Work />
          <Skills />
          <Projects />
          <Education />
          <Contact />
        </main>
      </div>
    </>
  )
}
