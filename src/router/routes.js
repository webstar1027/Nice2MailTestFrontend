
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
			{
				path: '/calendar',
				component: () => import('pages/googleAPI/calendar.vue'),
				meta: { requiresAuth: true },
			},
			{
				path: '/contacts',
				component: () => import('pages/googleAPI/contacts.vue'),
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
