<template>
  <div class="review-list-box">
    <div class="review-list-wrap" v-if="commentsData.length">
      <div class="review-list-title">{{reviewTitle}}</div>
      <ul>
        <li v-for="(item, index) in commentsData" :key="index">
          <div class="review-list-item">
            <div class="avatar-box cursor" @click="itemClick(item.user.userId)">
              <img :src="item.user.avatarUrl" alt="" width="100%">
            </div>
            <div class="review-list-item-content">
              <div class="review-list-item-avatar" v-if="item.user">
                <span class="review-list-item-name cursor" @click="itemClick(item.user.userId)">{{item.user.nickname}}:</span>
                <span class="review-list-item-avatar-content">{{item.content}}</span>
              </div>
              <div class="rp" v-if="item.beReplied.length" v-for="(list, listIndex) in item.beReplied" :key="listIndex">
                <span class="rp-name">@{{list.user.nickname}}:</span>
                <span class="rp-content">{{list.content}}</span>
              </div>
              <div class="review-list-item-other clearfix">
                <div class="time left">{{nomalTime(item.time)}}</div>
                <div class="review-list-item-icon right">
                  <span class="icon-item" :class="{'liked': item.liked }" @click="clickLike(item)">
                    <i class="fa fa-hand-pointer-o" aria-hidden="true"></i>
                    <span>{{item.likedCount ? item.likedCount : ''}}</span>
                  </span>
                  <span class="icon-item" @click="rp(item.user.nickname, item.commentId,)">
                    <i class="fa fa-commenting-o" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { timesFun } from 'common/js/util'
import { commentLike } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'review-list',
  props: {
    commentsData: {
      type: Array,
      default: () => []
    },
    reviewTitle: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: '0'
    },
    resourcesId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
  },
  created () {
  },
  components: {
  },
  methods: {
    nomalTime (timestamp) {
      return timesFun(timestamp)
    },
    clickLike (item) {
      if (item.liked) {
        this._commentLike(item.commentId, 0, this.type)
      } else {
        this._commentLike(item.commentId, 1, this.type)
      }
    },
    _commentLike (cid, t, type) {
      let that = this
      commentLike({id: that.resourcesId, cid: cid, t: t, type: type, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          setTimeout(function () {
            that.$emit('updateReview')
          }, 1000)
        }
      })
    },
    rp (name, id) {
      // console.log(name)
      this.$emit('rpName', name, id)
    },
    itemClick (id) {
      this.$router.push({name: 'user', params: {userId: id}})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .review-list-box
    .review-list-title
      margin-top: 20px
    ul
      li
        font-size: $font-size-small
        padding: 15px 0
        border-bottom: 2px solid #242424
        &:last-child
          border: none
        .review-list-item
          display: flex
          align-items: top
          .avatar-box
            width: 35px
            height: 35px
            overflow: hidden
            border-radius: 50%
            margin-right: 15px
          .review-list-item-content
            flex: 1
            .review-list-item-avatar
              padding-bottom: 10px
              .review-list-item-name
                color: #72ade7
            .rp
              padding: 10px
              background: #252525
              border-radius: 5px
              color: #7b7b7b
              margin-bottom: 10px
              .rp-name
                color: #72ade7
            .review-list-item-other
              color: #7b7b7b
              .review-list-item-icon
               span.icon-item
                 display: inline-block
                 margin-left: 20px
                 cursor: pointer
                 &.liked
                   i
                     color: red
                 span
                   color: $color-background
</style>
