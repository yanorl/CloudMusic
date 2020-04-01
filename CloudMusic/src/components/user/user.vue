<template>
  <div class="user-box">
    <scroll ref="scroll" :pullup="pullup" :beforeScroll="beforeScroll"  @scrollToEnd="subscribersListMore" :data="createdListres && otherLists" class="user-wrap">
      <div class="user-content">
        <div class="user-info">
          <div class="avatar-img">
            <img v-lazy="userDetail.profile.avatarUrl" alt="" width="100%">
          </div>
          <div class="user-info-details">
            <div class="user-ifo-top">
              <div class="user-name">{{userDetail.profile.nickname}}</div>
              <div class="user-mark">
                <span class="level">Lv.{{userDetail.level}}</span>
                <span v-if="userDetail.profile.gender" :class="genderFormat+'-gender'">
                    <i class="fa" :class="genderFormat" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <div class="account-data">
              <account-data :userData="userDetail.profile"></account-data>
            </div>
            <div class="user-info-list">
              <ul>
                <li v-if="district.province || district.city">所在地区:
                  <span v-if="district.province">{{district.province}}</span>
                  <span v-if="district.city">{{district.city}}</span>
                </li>
                <li>个人介绍:<span>{{detailDescription}}</span></li>
              </ul>
            </div>
          </div>
          <router-link to="/editUserInfo" tag="div" class="edit-user-info" v-if="editUser">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            <span>编辑个人信息</span>
          </router-link>
        </div>
        <div class="user-musics-box">
          <music-list :musicList="createdListres" :musicTitle="createdTitle" :listNum="listNum" :Num="'('+ totalCount.toString()+ ')'" :ranking="ranking" :uid="$route.params.userId.toString()" :listenSongs="userDetail.listenSongs" ref="createdList"></music-list>
          <div class="pagination-box" v-if="createdListres">
            <pagination :totalCount="totalCount" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
          </div>
          <music-list :musicList="otherLists" :musicTitle="otherTitle" :listNum="listNum" :hasMore="hasMore"></music-list>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import AccountData from 'base/account-data/account-data'
import MusicList from 'base/music-list/music-list'
import Pagination from 'base/pagination/pagination'
import { userDetail, playlist } from 'api'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/Scroll'
import { inquireDistrictMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'user',
  data () {
    return {
      userDetail: {
        profile: {}
      },
      listNum: 'playlist',
      createdListres: [],
      otherLists: [],
      limit: 19,
      currentPage: 1,
      rankingChange: true,
      pullup: true,
      hasMore: true,
      page: 0,
      beforeScroll: true,
      pageNum: 20
    }
  },
  mixins: [inquireDistrictMixin],
  computed: {
    ...mapGetters([
      'user'
    ]),
    ranking () {
      return this.rankingChange ? this.userDetail.peopleCanSeeMyPlayRecord : false
    },
    totalCount () {
      return Number(this.userDetail.profile.playlistCount)
    },
    detailDescription () {
      return this.userDetail.profile.signature ? this.userDetail.profile.signature : '暂无介绍'
    },
    createdTitle () {
      return this.formatTitle('我创建的歌单', '歌单')
    },
    otherTitle () {
      return this.formatTitle('我收藏的歌单', '收藏')
    },
    editUser () {
      if (this.$route.params.userId === this.user[0].profile.userId.toString()) {
        return true
      } else {
        return false
      }
    },
    genderFormat () {
      if (this.userDetail.profile.gender === 1) {
        return 'fa-mars'
      } else if (this.userDetail.profile.gender === 2) {
        return 'fa-venus'
      }
    }
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this._userDetail()
      this._playlist()
      this.createdListres = []
      this.otherLists = []
    }
  },
  created () {
    this._userDetail()
  },
  components: {
    AccountData,
    MusicList,
    Scroll,
    Pagination
  },
  methods: {
    _playlist () {
      this.$isLoading(true)
      Promise.all([this._createdList(), this._subscribersList()]).then((result) => {
        this.$isLoading(false)
      }).catch((error) => {
        this.$isLoading(false)
        console.log(error)
      })
    },
    _userDetail () {
      userDetail({uid: this.$route.params.userId}).then((res) => {
        if (res.code === ERR_OK) {
          this.userDetail = res
          this.inquireDistrict(this.userDetail.profile.province)
          this.inquireDistrict(this.userDetail.profile.city)
          this._playlist()
        }
      })
    },
    _createdList (commonParams = {}) {
      const data = Object.assign({}, {uid: this.$route.params.userId, limit: this.limit}, commonParams)
      playlist(data).then((res) => {
        if (res.code === ERR_OK) {
          let list = res.playlist
          list.forEach((item) => {
            if (item.creator.userId.toString() === this.$route.params.userId.toString()) {
              this.createdListres.push(item)
            }
          })
        }
      })
    },
    _subscribersList (commonParams = {}) {
      console.log(this.totalCount - 1)
      const data = Object.assign({}, {uid: this.$route.params.userId, limit: this.pageNum, offset: this.totalCount - 1}, commonParams)
      playlist(data).then((res) => {
        if (res.code === ERR_OK) {
          let list = res.playlist
          this.hasMore = res.more
          list.forEach((item) => {
            if (item.creator.userId.toString() !== this.$route.params.userId.toString()) {
              this.otherLists.push(item)
            }
          })
        }
      })
    },
    formatTitle (title1, title2) {
      if (this.$route.params.userId.toString() === this.user[0].profile.userId.toString()) {
        return title1
      } else {
        return title2
      }
    },
    itemClick (id) {
      this.$router.push({name: 'user', params: {userId: id}})
    },
    getData (i) {
      this.rankingChange = false
      if (i === 1) {
        this.rankingChange = true
      }
      let offsetNum = (i - 1) * this.limit
      this.currentPage = i
      this.createdListres = []
      this.$refs.scroll.scrollToElement(this.$refs.createdList.$refs.musicList, 100)
      this._createdList({offset: offsetNum})
    },
    subscribersListMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      let offsetNum = this.totalCount - 1 + this.page * this.pageNum
      this._subscribersList({offset: offsetNum})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .user-box
    padding-bottom: 15px
    width: 1140px
    position: fixed
    left: $aisde-width
    right: 0
    margin: auto
    bottom: 0
    top: 76px
    z-index: 1
    .user-wrap
      height: 100%
      overflow: hidden
      .user-content
        .user-info
          margin-bottom: 30px
          padding-top: 15px
          display: flex
          align-items: center
          font-size: $font-size-small
          .avatar-img
            width: 195px
            height: 195px
            border-radius: 50%
            overflow: hidden
            margin-right: 30px
          .user-info-details
            flex: 1
            margin-right: 30px
            .user-ifo-top
              .user-name
                font-size: $font-size-large-x
                margin-right: 15px
              .user-mark
                margin-top: 10px
                span
                  display: inline-block
                  height: 20px
                  line-height: 20px
                  padding: 0 7px
                  margin-right: 15px
                  border-radius: 10px
                  &.level
                    color: #fff
                    background: #3a3737
                    font-weight: bold
                    font-style:italic
                  &.fa-mars-gender
                    background: #3b6071
                    padding: 0 20px
                    color: #00a5f9
                  &.fa-venus-gender
                    background: #803352
                    color: #f10865
                    padding: 0 15px
            .account-data
              width: 300px
              margin: 15px 0
            .user-info-list
              ul
                li
                  margin-bottom: 10px
                  span
                    color: #7b7b7b
                    margin-right: 5px
          .edit-user-info
            height: 30px
            line-height: 30px
            padding: 0 10px
            border: 1px solid
            border-radius: 20px
            opacity: 0.7
            color: #fff
            cursor: pointer
            &:hover
              opacity: 1
              background: #2d2c2c
</style>
