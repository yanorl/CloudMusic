<template>
  <div class="category-label-box">
    <pop-ups ref="popUps" text="添加标签">
      <div class="category-label-wrap clearfix">
        <div class="category-label-content">
          <div class="category-label-midden">
            <scroll ref="scroll" class="category-label-scroll" :data="categorySub">
              <div>
                <p class="title">选择合适的标签，最多可选{{select}}<span class="color-main">3</span>个</p>
                <div class="category-label-list">
                  <div class="category-label-item clearfix" v-for="(item, index) in categoryTag" :key="index">
                    <span class="tags left">{{item}}</span>
                    <div class="item-li left">
                      <ul>
                        <template v-for="(list, i) in categorySub">
                          <label v-if="list.category == index" :key="i">
                            <li>
                              <input type="checkbox" class="checkbox" v-model="selectBox" :value="list.name" ref="checkbox">
                              <div class="item-li-content">
                                {{list.name}}<span><i class="fa fa-times-circle" aria-hidden="true"></i></span>
                              </div>
                            </li>
                          </label>
                        </template>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </scroll>
          </div>
          <div class="category-label-bottom">
            <div class="btn-tex" @click="submit"><span>完成</span></div>
          </div>
        </div>
      </div>
    </pop-ups>
  </div>
</template>

<script>
import PopUps from 'base/pop-ups/pop-ups'
import Scroll from 'base/scroll/Scroll'
import { playlistCatlist } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'category-label',
  data () {
    return {
      selectBox: [],
      categorySub: [],
      categoryTag: []
    }
  },
  watch: {
    selectBox (newData, oldData) {
      if (newData.length >= 3) {
        this.$nextTick(() => {
          this.checkMax()
        })
      } else {
        this.$nextTick(() => {
          this.allCheck()
        })
      }
    }
  },
  props: {
    select: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this._playlistCatlist()
  },
  components: {
    PopUps,
    Scroll
  },
  methods: {
    _playlistCatlist () {
      playlistCatlist().then((res) => {
        if (res.code === ERR_OK) {
          this.categorySub = res.sub
          this.categoryTag = res.categories
        }
      })
    },
    showPop () {
      this.selectBox = this.select
      this.$refs.popUps.show()
    },
    checkMax () {
      let items = this.$refs.checkbox
      console.log(items[0].checked)
      for (var i = 0; i < items.length; i++) {
        if (!items[i].checked) {
          items[i].disabled = true
        } else {
          items[i].disabled = false
        }
      }
    },
    allCheck () {
      let items = this.$refs.checkbox
      for (var i = 0; i < items.length; i++) {
        items[i].disabled = false
      }
    },
    popUpsClose () {
      this.$refs.popUps.close()
    },
    submit () {
      this.$emit('updateSongList', this.selectBox)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .category-label-wrap
    .category-label-content
      font-size: $font-size-small
      height: 330px
      .category-label-bottom
        .btn-tex
          margin: 30px 0 10px
          text-align: center
          span
            display: inline-block
            padding: 5px 30px
            border-radius: 30px
            box-sizing: border-box
            background: $color-main
            color: #fff
      .category-label-midden
        height: 265px
        .category-label-scroll
          height: 100%
          overflow: hidden
          .title
            color: $color-gray
          .category-label-list
            .category-label-item
              margin-top: 25px
              .tags
                display: inline-block
                margin-right: 15px
                padding: 5px 0
              .item-li
                width: 390px
                li
                  margin: 0 20px 10px 20px
                  float: left
                  position: relative
                  cursor: pointer
                  &:hover .item-li-content
                    color: $color-main
                  .item-li-content
                    padding: 0 15px
                    height: 30px
                    line-height: 30px
                    border-radius: 20px
                    background: #373737
                    span
                      position: absolute
                      top: -10px
                      right: 0
                      opacity: 0
                  input
                    display: none
                  input[type='checkbox']:checked + .item-li-content
                    background: #482b2b
                    color: $color-main
                    span
                      opacity: 1
</style>
