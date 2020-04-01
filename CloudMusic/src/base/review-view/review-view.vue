<template>
  <div class="review-view-box">
    <div class="review-view-wrap">
      <div class="review-view-content">
        <review-form ref="reviewForm" :rp="rp" :commentId="commentId" @tips="tips" @commentControl="_commentControl"></review-form>
        <div class="review-list-wrap">
          <div class="review-list-content">
            <div v-if="comments.length > 0">
              <review-list :commentsData="hotComments" reviewTitle="精彩评论" @rpName="rpName" :type="type" @updateReview="updateReview" :resourcesId="id"></review-list>
              <review-list :commentsData="comments" :reviewTitle="reviewTitle" @rpName="rpName" :type="type" @updateReview="updateReview" :resourcesId="id"></review-list>
              <div class="pagination-box" v-if="comments.length > 0">
                <pagination :totalCount="totalCount" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
              </div>
            </div>
            <div v-if="!totalCount">
              <p class="none-text">{{noneText}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  props: {
    hotComments: {
      type: Array,
      default: () => []
    },
    comments: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: '0'
    },
    totalCount: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: ''
    }
  },
  created () {
  },
  computed: {
    reviewTitle () {
      return `最新评论（${this.totalCount}）`
    }
  },
  components: {
    ReviewForm,
    ReviewList,
    Pagination
  },
  methods: {
    updateReview (data) {
      this.$emit('scrollTop')
      this.$emit('commentReview', data)
    },
    _commentControl (commonParams) {
      const data = Object.assign({}, commonParams, {id: this.id, type: this.type, timestamp: (new Date()).valueOf()})
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
  .review-view-box
    .review-view-wrap
      overflow: hidden
      .review-view-content
        .none-text
          color: #7b7b7b
          text-align: center
</style>
