import Vue from 'vue';
import GAuth from 'vue-google-oauth2'

const gauthOption = {
clientId: '290880609641-uiokj73etdah9h0fllkatjf4j8gii0hn.apps.googleusercontent.com',
scope: 'https://www.googleapis.com/auth/contacts',
prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
