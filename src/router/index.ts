import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Search from '../views/Search.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Search,
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
	},
	//{
	//	path: '/search',
	//	name: 'Search',
	//	component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
	//},
	{
		path: '/record/:id',
		name: 'Record',
		component: () => import(/* webpackChunkName: "show record" */ '../views/ShowRecord.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
