/**
 * 交互式填写站点、域名和 GitHub 信息，并保留 _config.yml 中的说明注释。
 * 关联文件：_config.yml、bin/generate-config.mjs 与“首次设置.command”。
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import YAML from 'yaml';

const projectRoot = resolve(import.meta.dirname, '..');
const configPath = resolve(projectRoot, '_config.yml');
const terminal = createInterface({ input: process.stdin, output: process.stdout });

// 显示带默认值的问题，并返回去除首尾空格后的答案。
async function ask(label, defaultValue = '') {
  const suffix = defaultValue ? `（默认：${defaultValue}）` : '';
  const answer = (await terminal.question(`${label}${suffix}：`)).trim();
  return answer || defaultValue;
}

// 把用户输入的域名规范为不含协议和路径的主机名。
function normalizeDomain(value) {
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '');
}

// 检查 GitHub 用户名与仓库名，防止生成无效后台地址。
function validateGithubName(value, fieldName) {
  if (!/^[A-Za-z0-9_.-]+$/.test(value)) {
    throw new Error(`${fieldName} 只能包含字母、数字、横线、下划线和点。`);
  }
}

// 读取现有配置并按回答更新指定字段。
async function main() {
  const source = await readFile(configPath, 'utf8');
  const document = YAML.parseDocument(source);
  const current = document.toJS();

  console.log('\n首次设置向导\n请依次填写；括号内为直接按回车时采用的值。\n');
  const title = await ask('博客名称', current.title);
  const author = await ask('作者名称', current.author === '你的名字' ? title : current.author);
  const subtitle = await ask('一句副标题', current.subtitle);
  const intro = await ask('首页简介', current.profile?.intro);
  const owner = await ask('GitHub 用户名', current.repository?.owner);
  const domainInput = await ask('自定义域名；没有则输入 -', current.custom_domain || '-');
  const domain = domainInput === '-' ? '' : normalizeDomain(domainInput);
  const defaultRepository = domain ? (current.repository?.name || 'blog') : `${owner}.github.io`;
  const repository = await ask('GitHub 仓库名', defaultRepository);
  const email = await ask('公开邮箱（可留空）', '');

  if (domain && (!domain.includes('.') || domain.includes(' '))) {
    throw new Error('自定义域名格式不正确，请填写类似 blog.example.com 的域名。');
  }
  validateGithubName(owner, 'GitHub 用户名');
  validateGithubName(repository, 'GitHub 仓库名');

  document.setIn(['title'], title);
  document.setIn(['author'], author);
  document.setIn(['subtitle'], subtitle);
  document.setIn(['profile', 'intro'], intro);
  document.setIn(['url'], domain ? `https://${domain}` : `https://${owner.toLowerCase()}.github.io`);
  document.setIn(['custom_domain'], domain);
  document.setIn(['repository', 'owner'], owner);
  document.setIn(['repository', 'name'], repository);
  document.setIn(['social', 'GitHub'], `https://github.com/${owner}`);
  if (email) {
    document.setIn(['social', '邮箱'], `mailto:${email}`);
  } else {
    document.deleteIn(['social', '邮箱']);
  }

  await writeFile(configPath, document.toString({ lineWidth: 0 }), 'utf8');
  console.log('\n设置已保存。接下来请按 README 创建并连接同名 GitHub 仓库。');
}

main()
  .catch((error) => {
    console.error(`\n首次设置失败：${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => terminal.close());
