
/**
 * 对api访问地址进行管理
 */
export default class ApiUtil {
    static URL_IP = 'http://127.0.0.1:5000';
    static URL_ROOT = '/api/v1';

    static API_STAFF_LIST = ApiUtil.URL_ROOT + '/getStaffList/';
    static API_STAFF_UPDATE = ApiUtil.URL_ROOT + '/updateStaff';
    static API_STAFF_DELETE = ApiUtil.URL_ROOT + '/deleteStaff/';
    static API_STAFF_SEARCH = ApiUtil.URL_ROOT + '/searchStaff';


    static API_JOB_LIST = ApiUtil.URL_ROOT + '/getJobList';
    static API_JOB_UPDATE = ApiUtil.URL_ROOT + '/updateJob';
    static API_JOB_DELETE = ApiUtil.URL_ROOT + '/deleteJob/';

    static API_FILE_UPLOAD = ApiUtil.URL_ROOT + '/fileUpload';
    static API_FILE_DELETE = ApiUtil.URL_ROOT + '/fileDelete';
    static API_FILE_DELETE_DIR = ApiUtil.URL_ROOT + '/fileDeleteDir/';
    static API_FILE_GET = ApiUtil.URL_ROOT + '/fileGet';
    static API_FILE_GET_LIST = ApiUtil.URL_ROOT + '/fileGetList/';
    static API_FILE_BACKUP = ApiUtil.URL_ROOT + '/fileBackup';
    static API_FILE_GET_BACKUP = ApiUtil.URL_ROOT + '/fileGetBackup';

}