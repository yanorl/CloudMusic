<!--分页-->
<template>
  <div class="pagination-wrap" v-if="totalPage > 1">
    <ul class="pagination-list-box clearfix">
      <li class="prev" :class="{'disabled':currentPage <= 1}" @click="prev()">
        <i class="fa fa-angle-left"></i>
      </li>
      <li v-for="(item, index) in showPageBtn" :key="index" :class="{'active':item === currentPage, 'disabled':item === '...'}"
      @click="turn(item)">{{item}}</li>
      <li class="next" :class="{'disabled':currentPage >= totalPage}" @click="next()"><i class="fa fa-angle-right"></i></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    currentPage: {
      // 当前页
      type: Number,
      default: 1
    },
    limit: {
      // 每页显示条数
      type: Number,
      default: 20
    },
    totalCount: {
      // 总条数
      type: Number,
      required: true
    }
  },
  data () {
    return {}
  },
  created () {
  },
  computed: {
    totalPage () {
      return Math.ceil(this.totalCount / this.limit)
    },
    showPageBtn () {
      let pageNum = Number(this.totalPage)
      let index = Number(this.currentPage)
      let ellipsis = '...'
      let arr = []
      if (pageNum <= 9) {
        for (let i = 1; i <= pageNum; i++) {
          arr.push(i)
        }
        return arr
      }
      if (index < 6) {
        return [1, 2, 3, 4, 5, 6, 7, 8, ellipsis, pageNum]
      }
      if (index >= pageNum - 4) {
        return [1, ellipsis, pageNum - 5, pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
      }
      return [1, ellipsis, index - 3, index - 2, index - 1, index, index + 1, index + 2, index + 3, ellipsis, pageNum]
    }
  },
  methods: {
    prev () {
      if (this.currentPage > 1) {
        return this.turn(this.currentPage - 1)
      } else {
        return ''
      }
    },
    next () {
      if (this.currentPage < this.totalPage) {
        return this.turn(this.currentPage + 1)
      }
    },
    // 翻页，显示条数变化
    turn (page) {
      if (page !== '...') {
        let i = parseInt(Number(page))
        if (i < 1) {
          i = 1
        } else if (i > this.totalPage) {
          i = this.totalPage
        }
        // this.$emit("update:currentPage", i)
        this.$emit('turn', i)
      }
    }
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .pagination-wrap
    display: flex
    justify-content: center
    align-items: center
    margin: 25px 0
    .pagination-list-box
      li
        float: left
        margin: 0 3px
        padding: 0 8px
        border: 1px solid #303030
        border-radius: 3px
        min-width: 25px
        height: 25px
        line-height: 25px
        box-sizing: border-box
        text-align: center
        cursor: pointer
        &:hover
          background: #312d2d
        &.disabled:hover,&.fa-ellipsis-h:hover
          background: none
          cursor: default
        &.active
          background: $color-main
          color: #fff
 </style>
