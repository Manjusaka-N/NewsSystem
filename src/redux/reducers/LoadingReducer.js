export const LoadingReducer = (preState={
    isLoading:false
},action)=>{
    const {type}= action
    switch (type) {
        case 'change loading':
            const newState = {...preState}
            newState.isLoading = !newState.isLoading
            return newState
        default:
            return preState;
    }
}