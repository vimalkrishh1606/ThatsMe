export const profile = {
  name: 'Vimaleshwar K K',
  role: 'Software Engineer',
  tagline: 'I work below the application layer — compilers, build systems, and payment infrastructure.',
  email: 'vimalkrishnamurthy62@gmail.com',
  location: 'Bengaluru, IN',
  links: [
    { label: 'LinkedIn', handle: 'vimaleshwar', url: 'https://www.linkedin.com/in/vimaleshwar/' },
    { label: 'LeetCode', handle: 'vimal_krishh', url: 'https://leetcode.com/u/vimal_krishh/' },
    { label: 'Codeforces', handle: 'cage19x', url: 'https://codeforces.com/profile/cage19x' },
  ],
}

// The landing block: what I work on, not the numbers from one project.
// Project-specific metrics live on the work cards they belong to.
export const focus = [
  {
    kicker: 'toolchain',
    title: 'Compilers & build systems',
    note: 'GHC internals, type-checker plugins, Nix builds that stay reproducible and incremental.',
  },
  {
    kicker: 'payments',
    title: 'Payment infrastructure',
    note: 'Part-payments, settlement rules, and record/replay testing for money that has to be right.',
  },
  {
    kicker: 'client',
    title: 'SDKs & native bridges',
    note: 'PureScript checkout, Android↔JS interop, clients you can never force-update.',
  },
]

export const experience = [
  {
    company: 'Juspay Technologies',
    role: 'Software Engineer',
    period: 'Sept 2022 – Present',
    location: 'Bengaluru, IN',
    accent: '#38bdf8',
    current: true,
    work: [
      {
        title: 'GHC 9.2.8 → 9.8.4 Migration',
        tag: 'Haskell · Nix',
        metrics: ['15+ repos', '3 major versions', '2.7k modules analysed'],
        short:
          'A three-major-version compiler jump across a 15+ repo payments backend, owning the payment-gateway service end to end.',
        full:
          'Migrated a 15+ repo Haskell payments backend three major GHC versions — a source-breaking jump across the serialisation and crypto stacks — owning the payment-gateway service end to end.',
      },
      {
        title: 'Build Incrementality & CI Reliability',
        tag: 'Nix · haskell-flake',
        short:
          'Taught a hermetic Nix build to reuse prior compilation artefacts, and root-caused a CI build-machine OOM.',
        full:
          'Improved build incrementality and CI reliability on a Nix + haskell-flake toolchain — wired a previous-build intermediates cache (.hi/.o) into the hermetic Nix derivation so unchanged modules skip recompilation between builds, and root-caused a CI build-machine OOM to unbounded GHC parallelism spawning one compiler heap per core, capping it against each service’s memory budget.',
      },
      {
        title: 'Compiler-Plugin Infrastructure',
        tag: 'GHC internals',
        metrics: ['8 plugins ported', 'compile-time enforcement'],
        short:
          'Type-checker plugins that fail the build on unsafe patterns — ESLint, but inside the compiler and type-aware.',
        full:
          'Engineered and maintained compiler-plugin infrastructure (GHC source/type-checker plugins) that enforces engineering rules at compile time across a large-scale Haskell payments platform — blocking non-indexed DB queries, detecting infinite recursion, restricting unsafe APIs — including its full migration to GHC 9.8.4 and fixes to its SQL-WHERE-clause AST analysis.',
      },
      {
        title: 'Regression-Replay Triage Automation',
        tag: 'Python · LLM',
        short:
          'An HTTP service that diffs a replay against its staging baseline and returns an AI-generated root cause per error category.',
        full:
          'Automated root-cause triage for regression-replay failures — the main bottleneck in validating a fleet-wide compiler migration — extending the team’s replay pipeline with an HTTP service that takes a repo and branch, diffs the replay report against a staging baseline, gathers per-session logs and decoded function traces, and returns an AI-generated root-cause analysis and suggested fix for each error category.',
      },
      {
        title: 'DB & Cache State Comparison',
        tag: 'MySQL · Postgres · Redis',
        short:
          'Catching persistence-layer regressions that API-response comparison alone silently misses.',
        full:
          'Built an automated database and cache state-comparison layer for a production payment regression-testing (record/replay) platform, diffing MySQL, PostgreSQL, and Redis end-state of replayed transactions against a source-of-truth baseline — surfacing persistence-level regressions (incorrect writes, missing rows, stale cache) that API-response comparison alone could not detect.',
      },
      {
        title: 'Part-Payment System',
        tag: 'Payments · Haskell',
        short:
          'Splitting an order into installments — and keeping a partially-paid order in a state that can always still be settled.',
        full:
          'Designed and built a part-payment system end to end for a high-volume payments platform, letting merchants split an order into scheduled installments without an external lender — merchant-defined fixed plans alongside customer-customisable editable plans, a validation layer enforcing sequential part ordering, replay rejection and remainder rules that keep a partially-paid order settleable, per-installment payment-method locking, and a scheduler-driven workflow that auto-refunds every completed part when an incomplete plan expires.',
      },
      {
        title: 'Dynamic Payment Locking',
        tag: 'PureScript · SDK',
        short:
          'Resolving which payment options a user may use — on a client you can never force-update.',
        full:
          'Built a dynamic payment-locking system for a checkout SDK that surfaces only eligible payment options (cards, UPI, wallets, netbanking, EMI, rewards) from the user’s saved instruments, transaction amount, applied offers, and merchant configuration — filtering to instrument-level granularity across ten card dimensions, four UPI types, and a three-tier EMI tree, with unrecognised method types decoding to a forward-compatible fallback so new server-side payment methods never break deployed clients.',
      },
      {
        title: 'Android NFC Bridge',
        tag: 'Kotlin · Android',
        short:
          'Contactless card reading exposed to a JavaScript checkout UI that knows nothing about device state or lifecycle.',
        full:
          'Designed and implemented an Android NFC bridge exposing contactless card reading to JavaScript-driven webview checkout UIs — hardware-capability and permission gating that deep-links into system NFC settings and resumes the interrupted read on return, request-code-keyed callback multiplexing so overlapping reads resolve independently without cross-talk, and a full-screen reader activity with configurable timeout, lifecycle-bound NFC dispatch, and host-overridable copy for localisation.',
      },
    ],
  },
  {
    company: 'Sahaj Software Solutions',
    role: 'Software Development Engineer Intern',
    period: 'Jan 2022 – Aug 2022',
    location: 'Pune, IN',
    accent: '#a78bfa',
    work: [
      {
        title: 'Kotlin Backend Systems',
        tag: 'Kotlin · OOP',
        short: 'Scalable backends built on object-oriented and SOLID design principles.',
        full:
          'Built scalable backend systems in Kotlin applying object-oriented and SOLID design principles, including a parking-lot management system.',
      },
      {
        title: 'Real-Time Socket System',
        tag: 'WebSockets · CI/CD',
        short: 'A socket-based client–server system with a JS frontend and a high-performance CSV parser.',
        full:
          'Developed a real-time socket-based client–server system with a modern JavaScript frontend, alongside a high-performance CSV parser — ensuring reliability with automated tests (JUnit, Cypress, Jasmine) and scalable delivery via CI/CD and Docker.',
      },
    ],
  },
  {
    company: 'Solytics Partners',
    role: 'Software Developer Intern',
    period: 'Nov 2020 – Mar 2021',
    location: 'Remote',
    accent: '#34d399',
    work: [
      {
        title: 'NIMBUS — No-Code ML Platform',
        tag: 'React · Redux',
        short: 'A modular React UI with optimised Redux/Saga state handling.',
        full:
          'Built a modular React (ES6+) UI for NIMBUS, a no-code machine-learning platform, with optimised Redux/Saga state handling.',
      },
      {
        title: 'API Integration',
        tag: 'REST · Postman',
        short: 'Wired the frontend to backend REST APIs and validated the flows.',
        full: 'Integrated the frontend with backend REST APIs and validated flows using Postman.',
      },
    ],
  },
]

export const skills = [
  {
    group: 'Languages',
    items: ['Haskell', 'PureScript', 'Kotlin', 'Python', 'JavaScript'],
    note: 'familiar: C++, Go, Java',
  },
  {
    group: 'Compilers & Build',
    items: ['GHC internals', 'Type-checker plugins', 'Typed-AST analysis', 'Nix', 'haskell-flake', 'Jenkins CI'],
  },
  {
    group: 'Backend & Data',
    items: ['Servant', 'REST APIs', 'PostgreSQL', 'MySQL', 'Redis', 'MongoDB', 'NodeJS', 'WebSockets'],
  },
  {
    group: 'Frontend & Mobile',
    items: ['React', 'Redux / Saga', 'NextJS', 'Android SDK', 'JS↔native bridges'],
  },
  {
    group: 'Tooling',
    items: ['Git', 'Docker', 'CI/CD', 'Linux', 'AWS', 'ElasticSearch', 'JUnit', 'Cypress'],
  },
  {
    group: 'Domain',
    items: ['Digital payments', 'UPI · Cards · EMI', 'Record-replay testing', 'Cryptography'],
  },
]

export const orbitSkills = [
  'Haskell', 'GHC', 'Nix', 'PureScript', 'Kotlin', 'Python',
  'React', 'Redis', 'Postgres', 'Docker', 'Servant', 'MySQL',
  'Android', 'JavaScript', 'Linux', 'AWS', 'MongoDB', 'NodeJS',
]

export const projects = [
  {
    title: 'E-Commerce Platform',
    stack: 'MERN',
    body:
      'Full-stack e-commerce application with JWT-based authentication, Stripe payment integration, real-time order tracking, and admin dashboards with sales analytics — React Redux for state management over RESTful APIs.',
  },
]

export const education = [
  {
    school: 'Army Institute of Technology',
    degree: 'B.E. in Computer Engineering',
    period: '2018 – 2022',
    location: 'Pune, Maharashtra, IN',
    score: 'GPA 8.96',
  },
  {
    school: 'Kendriya Vidyalaya Hebbal',
    degree: 'Secondary Education (CBSE)',
    period: '2017 – 2018',
    location: 'Bangalore, Karnataka, IN',
    score: '91%',
  },
]
