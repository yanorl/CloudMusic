import { mapGetters, mapMutations } from 'vuex'
import { likeList, likeSong, commentControl, playlist } from 'api'
import { ERR_OK } from 'api/config'
import Axios from 'axios'
import Alert from 'base/alert/alert'

export const likeMixin = {
  data () {
    return {
      likeList: [],
      alertFlow: false,
      alert: {
        icon: 'fa-check-circle',
        text: '已添加到我喜欢的音乐！'
      }
    }
  },
  created () {
    if (this.user.length > 0) {
      this._likeList()
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'watchLike'
    ])
  },
  watch: {
    watchLike () {
      this._likeList()
    }
  },
  components: {
    Alert
  },
  methods: {
    _likeList () {
      likeList({uid: this.user[0].profile.userId, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.likeList = res.ids
        }
      })
    },
    _likeSong (likeId, Boolean, e) {
      likeSong({id: likeId, like: Boolean, timestamp: (new Date()).valueOf()}).then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          // console.log(Boolean)
          e.target.className = ''
          e.target.className = Boolean ? 'fa color-main fa-heart' : 'fa fa-heart-o'
          this.setWatchLike(!this.watchLike)
          if (!Boolean) {
            this.alert.text = '取消喜欢成功!'
          } else {
            this.alert.text = '已添加到我喜欢的音乐！'
          }
          this.alertFlow = true
          setTimeout(() => {
            this.alertFlow = false
          }, 1500)
        }
      }).catch(function (error) {
        console.log(error.msg)
      })
    },
    className (id) {
      return this.likeList.includes(id) ? 'color-main fa-heart' : 'fa-heart-o'
    },
    clickLike (item, e) {
      if (item.st === 0) {
        let likeId = item.id
        let Boolean = !this.likeList.includes(likeId)
        this._likeSong(likeId, Boolean, e)
      } else {
        this.alertFlow = true
        this.alert.icon = 'fa-times-circle'
        this.alert.text = '因合作方要求，该资源暂时下架>_<'
        setTimeout(() => {
          this.alertFlow = false
        }, 1500)
      }
    },
    ...mapMutations({
      setWatchLike: 'SET_WATCH_LIKE'
    })
  }
}

export const inquireDistrictMixin = {
  data () {
    return {
      district: []
    }
  },
  methods: {
    inquireDistrict (word) {
      if (word) {
        let url = 'https://restapi.amap.com/v3/config/district?key=6c9102c532d23efc69376d4cde74dcc0&subdistrict=0&extensions=base'
        let that = this
        Axios.get(url, {
          params: {
            keywords: word
          },
          withCredentials: false
        }).then(function (res) {
          if (res.data.districts.length > 0) {
            let key = res.data.districts[0].level
            let name = res.data.districts[0].name
            let obj = {}
            obj[key] = name
            if (that.district.length) {
              that.district = Object.assign(that.district[0], obj)
            } else {
              that.district.push(obj)
            }
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentIndex',
      'playing',
      'playHistory',
      'currentSong'
    ])
  },
  methods: {
  }
}

export const reviewMixin = {
  data () {
    return {
      rp: ' ',
      limit: 30,
      currentPage: 1,
      noneText: '还没有评论，快来抢沙发~',
      alert: {
        icon: 'fa-check-circle',
        text: '写点东西吧，内容不能为空哦！'
      },
      alertFlow: false,
      commentId: ''
    }
  },
  methods: {
    commentControlFn (data, other = false) {
      commentControl(data).then((res) => {
        if (res.code === ERR_OK) {
          if (other) {
            this.reviewFlow = false
            this.$emit('openMediumScroll')
          }
          this.$refs.reviewForm.reviewContentEmpty()
          this.alert = {
            icon: 'fa-check-circle',
            text: '评论发表成功！'
          }
          this.alertFlow = true
          setTimeout(() => {
            this.alertFlow = false
            this.alert = {
              icon: 'fa-times-circle',
              text: '写点东西吧，内容不能为空哦！'
            }
            this.$refs.reviewForm.textareaFocus()
          }, 1500)
          // this._commentReview()
          this.updateReview()
        }
      })
    },
    getData (i) {
      let offsetNum = (i - 1) * this.limit
      this.currentPage = i
      this.updateReview({offset: offsetNum})
    },
    tips () {
      this.$refs.reviewForm.textareaFocus()
      this.alertFlow = true
      setTimeout(() => {
        this.alertFlow = false
      }, 1500)
    },
    rpName (name, id) {
      this.rp = `回复${name}: `
      this.commentId = String(id)
      this.$refs.reviewForm.textareaFocus()
      this.otherRp()
    }
  }
}

export const playlistMixin = {
  data () {
    return {
      createdListres: [],
      otherLists: []
    }
  },
  created () {
    if (this.user.length > 0) {
      this._playlist()
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    _playlist () {
      playlist({uid: this.user[0].profile.userId, limit: 1000, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeList(res.playlist)
        }
      })
    },
    _normalizeList (list) {
      list.forEach((item) => {
        let userId = item.creator.userId.toString()
        let routeId = this.user[0].profile.userId.toString()
        if (userId === routeId) {
          this.createdListres.push(item)
        } else {
          this.otherLists.push(item)
        }
      })
    }
  }
}

export const searchTagsMixin = {
  methods: {
    changeColor (value, link) {
      // console.log(value)
      if (Array.isArray(value)) {
        value = this.forArray(value, link)
        // console.log(value)
      }
      if (this.query && this.query.length > 0) {
        const result = value.replace(new RegExp(this.query, 'gi'), `<p style="display: inline-block; color: #94d9ff;">${this.titleCase5(this.query)}</p>`)
        return result
      } else {
        return value
      }
    },
    forArray (array, link) {
      let html = ''
      let length = Number(array.length - 1)
      for (let item in array) {
        html += `<span class="routerLink cursor" data-id="${array[item].id}" data-link="${link}">${array[item].name}</span>`
        if (length !== Number(item)) {
          html += '<b> / </b>'
        }
      }
      return html
    },
    titleCase5 (str) {
      return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
  }
}
