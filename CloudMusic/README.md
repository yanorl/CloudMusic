# # cloud-music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


访问本项目先安装 网易云音乐 NodeJS 版 API https://binaryify.github.io/NeteaseCloudMusicApi/#/

安装

$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git

$ npm install

运行

$ node app.js

基于 Vue(2.5) + vuex + vue-router + vue-axios + better-scroll + Scss + ES6 + babel-runtime + vee-validate + vue-lazyload + good-storage 等开发一款PC端音乐 WebApp，UI 界面参考了苹果版的网易云音乐

技术栈

一。前端

Vue：用于构建用户界面的 MVVM 框架 vue-router：为单页面应用提供的路由系统，使用了 Lazy Loading Routes 技术来实现异步加载优化性能 vuex：Vue 集中状态管理，在多个组件共享某些状态时非常便捷 vue-lazyload：实现图片懒加载，节省用户流量，优化页面加载速度 better-scroll：解决各种滚动场景需求的插件，使滑动体验更加流畅 SCSS：css 预编译处理器 ES6：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用 vee-validate： 表单校验 good-storage： 减少localstorage的代码量

二。后端

Node.js：利用 Express 搭建的本地测试服务器 vue-axios：用来请求后端 API 音乐数据 NeteaseCloudMusicApi：网易云音乐 NodeJS 版 API，提供音乐数据

三。其他工具

vue-cli：Vue 脚手架工具，快速初始化项目代码 eslint：代码风格检查工具，帮助我们规范代码书写 font-awesome ：图标库，谁用谁知道

四。实现功能

暂时完成的页面：首页推荐页面，登陆页面，用户个人中心，用户资料修改，歌单详情，评论，收藏，搜索页面、播放列表，播放器内核，全屏页面, 歌手页面，歌手详情 
未开发页面：排行榜详情，歌单分类，最新音乐，mv分类，电台等

1.首页推荐页面

推荐页分成三个部分，分别是 banner 轮播图、推荐歌单、独家放送、最新音乐、推荐mv、推荐电台，数据都是使用 Pomise 封装 axios 请求 API 获取得到的，图片都使用 vue-lazyload 实现懒加载。 轮播图：使用 swiper 实现

2.歌单页面

实现歌单详情的创建、修改、展示，评论功能，点赞功能等 通过better-scroll实现评论等分页功能和歌单列表等滚动功能。

3.播放器

实现功能：顺序播放、单曲循环、随机播放、收藏、歌曲切换、喜欢歌曲、拖拽播放进度和音量等。 播放、暂停使用 HTML5 的 audio 实现。 数据、播放状态、播放历史等方面使用了 vuex 来进行管理 图标使用 font-awesome 图标库，中间的唱片旋转动画使用了 animation 实现。 通过 localstorage 存储播放历史数据。

4.搜索功能

实现功能：可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户、热门搜索、保存搜索记录。 通过关键字请求 API 获取搜索数据，显示歌手、歌单、歌曲。 通过better-scroll实现搜索结果上拉刷新的功能。 通过 localstorage 存储搜索数据。