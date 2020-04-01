<template>
  <div class="subscribers-list-box">
    <div class="subscribers-list-wrap clearfix">
      <div class="subscribers-list-content" v-if="subscribers.length > 0">
        <div class="subscribers-list-item" v-for="(item, index) in subscribers" :key="index">
          <div class="avatar-img cursor" @click="itemClick(item.userId)">
            <img v-lazy="item.avatarUrl" alt="" width="100%">
          </div>
          <div class="subscribers-info">
            <div class="user-info">
            <span class="name cursor">{{item.nickname}}</span>
            <span v-if="item.gender" class="gender" :class="genderFormat(item.gender)+'-gender'">
              <i class="fa" :class="genderFormat(item.gender)" aria-hidden="true"></i>
            </span>
          </div>
          <div class="descripts ellipsis">
            {{subscribers.signature}}
          </div>
          </div>
        </div>
      </div>
      <div class="pagination-box" v-if="subscribers.length > 0">
        <pagination :totalCount="subscribedCount" :limit="limit" :currentPage="currentPage" @turn="getData"></pagination>
      </div>
      <p class="none-text" v-if="!subscribedCount">{{noneText}}</p>
    </div>
  </div>
</template>

<script>
import { subscribersPlayList } from 'api'
import { ERR_OK } from 'api/config'
import Pagination from 'base/pagination/pagination'

export default {
  name: 'subscribers-list',
  props: {
    subscribedCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      subscribers: [],
      noneText: '暂无收藏',
      limit: 60,
      currentPage: 1
    }
  },
  created () {
    this._subscribersPlayList()
  },
  computed: {
  },
  components: {
    Pagination
  },
  methods: {
    _subscribersPlayList (commonParams = {}) {
      const data = Object.assign({}, commonParams, {id: this.$route.params.id, limit: this.limit})
      subscribersPlayList(data).then((res) => {
        if (res.code === ERR_OK) {
          this.subscribers = res.subscribers
        }
      })
    },
    getData (i) {
      let offsetNum = (i - 1) * this.limit
      this.currentPage = i
      this.$emit('scrollTop')
      this._subscribersPlayList({offset: offsetNum})
    },
    genderFormat (index) {
      if (index === 1) {
        return 'fa-mars'
      } else if (index === 2) {
        return 'fa-venus'
      }
    },
    itemClick (id) {
      this.$router.push({name: 'user', params: {userId: id}})
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .subscribers-list-box
    .subscribers-list-wrap
      margin: 20px 34px
      .none-text
          text-align: center
          color: #7b7b7b
          width: 100%
      .subscribers-list-content
        display: flex
        justify-content: space-between
        align-items: center
        flex-wrap: wrap
        .subscribers-list-item
          width: 33.33%
          padding-right: 15px
          margin-bottom: 20px
          box-sizing: border-box
          display: flex
          align-items: center
          .avatar-img
            flex: 0 0 120px
            width: 120px
            height: 120px
            border-radius: 50%
            overflow: hidden
            margin-right: 15px
          .subscribers-info
            overflow: hidden
            .descripts
              margin-top: 10px
              color: $color-gray
            .user-info
              .name
                &:hover
                  color: #fff
              .gender
                width: 20px
                height: 20px
                line-height: 20px
                display: inline-block
                border-radius: 50%
                font-size: $font-size-small
                text-align: center
                &.fa-mars-gender
                  background: #3b6071
                  color: #00a5f9
                &.fa-venus-gender
                  background: #803352
                  color: #f10865
</style>
