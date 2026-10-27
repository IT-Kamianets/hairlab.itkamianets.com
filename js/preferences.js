// Runs before styles load, preventing a light flash for saved/system dark mode.
(function () {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('hairlab.display.v1')) || {}; } catch {}
  const language = ['uk', 'en'].includes(saved.language) ? saved.language : (navigator.language.startsWith('uk') ? 'uk' : 'en');
  const theme = ['light', 'dark', 'system'].includes(saved.theme) ? saved.theme : 'system';
  document.documentElement.lang = language;
  document.documentElement.dataset.themePreference = theme;
  document.documentElement.dataset.theme = theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
})();
