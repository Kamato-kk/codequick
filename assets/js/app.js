import { filterArticles, languageLabels, difficultyLabels, articleHref } from './content.js';
import { el, link, grid, renderArticle, renderAbout } from './ui.js';
import { setupTheme } from './theme.js';
const main = document.querySelector('main');
const navigation = document.querySelector('#navigation');
const menu = document.querySelector('#menu-toggle');
setupTheme(document.querySelector('#theme-toggle'));
function closeMenu() { navigation.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menu.focus(); }
  if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    const search = document.querySelector('#search'); if (search) { event.preventDefault(); search.focus(); }
  }
});
let articles = [];
const state = { query: '', language: 'all', difficulty: 'all' };
function buildNavigation() {
  navigation.replaceChildren(link('首頁', '#home'));
  [...new Set(articles.map(article => article.language))].forEach(language => navigation.append(link(languageLabels[language], `#language=${language}`)));
  navigation.append(link('關於網站', '#about'));
}
function hero() {
  const node = el('section', 'hero'); const text = el('div'); const title = el('h1');
  title.append('少一點查找，', el('br'), el('span', '', '多一點理解。'));
  text.append(el('p', 'eyebrow', '// Your everyday coding companion'), title, el('p', 'intro', '你的隨身程式語法手冊。從第一個變數到日常開發，快速找到 C++、Python 與 JavaScript 的實用解答。'));
  const meta = el('div', 'hero-meta'); meta.append(el('span', '', '3 種程式語言'), el('span', '', `${articles.length} 篇精選教學`), el('span', '', '100% 免費學習')); text.append(meta);
  const terminal = el('div', 'terminal'); terminal.setAttribute('aria-label', 'Python 範例預覽'); const bar = el('div', 'terminal-bar');
  for (let i = 0; i < 3; i++) bar.append(el('span', 'terminal-dot')); bar.append(el('span', '', 'hello_world.py'));
  const pre = el('pre'); const code = el('code'); code.append(el('span', 'code-comment', '# 每一次學習，都從一行程式開始\n'), el('span', 'code-blue', 'def '), document.createTextNode('start_learning(language):\n    message = '), el('span', 'code-green', 'f"Hello, {language}!"'), document.createTextNode('\n    return message\n\n'), el('span', 'code-blue', 'print'), document.createTextNode('(start_learning('), el('span', 'code-green', '"Python"'), document.createTextNode('))')); pre.append(code); terminal.append(bar, pre, el('div', 'terminal-bottom', '✓ Hello, Python!')); node.append(text, terminal); return node;
}
function home() {
  const library = el('section', 'library'); library.setAttribute('aria-labelledby', 'library-title');
  const label = el('label', 'sr-only', '搜尋文章標題、摘要或關鍵字'); label.htmlFor = 'search'; const wrap = el('div', 'search-wrap');
  const input = el('input'); input.type = 'search'; input.id = 'search'; input.placeholder = '想查什麼語法？試試「迴圈」或「陣列」'; input.value = state.query; input.autocomplete = 'off'; input.setAttribute('aria-controls', 'results');
  const symbol = el('span', 'search-symbol', '⌕'); symbol.setAttribute('aria-hidden', 'true'); const hint = el('span', 'search-hint', '/'); hint.setAttribute('aria-hidden', 'true'); wrap.append(label, symbol, input, hint);
  const filters = el('div', 'filters'); const tabs = el('div', 'language-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', '依程式語言篩選');
  ['all', ...new Set(articles.map(article => article.language))].forEach(language => {
    const button = el('button', 'filter-button', language === 'all' ? '全部語言' : languageLabels[language]); button.type = 'button'; button.dataset.language = language;
    button.addEventListener('click', () => { state.language = language; updateResults(); }); tabs.append(button);
  });
  const difficultyWrap = el('div'); const difficultyLabel = el('label', '', '難度 '); difficultyLabel.htmlFor = 'difficulty'; const difficulty = el('select'); difficulty.id = 'difficulty';
  for (const [value, text] of [['all', '全部難度'], ...Object.entries(difficultyLabels)]) { const option = el('option', '', text); option.value = value; difficulty.append(option); } difficulty.value = state.difficulty;
  difficulty.addEventListener('change', () => { state.difficulty = difficulty.value; updateResults(); }); difficultyWrap.append(difficultyLabel, difficulty); filters.append(tabs, difficultyWrap);
  const heading = el('div', 'section-heading'); const h2 = el('h2', '', '探索語法手冊'); h2.id = 'library-title'; const count = el('p'); count.setAttribute('role', 'status'); heading.append(h2, count); const results = el('div'); results.id = 'results';
  const recommended = el('aside', 'recommended'); recommended.append(el('p', 'eyebrow', 'Not sure where to start?'), el('h2', '', '從這裡，寫下你的第一行程式。'));
  const path = el('div', 'learning-path'); ['cpp', 'python', 'javascript'].forEach((language, index) => { const article = articles.find(item => item.language === language && item.category === 'basics'); if (article) { const item = link('', articleHref(article.id)); item.append(el('span', 'step', `0${index + 1}`), el('span', '', `${languageLabels[language]} 變數入門 →`)); path.append(item); } }); recommended.append(path);
  library.append(wrap, filters, heading, results, recommended); main.replaceChildren(hero(), library);
  function updateResults() {
    tabs.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === state.language)));
    const matches = filterArticles(articles, state); count.textContent = `共 ${matches.length} 篇教學 · 持續更新中`;
    if (matches.length) results.replaceChildren(grid(matches));
    else { const empty = el('div', 'empty'); const clear = el('button', '', '清除所有篩選'); clear.type = 'button'; clear.addEventListener('click', () => { Object.assign(state, { query: '', language: 'all', difficulty: 'all' }); input.value = ''; difficulty.value = 'all'; updateResults(); input.focus(); }); empty.append(el('h3', '', '還沒找到你要的語法'), el('p', '', '試著縮短關鍵字，或切換語言與難度。'), clear); results.replaceChildren(empty); }
  }
  input.addEventListener('input', () => { state.query = input.value; updateResults(); }); updateResults();
}
function route(focus = true) {
  closeMenu(); const hash = location.hash.slice(1); const params = new URLSearchParams(hash);
  let title = hash === 'main' ? document.title.replace('｜CodeQuick', '') : '程式語法速查手冊';
  if (hash === 'about') { main.replaceChildren(renderAbout()); title = '關於網站'; }
  else if (params.has('article')) {
    const article = articles.find(item => item.id === params.get('article'));
    if (article) { main.replaceChildren(renderArticle(articles, article)); title = article.title; }
    else { const error = el('section', 'about'); error.append(el('h1', '', '找不到這篇教學'), el('p', '', '文章網址可能有誤，請返回手冊重新查詢。'), link('← 返回首頁', '#home')); main.replaceChildren(error); title = '找不到文章'; }
  } else if (hash !== 'main' || !main.querySelector('h1')) {
    state.language = Object.hasOwn(languageLabels, params.get('language')) ? params.get('language') : 'all'; home();
  }
  document.title = `${title}｜CodeQuick`;
  navigation.querySelectorAll('a').forEach(anchor => { if (anchor.hash === (location.hash || '#home')) anchor.setAttribute('aria-current', 'page'); else anchor.removeAttribute('aria-current'); });
  if (focus) { const heading = main.querySelector('h1'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } window.scrollTo(0, 0); }
}
async function init() {
  try {
    const response = await fetch(new URL('../../data/articles.json', import.meta.url));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    articles = await response.json(); buildNavigation(); route(false); window.addEventListener('hashchange', () => route());
  } catch (error) {
    const section = el('section', 'about'); const retry = el('button', 'copy-button', '重新載入'); retry.type = 'button'; retry.addEventListener('click', () => location.reload()); section.append(el('h1', '', '暫時無法載入手冊'), el('p', '', '請確認網路連線，並透過本機 HTTP 伺服器或 GitHub Pages 開啟網站。'), retry); main.replaceChildren(section); console.error('文章載入失敗', error);
  }
}
init();
