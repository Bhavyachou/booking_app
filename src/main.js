import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue';

Vue.config.productionTip = false

Vue.use(SuiVue);

new Vue({
  render: h => h(App),
}).$mount('#app')



