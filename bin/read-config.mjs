/**
 * 从根目录 _config.yml 读取指定配置，供维护脚本复用。
 * 关联文件：_config.yml 与 bin 目录下的 Shell 工具。
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

// 按点号分隔的路径逐层读取配置值。
function readNestedValue(source, fieldPath) {
  return fieldPath.split('.').reduce((value, key) => value?.[key], source);
}

// 输出指定配置字段，缺失时返回明确错误。
async function main() {
  const fieldPath = process.argv[2];
  if (!fieldPath) {
    throw new Error('请提供配置字段，例如 repository.branch。');
  }
  const projectRoot = resolve(import.meta.dirname, '..');
  const source = await readFile(resolve(projectRoot, '_config.yml'), 'utf8');
  const value = readNestedValue(YAML.parse(source), fieldPath);
  if (value === undefined || value === null || value === '') {
    throw new Error(`配置项 ${fieldPath} 不存在或为空。`);
  }
  if (typeof value === 'object') {
    process.stdout.write(JSON.stringify(value));
    return;
  }
  process.stdout.write(String(value));
}

main().catch((error) => {
  console.error(`读取配置失败：${error.message}`);
  process.exitCode = 1;
});
