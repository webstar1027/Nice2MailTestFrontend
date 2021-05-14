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
							<q-btn :ripple="false" color="green" label="Add Task" @click="addTask" no-caps />
						</div>
					</div>
					<div class="row justify-center items-center">
						
						<div class="col-10 table-content">
							<q-table
							  v-if="!!tasks"
							  title="Google Calendar Task"
							  :data="tasks"
							  :columns="taskTableColumns"
							  row-key="name"
							  binary-state-sort
							>
								<template v-slot:body="props">
									<q-tr :props="props">
										<q-td key="title" :props="props"> {{ props.row.title }} </q-td>
										<q-td key="notes" :props="props"> {{ props.row.notes }}</q-td>
										<q-td key="due" :props="props"> {{ props.row.due }}</q-td>
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
					<h5 class="q-ml-sm">Create Google Calendar Task</h5>
				</q-card-section>

				<q-card-section>
					<q-form  @submit="onSubmit" class="row items-center justify-center">
						<div class="col-8 q-gutter-md" style="margin-bottom: 15px;">
							<q-select
						        filled
						        v-model="task.listId"
						        :options="tasklists"
						        label="Task Category"
						        emit-value
        						map-options
						     />
						</div>

						<div class="col-8  q-gutter-md">
							<q-input
						      	v-model="task.title"
						      	filled
						      	label="Title"
						      	lazy-rules
								:rules="[ val => val !== null && val !== '' || 'Please type task title']"
						  	/>
						</div>

						<div class="col-8 q-gutter-md">
							<q-input 	filled 
									 	v-model="task.due" 
									 	label="Due Date"
									 	lazy-rules
										:rules="[ val => val && val.length > 0 || 'Please select due date time']">
						      	<template v-slot:prepend>
							        <q-icon name="event" class="cursor-pointer">
							          	<q-popup-proxy transition-show="scale" transition-hide="scale">
								            <q-date v-model="task.due" mask="YYYY-MM-DD">
								              	<div class="row items-center justify-end">
								                	<q-btn v-close-popup label="Close" color="primary" flat />
								              	</div>
								            </q-date>
							          	</q-popup-proxy>
							        </q-icon>
						      	</template>
						    </q-input>
						</div>					

						<div class="col-8  q-gutter-md">
							<q-input
						      	v-model="task.notes"
						      	filled
						      	label="Notes"
						      	type="textarea"
						      	lazy-rules
								:rules="[ val => val !== null && val !== '' || 'Please type task notes']"
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
	name: 'Task',
	mounted() {
		this.$axios.get('http://localhost:3000/task.php').then(res => {
			console.log(res.data)
			this.loading = false;
			this.tasks = res.data.tasks
			this.tasklists = res.data.lists
		}).catch(err => {
			console.log(err.message)
		})
	},
	data() {
		return {
			loading:true,
			tasks: [],
			tasklists: [],
			taskTableColumns: [
				{ name: 'title', label: 'Title',  align: 'left', field: 'title', sortable: true},
				{ name: 'notes', label: 'Notes',  align: 'left', field: 'notes', sortable: true},
				{ name: 'due', label: 'Due Date',  align: 'left', field: 'due', sortable: true},
				{ name: 'actions', label: 'Actions',  align: 'center', field: 'actions' },
			],
			confirm: false,
			task: {title: null, update: null, id:null},
			edit:false,
			submitLoading: false,
		}
	},
	methods: {
		addTask() {
			this.confirm =  true
			this.task =  {listId:null, title: null, due:null, notes: null, id:null}
			this.edit = false
		},
		onSubmit() {
			this.submitLoading = true
			this.$axios.get('http://localhost:3000/task.php', {
				params: {
					task: {
						listId: this.task.listId,
						id: this.task.id,
						title: this.task.title,
						notes: this.task.notes,
						due:  (new Date(this.task.due)).toISOString(),
					}
				}
			}).then(res => {
				this.submitLoading = false;
				this.tasks = res.data.tasks
				this.confirm = false
			})
		},
		cancel() {
			this.task = {listId:null, title: null, due:null, notes: null, id:null}
			this.confirm = false
			this.edit = false
		},
		editItem(row) {
			this.task = row
			this.edit = true
			this.confirm = true
		},
		deleteItem(row) {
			this.$axios.get('http://localhost:3000/task.php', {
				params: {
					id: row.id,
					listId: row.listId
				}
			}).then(res => {
				this.tasks = res.data.tasks
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
