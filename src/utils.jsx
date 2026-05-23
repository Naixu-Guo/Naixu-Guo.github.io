/* global React */
// Small markdown-ish renderer for news content:
//   [text](url) → <a>
//   **text**    → <strong>
// Returns React nodes.
function renderInline(text) {
  if (!text) return null;
  const out = [];
  let i = 0, key = 0;
  while (i < text.length) {
    // [link](url)
    const linkStart = text.indexOf("[", i);
    const boldStart = text.indexOf("**", i);
    let next = -1;
    let kind = "";
    if (linkStart !== -1 && (boldStart === -1 || linkStart < boldStart)) {
      next = linkStart; kind = "link";
    } else if (boldStart !== -1) {
      next = boldStart; kind = "bold";
    }
    if (next === -1) {
      out.push(text.slice(i));
      break;
    }
    if (next > i) out.push(text.slice(i, next));
    if (kind === "link") {
      const closeText = text.indexOf("]", next);
      const openUrl = text.indexOf("(", closeText);
      const closeUrl = text.indexOf(")", openUrl);
      if (closeText === -1 || openUrl !== closeText + 1 || closeUrl === -1) {
        out.push(text[i]); i = next + 1; continue;
      }
      const label = text.slice(next + 1, closeText);
      const url = text.slice(openUrl + 1, closeUrl);
      out.push(
        <a key={key++} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
      );
      i = closeUrl + 1;
    } else { // bold
      const closeBold = text.indexOf("**", next + 2);
      if (closeBold === -1) {
        out.push(text.slice(i)); break;
      }
      const inner = text.slice(next + 2, closeBold);
      out.push(<strong key={key++}>{inner}</strong>);
      i = closeBold + 2;
    }
  }
  return out;
}
window.renderInline = renderInline;

// Reveal-on-scroll hook
function useReveal() {
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal:not(.reveal--in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
window.useReveal = useReveal;
