
const initialState = {
    jobs:[]
}


/**
 * reducer是一个纯函数，根据action返回新的状态
 * 跟踪源代码可知，这里的参数state由redux.js传入currentState，也就是上一次return的state
 * currentState = currentReducer(currentState, action);
 */
export default function(state = initialState, action) {
    switch (action.type) {
        case 'getJobs': {
            return {...state}
        }
        default:
            return state;
    }
}