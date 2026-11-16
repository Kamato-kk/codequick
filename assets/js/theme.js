export function setupTheme(button) {
  let theme = 'dark';
  try { const saved = localStorage.getItem('codequick-theme'); if (['dark', 'light'].includes(saved)) theme = saved; } catch { /* 儲存被封鎖時仍提供切換。 */ }
  function apply() {
    document.documentElement.dataset.theme = theme;
    button.textContent = theme === 'dark' ? '☀' : '☾';
    button.setAttribute('aria-label', `切換至${theme === 'dark' ? '淺' : '深'}色模式`);
  }
  apply();
  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark'; apply();
    try { localStorage.setItem('codequick-theme', theme); } catch { /* 使用記憶體內偏好。 */ }
  });
}
