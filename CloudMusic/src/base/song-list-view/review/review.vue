<template>
  <div class="review-box">
    <div class="review-wrap">
      <div class="review-content">
        <review-form ref="reviewForm" :rp="rp" :commentId="commentId" @tips="tips" @commentControl="_commentControl"></review-form>
        <div class="review-list-wrap">
          <div class="review-list-content">
            <template v-if="hotComments.length > 0 || comments.length > 0">
              <review-list :commentsData="hotComments" reviewTitle="精彩评论" @rpName="rpName" type="2" @updateReview="_commentReview" :resourcesId="$route.params.id"></review-list>
              <review-list :commentsData="comments" :reviewTitle="formatReviewTitle" @rpName="rpName" type="2" @updateReview="_commentReview" :resourcesId="$route.params.id"></review-list>
              <div class="pagination-box" v-if="comments.length">
                <pagination :totalCount="commentsData.total" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
              </div>
            </template>
            <template v-else>
              <p class="none-text">{{noneText}}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentPlayList } from 'api'
import { ERR_OK } from 'api/config'
import { reviewMixin } from 'common/js/mixin'
import ReviewForm from 'base/review-form/review-form'
import ReviewList from 'base/review-list/review-list'
import Pagination from 'base/pagination/pagination'

export default {
  name: 'review',
  mixins: [reviewMixin],
  data () {
    return {
    }
  },
  created () {
    this._commentReview()
  },
  components: {
    ReviewForm,
    ReviewList,
    Pagination
  },
  methods: {
    _commentReview (commonParams = {}, boolean) {
      const data = Object.assign({}, commonParams, {id: this.$route.params.id, limit: this.limit, timestamp: (new Date()).valueOf()})
      commentPlayList(data).then((res) => {
        if (res.code === ERR_OK) {
          this.commentsData = res
          this.comments = res.comments
          if (boolean) {
            this.hotComments = res.topComments
          } else {
            this.hotComments = res.hotComments
          }
        }
      })
    },
    getData (i) {
      this.$emit('scrollTop')
    },
    _commentControl (commonParams) {
      const data = Object.assign({}, commonParams, {id: this.$route.params.id, type: 2, timestamp: (new Date()).valueOf()})
      this.commentControlFn(data)
    },
    otherRp () {
      this.$emit('scrollTop')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .review-box
    .review-wrap
      margin:  0 34px
      overflow: hidden
      .review-content
        .none-text
          color: #7b7b7b
          text-align: center
</style>
