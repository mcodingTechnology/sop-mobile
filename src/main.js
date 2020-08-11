// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import { AjaxPlugin } from 'vux'
import 'font-awesome/css/font-awesome.css'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(AjaxPlugin)
Vue.use(VueRouter)
Vue.http.defaults.headers.post['Content-Type'] = 'application/json'

window.ELS = {
  api: 'http://sop.whrunhe.com/runheapi'
}
// const context = require.context('./components', false, /\.vue$/)
// const keys = context.keys()
// console.log(keys)
// keys.forEach(key => {
//   console.log(key.replace(/(.+\/)([^/]+)(\.vue)$/, '$2'))
//   arr.push({path: key.replace(/(.+\/)([^/]+)(\.vue)$/, '$2'), component: () => import(key)})
// })
// console.log(arr)

// 添加响应拦截器
Vue.http.interceptors.response.use(res => {
  // 对响应数据做些事
  if (res.data.code === '401') {
    var url = window.encodeURIComponent(window.location.href)
    Vue.http.get(window.ELS.api + '/wechatOauth/front/createOauthUrlForOpenid?originId=gh_acf7aa5995b7&url=' + 'http://sop.whrunhe.com/wxui/#/').then(res => {
      if (res.data.code === '200') window.location.href = res.data.data
    })
  }
  return res
}, error => {
  // 请求错误时做些事
  return Promise.reject(error)
})
const context = require.context('./app', false, /\.vue$/)
var arr = []
var menu = [{path: '/', title: '首页'}]
context.keys().forEach(key => {
  var path = key.replace(/(.+\/)([^/]+)(\.vue)$/, '$2')
  arr.push({path: '/' + path, component: context(key).default})
  if (!(path === 'index' || path === 'orderDetail' || path === 'returnDetail' || path === 'customerList' || path === 'InformationCenter' || path === 'approvalList' || path === 'customerOrder' || path === 'customerReturn' || path === 'finishList' || path === 'orderManage' || path === 'myReturn' || path === 'informationView')) menu.push({path: '/' + path, title: context(key).default.data().title || path})  // 排除掉不需要显示的模块
})
arr.push({path: '/', redirect: '/index'})
window.menu = menu
// console.log(arr)
// const routes = [
//   {path: '/', component: Home},
//   {path: '/cs', component: () => import('./components/orderManage.vue')}
// ]

const router = new VueRouter({
  routes: arr
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
