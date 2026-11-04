// The research agenda is shown once, on the homepage.
export function homeInterests({ INTERESTS, escapeHtml: e, ext }) {
  const featured = INTERESTS.topics.filter(topic => topic.showOnHome !== false);
  const link = item => item.href.startsWith('/') ? `<a href="${e(item.href)}">${e(item.label)}</a>` : ext(item.label, item.href);
  const community = INTERESTS.community;
  const communityCopy = community && (e(community.text).includes(e(community.title))
    ? e(community.text).replace(e(community.title), () => ext(community.title, community.href))
    : `${e(community.text)} ${ext(community.title, community.href)}`);
  return `<section class="wrap home-current" id="current-interests" aria-labelledby="current-interests-title">
    <h2 id="current-interests-title">${e(INTERESTS.heading)}</h2>
    ${INTERESTS.homeLead ? `<p class="home-current__lead">${e(INTERESTS.homeLead)}</p>` : ''}
    <div class="home-current__topics">${featured.map(topic => `<article class="home-current__topic" id="${e(topic.id)}">
      <h3><a href="${e(topic.researchHref || "/research/")}">${e(topic.homeTitle || topic.title)}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></h3>
      <p>${e(topic.homeSummary || topic.description)}</p>
      <div class="home-current__evidence">${topic.homeContext ? `<p class="home-current__context">${e(topic.homeContext)}</p>` : ''}<div class="home-current__links">${topic.links.map(link).join('')}</div></div>
    </article>`).join('')}</div>
    ${community ? `<p class="home-community">${communityCopy}</p>` : ''}
    ${INTERESTS.perspective ? `<section class="home-perspective" aria-labelledby="home-perspective-title"><h3 id="home-perspective-title">${e(INTERESTS.perspective.title)}</h3><p>${e(INTERESTS.perspective.text)}</p></section>` : ''}
    <p class="home-current__invitation">If one of these overlaps with your interests, <a href="#contact">${e(INTERESTS.contactLabel || "let’s talk")}</a>.</p>
  </section>`;
}
