<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn
				  flat
				  dense
				  round
				  icon="menu"
				  aria-label="Menu"
				  v-if="isAuthenticated"
				  @click="leftDrawerOpen = !leftDrawerOpen"
				/>
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
				<q-item clickable v-ripple v-else>
			        <q-item-section avatar>
			          	<q-avatar>
			            	<img :src="user.iJ">
			          	</q-avatar>
			        </q-item-section>
			        <q-item-section>{{user.Ue}}</q-item-section>
			        <q-menu>
				        <q-list style="min-width: 100px">
				            <q-item @click="logout" clickable v-close-popup>
				              <q-item-section>Logout</q-item-section>
				            </q-item>
				            <q-separator/>
				        </q-list>
        			</q-menu>
			    </q-item>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-if="isAuthenticated"
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			content-class="bg-grey-1"
		>
		  	<q-list>
				<q-item-label
				  header
				  class="text-grey-8"
				>
				  Google API List
				</q-item-label>
				<EssentialLink
				  v-for="link in essentialLinks"
				  :key="link.title"
				  v-bind="link"
				/>
		  	</q-list>
		</q-drawer>

		<q-page-container>
		  	<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import EssentialLink from '../components/EssentialLink'
const linksData = [
	{
		title: 'Contacts',
		caption: 'Google Contacts',
		icon: 'school',
		link: '/contacts'
	},
	{
		title: 'Calendar',
		caption: 'Google Contacts',
		icon: 'school',
		link: '/calendar'
	}
];

export default {
	name: 'MainLayout',
	components: { EssentialLink },
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
	methods: {
	  	async logout() {
	  		const { data } = await this.$gAuth.signOut()
	  		this.$store.dispatch('auth/setCurrentUser', null)
	        this.$store.dispatch('auth/setUserProfile', null)
	        this.$router.push('/')
	  	}
    }
}
</script>
