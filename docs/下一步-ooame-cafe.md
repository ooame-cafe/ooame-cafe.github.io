# ooame-cafe 下一步操作

本项目已经配置为：

```text
GitHub 组织：ooame-cafe
仓库：ooame-cafe.github.io
公开网址：https://ooame-cafe.github.io
```

公开网址不会出现原 GitHub 用户名。

## 一、创建免费 GitHub 组织

保持登录现有 GitHub 账户，打开：

```text
https://github.com/account/organizations/new?plan=free
```

依次操作：

1. 选择免费的组织方案；
2. 组织名填写 `ooame-cafe`；
3. 联系邮箱填写自己的邮箱；
4. 选择该组织属于个人；
5. 完成创建。

如果页面提示 `ooame-cafe` 已被占用，先不要使用其他名字，因为项目配置也需要一起修改。

## 二、在组织中创建仓库

打开 GitHub 的新建仓库页面：

```text
https://github.com/new
```

填写：

```text
Owner：ooame-cafe
Repository name：ooame-cafe.github.io
Visibility：Public
```

不要添加 README、`.gitignore` 或许可证，保持仓库为空。

## 三、上传博客

在博客文件夹打开终端，执行：

```bash
git init -b main
git add .
git commit -m "创建大雨カフェ"
git remote add origin https://github.com/ooame-cafe/ooame-cafe.github.io.git
git push -u origin main
```

如果 Git 提示尚未设置姓名和邮箱，先执行：

```bash
git config --global user.name "シソ"
git config --global user.email "你的GitHub邮箱"
```

然后重新执行提交与推送命令。

## 四、开启 GitHub Pages

打开：

```text
https://github.com/ooame-cafe/ooame-cafe.github.io/settings/pages
```

在 `Build and deployment` 中把 `Source` 设为 `GitHub Actions`。

随后进入仓库的 `Actions` 页面，等待“构建并发布博客”显示绿色对勾。完成后访问：

```text
https://ooame-cafe.github.io
```

## 五、以后如何写文章

本地写作：

1. 双击 `开始写作.command`；
2. 在 Chrome 后台选择本地博客文件夹；
3. 写文章并上传图片；
4. 本地预览无误后双击 `同步发布.command`。

公网写作：

```text
https://ooame-cafe.github.io/admin/index.html
```

首次进入选择 GitHub 访问令牌登录。创建令牌时，需要授予它访问 `ooame-cafe/ooame-cafe.github.io` 仓库的权限。
