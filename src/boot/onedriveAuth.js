// import something here
import Vue from 'vue';
import OneDriveAuth  from 'onedrive-auth'

var onedrive = new OneDriveAuth({
  clientId: 'dccaf584-2eae-4aba-bb56-725ab38087f3',
  scopes: 'files.read files.read.all files.readwrite files.readwrite.all offline_access wl.signin',
  redirectUri: 'http://localhost:8080',
})

Vue.prototype.$onedrive = onedrive
