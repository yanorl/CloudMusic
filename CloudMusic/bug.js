// 1. 侧边栏弹出 user-account-wrap.vue 页面，点击这个页面以外的任意地方，隐藏这个页面，现在用的这个方法，aside.vue这个页面点击没效果
// (解决)
2.song-list.vue 这个页面的弹窗提示，因为受父组件使用滚动插件better-scroll的影响，有position: fixed, 所以fixed 的高度改变了，弹窗效果也滚动了
（弹窗，提示框，等改为插件模式）

// 3.播放列表点击其它位置隐藏，未实现
// (解决)

4.双击歌曲播放时，有时出现播放失败（获取播放链接时差问题）

5.播放歌词时前5行歌词，会造成滚动到顶部在回到原来的位置(player.vue页面234行。     medium-screen.vue页面84行)

// 5.播放列表和历史记录切换的时候，this.switchesData数据混乱造成不能正确显示播放的歌曲滚动到指定位置(不用v-if 用v-show)