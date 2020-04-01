<template>
  <div class="review-box">
    <review-view type="5" :id="$route.params.id.toString()" :hotComments="hotComments" :comments="comments" :totalCount="totalCount" @commentReview="commentReview" @scrollTop="scrollTop"></review-view>
  </div>
</template>

<script>
import reviewView from 'base/review-view/review-view'
import { commentVideo } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'review',
  data () {
    return {
      totalCount: 0,
      comments: [],
      hotComments: []
    }
  },
  watch: {
    $route: function (newRouter, oldRouter) {
      this.commentReview()
    }
  },
  created () {
    this.commentReview()
  },
  components: {
    reviewView
  },
  methods: {
    commentReview (data) {
      this._commentReview(data)
    },
    _commentReview (commonParams = {}, boolean) {
      const data = Object.assign({}, commonParams, {id: this.$route.params.id, limit: this.limit, timestamp: (new Date()).valueOf()})
      commentVideo(data).then((res) => {
        if (res.code === ERR_OK) {
          this.totalCount = res.total
          this.comments = res.comments
          this.hotComments = res.hotComments
        }
      })
    },
    scrollTop (i) {
      this.$emit('scrollTop')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
