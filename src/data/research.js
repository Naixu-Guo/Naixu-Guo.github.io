window.RESEARCH = {
  page: {
    kicker: "Research / Vision",
    themesKicker: "Themes",
    representativeLabel: "Representative Work",
    threadsLabel: "Research Threads",
  },
  intro: "I study how the structure of nature and scientific knowledge can be used for computation. My work develops quantum algorithmic primitives and applies them to simulation, scientific computing, and learning, while also exploring AI agents that help organize, verify, and reason over scientific research.",
  vision: {
    lead: "Turning the structure of nature and knowledge",
    focus: "into computation",
  },
  areas: [
    {
      number: "01",
      title: "Quantum Algorithms",
      pageSummary: "I work on exploring new quantum algorithmic primitives and finding new applications. I often bring intuition from physical systems and AI problems into quantum algorithm design, while also using quantum computation as a lens to understand scientific problems and learning systems.",
      threads: [
        "Quantum linear algebra and its applications",
        "Dissipative quantum algorithms and simulation",
        "General nonlinear transformation in quantum systems",
      ],
      representative: [
        { title: "Quantum linear algebra is all you need for Transformer architectures", venue: "arXiv", link: "https://arxiv.org/abs/2402.16714" },
        { title: "Fast-forwardable Lindbladians imply quantum phase estimation", venue: "QIP 2026", link: "https://arxiv.org/abs/2510.06759" },
        { title: "Design nearly optimal quantum algorithm for linear differential equations via Lindbladians", venue: "PRL 2025", link: "https://arxiv.org/abs/2410.19628" },
      ],
    },
    {
      number: "02",
      title: "Quantum learning",
      pageSummary: "I study what information about a quantum system can be learned from data, and how efficiently it can be represented and used. The goal is to understand which physical or mathematical structures make quantum learning possible, scalable, and useful for prediction and simulation.",
      threads: [
        "Quantum state learning and tomography",
        "Hamiltonian and Lindbladian learning",
      ],
      representative: [
        { title: "Provable learning of quantum states with graphical models", venue: "Phys. Rev. Research", link: "https://journals.aps.org/prresearch/abstract/10.1103/1355-xvpx" },
        { title: "Online Learning of Pure States is as Hard as Mixed States", venue: "NeurIPS 2025", link: "https://arxiv.org/abs/2502.00823"},
      ],
    },
    {
      number: "03",
      title: "AI Agents for Scientific Discovery",
      pageSummary: "I am building AI systems that can assist the full research loop in theoretical science, with a focus on quantum information and computing. The goal is to move beyond paper summarization toward agents that can read literature, extract reusable knowledge, reason over assumptions and proofs, generate research ideas, and test them through verification and benchmarks.",
      threads: [
        "Scientific knowledge graphs and paper understanding",
        "Verification, benchmarking, and harness for AI agents",
        "Self-evolving AI agents for research",
      ],
      representative: [
        { title: "AI quantum physicist (ongoing project)", venue: "", link: "" },
      ],
    },
  ],
};
