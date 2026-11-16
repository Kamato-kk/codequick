import { languageLabels, difficultyLabels, categoryLabels, articleHref, getRelated } from './content.js';
// 所有教學文字只透過 textContent 放入 DOM，資料無法注入 HTML。
export function el(tag, className = '', text = '') {
  const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node;
}
export function link(text, href, className = '') { const node = el('a', className, text); node.href = href; return node; }
export function card(article) {
  const node = el('article', 'article-card'); const top = el('div', 'card-top');
  top.append(el('span', `language-mark ${article.language}`, languageLabels[article.language]), el('span', 'badge', difficultyLabels[article.difficulty]));
  const heading = el('h3'); heading.append(link(article.title, articleHref(article.id)));
  const bottom = el('div', 'card-bottom'); bottom.append(el('span', '', categoryLabels[article.category]), link('閱讀教學 →', articleHref(article.id)));
  // 同卡片的第二個連結提供具名文字，避免螢幕閱讀器只讀出重複的閱讀教學。
  bottom.lastChild.setAttribute('aria-label', `閱讀教學：${article.title}`);
  node.append(top, heading, el('p', '', article.summary), bottom); return node;
}
export function grid(articles) { const node = el('div', 'article-grid'); node.append(...articles.map(card)); return node; }
export function listSection(title, items) { const section = el('section'); const list = el('ul'); list.append(...items.map(text => el('li', '', text))); section.append(el('h2', '', title), list); return section; }
export function renderArticle(articles, article) {
  const reader = el('article', 'reader'); const breadcrumbs = el('div', 'breadcrumbs'); breadcrumbs.append(link('← 返回全部教學', '#home'), document.createTextNode(` / ${languageLabels[article.language]}`));
  const header = el('header', 'article-header'); const tags = el('div', 'language-tabs'); tags.append(el('span', `language-mark ${article.language}`, languageLabels[article.language]), el('span', 'badge', difficultyLabels[article.difficulty]), el('span', 'badge', categoryLabels[article.category]));
  header.append(tags, el('h1', '', article.title), el('p', '', article.summary)); reader.append(breadcrumbs, header, listSection('學習目標', article.objectives));
  const explanation = el('section'); explanation.append(el('h2', '', '語法介紹'), el('p', 'explanation', article.explanation)); reader.append(explanation);
  const examples = el('section'); examples.append(el('h2', '', '程式碼範例'));
  article.examples.forEach(example => {
    const block = el('div', 'code-block'); const toolbar = el('div', 'code-toolbar'); const button = el('button', 'copy-button', '複製程式碼'); button.type = 'button'; button.setAttribute('aria-label', `複製：${example.title}`);
    const pre = el('pre'); pre.tabIndex = 0; pre.setAttribute('aria-label', `${example.title} 程式碼`); const code = el('code', '', example.code); pre.append(code);
    const status = el('p', 'copy-status'); status.setAttribute('role', 'status');
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(example.code); status.textContent = '已複製程式碼。'; }
      catch { const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); pre.focus(); status.textContent = '無法存取剪貼簿，已選取程式碼，請按 Ctrl+C 或使用裝置的複製功能。'; }
    });
    toolbar.append(el('span', '', example.title), button); const output = el('pre', 'output', example.output); output.tabIndex = 0; output.setAttribute('aria-label', '預期執行結果');
    block.append(toolbar, pre, el('div', 'output-label', '預期執行結果'), output, status); examples.append(block);
  }); reader.append(examples, listSection('注意事項', article.notes));
  const related = el('section'); related.append(el('h2', '', '延伸閱讀'), grid(getRelated(articles, article))); reader.append(related); return reader;
}
export function renderAbout() {
  const node = el('article', 'about'); node.append(el('p', 'eyebrow', 'About the project'), el('h1', '', '讓語法查詢，更直覺。'), el('p', '', 'CodeQuick 是為初學者建立的繁體中文程式語法速查手冊，涵蓋 C++、Python 與 JavaScript。從一個概念、一段程式碼開始，找回學習的節奏。'), el('h2', '', '從理解到實作'), el('p', '', '每篇教學提供學習目標、語法介紹、完整可執行範例、預期輸出與注意事項。你可以搜尋關鍵字、依語言與難度篩選，並複製程式碼到自己的開發環境練習。'), el('h2', '', '用規則，讓知識持續成長'), el('p', '', '本專案是 Homework 9 的實作成果。AGENTS.md 定義設計系統、資料契約與驗證流程；教學資料與版型分離，新增文章即可自動出現在搜尋與分類中。'), el('h2', '', '資料與隱私'), el('p', '', '網站無帳號、無追蹤工具，也不會將搜尋字詞傳送至後端。主題偏好只儲存在你的瀏覽器。範例僅供學習，請在自己的開發環境執行。'), link('← 開始查詢語法', '#home')); return node;
}
