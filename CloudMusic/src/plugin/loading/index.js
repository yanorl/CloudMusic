import indexVue from './index.vue'

function plugin (Vue, options) {
  var MyPluginVue = Vue.extend(indexVue)
  var vm = new MyPluginVue({
    data: {
      isLoading: false
    }
  }).$mount()
  document.body.appendChild(vm.$el)
  Vue.prototype.$isLoading = function (isLoading) {
    vm.changeStatus(isLoading)
  }
}

export default plugin
