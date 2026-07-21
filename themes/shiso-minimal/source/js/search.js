/**
 * 加载构建时生成的 search.json，在弹窗中完成本地站内搜索。
 * 关联元素：data-search-dialog、data-search-input、data-search-results。
 */
(() => {
  const dialog = document.querySelector('[data-search-dialog]');
  const openButton = document.querySelector('[data-search-open]');
  const input = document.querySelector('[data-search-input]');
  const status = document.querySelector('[data-search-status]');
  const results = document.querySelector('[data-search-results]');
  let indexPromise;

  // 转义搜索结果中的文本，避免内容被当成 HTML。
  function escapeHtml(value = '') {
    const node = document.createElement('div');
    node.textContent = value;
    return node.innerHTML;
  }

  // 首次使用时读取搜索索引，后续复用同一份数据。
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(dialog.dataset.indexUrl)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        });
    }
    return indexPromise;
  }

  // 根据关键词在标题、摘要、分类和标签中匹配。
  function filterIndex(items, query) {
    const keywords = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const haystack = [
        item.title,
        item.excerpt,
        ...(item.categories || []),
        ...(item.tags || []),
      ].join(' ').toLocaleLowerCase();
      return keywords.every((keyword) => haystack.includes(keyword));
    }).slice(0, 12);
  }

  // 把匹配结果渲染到搜索弹窗。
  function render(items) {
    status.textContent = items.length ? `找到 ${items.length} 条结果。` : '没有找到匹配文章。';
    results.innerHTML = items.map((item) => `
      <article>
        <a href="${escapeHtml(item.path)}">${escapeHtml(item.title)}</a>
        <p>${escapeHtml(item.date)} · ${escapeHtml(item.excerpt)}</p>
      </article>
    `).join('');
  }

  openButton?.addEventListener('click', async () => {
    dialog.showModal();
    input.focus();
    status.textContent = '正在准备搜索…';
    try {
      await loadIndex();
      status.textContent = '输入关键词开始搜索。';
    } catch (error) {
      status.textContent = `搜索索引加载失败：${error.message}`;
    }
  });

  input?.addEventListener('input', async () => {
    const query = input.value.trim();
    if (!query) {
      status.textContent = '输入关键词开始搜索。';
      results.innerHTML = '';
      return;
    }
    try {
      render(filterIndex(await loadIndex(), query));
    } catch (error) {
      status.textContent = `搜索失败：${error.message}`;
    }
  });

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
