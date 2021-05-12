export function setCurrentUser(state, user) {
    state.currentUser = user
}

export function setUserProfile(state, profile) {
    state.userProfile = profile
    state.token = profile.access_token
}