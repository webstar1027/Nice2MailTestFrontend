<template>
    <q-page class="bg-light-green window-height window-width row justify-center items-center">
        <div class="column">
        <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
            <q-card-section>
                <q-form class="q-gutter-md">
                <q-input square filled clearable v-model="email" type="email" label="email" />
                <q-input square filled clearable v-model="password" type="password" label="password" />
                </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
                <q-btn unelevated color="light-green-7" size="lg" class="full-width" label="Login" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
                <div class="q-mt-xl">
                <q-btn
                    color="primary" glossy push class="full-width"
                    icon="fab fa-facebook-f" label="Login with Google"
                    size="md" @click="login('google')" >
                </q-btn>
                </div>
            </q-card-section>
            </q-card>
        </div>
        </div>
    </q-page>
</template>

<script>
export default {
    name: 'Login',
    data () {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login(provider) {
            const authUser = await this.$gAuth.signIn()
            const basicProfile = authUser.getAuthResponse()
            this.$store.dispatch('auth/setCurrentUser', authUser.getBasicProfile())
            this.$store.dispatch('auth/setUserProfile', authUser.getAuthResponse())
            this.$router.push('/dashboard')            
        },
    }
}

/**
 * @param  {Object} options
 * @return {Window}
 */
function openWindow (url, title, options = {}) {
	if (typeof url === 'object') {
		options = url
		url = ''
	}

	options = { url, title, width: 600, height: 720, ...options }

	const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
	const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top
	const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width
	const height = window.innerHeight || document.documentElement.clientHeight || window.screen.height

	options.left = ((width / 2) - (options.width / 2)) + dualScreenLeft
	options.top = ((height / 2) - (options.height / 2)) + dualScreenTop

	const optionsStr = Object.keys(options).reduce((acc, key) => {
		acc.push(`${key}=${options[key]}`)
		return acc
	}, []).join(',')

	const newWindow = window.open(url, title, optionsStr)

	if (window.focus) {
		newWindow.focus()
	}

	return newWindow
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
