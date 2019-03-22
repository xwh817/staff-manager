
/**
 * 对api访问地址进行管理
 */
export default class ApiUtil {
    static URL_ROOT = 'http://127.0.0.1:5000/api/';
    static API_VERSION = 'v1';

    static API_GET_STAFF_LIST = ApiUtil.URL_ROOT + ApiUtil.API_VERSION + '/getStaffList/';
}