// Content ported from _data/*.yml in the source repo.
// Keep this as the single source of truth.

window.SITE = {
  author: "Naixu Guo",
  nameZh: "郭乃绪",
  description: "Quantum algorithms, structured learning, and scientific discovery.",
  email: "naixug@u.nus.edu",
  socials: {
    scholar: "https://scholar.google.com/citations?user=r2I_WtAAAAAJ&hl=en",
    x: "https://x.com/gnx_kns",
    linkedin: "https://www.linkedin.com/in/naixu-guo-a0567626a/",
    github: "https://github.com/Naixu-Guo",
  },
  hero: {
    kicker: "Structured Dynamics",
    tagline: "Quantum algorithms, scientific computing, and AI research systems.",
    statement: "I work on the algorithmic foundations of quantum-enhanced intelligence.",
  },
  bioOpener: "I work on the algorithmic foundations of quantum-enhanced intelligence — the way computation, learning, and physical evolution share a common language of dynamics.",
  bio: [
    "I am interested in collaborations on quantum algorithms, scientific computing, and AI agents for scientific knowledge and reasoning.",
  ],
  facts: [
    { label: "Currently", value: "Research internship", sub: "A*STAR IHPC · Yunlong Xiao" },
    { label: "Based in",  value: "Singapore", sub: "CQT, NUS" },
    { label: "Advised by", value: "Rebentrost · Santha", sub: "Centre for Quantum Technologies" },
    { label: "Trained at", value: "Osaka · Kyoto", sub: "Fujii · Miyadera" },
  ],
  interests: ["Quantum algorithms", "AI for science", "Quantum ML", "Open systems", "Learning theory", "Linear algebra"],
  personal: {
    role: "Ph.D. student, Computer Science (Quantum Information)",
    institution: "Centre for Quantum Technologies, NUS",
    location: "Singapore",
    focus: "Quantum algorithms · Quantum learning · AI agents",
  },
  selectedWorks: [
    { title: "Quantum Transformer", mapping: "neural systems × quantum structure", link: "https://arxiv.org/abs/2402.16714" },
    { title: "Fast-forwardable Lindbladians", mapping: "open-system dynamics × phase estimation", link: "https://arxiv.org/abs/2510.06759" },
    { title: "Accelerating Inference for Multilayer Networks", mapping: "scientific modeling × quantum acceleration", link: "https://arxiv.org/abs/2510.07195" },
  ],
  contactMessage: "Happy to talk about research and opportunities in quantum and AI.",
};

window.NEWS = [
  { date: "Feb 2026", content: "Started a research internship at A*STAR Institute of High Performance Computing, hosted by Yunlong Xiao." },
  { date: "Jan 2026", content: 'Our work [Accelerating Inference for Multilayer Neural Networks with Quantum Computers](https://arxiv.org/abs/2510.07195) accepted at **ICLR 2026**.', venue: "ICLR" },
  { date: "Dec 2025", content: "Gave an outreach talk on the limits of classical computation and quantum advantage at Quantum Fall Fest 2025 in Singapore." },
  { date: "Nov 2025", content: 'Our work [Fast-forwardable Lindbladians imply quantum phase estimation](https://arxiv.org/abs/2510.06759) accepted at **QIP 2026**.', venue: "QIP" },
  { date: "Oct 2025", content: "Invited talks on quantum algorithms for linear differential equations and phase estimation via Lindbladians at Institute for Quantum Computing and Oxford University." },
  { date: "Oct 2025", content: "New preprints: [Fast-forwardable Lindbladians imply quantum phase estimation](https://arxiv.org/abs/2510.06759) and [Accelerating Inference for Multilayer Neural Networks](https://arxiv.org/abs/2510.07195)." },
  { date: "Aug 2025", content: 'Our paper [Online Learning of Pure States is as Hard as Mixed States](https://arxiv.org/abs/2502.00823) accepted at **NeurIPS 2025**.', venue: "NeurIPS" },
  { date: "Aug 2025", content: 'Our paper [Design nearly optimal quantum algorithm for linear differential equations via Lindbladians](https://arxiv.org/abs/2410.19628) accepted at **Physical Review Letters**.', venue: "PRL" },
  { date: "Aug 2025", content: "Started visit to Xanadu, University of Toronto, and University of Waterloo." },
  { date: "Aug 2025", content: "Received the [research excellence scholarship](https://www.sandboxaq.com/company/scholarships) from Sandbox AQ." },
  { date: "Aug 2025", content: "Our paper [Quantum linear algebra is all you need for Transformer architectures](https://arxiv.org/abs/2402.16714) presented as a plenary talk at AQIS 2025." },
  { date: "Jun 2025", content: "Our paper [Design nearly optimal quantum algorithm for linear differential equations via Lindbladians](https://arxiv.org/abs/2410.19628) accepted for a talk at AQIS 2025." },
  { date: "May 2025", content: "Talk on [Design nearly optimal quantum algorithm for linear differential equations via Lindbladians](https://arxiv.org/abs/2410.19628) at Joint CQT-MCQST workshop." },
  { date: "Apr 2025", content: "Invited talk on [Quantum linear algebra is all you need for Transformer architectures](https://arxiv.org/abs/2402.16714) at Nanyang Technological University, hosted by Mile Gu." },
  { date: "Apr 2025", content: "Invited talk on [Design nearly optimal quantum algorithm for linear differential equations via Lindbladians](https://arxiv.org/abs/2410.19628) at Centre for Quantum Technologies, NUS." },
  { date: "Mar 2025", content: "Invited talk on [Design nearly optimal quantum algorithm for linear differential equations via Lindbladians](https://arxiv.org/abs/2410.19628) at University of Latvia, hosted by Andris Ambainis." },
];

window.PUBLICATIONS = [
  {
    title: "Fast-forwardable Lindbladians imply quantum phase estimation",
    authors: "Zhong-Xia Shang, **Naixu Guo** (co-first author), Patrick Rebentrost, Alán Aspuru-Guzik, Tongyang Li, Qi Zhao",
    journal: "Annual Quantum Information Processing Conference (**QIP**), 2026; arXiv:2510.06759, 2025",
    year: 2026, category: "conference", featured: true,
    summary: "Clarifies a structural bridge between open-system evolution and phase estimation, showing how dissipative dynamics can encode a core quantum algorithmic primitive.",
    link: "https://arxiv.org/abs/2510.06759",
  },
  {
    title: "Accelerating Inference for Multilayer Neural Networks with Quantum Computers",
    authors: "Arthur G. Rattew, Po-Wei Huang, **Naixu Guo**, Lirandë Pira, Patrick Rebentrost",
    journal: "International Conference on Learning Representations (**ICLR**), 2026",
    year: 2026, category: "conference", featured: true,
    summary: "Develops a quantum framework for inference in multilayer neural systems, connecting structured model dynamics with scalable scientific computation.",
    link: "https://arxiv.org/abs/2510.07195",
  },
  {
    title: "Quantum Machine Learning: A Hands-on Tutorial for Machine Learning Practitioners and Researchers",
    authors: "Yuxuan Du, Xinbiao Wang, **Naixu Guo**, Zhan Yu, Yang Qian, Kaining Zhang, Min-Hsiu Hsieh, Patrick Rebentrost, Dacheng Tao",
    journal: "Springer Nature, 2025",
    year: 2025, category: "journal",
    summary: "A broad technical introduction to the methods, assumptions, and practical questions shaping contemporary quantum machine learning.",
    link: "https://arxiv.org/abs/2502.01146",
  },
  {
    title: "Online Learning of Pure States is as Hard as Mixed States",
    authors: "Maxime Meyer, Soumik Adhikary, **Naixu Guo**, Patrick Rebentrost",
    journal: "Neural Information Processing Systems (**NeurIPS**), 2025",
    year: 2025, category: "conference",
    summary: "Establishes hardness results for online learning in quantum settings, sharpening the theoretical limits of learnability for structured quantum data.",
    link: "https://arxiv.org/abs/2502.00823",
  },
  {
    title: "Design nearly optimal quantum algorithm for linear differential equations via Lindbladians",
    authors: "Zhong-Xia Shang, **Naixu Guo**, Dong An, Qi Zhao",
    journal: "Phys. Rev. Letters (**PRL**), 2025",
    year: 2025, category: "journal", featured: true,
    summary: "Builds nearly optimal Lindbladian methods for linear differential equations, tightening the algorithmic treatment of continuous-time dynamics.",
    link: "https://arxiv.org/abs/2410.19628",
  },
  {
    title: "Quantum linear algebra is all you need for Transformer architectures",
    authors: "**Naixu Guo**, Zhan Yu, Matthew Choi, Yizhan Han, Aman Agrawal, Kouhei Nakaji, Alán Aspuru-Guzik, Patrick Rebentrost",
    journal: "arXiv:2402.16714, 2024",
    year: 2024, category: "preprint", featured: true,
    summary: "Recasts transformer-style computation in quantum linear algebraic terms, linking modern model architectures to structured quantum routines.",
    link: "https://arxiv.org/abs/2402.16714",
    mediaLink: "https://pennylane.ai/blog/2024/04/quantum_transformers",
    mediaLabel: "PennyLane Essay",
  },
  {
    title: "Nonlinear transformation of complex amplitudes via quantum singular value transformation",
    authors: "**Naixu Guo**, Kosuke Mitarai, Keisuke Fujii",
    journal: "Physical Review Research (**PRR**), 2024",
    year: 2024, category: "journal",
    summary: "Extends quantum singular value transformation toward nonlinear amplitude manipulations, expanding the expressive structure of quantum linear algebra.",
    link: "https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.6.043227",
  },
  {
    title: "Provable learning of quantum states with graphical models",
    authors: "Liming Zhao, **Naixu Guo**, Ming-Xing Luo, Patrick Rebentrost",
    journal: "arXiv:2309.09235, 2023",
    year: 2023, category: "preprint",
    summary: "Uses graphical model structure to study provable learning procedures for quantum states, connecting representation and inference in quantum systems.",
    link: "https://arxiv.org/abs/2309.09235",
  },
  {
    title: "Estimating properties of a quantum state by importance-sampled operator shadows",
    authors: "**Naixu Guo**, Feng Pan, Patrick Rebentrost",
    journal: "arXiv:2305.09374, 2023",
    year: 2023, category: "preprint",
    summary: "Introduces importance-sampled operator shadows for more efficient estimation of quantum-state properties under structured measurement access.",
    link: "https://arxiv.org/abs/2305.09374",
  },
  {
    title: "Quantum Alphatron: quantum advantage for learning with kernels and noise",
    authors: "Siyi Yang, **Naixu Guo**, Miklos Santha, Patrick Rebentrost",
    journal: "Quantum, 2023",
    year: 2023, category: "journal",
    summary: "Studies kernel-based quantum learning under noise, giving a theoretical account of advantage in a structured learning model.",
    link: "https://quantum-journal.org/papers/q-2023-10-23-1174/",
  },
];

window.RESEARCH = {
  intro: "My work is organized around computational systems that evolve, learn, and transform structure. Across these directions, the common thread is to formalize dynamics in ways that preserve algorithmic precision while opening new paths for scientific discovery.",
  vision: {
    lead: "Intelligence as",
    focus: "a dynamical system",
    flow: ["learning", "computation", "physical evolution"],
  },
  areas: [
    {
      number: "01", title: "Quantum Algorithms",
      keywords: "Linear algebra · open systems · evolution",
      focus: "Designing computational structures that capture system dynamics.",
      summary: "Quantum algorithms as structured transformations of evolving systems, where physical dynamics become computational primitives.",
      pageSummary: "I study algorithmic formalisms for evolution operators, linear differential systems, and open quantum dynamics. The goal is to convert physical structure into computational leverage without losing theoretical rigor.",
      threads: [
        "Open-system evolution and fast-forwardability",
        "Quantum linear algebra for structured operators",
        "Algorithms for differential equations and simulation",
      ],
      representative: [
        { title: "Fast-forwardable Lindbladians imply quantum phase estimation", venue: "QIP 2026", link: "https://arxiv.org/abs/2510.06759" },
        { title: "Design nearly optimal quantum algorithm for linear differential equations via Lindbladians", venue: "PRL 2025", link: "https://arxiv.org/abs/2410.19628" },
      ],
    },
    {
      number: "02", title: "AI for Science",
      keywords: "Learning theory · neural dynamics · scientific discovery",
      focus: "Learning theory and quantum frameworks for advancing scientific modeling.",
      summary: "Learning systems as models of scientific structure, from neural dynamics to inference in complex multilayer systems.",
      pageSummary: "This direction connects learning theory with scientific modeling. I am interested in how structured computational tools, including quantum ones, can sharpen inference, representation, and discovery in complex systems.",
      threads: [
        "Inference in multilayer and dynamical networks",
        "Theory-guided models for scientific discovery",
        "Quantum perspectives on structured learning systems",
      ],
      representative: [
        { title: "Accelerating Inference for Multilayer Neural Networks with Quantum Computers", venue: "ICLR 2026", link: "https://arxiv.org/abs/2510.07195" },
        { title: "Provable learning of quantum states with graphical models", venue: "arXiv", link: "https://arxiv.org/abs/2309.09235" },
      ],
    },
    {
      number: "03", title: "Quantum Machine Learning",
      keywords: "Quantum ML · learnability · theory",
      focus: "Algorithmic foundations and theoretical limits of quantum-accelerated learning.",
      summary: "Quantum machine learning as a question of structure, learnability, and the limits of algorithmic speedup.",
      pageSummary: "I work on the theoretical foundations of quantum-enhanced learning, with an emphasis on representation, learnability, and the precise regimes where quantum computation changes the character of modern learning systems.",
      threads: [
        "Quantum linear algebra for modern model architectures",
        "Learnability and complexity of quantum data",
        "Theory of nonlinear and kernel-based quantum models",
      ],
      representative: [
        { title: "Quantum linear algebra is all you need for Transformer architectures", venue: "arXiv", link: "https://arxiv.org/abs/2402.16714" },
        { title: "Quantum Alphatron: quantum advantage for learning with kernels and noise", venue: "Quantum 2023", link: "https://quantum-journal.org/papers/q-2023-10-23-1174/" },
      ],
    },
  ],
};

window.LIBRARY = {
  subtitle: "A collection of references I personally find useful for study and research. Feel free to send me an email if you have any good suggestions.",
  categories: [
    {
      title: "Quantum Computing",
      description: "Algorithms, learning, complexity, and information theory",
      subcategories: [
        {
          title: "Algorithms",
          items: [
            { title: "Lecture notes by Andrew Childs", link: "https://www.cs.umd.edu/~amchilds/qa/", type: "lecture notes" },
            { title: "Lecture notes by Ronald de Wolf", link: "https://staff.fnwi.uva.nl/r.dewolf/qcnotes.pdf", type: "lecture notes" },
            { title: "Lecture notes by Lin Lin", link: "https://math.berkeley.edu/~linlin/teaching/QC18.html", type: "lecture notes" },
            { title: "Quantum algorithms by Andris Ambainis", link: "https://www.lu.lv/fileadmin/user_upload/lu_portal/projekti/quantum/Quantum_algorithms.pdf", type: "lecture notes" },
          ],
        },
        {
          title: "Learning",
          items: [
            { title: "A Survey of Quantum Learning Theory", link: "https://arxiv.org/abs/2106.15559", type: "paper" },
            { title: "A survey on the complexity of learning quantum states", link: "https://arxiv.org/abs/2011.12166", type: "paper" },
            { title: "The randomized measurement toolbox", link: "https://arxiv.org/abs/2004.14439", type: "paper" },
            { title: "Introduction to Haar Measure Tools in Quantum Information", link: "https://arxiv.org/abs/2112.01349", type: "paper" },
          ],
        },
        {
          title: "Complexity",
          items: [
            { title: "Around the quantum PCP Conjecture", link: "https://arxiv.org/abs/1311.7685", type: "paper" },
            { title: "Quantum proofs", link: "https://arxiv.org/abs/1201.2189", type: "paper" },
          ],
        },
        {
          title: "Information",
          items: [
            { title: "Theory of Quantum Information", link: "https://arxiv.org/abs/1806.05966", type: "paper" },
          ],
        },
      ],
    },
    {
      title: "Machine Learning",
      description: "Theory, algorithms, and applications",
      subcategories: [
        {
          title: "General",
          items: [
            { title: "Lecture notes by Arthur Gretton", link: "https://www.gatsby.ucl.ac.uk/~gretton/coursefiles.html", type: "lecture notes" },
            { title: "Lecture notes by Tengyu Ma", link: "https://web.stanford.edu/class/cs229t/", type: "lecture notes" },
            { title: "Neural Tangent Kernel Papers", link: "https://arxiv.org/search/?query=neural+tangent+kernel&searchtype=all", type: "paper collection" },
            { title: "The Information Bottleneck Problem and Its Applications in Machine Learning", link: "https://arxiv.org/abs/1503.02406", type: "paper" },
            { title: "Diffusion Models: A Comprehensive Survey of Methods and Applications", link: "https://arxiv.org/abs/2209.00796", type: "paper" },
          ],
        },
      ],
    },
    {
      title: "Other Topics",
      description: "Mathematics, optimization, and theoretical computer science",
      subcategories: [
        {
          title: "Theory",
          items: [
            { title: "Spectral graph theory", link: "https://www.cs.yale.edu/homes/spielman/spectra/index.html", type: "lecture notes" },
            { title: "Markov chain and mixing times", link: "https://pages.uoregon.edu/dlevin/MARKOV/", type: "lecture notes" },
            { title: "Analysis of Boolean Functions", link: "https://www.cs.cmu.edu/~odonnell/boolean-analysis/", type: "lecture notes" },
            { title: "Introduction to Online Convex Optimization", link: "https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/", type: "lecture notes" },
          ],
        },
        {
          title: "Deep Learning",
          items: [
            { title: "Deep Learning by Ian Goodfellow", link: "https://www.deeplearningbook.org/", type: "book" },
            { title: "Neural Networks and Deep Learning by Michael Nielsen", link: "http://neuralnetworksanddeeplearning.com/", type: "book" },
          ],
        },
        {
          title: "Machine Learning",
          items: [
            { title: "Pattern Recognition and Machine Learning by Christopher Bishop", link: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/", type: "book" },
            { title: "The Elements of Statistical Learning by Trevor Hastie", link: "https://web.stanford.edu/~hastie/ElemStatLearn/", type: "book" },
          ],
        },
      ],
    },
  ],
};

window.CV = {
  intro: "A concise overview of research training, academic appointments, awards, and professional service.",
  sections: [
    {
      title: "Education",
      items: [
        { title: "Ph.D. in Computer Science (Quantum Information)", institution: "National University of Singapore", duration: "2022 — 2026 (expected)", details: "Advisors: Patrick Rebentrost and Miklos Santha" },
        { title: "M.E. in Electrical Engineering", institution: "Osaka University", duration: "2020 — 2022", details: "Advisor: Keisuke Fujii" },
        { title: "B.E. in Applied Physics", institution: "Kyoto University", duration: "2016 — 2020", details: "Advisor: Takayuki Miyadera" },
      ],
    },
    {
      title: "Honors, Awards & Fellowships",
      items: [
        { title: "Research Excellence Scholarship", institution: "Sandbox AQ", duration: "2025" },
        { title: "CQT Young Researcher Career Development Grant", institution: "Centre for Quantum Technologies", duration: "2025" },
        { title: "Distinguished Scholarship Award", institution: "National University of Singapore", duration: "2022" },
        { title: "Hirose International Scholarship", institution: "Hirose Foundation", duration: "2017 — 2022" },
        { title: "Monbukagakusho Honors Scholarship", institution: "MEXT, Japan", duration: "2016 — 2017" },
      ],
    },
    {
      title: "Academic Visits & Research Experience",
      items: [
        { title: "University of Toronto", institution: "Host: Alán Aspuru-Guzik", duration: "Aug — Sep 2024" },
        { title: "Peking University & Tsinghua University", institution: "Host: Dong An & Ziwen Liu", duration: "Dec 2024" },
        { title: "HKUST (Guangzhou)", institution: "Host: Xin Wang", duration: "Dec 2024" },
        { title: "RWTH Aachen & Free University of Berlin", institution: "Host: Mario Berta & Jens Eisert", duration: "Jun — Jul 2024" },
        { title: "Nagoya University", institution: "Host: François Le Gall", duration: "Jul 2021 — Mar 2022" },
        { title: "Kyoto University", institution: "Host: Keisuke Fujii", duration: "Mar — Jul 2019" },
      ],
    },
    {
      title: "Professional Service",
      items: [
        { title: "Program Committee", institution: "Joint CQT–MCQST workshop" },
        { title: "Reviewer (Journals)", institution: "Quantum, PRX Quantum, Physical Review Research, Quantum Machine Intelligence" },
        { title: "Reviewer (Conferences)", institution: "QIP 2023/2024, TQC 2023/2024, QCTIP 2024, AQIS 2025, QCE 2025" },
      ],
    },
  ],
};
