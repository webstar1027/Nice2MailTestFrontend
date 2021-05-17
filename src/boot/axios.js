import Vue from 'vue'
import axios from 'axios'

export default ({ app, router, store, Vue }) => {
    axios.interceptors.request.use(request => {
        const token = store.getters['auth/getToken']
        if (token) {
            request.headers.common.Authorization = `Bearer ${token}`
        }
        return request
    })

    Vue.prototype.$axios = axios
}