export const languageLabels = { cpp: 'C++', python: 'Python', javascript: 'JavaScript' };
export const difficultyLabels = { beginner: '入門', intermediate: '進階' };
export const categoryLabels = { basics: '語法基礎', 'control-flow': '流程控制', collections: '資料集合', functions: '函式' };
export function filterArticles(articles, { query = '', language = 'all', difficulty = 'all' } = {}) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter(article => (language === 'all' || article.language === language)
    && (difficulty === 'all' || article.difficulty === difficulty)
    && words.every(word => [article.title, article.summary, ...article.keywords].join(' ').toLocaleLowerCase().includes(word)));
}
export function getRelated(articles, article) {
  const explicit = article.related.map(id => articles.find(item => item.id === id)).filter(Boolean);
  const fallback = articles.filter(item => item.language === article.language && item.id !== article.id);
  return [...new Map([...explicit, ...fallback].map(item => [item.id, item])).values()].slice(0, 2);
}
export function articleHref(id) { return `#article=${encodeURIComponent(id)}`; }
