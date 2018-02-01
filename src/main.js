// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router/index';
import VueResource from 'vue-resource';
import Vuex from 'vuex';
import VueLazyLoad from 'vue-lazyload';
//import {currency} from './util/currency'; // 全局注册过滤器
Vue.config.productionTip = false;

import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll);

// 全局注册使用
//Vue.filter('currency',currency);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
});


/*全局引入css样式文件*/
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'


/*通过vuex全局管理状态值*/
const store = new Vuex.Store({
	state:{
		nickName:'',
		cartCount:0
	},
	mutations:{
		updateUserInfo(state,nickName){
			state.nickName = nickName;
			console.log('hello')
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount;
		},
		initCartCount(state,cartCount){
			state.cartCount = cartCount;
		}
	}
});


/* eslint-disable no-new */
new Vue({
  	el: '#app',
	store,
  	router,
  	template: '<App/>',
  	components: { App }
});


