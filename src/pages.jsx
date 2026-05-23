/* global React, SITE, RESEARCH, PUBLICATIONS, CV, NEWS, renderInline */
const { useEffect: useEffectSub } = React;

function PageIntro({ kicker, title, lead }) {
  return (
    <section className="page-intro">
      <div className="container">
        <div className="page-intro__grid">
          <div className="section__kicker">{kicker}</div>
          <div>
            <h1 className="page-intro__title">{title}</h1>
            {lead && <p className="page-intro__lead">{lead}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Research() {
  useEffectSub(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);
  const r = RESEARCH;
  return (
    <React.Fragment>
      <section className="section section--first reveal">
        <div className="container">
          <div className="section__head">
            <div className="section__kicker">Research / Vision</div>
            <div>
              <h1 className="vision">
                {r.vision.lead}<br />
                <em>{r.vision.focus}</em>.
              </h1>
              <p className="section__lead">{r.intro}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="container">
          <div className="section__head section__head--compact">
            <div className="section__kicker">Themes</div>
            <div></div>
          </div>
          <div className="agenda">
            {r.areas.map((area) => (
              <article className="agenda__item" key={area.number}>
                <div className="agenda__rail">
                  <div className="agenda__num">{area.number}</div>
                  <h2 className="agenda__title">{area.title}</h2>
                </div>
                <div className="agenda__body">
                  <p className="agenda__desc">{area.pageSummary}</p>
                  <div className="agenda__field-label">Representative Work</div>
                  <div className="direction__reps" style={{ borderTop: 0, paddingTop: 0 }}>
                    {area.representative.map((rep, j) => (
                      <div className="direction__rep" key={j}>
                        <a href={rep.link} target="_blank" rel="noopener noreferrer">{rep.title}</a>
                        <span className="direction__rep-venue">{rep.venue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

function Publications() {
  useEffectSub(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  // group by year
  const byYear = {};
  for (const p of PUBLICATIONS) {
    if (!byYear[p.year]) byYear[p.year] = [];
    byYear[p.year].push(p);
  }
  const years = Object.keys(byYear).sort((a, b) => b - a);

  // pull the arxiv id (or a short id) out of an arxiv link for the placeholder label
  const figureLabel = (p) => {
    const m = (p.link || "").match(/arxiv\.org\/abs\/([\d.]+)/i);
    if (m) return "arXiv:" + m[1];
    if ((p.link || "").includes("aps.org")) return "PRL · PRR";
    if ((p.link || "").includes("quantum-journal")) return "Quantum";
    return p.category || "paper";
  };

  return (
    <React.Fragment>
      <PageIntro
        kicker="Publications"
        title="Publications."
      />

      <section className="section reveal">
        <div className="container">
          {years.map((y) => (
            <div className="pub-year" key={y}>
              <div className="pub-year__num">{y}</div>
              <div className="pub-year__items">
                {byYear[y].map((p, j) => (
                  <article className="pub-card" key={j}>
                    <a className="pub-card__figure"
                       href={p.link}
                       target="_blank" rel="noopener noreferrer"
                       aria-label={p.title}>
                      {p.figure ? (
                        <img src={p.figure} alt="" />
                      ) : (
                        <div className="pub-card__placeholder">
                          <span className="pub-card__placeholder-label">{figureLabel(p)}</span>
                        </div>
                      )}
                    </a>
                    <div className="pub-card__body">
                      <p className="pub-card__meta">
                        <span>{p.category}</span>
                        <span>·</span>
                        <span>{p.year}</span>
                      </p>
                      <h3 className="pub-card__title">
                        <a href={p.link} target="_blank" rel="noopener noreferrer">{p.title}</a>
                      </h3>
                      <p className="pub-card__authors">{renderInline(p.authors)}</p>
                      <p className="pub-card__venue">{renderInline(p.journal)}</p>
                      {p.summary && <p className="pub-card__summary">{p.summary}</p>}
                      <div className="pub-links">
                        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">Paper ↗</a>}
                        {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                        {p.mediaLink && <a href={p.mediaLink} target="_blank" rel="noopener noreferrer">{p.mediaLabel || "Media"} ↗</a>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

function CVPage() {
  useEffectSub(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);
  return (
    <React.Fragment>
      <PageIntro
        kicker="CV"
        title="Curriculum Vitae."
      />

      <section className="section reveal">
        <div className="container">
          {CV.sections.map((s, i) => (
            <div className="cv-block" key={i}>
              <h2>{s.title}</h2>
              {s.items.map((item, j) => (
                <article className="cv-item" key={j}>
                  <div>
                    <h3 className="cv-item__title">{item.title}</h3>
                    {item.institution && <p className="cv-item__inst">{item.institution}</p>}
                    {item.details && <p className="cv-item__details">{item.details}</p>}
                  </div>
                  {item.duration && <p className="cv-item__date">{item.duration}</p>}
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

function Library() {
  useEffectSub(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);
  return (
    <React.Fragment>
      <PageIntro
        kicker="Library"
        title="Library."
      />
      <section className="section reveal">
        <div className="container">
          <div className="lib">
            {window.LIBRARY.categories.map((cat, i) => (
              <section className="lib-cat" key={i}>
                <div className="lib-cat__head">
                  <p className="lib-cat__num">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="lib-cat__title">{cat.title}</h2>
                </div>
                <div className="lib-cat__body">
                  {cat.subcategories.map((sub, j) => (
                    <div className="lib-block" key={j}>
                      <h3 className="lib-block__title">{sub.title}</h3>
                      <ul className="lib-list">
                        {sub.items.map((item, k) => (
                          <li className="lib-item" key={k}>
                            <a className="lib-item__link" href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                            <span className="lib-item__type">{item.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { Research, Publications, CVPage, Library });
