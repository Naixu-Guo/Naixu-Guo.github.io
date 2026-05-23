/* global React, ReactDOM, SITE, Home, Research, Publications, CVPage, Library, useReveal */
const { useState, useEffect } = React;

const DATA_FILES = [
  "src/data/home.js",
  "src/data/publications.js",
  "src/data/research.js",
  "src/data/cv.js",
  "src/data/library.js",
];

const ROUTES = [
  { path: "/",             label: "Home",         Component: () => null },
  { path: "/research",     label: "Research",     Component: () => null },
  { path: "/publications", label: "Publications", Component: () => null },
  { path: "/cv",           label: "CV",           Component: () => null },
  { path: "/library",      label: "Library",      Component: () => null },
];

function parseRoute() {
  const h = window.location.hash || "#/";
  const path = h.replace(/^#/, "") || "/";
  return path;
}

function Nav({ route, navigate, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [route]);

  const navClass = `nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`;
  const link = (p, label) => {
    const active = route === p || (p !== "/" && route.startsWith(p));
    return (
      <a
        href={`#${p}`}
        className={active ? "active" : ""}
        onClick={(e) => { e.preventDefault(); navigate(p); }}
      >{label}</a>
    );
  };

  return (
    <nav className={navClass}>
      <div className="container">
        <div className="nav__inner">
          <a href="#/" className="nav__brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <span>{SITE.name}</span>
            <span className="nav__brand-zh">{SITE.nameZh}</span>
          </a>
          <ul className="nav__links">
            {ROUTES.map((r) => (
              <li key={r.path}>{link(r.path, r.label)}</li>
            ))}
          </ul>
          <button className="nav__theme" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? "Dark" : "Light"}
          </button>
          <button className="nav__toggle" onClick={() => setOpen((x) => !x)} aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </div>
      <div className="nav__mobile">
        {ROUTES.map((r) => (
          <React.Fragment key={r.path}>{link(r.path, r.label)}</React.Fragment>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div>
            <strong>{SITE.name} · {SITE.nameZh}</strong>
            <span style={{ display: "block", marginTop: 4 }}>{SITE.personal.institution}</span>
          </div>
          <div>
            <span>© MMXXVI · {SITE.email}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [route, setRoute] = useState(parseRoute());
  const [theme, setTheme] = useState(() => localStorage.getItem("ng-theme") || "dark");
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const host = window.location.hostname;
    if (host !== "127.0.0.1" && host !== "localhost") return undefined;

    let cancelled = false;
    const lastSource = new Map();

    const refreshData = async (force) => {
      try {
        const responses = await Promise.all(
          DATA_FILES.map(async (path) => {
            const response = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) return null;
            return { path, source: await response.text() };
          })
        );

        if (cancelled) return;

        const changed = responses.filter((entry) => (
          entry && (force || lastSource.get(entry.path) !== entry.source)
        ));

        if (!changed.length) return;

        changed.forEach(({ path, source }) => {
          lastSource.set(path, source);
          new Function(source)();
        });

        setDataVersion((version) => version + 1);
      } catch (error) {
        console.warn("Failed to refresh local data files.", error);
      }
    };

    refreshData(true);
    const intervalId = window.setInterval(() => { refreshData(false); }, 1500);
    const onFocus = () => { refreshData(false); };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ng-theme", theme);
  }, [theme]);

  // re-attach reveal observer on every route change
  useReveal();
  useEffect(() => {
    // give a tick for new DOM to mount
    const id = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.reveal--in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("reveal--in");
      });
    }, 80);
    return () => clearTimeout(id);
  }, [route]);

  const navigate = (p) => {
    window.location.hash = `#${p}`;
    setRoute(p);
  };

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  let Page = Home;
  if (route.startsWith("/research")) Page = Research;
  else if (route.startsWith("/publications")) Page = Publications;
  else if (route.startsWith("/cv")) Page = CVPage;
  else if (route.startsWith("/library")) Page = Library;

  return (
    <React.Fragment>
      <Nav route={route} navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Page navigate={navigate} />
      </main>
      <Footer />
    </React.Fragment>
  );
}

window.App = App;

// mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
