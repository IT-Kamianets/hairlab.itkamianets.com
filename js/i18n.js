import ukrainian from './locales/uk.js';
export const languages = ['en', 'uk'];
export function translate(text, language) {
  if (language !== 'uk') return text;
  return text
    .replace(/(\d+) of (\d+) lessons completed · about 4 min/g, 'Завершено уроків: $1 з $2 · близько 4 хв')
    .replace(/LESSON (\d+) OF (\d+)/g, 'УРОК $1 ІЗ $2')
    .replace(/(\d+) looks? to explore/g, 'Знайдено образів: $1')
    .replace(/(\d+) of 3 looks selected for comparison\./g, 'Вибрано образів для порівняння: $1 із 3.')
    .replace(/ progress$/g, ' — прогрес')
    .replace(translationPattern, match => dictionary[match]);
}
// English source phrases remain stable message keys. Longest matches take priority
// so complete explanations are translated before short reusable labels.
const dictionary = { ...ukrainian };
for (const [key, value] of Object.entries(ukrainian)) {
  if (!dictionary[key.toLowerCase()]) dictionary[key.toLowerCase()] = value;
}
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const translationPattern = new RegExp(`(?<![\\p{L}])(?:${Object.keys(dictionary).sort((a,b) => b.length-a.length).map(escape).join('|')})(?![\\p{L}])`, 'gu');
export function initLocalization() {
  const sourceText = new WeakMap();
  const sourceAttributes = new WeakMap();
  const attrs = ['aria-label', 'placeholder', 'alt', 'title'];
  let language = document.documentElement.lang;
  const observer = new MutationObserver(localize);
  function localize() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest('script, style, textarea, [translate="no"]')) continue;
      const previous = sourceText.get(node);
      const source = previous && node.data === previous.rendered ? previous.source : node.data;
      const rendered = translate(source, language);
      if (node.data !== rendered) node.data = rendered;
      sourceText.set(node, { source, rendered });
    }
    for (const element of document.body.querySelectorAll('[aria-label], [placeholder], [alt], [title]')) {
      if (element.closest('[translate="no"]')) continue;
      const records = sourceAttributes.get(element) || {};
      for (const attr of attrs) {
        if (!element.hasAttribute(attr)) continue;
        const current = element.getAttribute(attr);
        const previous = records[attr];
        const source = previous && current === previous.rendered ? previous.source : current;
        const rendered = translate(source, language);
        if (current !== rendered) element.setAttribute(attr, rendered);
        records[attr] = { source, rendered };
      }
      sourceAttributes.set(element, records);
    }
    observer.observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:attrs });
  }
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const languageSelect = document.getElementById('language-select');
  const themeSelect = document.getElementById('theme-select');
  languageSelect.value = language;
  themeSelect.value = document.documentElement.dataset.themePreference;
  function save() {
    try { localStorage.setItem('hairlab.display.v1', JSON.stringify({ version:1, language, theme:themeSelect.value })); }
    catch { document.getElementById('status').textContent = translate('Browser storage is unavailable or full. Changes work in this tab but may not survive a reload.', language); }
  }
  function applyTheme() {
    const preference = themeSelect.value;
    const theme = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#19171B' : '#FFF9FC');
  }
  languageSelect.addEventListener('change', () => {
    language = languageSelect.value;
    document.documentElement.lang = language;
    save(); localize();
    document.dispatchEvent(new Event('languagechange'));
  });
  themeSelect.addEventListener('change', () => { applyTheme(); save(); });
  systemTheme.addEventListener('change', applyTheme);
  applyTheme(); localize();
  return { localize, t: text => translate(text, language) };
}
