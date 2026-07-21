# Everforest Hexo 个人博客

这是一个面向个人长期维护的 Hexo 博客模板。它保留静态网站的简单结构，同时提供本地与公网网页后台，可在浏览器中写文章、上传封面和正文图片。

## 已包含的功能

- Everforest 浅色、深色主题，默认跟随系统，可手动切换；
- 首页、文章、归档、分类、标签、关于、404 页面；
- 站内搜索、文章目录、预计阅读时间、RSS、返回顶部；
- Sveltia CMS 本地后台和公网后台；
- 图片保存到博客仓库，文章与图片一起版本管理；
- GitHub Actions 自动部署到 GitHub Pages；
- Mac 双击工具：首次设置、开始写作、同步发布、检查更新、本地备份；
- 所有公开配置集中在根目录 `_config.yml`，令牌和密钥不写入项目。

## 最短使用路线

1. 安装 [Node.js LTS](https://nodejs.org/) 和 [Git](https://git-scm.com/download/mac)。
2. 双击 `首次设置.command`，填写站名和 GitHub 信息；没有域名时输入 `-`。
3. 在 GitHub 新建一个公开空仓库，仓库名与设置向导中填写的一致。
4. 在本文件夹打开终端，执行“首次上传”中的命令。
5. 在 GitHub 仓库的 `Settings → Pages` 中选择 `GitHub Actions`。
6. 没有域名时直接使用 GitHub 提供的免费地址；以后购买域名再设置 DNS。
7. 日常写作时双击 `开始写作.command`，完成后双击 `同步发布.command`。

如果 macOS 第一次阻止 `.command` 文件运行，请右键该文件，选择“打开”，再确认一次。

## 第一次上传

先在 GitHub 新建公开仓库。不要勾选自动创建 README、许可证或 `.gitignore`，保持仓库为空。

没有自定义域名时，个人或组织主页仓库必须命名为：

```text
账户名.github.io
```

例如组织名为 `ooame-cafe`，仓库名应为 `ooame-cafe.github.io`，免费网站地址就是 `https://ooame-cafe.github.io`。

在本项目文件夹打开终端，依次执行：

```bash
git init -b main
git add .
git commit -m "创建个人博客"
git remote add origin https://github.com/你的GitHub用户名/你的仓库名.git
git push -u origin main
```

如果 GitHub 要求登录，请按浏览器提示授权。GitHub 不再接受账户密码作为命令行 Git 密码。

上传完成后，进入仓库：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

然后打开 `Actions` 页面。名为“构建并发布博客”的任务显示绿色对勾后，基础站点已经发布。Hexo 官方也采用 GitHub Actions 发布方式，参见 [Hexo 的 GitHub Pages 指南](https://hexo.io/docs/github-pages)。

## 自定义域名

### 使用子域名

假设域名是 `blog.example.com`，GitHub 用户名是 `alice`：

1. 先进入仓库 `Settings → Pages`，在 `Custom domain` 填写 `blog.example.com` 并保存。
2. 再到域名服务商的 DNS 控制台添加记录：

```text
类型：CNAME
主机记录：blog
记录值：alice.github.io
```

记录值不要带仓库名，也不要写 `https://`。

### 使用根域名

假设域名是 `example.com`，添加四条 `A` 记录，主机记录均为 `@`：

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

GitHub 建议先验证域名、在 Pages 设置中保存自定义域名，再修改 DNS；DNS 生效可能需要一段时间。最新记录值与安全说明以 [GitHub 自定义域名文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) 为准。

域名生效后，在 `Settings → Pages` 勾选 `Enforce HTTPS`。根配置中的 `custom_domain` 会同步生成 `source/CNAME`，但使用 GitHub Actions 时仍应以 Pages 设置中的域名为准。

## 本地网页后台

双击 `开始写作.command`。工具会：

1. 首次使用时安装依赖；
2. 启动本地博客；
3. 用默认浏览器打开首页；
4. 用 Chrome 打开 `http://localhost:4000/admin/index.html`。

第一次进入后台，选择“使用本地仓库”或 `Work with Local Repository`，然后选择这个博客的根文件夹。Sveltia 的本地目录模式依赖浏览器文件访问能力，因此应使用 Chrome、Edge 等 Chromium 浏览器；Safari 和 Firefox 当前不支持该模式。

写完后点击保存。文章进入 `source/_posts/`，图片进入 `source/uploads/`。本地后台不会自动执行 Git 操作，确认预览无误后双击 `同步发布.command`。

## 公网网页后台

博客发布后，在私人设备访问：

```text
https://你的域名/admin/index.html
```

选择“使用访问令牌登录”：

1. 点击界面提供的 GitHub 令牌创建链接；
2. 按页面预选的权限创建令牌；
3. 复制令牌，粘贴回登录框；
4. 进入后台后直接写作和上传图片。

发布文章会直接提交到 `main` 分支，并触发 GitHub Actions 更新网站。令牌保存在当前浏览器的本地存储中，不会写入博客仓库。只在自己的设备使用；设备遗失、转让或怀疑令牌泄露时，应立即到 GitHub 删除该令牌。Sveltia 对个人 GitHub 后台的令牌登录说明见 [GitHub Backend](https://sveltiacms.app/en/docs/backends/github)。

“公开发布”开关关闭时，文章仍会保存到仓库，但 Hexo 不会把它列入公开网站。

## 五个双击工具

| 文件 | 用途 |
| --- | --- |
| `首次设置.command` | 填写或修改站名、作者、域名、GitHub 仓库和公开邮箱 |
| `开始写作.command` | 启动本地预览与本地网页后台 |
| `同步发布.command` | 构建检查、获取远端更新、提交并推送到 GitHub |
| `检查更新.command` | 本地没有改动时，从 GitHub 获取最新内容 |
| `本地备份.command` | 创建不含依赖和构建产物的时间戳 ZIP 备份 |

命令行等价操作：

```bash
npm run server
npm run build
npm run sync -- "本次更新说明"
npm run update:local
npm run backup
```

备份默认放在博客文件夹旁的 `shiso-blog-backups`。可以在 `_config.yml` 修改 `tooling.backup_dir`。

## 修改分类、简介和链接

打开根目录 `_config.yml`：

- `title`、`subtitle`、`description`、`author`：站点信息；
- `profile`：首页简介和页脚文字；
- `menu`：导航；
- `social`：公开链接；
- `content.categories`：写作后台的分类选项；
- `content.reading_speed`：预计阅读时间的估算速度；
- `tooling.backup_dir`：本地备份目录。

修改后运行 `npm run build`。后台配置、自定义域名文件和后台程序会自动更新，不要直接修改 `source/admin/config.yml`。

## 图片建议

图片保存在 Git 仓库中，适合个人博客常见的少量图片。建议：

- 单张图片尽量控制在 2 MB 以内；
- 上传前转换为 WebP、JPEG 或经过压缩的 PNG；
- 不要上传含身份证件、住址、未公开研究材料等敏感信息；
- 图片数量较多时，再考虑 Cloudinary、R2 等独立图床。

## 进一步说明

- [ooame-cafe 下一步操作](docs/下一步-ooame-cafe.md)
- [完整教程](docs/完整教程.md)
- [日常维护](docs/日常维护.md)
- [常见问题](docs/常见问题.md)

当前模板使用 Hexo 8，需要 Node.js 20.19 或更高版本；版本要求见 [Hexo 官方文档](https://hexo.io/docs/)。
