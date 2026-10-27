import { initLocalization } from './i18n.js';
const { t } = initLocalization();
const updateTitle = () => { document.title = `${t('Page not found')} · HairLab`; };
document.addEventListener('languagechange', updateTitle);
updateTitle();
