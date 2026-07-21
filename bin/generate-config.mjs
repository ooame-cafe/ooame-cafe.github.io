/**
 * 根据根目录 _config.yml 生成 Sveltia CMS 配置、CNAME，并复制固定版本的后台程序。
 * 关联文件：_config.yml、source/admin/config.yml、source/CNAME、package.json。
 */
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const projectRoot = resolve(import.meta.dirname, '..');
const configPath = resolve(projectRoot, '_config.yml');

// 读取并解析博客主配置。
async function loadConfig() {
  const source = await readFile(configPath, 'utf8');
  return YAML.parse(source);
}

// 把配置内的相对路径限制在项目目录中，避免误写其他位置。
function projectPath(relativePath, fieldName) {
  if (!relativePath || typeof relativePath !== 'string') {
    throw new Error(`配置项 ${fieldName} 不能为空。`);
  }
  const target = resolve(projectRoot, relativePath);
  if (!target.startsWith(`${projectRoot}/`)) {
    throw new Error(`配置项 ${fieldName} 必须指向项目目录内部。`);
  }
  return target;
}

// 检查部署所需字段，并在 CI 中阻止占位配置上线。
function validateConfig(config) {
  const required = [
    ['title', config.title],
    ['url', config.url],
    ['repository.owner', config.repository?.owner],
    ['repository.name', config.repository?.name],
    ['repository.branch', config.repository?.branch],
  ];
  const missing = required.filter(([, value]) => !String(value ?? '').trim());
  if (missing.length) {
    throw new Error(`以下配置不能为空：${missing.map(([name]) => name).join('、')}`);
  }

  const placeholders = [
    config.title === '你的名字',
    String(config.url).includes('example.com'),
    String(config.custom_domain || '').includes('example.com'),
    String(config.repository.owner).includes('your-github-username'),
  ];
  if (placeholders.some(Boolean)) {
    const message = '仍有示例信息：请按 README 修改 _config.yml 顶部的站点与 GitHub 配置。';
    if (process.env.CI === 'true') {
      throw new Error(message);
    }
    console.warn(`提示：${message}`);
  }
}

// 生成兼容本地目录模式与 GitHub 令牌登录的 Sveltia CMS 配置。
function createCmsConfig(config) {
  return {
    backend: {
      name: 'github',
      repo: `${config.repository.owner}/${config.repository.name}`,
      branch: config.repository.branch,
    },
    media_folder: `/${config.tooling.upload_dir}`,
    public_folder: '/uploads',
    locale: 'zh_Hans',
    publish_mode: 'simple',
    collections: [
      {
        name: 'posts',
        label: '文章',
        label_singular: '文章',
        folder: '/source/_posts',
        create: true,
        delete: true,
        extension: 'md',
        format: 'frontmatter',
        slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
        summary: '{{year}}-{{month}}-{{day}} · {{title}}',
        fields: [
          { label: '标题', name: 'title', widget: 'string' },
          {
            label: '发布日期',
            name: 'date',
            widget: 'datetime',
            format: 'YYYY-MM-DD HH:mm:ss',
            date_format: 'YYYY-MM-DD',
            time_format: 'HH:mm:ss',
          },
          {
            label: '分类',
            name: 'categories',
            widget: 'select',
            options: config.content.categories,
            default: config.content.categories[0],
          },
          { label: '标签', name: 'tags', widget: 'list', required: false },
          { label: '首页摘要', name: 'excerpt', widget: 'text', required: false },
          { label: '封面图', name: 'cover', widget: 'image', required: false },
          {
            label: '公开发布',
            name: 'published',
            widget: 'boolean',
            default: true,
            required: false,
            hint: '关闭后内容会保存到仓库，但不会出现在公开网站。',
          },
          { label: '正文', name: 'body', widget: 'richtext' },
        ],
      },
      {
        name: 'pages',
        label: '固定页面',
        files: [
          {
            label: '关于',
            name: 'about',
            file: '/source/about/index.md',
            fields: [
              { label: '标题', name: 'title', widget: 'string' },
              { label: '正文', name: 'body', widget: 'richtext' },
            ],
          },
        ],
      },
    ],
  };
}

// 写入 CMS 配置，并在文件头标记来源。
async function writeCmsConfig(config) {
  const target = projectPath(config.tooling.cms_config, 'tooling.cms_config');
  await mkdir(dirname(target), { recursive: true });
  const header = '# 此文件由 bin/generate-config.mjs 根据根目录 _config.yml 自动生成，请勿直接修改。\n';
  const schema = '# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json\n\n';
  await writeFile(target, `${header}${schema}${YAML.stringify(createCmsConfig(config))}`, 'utf8');
}

// 写入自定义域名文件；域名留空时移除旧文件。
async function writeCname(config) {
  const target = projectPath(config.tooling.cname_file, 'tooling.cname_file');
  const domain = String(config.custom_domain ?? '').trim();
  if (!domain) {
    await rm(target, { force: true });
    return;
  }
  await writeFile(target, `${domain}\n`, 'utf8');
}

// 从 node_modules 复制固定版本 Sveltia，避免后台运行时依赖第三方 CDN。
async function copyCmsBundle(config) {
  const source = resolve(projectRoot, 'node_modules/@sveltia/cms/dist/sveltia-cms.js');
  const target = projectPath(config.tooling.cms_bundle, 'tooling.cms_bundle');
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}

// 顺序完成校验和所有派生文件生成。
async function main() {
  const config = await loadConfig();
  validateConfig(config);
  await writeCmsConfig(config);
  await writeCname(config);
  await copyCmsBundle(config);
  console.log('配置已生成：写作后台、自定义域名与后台程序均已就绪。');
}

main().catch((error) => {
  console.error(`配置生成失败：${error.message}`);
  process.exitCode = 1;
});
