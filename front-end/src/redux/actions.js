import ApiUtil from '../Utils/ApiUtil'
import HttpUtil from '../Utils/HttpUtil'
/**
 * 将action抽取出来
 * action名字 => funciton调用
 */


export const getJobs = () => (dispatch, getState) => {
    dispatch({
        type: 'get_jobs_start',
    });
    //先去请求数据
    HttpUtil.get(ApiUtil.API_JOB_LIST)
        .then(
            jobList => {
                //请求数据完成后再dispatch
                dispatch({
                    type: 'get_jobs_success',
                    payload: jobList
                })
            }
        )
        .catch(e => {
            console.log(e)
            dispatch({
                type: 'get_jobs_fail',
                payload: e
            })
        })
};



export const updateJob = (job) => (dispatch, getState) => {
    HttpUtil.post(ApiUtil.API_JOB_UPDATE, job)
        .then(
            re => {
                dispatch({
                    type: 'update_jobs_success',
                    payload: job
                })
            }
        )
        .catch(e => {
            console.log(e)
            dispatch({
                type: 'action_jobs_fail',
                payload: e
            })
        })
};


export const addJob = () => ({ type: 'addJob' });
