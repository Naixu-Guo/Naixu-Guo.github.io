/* global React, SITE, NEWS, renderInline */
const { useEffect } = React;

function Home({ navigate }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);
  return (
    <React.Fragment>
      <section className="hero">
        <div className="container">
          <div className="hero__slug">
            <div className="hero__slug-left">
              <span className="hero__slug-dot"></span>
              <span>№ 01 — MMXXVI</span>
            </div>
            <div className="hero__slug-right">{SITE.personal.location}</div>
          </div>

          <div className="hero__grid">
            <div className="hero__left">
              <h1 className="hero__name">{SITE.heroName.primary} <em>{SITE.heroName.accent}</em></h1>
              <p className="hero__zh">{SITE.heroName.zh}</p>
              <p className="hero__tagline">{SITE.hero.tagline}</p>

              <dl className="hero__meta">
                <dt>Role</dt>
                <dd><strong>{SITE.personal.role}</strong></dd>
                <dt>Affiliation</dt>
                <dd>{SITE.personal.institution}<br />Advised by {SITE.personal.advisors}.</dd>
                <dt>Ask me about</dt>
                <dd>{SITE.personal.focus}</dd>
              </dl>

              <div className="hero__cta">
                <a href="#/research" onClick={(e) => { e.preventDefault(); navigate("/research"); }}>Research</a>
                <a href="#/publications" onClick={(e) => { e.preventDefault(); navigate("/publications"); }}>Publications</a>
                <a href="#/cv" onClick={(e) => { e.preventDefault(); navigate("/cv"); }}>CV</a>
                <a href={`mailto:${SITE.email}`}>Email</a>
              </div>
            </div>

            <div className="hero__media">
              <div className="hero__portrait-wrap">
                <img className="hero__portrait" src="photo.jpg" alt={`Portrait of ${SITE.name}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section reveal">
        <div className="container">
          <div className="about">
            <div className="about__rail">
              <span className="about__rail-label">Interests</span>
              <span className="about__rail-sep"></span>
            </div>
            <div className="about__body">
              {SITE.bio.map((p, i) => <p key={i} className="about__para">{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* Updates */}
      <section className="section reveal">
        <div className="container">
          <div className="section__head">
            <div className="section__kicker">Recent Updates</div>
            <div>
              <h2 className="section__title">News.</h2>
            </div>
          </div>

          <div className="updates">
            {NEWS.slice(0, 6).map((n, i) => (
              <article className="update" key={i}>
                <div className="update__date">{n.date}</div>
                <div className="update__body">
                  {n.venue && <span className="update__venue">{n.venue}</span>}
                  {renderInline(n.content)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section reveal">
        <div className="container">
          <div className="contact">
            <div className="section__kicker">Get in Touch</div>
            <div>
              <p className="contact__big">{SITE.contactMessage}</p>
              <div className="contact__links">
                <a className="contact__link" href={`mailto:${SITE.email}`}>Email</a>
                <a className="contact__link" href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.Home = Home;
