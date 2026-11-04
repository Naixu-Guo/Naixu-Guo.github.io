// Saved links from the former reader and duplicated Research agenda.
(() => {
  const targets = {
    interests: '/#current-interests',
    'ai-quantum-design': '/#scientific-agents',
    'scientific-agents': '/#scientific-agents',
    'quantum-algorithms-learning': '/#quantum-algorithms-learning',
    papers: '/publications/', reading: '/library/',
  };
  function redirectLegacyTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    // Existing homepage anchors stay native, preventing redirect loops.
    if (!document.getElementById(id) && Object.hasOwn(targets, id)) location.replace(targets[id]);
  }
  redirectLegacyTarget();
  window.addEventListener('hashchange', redirectLegacyTarget);
})();
