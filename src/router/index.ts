import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: () => import('../views/Home.vue'),
	},
	{
		path: '/find',
		name: 'Search',
		component: () => import('../views/Search.vue'),
	},
	{
		path: '/post/:id',
		name: 'Record',
		component: () => import('../views/ShowRecord.vue'),
		props: (route) => ({
			id: route.params.id,
			autoplay: route.query.autoplay || null,
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
