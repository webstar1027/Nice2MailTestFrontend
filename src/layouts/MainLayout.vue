<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title>
				   Nice2Mail
				</q-toolbar-title>

				<q-item
				    to="/login"
				    v-if="!isAuthenticated"
				>
				    <q-item-section>
				      <q-item-label>Login</q-item-label>
				    </q-item-section>
				</q-item>
				<q-item clickable v-ripple>
			        <q-item-section avatar>
			          	<q-avatar>
			            	<img :src="user.iJ">
			          	</q-avatar>
			        </q-item-section>
			        <q-item-section>{{user.Ue}}</q-item-section>
			    </q-item>
			</q-toolbar>
		</q-header>
		<q-page-container>
		  	<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
const linksData = [
	{
		title: 'Login',
		caption: 'Google Authentication',
		icon: 'school',
		link: '/login'
	}  
];

export default {
  name: 'MainLayout',
  computed: {
  	...mapGetters({
  		user: 'auth/getCurrentUser',
  		isAuthenticated: 'auth/isAuthenticated'
  	})
  },
  data () {
	return {
	  leftDrawerOpen: false,
	  essentialLinks: linksData
	}
  },
  mounted() {
  	console.log(this.user)
  }
}
</script>
