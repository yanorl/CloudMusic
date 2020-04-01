<template>
  <div class="aside-wrap">
    <div class="aside-top">
      <div class="avatar-box">
        <span class="avatar-wrap">
          <div class="login flex cursor" @click="changePersonalStatus" v-if="!user.length">
            <span class="avatar-img">
              <i class="fa fa-user-o" aria-hidden="true"></i>
            </span>
            <span class="avatar-name">
              未登录
            </span>
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
          <div class="user-account flex" v-if="user.length">
            <router-link :to="{ name: 'user', params: { userId: user[0].profile.userId }}" class="avatar-img">
              <img v-lazy="avatarUrl" alt="" width="100%">
            </router-link>
            <span class="cursor" @click="accountInfo" ref="userAccount">
              <span class="avatar-name">
                {{nickname}}
              </span>
              <i class="fa fa-caret-right" aria-hidden="true"></i>
              <user-account :showFlag="showFlag" :userDetail="userDetail"></user-account>
            </span>
          </div>
        </span>
      </div>
    </div>
    <div class="aside-scroll-fixed">
      <scroll ref="scroll" class="aside-content" :data="createdListres && otherLists">
        <div class="aside-list">
          <dl>
            <router-link tag="dd" :to="item.link" :class="{'current': $route.path === item.link}" v-for="(item, index) in asidList.datas" :key="index">
              <span class="icon">
                <i class="fa" :class="item.icon" aria-hidden="true"></i>
              </span>
              {{item.text}}
            </router-link>
          </dl>
          <dl v-if="user.length">
            <dt @click="showFirst = !showFirst">
              创建的歌单
              <span class="right">
                <i class="fa" :class="firstClass" aria-hidden="true"></i>
              </span>
            </dt>
            <template v-if="showFirst">
              <dd @click="createList"><i class="fa fa-plus-square-o" aria-hidden="true"></i>创建歌单 </dd>
              <dd :class="{'current': $route.params.id == item.id}" @click="selectItem(item.id)" v-for="(item, index) in createdListres" :key="index" v-show="createdListres.length > 0">
                <span class="icon">
                  <i class="fa " :class="activeClass === index ? 'fa-heart-o': item.privacy == 10 ? 'fa-lock' :'fa-music'" aria-hidden="true"></i>
                </span>
                {{item.name}}
              </dd>
            </template>
          </dl>
          <dl v-if="user.length">
            <dt @click="showSecond = !showSecond">
              收藏的歌单
              <span class="right">
                <i class="fa" :class="secondClass" aria-hidden="true"></i>
              </span>
            </dt>
            <template v-if="showSecond">
              <dd :class="{'current': $route.params.id == item.id}" @click="selectItem(item.id)" v-for="(item, index) in otherLists" :key="index" v-show="otherLists.length > 0">
                <span class="icon">
                  <i class="fa fa-music" aria-hidden="true"></i>
                </span>
                {{item.name}}
              </dd>
            </template>
          </dl>
        </div>
        <personal-status ref="PersonalStatus"></personal-status>
      </scroll>
    </div>
    <creat-playlist ref="creatPlaylist" @successCreat="successCreat" v-if="showPlaylist"></creat-playlist>
  </div>
</template>

<script>
import PersonalStatus from 'base/personal-status/personal-status'
import creatPlaylist from 'base/creat-playlist/creat-playlist'
import UserAccount from 'components/user-account/user-account'
import Scroll from 'base/scroll/Scroll'
import { playlistMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'
import { userDetail } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'aside-box',
  data () {
    return {
      activeClass: 0,
      showFlag: false,
      showFirst: true,
      showPlaylist: false,
      showSecond: true,
      userDetail: {},
      nickname: '',
      avatarUrl: '',
      asidList: {
        datas: [
          {
            icon: 'fa-music',
            text: '发现音乐',
            link: '/recommend'
          },
          {
            icon: 'fa-forumbee',
            text: '私人FM',
            link: '/test'
          },
          {
            icon: 'fa-music',
            text: '发现音乐',
            link: '/test'
          },
          {
            icon: 'fa-stop-circle-o',
            text: '视频',
            link: '/test'
          },
          {
            icon: 'fa-user',
            text: '朋友',
            link: '/test'
          }
        ]
      }
    }
  },
  watch: {
    watchPlayListUpdata (newDate, oldDate) {
      if (newDate !== oldDate) {
        if (this.user.length > 0) {
          this.createdListres = []
          this._playlist()
        }
      }
    }
  },
  mixins: [playlistMixin],
  components: {
    PersonalStatus,
    UserAccount,
    Scroll,
    creatPlaylist
  },
  computed: {
    ...mapGetters([
      'user',
      'watchPlayListUpdata'
    ]),
    firstClass () {
      return this.showFirst ? 'fa-minus' : 'fa-plus'
    },
    secondClass () {
      return this.showSecond ? 'fa-minus' : 'fa-plus'
    }
  },
  created () {
    if (this.user.length > 0) {
      this._userDetail()
    }
  },
  mounted () {
    document.addEventListener('click', this.handleDocumentClick)
  },
  methods: {
    _userDetail () {
      userDetail({uid: this.user[0].profile.userId, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.userDetail = res.profile
          this.nickname = res.profile.nickname
          this.avatarUrl = res.profile.avatarUrl
        }
      })
    },
    changePersonalStatus () {
      this.$refs.PersonalStatus.show()
    },
    accountInfo () {
      this.showFlag = true
    },
    handleDocumentClick (e) {
      if (this.showFlag && !this.$refs.userAccount.contains(e.target)) {
        this.showFlag = false
      }
    },
    selectItem (data) {
      this.$router.push('/songListView/' + data)
    },
    createList () {
      let that = this
      that.showPlaylist = true
      that.$nextTick(() => {
        that.$refs.creatPlaylist.createList()
      })
    },
    successCreat () {
      this.createdListres = []
      this._playlist()
    }
  },
  destroyed () {
    document.removeEventListener('click', this.handleDocumentClick)
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .aside-wrap
    padding: 0 14px 0 0
    box-sizing: border-box
    background: $asid-background
    height: 100%
    position: relative
    .aside-top
      padding: 20px
      position: relative
      .avatar-box .flex
        display: flex
        align-items: center
        .avatar-img
          img
            width: 40px
            height: 40px
            border-radius: 50%
          i
            font-size: $font-size-i-big
            display: inline-block
            vertical-align: middle
        .avatar-name
          margin: 0 10px 0 22px
    .aside-scroll-fixed
      position: fixed
      top: 159px
      bottom: $player-height
      width: $aisde-width
      background: $asid-background
      // z-index: 2
      .aside-content
        height: 100%
        overflow: hidden
        padding-right: 14px
        .aside-list
          dl
            margin-bottom: 15px
            dt,dd
              padding-left: 25px
            dt
              color: $color-i
              height: 35px
              line-height: 35px
              cursor: pointer
            dd
              color: #c4c4c4
              height: 46px
              line-height: 46px
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
              cursor: pointer
              &.current, &:hover
                background: #141414
                color: $color-main
                i
                  color: $color-main
              i
                color: $color-i
                margin-right: 10px
</style>
