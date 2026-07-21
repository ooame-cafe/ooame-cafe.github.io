/**
 * 生成供浏览器端站内搜索使用的轻量 JSON 索引。
 * 关联文件：_config.yml 的 search.path 与主题 source/js/search.js。
 */

// 移除 HTML 标签并压缩空白，避免把标记写入索引。
function plainText(value = '') {
  return String(value)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 把日期统一格式化为 YYYY-MM-DD，避免依赖页面模板上下文。
function formatDate(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 把 Hexo 文章集合转换为浏览器可读取的搜索数据。
hexo.extend.generator.register('search-index', function generateSearchIndex(locals) {
  const path = this.config.search?.path || 'search.json';
  const posts = locals.posts
    .filter((post) => post.published !== false && post.draft !== true)
    .sort('-date')
    .map((post) => ({
      title: post.title,
      path: `${this.config.root}${post.path}`.replace(/\/{2,}/g, '/'),
      date: formatDate(post.date),
      excerpt: plainText(post.excerpt || post.content).slice(0, 220),
      categories: post.categories.map((category) => category.name),
      tags: post.tags.map((tag) => tag.name),
    }));

  return {
    path,
    data: JSON.stringify(posts),
  };
});
