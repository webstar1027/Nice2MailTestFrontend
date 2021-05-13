import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

export default function ({ store }) {
	const Router = new VueRouter({
		scrollBehavior: () => ({ x: 0, y: 0 }),
		routes,
		mode: process.env.VUE_ROUTER_MODE,
		base: process.env.VUE_ROUTER_BASE
	})

	Router.beforeEach((to, from, next) => {
		if (to.matched.some(route => route.meta.requiresAuth)) {
			if (store.getters.['auth/isAuthenticated']) {
			  next()
			} else {
			  next("/login")
			}
		} else {
			if (to.path === '/') {
				if (store.getters.['auth/isAuthenticated']) {
				  	next('/dashboard')
				} else {
					next()
				}
			} else {
		  		next();
			}
		}
  	});

  	return Router
}
