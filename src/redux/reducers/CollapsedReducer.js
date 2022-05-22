export const CollapsedReducer = (preState={
    isCollapsed:false
},action)=>{
    const {type}= action
    switch (type) {
        case 'change collapsed':
            const newState = {...preState}
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return preState;
    }
}