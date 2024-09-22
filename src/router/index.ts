import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Search from '../views/Search.vue';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/find',
		name: 'Search',
		component: Search,
	},
	{
		path: '/about',
		name: 'About',
		/*route level code-splitting
		 this generates a separate chunk (about.[hash].js) for this route
		 which is lazy-loaded when the route is visited.*/
		component: () => import('../views/About.vue'),
	},
	{
		path: '/record/:id',
		name: 'Record',
		component: () => import('../views/ShowRecord.vue'),
		props: (route) => ({
			id: route.params.id,
			autoplay: route.query.autoplay || null,
			startAt: route.query.startAt || null,
		}),
	},
	{
		path: '/:pathMatch(.*)*', // Catch-all route
		name: 'NotFound',
		component: () => import('../views/404.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from) => {
	if (from.query.locale && !to.query.locale) {
		to.query.locale = from.query.locale;
		return to;
	}
});

export default router;
