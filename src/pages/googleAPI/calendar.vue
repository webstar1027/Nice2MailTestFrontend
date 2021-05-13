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
						<div class="col-2">
							<q-btn :ripple="false" color="red" label="Add Task" @click="addTask" no-caps />
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
										<q-td key="summary" :props="props">{{props.row.summary}}</q-td>
										<q-td key="start_date" :props="props">{{props.row.start_date}}</q-td>
										<q-td key="end_date" :props="props">{{props.row.end_date}}</q-td>
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

				<q-card-section class="row items-center justify-center">
					<div class="col-6 q-gutter-md" style="margin-right: 10px; ">
						<q-input filled v-model="event.start_date" label="Event Start">
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
					    <q-input filled v-model="event.end_date" label="Event End">
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
				</q-card-section>

				<q-card-section class="row justify-center">
					<div class="col-12  q-gutter-md">
						<q-input
					      v-model="event.summary"
					      filled
					      label="Summary"
					      type="textarea"
					    />
					</div>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn flat label="Cancel" color="primary" v-close-popup />
					<q-btn flat label="Save" color="primary" @click="onSubmit" v-close-popup />
				</q-card-actions>
			</q-card>
		</q-dialog>
  	</q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
	name: 'Calendar',
	mounted() {
		this.$axios.get('http://localhost:3000/calendar.php').then(res => {
			console.log(res.data.events)
			this.loading = false;
			this.events = res.data.events
			// this.tasks = res.data.tasks
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
			],
			confirm: false,
			event: {
				start_date: '',
				end_date: '',
				summary: ''
			},
		}
	},
	methods: {
		addEvent() {
			this.confirm =  true
			this.event =  {start_date: '', end_date: '', summary: ''}
		},
		addTask() {

		},
		onSubmit() {
			this.$axios.get('http://localhost:3000/calendar.php', {
				params: {
					event: this.event
				}
			}).then(res => {
				console.log(res.data.events)
				// this.loading = false;
				this.events = res.data.events
				// this.tasks = res.data.tasks
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
