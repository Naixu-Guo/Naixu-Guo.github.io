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
    <div class="home-current__topics">${featured.map(topic => `<article class="home-current__topic" id="${e(topic.id)}">
      <h3><a href="${e(topic.researchHref || "/research/")}">${e(topic.homeTitle || topic.title)}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></h3>
      <p>${e(topic.homeSummary || topic.description)}</p>
      <div class="home-current__links">${topic.links.map(link).join('')}</div>
    </article>`).join('')}</div>
    ${community ? `<p class="home-community">${communityCopy}</p>` : ''}
    <p class="home-current__invitation">For ideas and collaborations, <a href="#contact">${e(INTERESTS.contactLabel || "let’s talk")}</a>.</p>
  </section>`;
}
