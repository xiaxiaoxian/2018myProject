import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList.vue';
import Cart from './../views/Cart.vue';
import Address from './../views/Address.vue';
import OrderConfirm from '@/views/OrderConfirm.vue';
import OrderSuccess from '@/views/OrderSuccess.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',       // 首页
			name: 'GoodsList',
			component: GoodsList
		},
		{
			path:'/cart',    // 购物车
			name:'Cart',
			component: Cart
		},
		{
			path:'/address', // 地址
			name:'Address',
			component:Address
		},
		{
			path:'/orderConfirm',
			name:'OrderConfirm',
			component:OrderConfirm
		},
		{
			path:'/orderSuccess',
			name:'OrderSuccess',
			component:OrderSuccess
		}

	]
})
