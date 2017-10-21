import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App'
import router from './router'
import store from './store'
import VueLs from './plugins/storage'
import ElectronLink from './plugins/v-electron-link'
import IpcEvent from './plugins/ipcEvent'

if (!process.env.IS_WEB) {
  Vue.use(ElectronLink)
  Vue.use(IpcEvent)
}
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueLs)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

window.store = store
window.router = router
