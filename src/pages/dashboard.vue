<template>
  <q-page>
  	<div class="q-pa-md">
  		<div class="row  items-center">
  			<div class="col-12">
  				<div class="row justify-end">
  					<div class="col-2">
		  				<q-btn :ripple="false" color="secondary" label="Add contact" @click="confirm = true" no-caps />
		  			</div>
  				</div>
  				<div class="row justify-center">
  					<div class="col-10 table-content">
		  				<q-table
						  title="Google Contacts"
						  :data="contacts"
						  :columns="columns"
						  row-key="name"
						/>
		  			</div>
  				</div>
  			</div>
  		</div>
	</div>

	<q-dialog v-model="confirm" persistent>
	    <q-card>
	        <q-card-section class="row">
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
				          val => val !== null && val !== '' || 'Please type contact phone number',
				          val => val > 0 && val < 100 || 'Please type a real phone number'
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
export default {
  name: 'Dashboard',
  computed: {
	...mapGetters({
	  	contacts: 'contact/getContacts',
	}),

  },
  data() {
	return {
	 	columns:[
			{ name: 'name', label: 'Name', field: 'name',  align: 'left', sortable: true },
			{ name: 'email', label: 'E-mail', field: 'email',  align: 'left', sortable: true },
			{ name: 'phoneNumber', label: 'Phone Number',  align: 'left', field: 'phoneNumber' },
		],
	  	confirm: false,
	  	edit:false,
	  	contact: {
	  		name:'',
	  		email:'',
	  		phoneNumber:''
	  	}
	}
  },
  mounted() {
	console.log(this.contacts)
  },
  methods: {
  	onSubmit(flag) {
  		if (flag) {
  			this.$axios.post('http://localhost:3000/index.php', {
  				params: {
  					contact: this.contact,
  				}
  			})
  		} else {

  		}
  	}
  }
  
}
</script>

<style lang="sass" scoped>
	.table-content
		padding-top: 60px
	.q-table > td
		text-align: left !important
</style>
