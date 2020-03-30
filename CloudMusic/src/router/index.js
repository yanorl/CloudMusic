import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 解决两次访问相同路由地址报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const home = (resolve) => {
  import('components/home/home').then((module) => {
    resolve(module)
  })
}

const recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const user = (resolve) => {
  import('components/user/user').then((module) => {
    resolve(module)
  })
}

const userRecord = (resolve) => {
  import('components/user-record-list/user-record-list').then((module) => {
    resolve(module)
  })
}

const editUserInfo = (resolve) => {
  import('components/edit-user-info/edit-user-info').then((module) => {
    resolve(module)
  })
}

const songListView = (resolve) => {
  import('components/song-list-view/song-list-view').then((module) => {
    resolve(module)
  })
}

const artist = (resolve) => {
  import('components/artist/artist').then((module) => {
    resolve(module)
  })
}

const album = (resolve) => {
  import('components/album/album').then((module) => {
    resolve(module)
  })
}

const editPlaylistInfo = (resolve) => {
  import('components/edit-playlist-info/edit-playlist-info').then((module) => {
    resolve(module)
  })
}

const mv = (resolve) => {
  import('components/mv/mv').then((module) => {
    resolve(module)
  })
}

const video = (resolve) => {
  import('components/video/video').then((module) => {
    resolve(module)
  })
}

const search = (resolve) => {
  import('components/search-view/search-view').then((module) => {
    resolve(module)
  })
}

const searchSingle = (resolve) => {
  import('components/search-view/search-single/search-single').then((module) => {
    resolve(module)
  })
}

const test = (resolve) => {
  import('components/test').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      redirect: '/recommend',
      children: [
        {
          path: '/recommend',
          component: recommend
        },
        {
          path: '/user/:userId',
          name: 'user',
          component: user
        },
        {
          path: '/userRecord/:userId',
          name: 'userRecord',
          component: userRecord
        },
        {
          path: '/editUserInfo',
          component: editUserInfo
        },
        {
          path: '/editPlaylistInfo/:id',
          name: 'editPlaylistInfo',
          component: editPlaylistInfo
        },
        {
          path: '/songListView/:id',
          name: 'songListView',
          component: songListView
        },
        {
          path: '/artist/:id',
          name: 'artist',
          component: artist
        },
        {
          path: '/album/:id',
          name: 'album',
          component: album
        },
        {
          path: '/search/:name',
          name: 'search',
          component: search,
          children: [
            {
              path: '/searchSingle/:name',
              name: 'searchSingle',
              component: searchSingle
            }
          ]
        }
      ]
    },
    {
      path: '/mv/:mvid',
      name: 'mv',
      component: mv
    },
    {
      path: '/video/:id',
      name: 'video',
      component: video
    },
    {
      path: '/test',
      component: test
    }
  ]
})
