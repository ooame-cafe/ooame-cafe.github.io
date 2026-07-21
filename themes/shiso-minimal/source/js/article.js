/**
 * 根据文章二、三级标题生成目录，并标记当前阅读位置。
 * 关联元素：data-article-content、data-article-toc、data-toc-list。
 */
(() => {
  const content = document.querySelector('[data-article-content]');
  const toc = document.querySelector('[data-article-toc]');
  const tocList = document.querySelector('[data-toc-list]');
  if (!content || !toc || !tocList) return;

  const headings = [...content.querySelectorAll('h2, h3')];
  if (headings.length < 2) return;

  // 生成稳定且不重复的标题锚点。
  function createId(heading, index) {
    if (heading.id) return heading.id;
    const normalized = heading.textContent
      .trim()
      .toLocaleLowerCase()
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/^-|-$/g, '');
    return normalized || `section-${index + 1}`;
  }

  headings.forEach((heading, index) => {
    heading.id = createId(heading, index);
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.dataset.level = heading.tagName === 'H3' ? '3' : '2';
    link.textContent = heading.textContent;
    tocList.append(link);
  });
  toc.hidden = false;

  const links = [...tocList.querySelectorAll('a')];

  // 根据进入视口的标题更新目录状态。
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (!visible) return;
    links.forEach((link) => {
      link.classList.toggle('is-active', decodeURIComponent(link.hash.slice(1)) === visible.target.id);
    });
  }, { rootMargin: '-18% 0px -70% 0px' });

  headings.forEach((heading) => observer.observe(heading));
})();
