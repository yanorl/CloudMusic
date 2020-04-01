<template>
  <div class="edit-playlist-info-box">
    <form ref="form" class="left">
      <div class="form-group">
        <label for="playlistname" class="form-type-info">歌单名：</label>
        <div class="form-type">
          <input type="text" class="form-control" id="playlistname" v-model="formArray.playlistname" placeholder="请输入歌单名">
        </div>
      </div>
      <div class="form-group radio">
        <span class="form-type-info"> 标签：</span>
        <div class="form-type">
         <div class="tags left">
           <span v-for="(item, index) in tags" :key="index">
             {{item}}
           </span>
         </div>
         <span class="trigger" @click="plusTag">添加标签</span>
        </div>
      </div>
      <div class="form-group">
        <label for="info" class="form-type-info">介绍：</label>
        <div class="form-type">
          <textarea class="form-control info" rows="4" id="info" v-model="formArray.info" placeholder="请输入介绍"></textarea>
          <span class="tag-absoulte" :class="infoNumber < 0 ? 'color-main' : ''">{{infoNumber}}</span>
        </div>
      </div>
      <div class="button-box">
        <button type="button" class="button-wrap botton-confix" @click="saveForm" :disabled="disabledButton">保存</button>
        <button type="button" class="button-wrap botton-close" @click="closeForm">取消</button>
      </div>
      <div v-show="loading" class="loading-container">
        <loading></loading>
      </div>
    </form>
    <div class="avatar-img">
      <img v-lazy="songlistViewArray.coverImgUrl" alt="" width="100%">
    </div>
  <category-label ref="CategoryLabel" @updateSongList="updateSongList" :select="tags"></category-label>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import categoryLabel from 'base/category-label/category-label'
import { songlistView, playlistUpdate } from 'api'
import { ERR_OK } from 'api/config'

export default {
  name: 'edit-playlist-info',
  data () {
    return {
      songlistViewArray: [],
      formArray: {
        playlistname: '',
        info: ''
      },
      holdFormArray: {
        playlistname: '',
        info: ''
      },
      tags: [],
      infoNumber: 1000,
      disabledButton: true,
      loading: false
    }
  },
  watch: {
    '$route.params.id': function (newRouter, oldRouter) {
      this._songlistView()
    },
    'formArray.info' (newDate) {
      if (newDate) {
        this.infoNumber = 1000 - Number(newDate.length)
      }
    },
    formArray: {
      handler (newData, oldData) {
        if (newData.playlistname === '') {
          this.disabledButton = true
        } else {
          let boolean = this.isObjectValueEqual(newData, this.holdFormArray)
          if (boolean) {
            this.disabledButton = true
          } else {
            this.disabledButton = false
          }
        }
      },
      deep: true
    }
  },
  computed: {
  },
  created () {
    this._songlistView()
  },
  components: {
    Loading,
    categoryLabel
  },
  methods: {
    isArr (arr1, arr2) {
      /* eslint-disable */
      return JSON.stringify(arr1.sort()) == JSON.stringify(arr2.sort())
    },
    isObjectValueEqual (a, b) {
      // 取对象a和b的属性名
      var aProps = Object.keys(a)
      var bProps = Object.keys(b)
      // 判断属性名的length是否一致
      if (aProps.length !== bProps.length) {
        return false
      }
      // 循环取出属性名，再判断属性值是否一致
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]
        if (!a[propName]) {
          a[propName] = ''
        }
        if (!b[propName]) {
          b[propName] = ''
        }
        if (a[propName].toString() !== b[propName].toString()) { // 要转换为字符串
          return false
        }
      }
      return true
    },
    _songlistView () {
      songlistView({id: this.$route.params.id, timestamp: (new Date()).valueOf()}).then((res) => {
        if (res.code === ERR_OK) {
          this.songlistViewArray = res.playlist
          this.formArray.playlistname = this.songlistViewArray.name
          this.formArray.info = this.songlistViewArray.description
          this.tags = this.songlistViewArray.tags
          // 查询到的原始值
          this.holdFormArray.playlistname = this.songlistViewArray.name
          this.holdFormArray.info = this.songlistViewArray.description
        }
      })
    },
    updateSongList (data) {
      if (this.isArr(data, this.tags)) {
        this.disabledButton = true
      } else {
        this.disabledButton = false
      }
      this.tags = data
      this.$refs.CategoryLabel.popUpsClose()
    },
    _playlistUpdate () {
      this.loading = true
      playlistUpdate({id: this.$route.params.id, name: this.formArray.playlistname, desc: this.formArray.info, tags: this.tags.join(';')}).then((res) => {
        if (res.code === ERR_OK) {
          this.loading = false
          this.disabledButton = true
          this.closeForm()
        }
      })
    },
    saveForm () {
      if (this.infoNumber >= 0) {
        this._playlistUpdate()
      } else {
        this.$toast('介绍字数超限')
      }
    },
    closeForm () {
      this.$router.go(-1)
    },
    showConfirm () {
      this.$refs.confirmDom.show()
    },
    plusTag () {
      this.$refs.CategoryLabel.showPop()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .edit-playlist-info-box
    margin: 20px 0
    .form-group
      margin-bottom: 20px
      overflow: hidden
      .form-type-info
        float: left
        margin-right: 15px
        width: 80px
        text-align: right
      .form-type
        float: left
        position: relative
        input,textarea
          background: #2b2b2b
          border: 0
          width: 400px
          padding: 10px
          font-size: $font-size-small
          box-sizing: border-box
        input[type='radio']
          width: initial
         label
           margin-right: 25px
           span
             margin-left: 5px
        .tag-absoulte
          position: absolute
          right: 10px
          bottom: 10px
          font-size: $font-size-small
          color: #565454
        .info
          padding-right: 33px
        .tags
          span
            display: inline-block
            padding: 2px 10px
            margin-right: 10px
            background: #2b2b2b
            border-radius: 10px
        span.trigger
          text-decoration: underline
          margin-left: 10px
          cursor: pointer
          &:hover
            color: #fff
     .button-box
       margin: 30px 0 30px 95px
       .button-wrap
         display: inline-block
         padding: 5px 25px
         border: 1px solid
         border-radius: 20px
         cursor: pointer
         &:disabled
           opacity: 0.5
           cursor: not-allowed
       .botton-confix
         background: #d8100d
         border-color: #8a2d2c
         margin-right: 20px
         color: #fff
       .botton-close
         border-color: #565454
         background: none
    .avatar-img
      float: left
      margin-left: 50px
      width: 145px
      height: 145px
      border-radius: 5px
      overflow: hidden
</style>
