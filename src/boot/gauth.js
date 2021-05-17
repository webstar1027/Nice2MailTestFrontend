import Vue from 'vue';
import GAuth from 'vue-google-oauth2'

const gauthOption = {
	clientId: '290880609641-uiokj73etdah9h0fllkatjf4j8gii0hn.apps.googleusercontent.com',
	scope: 'https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/drive',
	prompt: 'select_account'
}

Vue.use(GAuth, gauthOption)

