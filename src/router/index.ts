import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Search from '../views/Search.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		redirect: '/arkiv',
	},
	{
		path: '/arkiv',
		name: 'Archive',
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
