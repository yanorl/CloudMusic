<template>
  <div class="review-box">
    <review-view type="2" :id="$route.params.id" :hotComments="hotComments" :comments="comments" :totalCount="totalCount" @commentReview="commentReview" @scrollTop="scrollTop"></review-view>
  </div>
</template>

<script>
import { commentPlayList } from 'api'
import { ERR_OK } from 'api/config'
import reviewView from 'base/review-view/review-view'

export default {
  name: 'review',
  data () {
    return {
      loading: false,
      totalCount: 0,
      comments: [],
      hotComments: []
    }
  },
  created () {
    this._commentReview()
  },
  components: {
    reviewView
  },
  methods: {
    commentReview (data) {
      this._commentReview(data)
    },
    _commentReview (commonParams = {}) {
      this.$isLoading(true)
      const data = Object.assign({}, commonParams, {id: this.$route.params.id, limit: this.limit, timestamp: (new Date()).valueOf()})
      commentPlayList(data).then((res) => {
        if (res.code === ERR_OK) {
          this.totalCount = res.total
          this.comments = res.comments
          this.hotComments = res.hotComments
          this.$isLoading(false)
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
  .review-box
    margin: 0 35px
</style>
