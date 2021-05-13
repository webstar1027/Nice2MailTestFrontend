
const routes = [
  	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/Index.vue') },
			{
				path: '/login',
				component: () => import('pages/login.vue')
			},
			{
				path: '/dashboard',
				component: () => import('pages/dashboard.vue'),
				 meta: { requiresAuth: true },
			},
		]
  	},
  	{
		path: '*',
		component: () => import('pages/Error404.vue')
  	}
]

export default routes
