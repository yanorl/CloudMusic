<template>
  <div class="review-box">
    <review-view type="3" :id="$route.params.id" :hotComments="hotComments" :comments="comments" :totalCount="totalCount" @commentReview="commentReview" @scrollTop="scrollTop"></review-view>
  </div>
</template>

<script>
import { commentAlbum } from 'api'
import { ERR_OK } from 'api/config'
import reviewView from 'base/review-view/review-view'

export default {
  name: 'review',
  data () {
    return {
      totalCount: '',
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
      const data = Object.assign({}, commonParams, {id: this.$route.params.id, limit: this.limit, timestamp: (new Date()).valueOf()})
      commentAlbum(data).then((res) => {
        if (res.code === ERR_OK) {
          this.totalCount = res.total.toString()
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
  .review-box
    margin: 0 35px
</style>
