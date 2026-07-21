/**
 * 处理明暗主题切换、系统主题跟随与返回顶部按钮。
 * 关联元素：data-theme-toggle、data-back-to-top。
 */
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const backToTop = document.querySelector('[data-back-to-top]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  // 更新主题并可选地保存用户选择。
  function setTheme(theme, persist = false) {
    root.dataset.theme = theme;
    toggle?.setAttribute('aria-label', theme === 'dark' ? '切换为浅色主题' : '切换为深色主题');
    if (persist) {
      try {
        localStorage.setItem('shiso-theme', theme);
      } catch (_) {
        // 浏览器禁用存储时，当前页面仍可正常切换。
      }
    }
  }

  // 判断用户是否已经手动保存主题。
  function hasSavedTheme() {
    try {
      return Boolean(localStorage.getItem('shiso-theme'));
    } catch (_) {
      return false;
    }
  }

  toggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  media.addEventListener('change', (event) => {
    if (!hasSavedTheme()) {
      setTheme(event.matches ? 'dark' : 'light');
    }
  });

  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  setTheme(root.dataset.theme || (media.matches ? 'dark' : 'light'));
})();
