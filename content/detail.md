---
title: "blog网站对照组"
description: "这是我的第一篇基于 Nuxt Content v3 的博客文章。"
date: 2026-03-04
tags: ["Nuxt", "TypeScript", "Blog"]
# image: "/images/cover.jpg"
published: true
---



# 前言
本文为 blog网站对照组
# 全文检索-关键词
【想法】
【提问】

# 功能
全文检索
tags
tags根据文章内容自动筛选生成
# 提问
## 1.为什么我使用npx 安装content模块和tailwind模块后，都会提示我是否想要安装 better-sqlite3 package
## 2.今天启动项目后，初次访问博客-对照组网站的速度有点慢

## 3.内容管理	Nuxt Content v3 讲一下具体用法


# 项目整体文本大小控制,使用scss设置变量
## 1.大：30px
## 2.中：20px
## 3.小：10px
# 操作描述
## 1.以白板方式创建nuxt 项目
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/936361ad1bbb4578809b098c0a57d032.png)

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4b8195b372894fe287972858661c3196.png)

## 2.手动npm安装一遍
1.安装content 模块，这个是博客核心所需

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/591a15a8437444df882d1a8956fad70e.png)
2. 安装tailwindcss
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f93048baf21b4c12a210fc527450976e.png)

3. 安装scss
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/15577dc46fe342b4be5670dd1f7c5c3a.png)
4. 安装icon库
## 3.开始写代码


![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/df9ae2ea305944988bc75cc26e0cca79.png)

## 4.迁移代码文件，迁移nuxt.config.ts配置

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9c5845d6dbd749228272000986481e12.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0ee58cec87f343f4bba0ebf97767d8d6.png)


## 5.重启项目，遇到报错，不安装better-sqlite3就无法正常启动
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/918fc6981922442592d9ddea4c5cfd2f.png)

## 6.结果还是要安装better-sqlite，因为这是v3版本content 模块所需的必须功能，被设计为运行时必需依赖
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6fa23a54190c4009952dc8c5583789a7.png)



## 7.查看页面表现
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/830cc46e4bb14fd2b5a08d4ad2174d6d.png)
## 8.继续开发NavigationBar

## 9.设置NavigationBar右边功能栏,使用iconfy图标
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f395e845eb0143e3b6c3529125a40374.png)

## 10.设置Breadcrumb
该使用什么组件呢
自己写的话
先简单搞个基本样式吧
【想法】先把网站主体做出来吧,后面再去做一些什么页面性能优化，seo优化，搜索引擎检索优化，px变其它标准化单位，移动端适配，ipad端适配，ios端适配，页面动效，操作反馈动效
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b25ca8dca029404ba57395b580beb281.png)

## 11.设置首页内容：header,list,side-content
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/40f515779a6a4575bd788cc60525a302.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7e9d43080df440bfaa0290f27b0bca85.png)
## 12.搭建博客文章详情页面：这是使用content模板创建nuxt项目时自带的一个文件，我略作修改
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/68e26e2e6da94e4cbaa6adae469a3eff.png)

## 13.获取到content内容列表

