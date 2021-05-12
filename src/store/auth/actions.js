export function setCurrentUser (context, payload) {
    context.commit('setCurrentUser', payload)
}

export function setUserProfile(context, payload) {
	context.commit('setUserProfile', payload)
}