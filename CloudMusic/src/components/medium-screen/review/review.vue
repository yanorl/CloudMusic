<template>
  <div class="review-box">
    <div class="title">
      听友评论 <span>(已有{{totalCount}}条评论)</span>
    </div>
    <div class="review-trigger" @click="changeReviewFlase">
      <div class="left">
        <i class="fa fa-pencil" aria-hidden="true"></i>
        <span>发表评论</span>
      </div>
      <div class="right icon-box">
        <span cl><i aria-hidden="true" class="fa fa-smile-o"></i></span>
        <span>@</span>
      </div>
    </div>
    <div class="review-form" v-show="reviewFlow">
      <div class="review-form-content">
        <div class="review-form-title">
          <span class="close" @click="changeReviewTrue">X</span>
          <div class="title">{{currentSong.name}}</div>
        </div>
        <review-form ref="reviewForm" :rp="rp" :commentId="commentId" @tips="tips" @commentControl="_commentControl"></review-form>
      </div>
    </div>
    <div class="review-list-wrap">
      <div class="review-list-content" v-if="comments">
        <template v-if="comments.length > 0">
          <review-list :commentsData="hotComments" reviewTitle="精彩评论" @rpName="rpName" type="0" @updateReview="_commentReview" :resourcesId="currentSong.id.toString()"></review-list>
          <review-list :commentsData="comments" :reviewTitle="reviewTitle" @rpName="rpName" type="0" @updateReview="_commentReview" :resourcesId="currentSong.id.toString()"></review-list>
          <div class="pagination-box">
            <pagination :totalCount="Number(totalCount)" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
          </div>
        </template>
        <template v-else>
          <p class="none-text">{{noneText}}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewForm from 'base/review-form/review-form'
import ReviewList from 'base/review-list/review-list'
import Pagination from 'base/pagination/pagination'
import { reviewMixin } from 'common/js/mixin'
import { commentMusic } from 'api'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'

export default {
  name: 'review',
  mixins: [reviewMixin],
  data () {
    return {
      reviewFlow: false,
      totalCount: '',
      comments: [],
      hotComments: []
    }
  },
  computed: {
    reviewTitle () {
      return `最新评论（${this.totalCount}）`
    },
    ...mapGetters([
      'currentSong'
    ])
  },
  created () {
  },
  components: {
    ReviewForm,
    ReviewList,
    Pagination
  },
  methods: {
    updateReview (data) {
      this._commentReview(data)
    },
    _commentReview (commonParams = {}) {
      const data = Object.assign({}, commonParams, {id: this.currentSong.id, limit: this.limit, timestamp: (new Date()).valueOf()})
      commentMusic(data).then((res) => {
        if (res.code === ERR_OK) {
          this.totalCount = res.total
          this.comments = res.comments
          this.hotComments = res.topComments
        }
      })
    },
    _commentControl (commonParams) {
      const data = Object.assign({}, commonParams, {id: this.currentSong.id, type: 0, timestamp: (new Date()).valueOf()})
      this.commentControlFn(data, true)
    },
    changeReviewFlase () {
      this.$emit('closeMediumScroll')
      this.reviewFlow = true
    },
    changeReviewTrue () {
      this.$emit('openMediumScroll')
      this.reviewFlow = false
    },
    otherRp () {
      this.changeReviewFlase()
      this.$emit('scrollTop')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .review-box
    .title
      span
        margin-left: 15px
        font-size: $font-size-small
    .review-trigger
      height: 30px
      line-height: 30px
      background: #2f2f2f
      padding: 0 10px
      border-radius: 5px
      margin: 15px 0
      .icon-box
        span
          margin-left: 5px
          i
            font-size: $font-size-medium
            vertical-align: middle
    .review-form
      position: fixed
      left: 50%
      transform: translate(-50%, -80%)
      .review-form-content
        background: #292929
        width: 500px
        padding: 20px 15px
        border-radius: 10px
        .review-form-title
          font-size: $font-size-medium
          text-align: center
          position: relative
          .close
            position: absolute
            left: 0
            top: 50%
            transform: translate(0, -50%)
            color: #565656
            cursor: pointer
        .button-wrap
          background: $color-main
  </style>
