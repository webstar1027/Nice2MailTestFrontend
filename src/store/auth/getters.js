export function getCurrentUser(state) {
	return state.currentUser
}

export function getAuthenticatedUserProfile(state) {
	return state.userProfile
}

export function getToken(state) {
	return state.token
}

export function isAuthenticated(state) {
	return state.currentUser !== null
}