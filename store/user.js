export const state = () => ({
    token: ""
})

export const mutations = {
    setToken(state, data){
        state.token = data;
    }
}
