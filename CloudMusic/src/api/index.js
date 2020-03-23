import OriginAxios from 'common/js/axios'

// 手机登录
export function loginPhone (params) {
  const url = '/login/cellphone'
  return OriginAxios(url, params)
}

// 退出登录
export function signOut (params) {
  const url = '/logout'
  return OriginAxios(url, params)
}

// 获取用户详情
export function userDetail (params) {
  const url = '/user/detail'
  return OriginAxios(url, params)
}

// 编辑用户信息
export function userUpdate (params) {
  const url = '/user/update'
  return OriginAxios(url, params)
}

// 获取用户歌单
export function playlist (params) {
  const url = '/user/playlist'
  return OriginAxios(url, params)
}

export function checkPhone (params) {
  const url = '/cellphone/existence/check'
  return OriginAxios(url, params)
}

// banner
export function TypeBanner () {
  const url = '/banner'
  // 0: pc 1: android 2: iphone 3: ipad
  return OriginAxios(url, {type: 2})
}

// 推荐歌单
export function personalized (params) {
  const url = '/personalized'
  return OriginAxios(url, params)
}

// 独家放送
export function privatecontent (params) {
  const url = '/personalized/privatecontent'
  return OriginAxios(url, params)
}

// 最新音乐
export function newsong (params) {
  const url = '/personalized/newsong'
  return OriginAxios(url, params)
}

// 推荐mv
export function recommendMv (params) {
  const url = '/personalized/mv'
  return OriginAxios(url, params)
}

// 推荐电台
export function recommendDj (params) {
  const url = '/dj/recommend'
  return OriginAxios(url, params)
}

// 热门搜索
export function searchHot (params) {
  const url = '/search/hot'
  return OriginAxios(url, params)
}

// 搜索建议 搜索结果同时包含单曲 , 歌手 , 歌单 ,mv 信息
export function searchSuggest (params) {
  const url = '/search/suggest'
  return OriginAxios(url, params)
}

// 获取用户动态
export function userEvent (params) {
  const url = '/user/event'
  return OriginAxios(url, params)
}

// 获取用户关注列表
export function userFollows (params) {
  const url = '/user/follows'
  return OriginAxios(url, params)
}

// 获取用户粉丝列表
export function userFolloweds (params) {
  const url = '/user/followeds'
  return OriginAxios(url, params)
}

// 获取用户播放记录
export function userRecord (params) {
  const url = '/user/record'
  return OriginAxios(url, params)
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export function userSubcount (params) {
  const url = '/user/subcount'
  return OriginAxios(url, params)
}

// 喜欢的音乐
export function likeSong (params) {
  const url = '/like'
  return OriginAxios(url, params)
}

// 喜欢音乐列表
export function likeList (params) {
  const url = '/likelist'
  return OriginAxios(url, params)
}

// 获取歌单详情
export function songlistView (params) {
  const url = '/playlist/detail'
  return OriginAxios(url, params)
}

// 获取歌曲评论
export function commentMusic (params) {
  const url = '/comment/music'
  return OriginAxios(url, params)
}

// 获取歌单评论
export function commentPlayList (params) {
  const url = '/comment/playlist'
  return OriginAxios(url, params)
}

// 给评论点赞
export function commentLike (params) {
  const url = '/comment/like'
  return OriginAxios(url, params)
}

// 发送/删除评论
export function commentControl (params) {
  const url = '/comment'
  return OriginAxios(url, params)
}

// 歌单收藏者
export function subscribersPlayList (params) {
  const url = '/playlist/subscribers'
  return OriginAxios(url, params)
}

// 收藏/取消收藏歌单
export function playlistSubscribe (params) {
  const url = '/playlist/subscribe'
  return OriginAxios(url, params)
}

// 获取音乐 url
export function getPlayUrl (params) {
  const url = '/song/url'
  return OriginAxios(url, params)
}

// 获取音乐歌词
export function getLyric (params) {
  const url = '/lyric'
  return OriginAxios(url, params)
}

// 获取相似歌单
export function simiPlaylist (params) {
  const url = '/simi/playlist'
  return OriginAxios(url, params)
}

// 获取相似音乐
export function simiSong (params) {
  const url = '/simi/song'
  return OriginAxios(url, params)
}

// 获取最近 5 个听了这首歌的用户
export function simiUser (params) {
  const url = '/simi/user'
  return OriginAxios(url, params)
}

// 新建歌单
export function playlistCreate (params) {
  const url = '/playlist/create'
  return OriginAxios(url, params)
}

// 歌单分类
export function playlistCatlist (params) {
  const url = '/playlist/catlist'
  return OriginAxios(url, params)
}

// 更新歌单标签
export function tagsUpdate (params) {
  const url = '/playlist/tags/update'
  return OriginAxios(url, params)
}

// 更新歌单
export function playlistUpdate (params) {
  const url = '/playlist/update'
  return OriginAxios(url, params)
}

// 对歌单添加或删除歌曲
export function playlistTracks (params) {
  const url = '/playlist/tracks'
  return OriginAxios(url, params)
}

// 获取歌手单曲
export function artists (params) {
  const url = '/artists'
  return OriginAxios(url, params)
}

// 获取歌手 mv
export function artistMv (params) {
  const url = '/artist/mv'
  return OriginAxios(url, params)
}

// 获取歌手专辑
export function artistAlbum (params) {
  const url = '/artist/album'
  return OriginAxios(url, params)
}

// 获取专辑内容
export function album (params) {
  const url = '/album'
  return OriginAxios(url, params)
}

// 专辑评论
export function commentAlbum (params) {
  const url = '/comment/album'
  return OriginAxios(url, params)
}

// 专辑动态信息
export function albumDynamic (params) {
  const url = '/album/detail/dynamic'
  return OriginAxios(url, params)
}

// 收藏/取消收藏专辑
export function albumSub (params) {
  const url = '/album/sub'
  return OriginAxios(url, params)
}

// 获取歌手描述
export function artistDesc (params) {
  const url = '/artist/desc'
  return OriginAxios(url, params)
}

// 获取相似歌手
export function simiArtist (params) {
  const url = '/simi/artist'
  return OriginAxios(url, params)
}

// 收藏/取消收藏歌手
export function artistSub (params) {
  const url = '/artist/sub'
  return OriginAxios(url, params)
}

// 获取 mv 数据
export function mvDetail (params) {
  const url = '/mv/detail'
  return OriginAxios(url, params)
}

// mv 地址
export function mvUrl (params) {
  const url = '/mv/url'
  return OriginAxios(url, params)
}

// 相关视频
export function relatedAllvideo (params) {
  const url = '/related/allvideo'
  return OriginAxios(url, params)
}

// 相似 mv
export function simiMv (params) {
  const url = '/simi/mv'
  return OriginAxios(url, params)
}

// mv 评论
export function commentMv (params) {
  const url = '/comment/mv'
  return OriginAxios(url, params)
}

// 收藏/取消收藏 MV
export function mvSub (params) {
  const url = '/mv/sub'
  return OriginAxios(url, params)
}

// 资源点赞( MV,电台,视频)
export function resourceLike (params) {
  const url = '/resource/like'
  return OriginAxios(url, params)
}

// 视频详情
export function videoDetail (params) {
  const url = '/video/detail'
  return OriginAxios(url, params)
}

// 获取视频播放地址
export function videoUrl (params) {
  const url = '/video/url'
  return OriginAxios(url, params)
}

// 收藏视频
export function videoSub (params) {
  const url = '/video/sub'
  return OriginAxios(url, params)
}

// 视频评论
export function commentVideo (params) {
  const url = '/comment/video'
  return OriginAxios(url, params)
}

// 收藏的 MV 列表
export function mvSublist (params) {
  const url = '/mv/sublist'
  return OriginAxios(url, params)
}
