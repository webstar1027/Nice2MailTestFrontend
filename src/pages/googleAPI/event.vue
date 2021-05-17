<template>
  	<q-page>
		<div class="q-pa-md">
			<div class="row justify-center" v-if="loading" style="position: absolute; top: 45%; left: 50%;">
				<q-spinner-bars
				  color="primary"
				  size="4em"
				/>
			</div>
			<div class="row  items-center" v-else>
				<div class="col-12">
					<div class="row justify-end">
						<div class="col-2">
							<q-btn :ripple="false" color="green" label="Add Event" @click="addEvent" no-caps />
						</div>
					</div>
					<div class="row justify-center items-center">
						<div class="col-10 table-content">
							<q-table
							  v-if="!!events"
							  title="Google Calendar Events"
							  :data="events"
							  :columns="eventTableColumns"
							  row-key="name"
							  binary-state-sort
							>
								<template v-slot:body="props">
									<q-tr :props="props">
										<q-td key="summary" :props="props"> {{ props.row.summary }} </q-td>
										<q-td key="start_date" :props="props"> {{ props.row.start_date }}</q-td>
										<q-td key="end_date" :props="props"> {{ props.row.end_date }}</q-td>
										<q-td key="actions" :props="props">
										<q-btn color="blue" label="Update" @click="editItem(props.row)" size=sm no-caps></q-btn>
										<q-btn color="red" label="Delete"  @click="deleteItem(props.row)" size=sm no-caps>
										</q-btn>
									</q-td>
									</q-tr>
								</template>
							</q-table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<q-dialog v-model="confirm" persistent>
			<q-card  style="width: 600px; max-width: 80vw;">
				<q-card-section class="row items-center">
					<q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
					<h5 class="q-ml-sm">Create Google Calendar Event</h5>
				</q-card-section>

				<q-card-section>
					<q-form  @submit="onSubmit" class="row items-center justify-center">
						<div class="col-6 q-gutter-md" style="margin-right: 10px; ">
							<q-input 	filled 
									 	v-model="event.start_date" 
									 	label="Event Start"
									 	lazy-rules
										:rules="[ val => val && val.length > 0 || 'Please select start date time']">
						      	<template v-slot:prepend>
							        <q-icon name="event" class="cursor-pointer">
							          	<q-popup-proxy transition-show="scale" transition-hide="scale">
								            <q-date v-model="event.start_date" mask="YYYY-MM-DD HH:mm">
								              	<div class="row items-center justify-end">
								                	<q-btn v-close-popup label="Close" color="primary" flat />
								              	</div>
								            </q-date>
							          	</q-popup-proxy>
							        </q-icon>
						      	</template>

						      	<template v-slot:append>
							        <q-icon name="access_time" class="cursor-pointer">
							          	<q-popup-proxy transition-show="scale" transition-hide="scale">
								            <q-time v-model="event.start_date" mask="YYYY-MM-DD HH:mm" format24h>
								              	<div class="row items-center justify-end">
								                	<q-btn v-close-popup label="Close" color="primary" flat />
								              	</div>
								            </q-time>
							          	</q-popup-proxy>
							        </q-icon>
						      	</template>
						    </q-input>
						</div>

						<div class="col-6 q-gutter-md">
						    <q-input 	filled
						    			v-model="event.end_date"
						    			label="Event End"
						    			lazy-rules
										:rules="[ val => val && val.length > 0 || 'Please select end date time']">
						      	<template v-slot:prepend>
							        <q-icon name="event" class="cursor-pointer">
							          	<q-popup-proxy transition-show="scale" transition-hide="scale">
								            <q-date v-model="event.end_date" mask="YYYY-MM-DD HH:mm">
								              	<div class="row items-center justify-end">
								                	<q-btn v-close-popup label="Close" color="primary" flat />
								              	</div>
								            </q-date>
							          	</q-popup-proxy>
							        </q-icon>
						      	</template>

						      	<template v-slot:append>
							        <q-icon name="access_time" class="cursor-pointer">
							          	<q-popup-proxy transition-show="scale" transition-hide="scale">
								            <q-time v-model="event.end_date" mask="YYYY-MM-DD HH:mm" format24h>
								              	<div class="row items-center justify-end">
								                	<q-btn v-close-popup label="Close" color="primary" flat />
								              	</div>
								            </q-time>
							          	</q-popup-proxy>
							        </q-icon>
						      	</template>
						    </q-input>
						</div>

						<div class="col-12  q-gutter-md">
							<q-input
						      	v-model="event.summary"
						      	filled
						      	label="Summary"
						      	type="textarea"
						      	lazy-rules
								:rules="[ val => val !== null && val !== '' || 'Please type event summary']"
						  	/>
						</div>

						<div class="col-8"></div>
						<div class="col-4 justify-end">
							<q-btn flat label="Cancel" color="light-blue" @click="cancel"/>
							<q-btn 	flat
									v-if="edit"
									label="Edit"
									:loading="submitLoading"
									color="light-blue"
									class="float-right"
									type="submit">
								<template v-slot:loading>
						        	<q-spinner-pie class="on-center" color="positive" size="1em" />
						      	</template>
							</q-btn>
							<q-btn 	flat
									v-else
									:loading="submitLoading"
									label="Create"
									class="float-right"
									color="light-blue"
									type="submit">
								<template v-slot:loading>
						        	<q-spinner-pie class="on-center" color="positive" size="1em" />
						      	</template>
						    </q-btn>
						</div>
					</q-form>
				</q-card-section>
			</q-card>
		</q-dialog>
  	</q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
	name: 'Event',
	mounted() {
		this.$axios.get('http://localhost:3000/event.php').then(res => {
			this.loading = false;
			this.events = res.data.events
		}).catch(err => {
			console.log(err.message)
		})
	},
	data() {
		return {
			loading:true,
			events: [],
			tasks: [],
			eventTableColumns: [
				{ name: 'summary', label: 'Summary',  align: 'left', field: 'summary', sortable: true},
				{ name: 'start_date', label: 'Start Date', field: 'start_date',  align: 'left', sortable: true },
				{ name: 'end_date', label: 'End Date',  align: 'left', field: 'end_date', sortable: true},
				{ name: 'actions', label: 'Actions',  align: 'center', field: 'actions' },
			],
			confirm: false,
			event: {start_date: null, end_date: null, summary: null, id:null},
			edit:false,
			submitLoading: false,
			deleteLoading: false
		}
	},
	methods: {
		addEvent() {
			this.confirm =  true
			this.event =  {start_date: null, end_date: null, summary: null, id:null}
			this.edit = false
		},
		addTask() {

		},
		onSubmit() {

			this.submitLoading = true
			this.$axios.get('http://localhost:3000/event.php', {
				params: {
					event: this.event
				}
			}).then(res => {
				this.submitLoading = false;
				this.events = res.data.events
				this.confirm = false
			})
		},
		cancel() {
			this.event = {start_date: null, end_date: null, summary: null, id:null}
			this.confirm = false
			this.edit = false
		},
		editItem(row) {
			this.event = row
			this.edit = true
			this.confirm = true
		},
		deleteItem(row) {
			this.deleteLoading = true
			this.$axios.get('http://localhost:3000/event.php', {
				params: {
					id: row.id
				}
			}).then(res => {
				this.deleteLoading = false
				this.events = res.data.events
			})
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
