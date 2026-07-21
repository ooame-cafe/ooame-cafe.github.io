/**
 * 注册主题模板使用的辅助函数。
 * 关联文件：layout/index.ejs、layout/post.ejs 与根配置 content.reading_speed。
 */

// 根据中英文字符量估算阅读时间。
hexo.extend.helper.register('reading_time', function readingTime(content = '') {
  const text = String(content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const chineseCount = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const latinWords = text.replace(/[\u3400-\u9fff]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const weightedCount = chineseCount + latinWords * 2;
  const speed = Number(this.config.content?.reading_speed) || 400;
  return Math.max(1, Math.ceil(weightedCount / speed));
});
