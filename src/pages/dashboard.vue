<template>
  <q-page>
  	<div class="q-pa-md">
  		<div class="row justify-center" v-if="!loading" style="position: absolute; top: 45%; left: 50%;">
  			<q-spinner-bars
	          color="primary"
	          size="4em"
	        />
  		</div>
  		<div class="row  items-center" v-else>
  			<div class="col-12">
  				<div class="row justify-end">
  					<div class="col-2">
		  				<q-btn :ripple="false" color="secondary" label="Add contact" @click="confirm = true" no-caps />
		  			</div>
  				</div>
  				<div class="row justify-center items-center">
  					
  					<div class="col-10 table-content">
		  				<q-table
						  title="Google Contacts"
						  :data="contacts"
						  :columns="columns"
						  row-key="name"
						>
							<template v-slot:body-cell-action="props">
							    <q-td :props="props">
							      <div>
							        <q-btn color="primary" label="Edit" @click="editContact"/>
							      </div>
							    </q-td>
							</template>
						</q-table>
		  			</div>
  				</div>
  			</div>
  		</div>
	</div>

	<q-dialog v-model="confirm" persistent>
	    <q-card>
	        <q-card-section class="row items-center">
	          	<q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
	          	<h5 class="q-ml-sm" v-if="edit">Update Google Contact</h5>
	          	<h5 class="q-ml-sm" v-else>Create Google Contact</h5>
	        </q-card-section>

	        <q-card-section class="row items-center justify-center">
	        	<q-form
			      class="q-gutter-md"
			    >
			    	<q-input
				        filled
				        v-model="contact.name"
				        label="Name"
				        hint="Name and surname"
				        lazy-rules
				        :rules="[ val => val && val.length > 0 || 'Please type contact name']"
				    />
				    <q-input
				        filled
				        v-model="contact.email"
				        label="E-mail"
				        hint="E-mail"
				        lazy-rules
				        :rules="[ val => val && val.length > 0 || 'Please type contact email']"
				    />

				    <q-input
				        filled
				        type="number"
				        v-model="contact.phoneNumber"
				        label="phone number"
				        lazy-rules
				        :rules="[
				          val => val !== null && val !== '' || 'Please type contact phone number'
				        ]"
				    />
				</q-form>
	        </q-card-section>
	        <q-card-actions align="right">
		        <q-btn flat label="Cancel" color="primary" v-close-popup />
		        <q-btn flat v-if="edit" label="Edit" color="primary" @click="onSubmit(0)" v-close-popup />
		        <q-btn flat v-else label="Create" color="primary" @click="onSubmit(1)" v-close-popup />
	        </q-card-actions>
	    </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notify } from 'quasar'
export default {
  name: 'Dashboard',
  computed: {
	...mapGetters({
		user: 'auth/getCurrentUser',
	  	profile: 'auth/getAuthenticatedUserProfile',
	  	token: 'auth/getToken'
	}),
  },
  mounted() {
  	this.$axios.get('http://localhost:3000/index.php', {
        params: {
            scope: this.profile.scope,
            access_token: this.token
        }
    }).then(res => {
    	console.log(res.data.contacts)
    	this.loading = true;
    	this.contacts = res.data.contacts
    	this.$store.dispatch('contact/saveContacts', res.data.contacts)
    })
  },
  data() {
	return {
		contacts: [],
	 	columns:[
			{ name: 'name', label: 'Name', field: 'name',  align: 'left', sortable: true },
			{ name: 'email', label: 'E-mail', field: 'email',  align: 'left', sortable: true },
			{ name: 'phoneNumber', label: 'Phone Number',  align: 'left', field: 'phoneNumber' },
			{ name: 'action', label: 'Action',  align: 'center', field: 'action' },
		],
	  	confirm: false,
	  	edit:false,
	  	contact: {
	  		name:'',
	  		email:'',
	  		phoneNumber:''
	  	},
	  	loading:false
	}
  },
  methods: {
  	onSubmit(flag) {
  		if (flag) {
  			if (!this.checkContacts(this.contact)) {
	  			this.$axios.get('http://localhost:3000/index.php', {
	  				params: {
	  					scope: this.profile.scope,
	            		access_token: this.token,
	  					contact: this.contact,
	  					flag: flag
	  				}
	  			}).then( res => {
	  				console.log(res.data);
	  				this.contacts = res.data.contacts
	  			})
	  		} else {
	  			this.$q.notify({
			        message: 'Email Name is already registered .',
			        color: 'secondary',
			        position:'center'
			    })
	  		}
  		} else {

  		}
  	},
  	checkContacts(contact) {
  		let flag = false;

  		this.contacts.forEach(item => {
  			if (item.name === contact.name || item.email === contact.email) {
  				flag = true;
  			}
  		})

  		return flag;
  	}
  },
  editContact(contact) {
  	console.log(contact)
  }
}
</script>

<style lang="sass" scoped>
	.table-content
		padding-top: 60px
	.q-table > td
		text-align: left !important
</style>
