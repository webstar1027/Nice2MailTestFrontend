<template>
  <q-page>
	<div class="q-pa-md">
		<div class="row justify-center" v-if="loading" style="position: absolute; top: 45%; left: 50%;">
			<q-spinner-bars
			  color="primary"
			  size="4em"
			/>
		</div>
		<div class="row items-center" v-else>
			<div class="col-12">
				<div class="row justify-end">
					<div class="col-5">
						<q-uploader
							ref="uploader"
							:factory="uploadFile"
							color="teal"
							flat
							bordered
							max-files="1"
							style="max-width: 300px"
							@rejected="onRejected"
							@failed="failUpload"
						/>
					</div>
				</div>
				<div class="row justify-center items-center">
					<div class="col-10 table-content">
						<q-table	v-if="!!files"
									title="Google Drive Files"
									:data="files"
									:columns="fileTableColumns"
									row-key="name"
									binary-state-sort>
							<template v-slot:body="props">
								<q-tr :props="props">
									<q-td key="name" :props="props"> {{ props.row.name }} </q-td>
									<q-td key="actions" :props="props">
									<q-btn color="green" label="Share" @click="shareFile(props.row)" size=sm no-caps></q-btn>
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

	<q-dialog v-model="share" persistent>
		<q-card  style="width: 600px; max-width: 80vw;">
			<q-card-section class="row items-center">
				<q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
				<h5 class="q-ml-sm">Share Drive File</h5>
			</q-card-section>

			<q-card-section>
				<q-form  @submit="shareToUser" class="row items-center justify-center">
					<div class="col-8 q-gutter-md">
						<q-field borderless label="Google Drive File Name" stack-label>
							<template v-slot:control>
								<div class="justify-center" tabindex="0">{{ file.name }}</div>
							</template>
						</q-field>
					</div>

					<div class="col-8  q-gutter-md">
						<q-input   	v-model="email"
									filled
									label="Please type user email to be sent file"
									lazy-rules
									:rules="[ 
										v => !!v || 'E-mail is required',
										v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
									]"
						/>
					</div>

					<div class="col-8"></div>
					<div class="col-4 justify-end">
						<q-btn flat label="Cancel" color="light-blue" @click="cancel"/>
						
						<q-btn 	flat
								:loading="submitLoading"
								label="Share"
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
	name: 'Drive',
	data() {
		return {
			loading: false,
			email: null,
			files: [],
			fileTableColumns: [
				{ name: 'name', label: 'File Name',  align: 'left', field: 'name', sortable: true},
				{ name: 'actions', label: 'Actions',  align: 'center', field: 'actions' },
			],
			share: false,
			file: {id:null, name:null},
			submitLoading: false
		}
	},
	mounted() {
		this.loading = true
		this.$axios.post('http://localhost:3000/drive.php').then(res => {
			this.loading = false;
			this.files = res.data.files
		}).catch(err => {
			console.log(err.message)
		})
	},
	methods: {
		shareFile(row) {
			this.share = true
			this.file = row
		},
		deleteItem(row) {
			console.log(row.id)
			this.$axios.get('http://localhost:3000/drive.php', {
				params: {
					deleteId:row.id
				}
			}).then(res => {
				this.files = res.data.files
			})
		},
		cancel() {
			this.share = false
			this.file = { id:null, name:null }
		},
		shareToUser() {
			this.submitLoading = true;
			this.$axios.get('http://localhost:3000/drive.php', {
				params: {
					id: this.file.id,
					email: this.email
				}
			}).then(res => {
				this.submitLoading = false
				this.files = res.data.files
				this.share = false
			}).catch(err => {
				console.log(err.message)
			})
		},
		onRejected(rejectedEntries) {
			this.$q.notify({
				type: 'negative',
				message: `${rejectedEntries.length} file(s) did not pass validation constraints`
			})
		},
		failUpload(info) {
			console.log(info)
		},
		uploadFile(file, updateProgress) {
			const data = new FormData()
			data.append('file', file[0])
			this.$axios.post('http://localhost:3000/drive.php',
		  		data)
		  	.then(res => {
		  		this.$q.notify({
		          	type: 'possitive',
		          	message: `Image Uploaded`
		        })
		  		this.$refs.uploader.reset()
		  	})
		  	.catch(err => console.log(err))
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
