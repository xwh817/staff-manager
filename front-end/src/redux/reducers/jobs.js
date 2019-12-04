
const initialState = {
    loading:false,
    jobs:[],
    message:''
}


/**
 * reducer是一个纯函数，根据action返回新的状态
 * 跟踪源代码可知，这里的参数state由redux.js传入currentState，也就是上一次return的state
 * currentState = currentReducer(currentState, action);
 */
export default function(state = initialState, action) {
    switch (action.type) {
        case 'get_jobs_start': {
            return {...state, loading:true, message:''}
        }
        case 'get_jobs_success': {
            var data = action.payload;
            data.map((item, index) => {
                item.index = index + 1;
                return item;
            });
            return {...state, loading:false, jobs:data, message:''}
        }
        case 'get_jobs_fail': {
            return {...state, loading:false, message: action.payload}
        }
        case 'update_jobs_success': {
            var others = state.jobs.filter(item => item.id !== action.payload.id)
            return {...state, loading:false, jobs:[...others, action.payload], message:action.payload}
        }
        default:
            return state;
    }
}