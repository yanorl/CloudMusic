export default class VideoClass {
  constructor ({ url, posterImg, name, artists, publishTime, playCount, briefDesc, desc, likeCount, subCount }) {
    this.url = url
    this.posterImg = posterImg
    this.name = name
    this.artists = artists
    this.publishTime = publishTime
    this.playCount = playCount
    this.briefDesc = briefDesc
    this.desc = desc
    this.likeCount = likeCount
    this.subCount = subCount
  }
}
