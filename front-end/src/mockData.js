import Mock from 'mockjs'
import ApiUtil from './Utils/ApiUtil'


/* Mock.mock(ApiUtil.API_JOB_LIST,
    {
        'list|8':[{
            'id+1':1,
            'name':'test'
        }]
    }
); */

Mock.mock(ApiUtil.API_STAFF_LIST+"0",
    '[{"phone": "asdfasd", "gender": "", "education": 3, "wechat": "asdfasdfa", "hometown": "asdfa", "experience": "asdfasd\nasdfas\nasdfas", "name": "test", "birth_year": 90, "email": "asdfasdf", "qq": "asdfasdfasdf", "id": 14, "contact_logs": "12341234\n132\n4134\n134", "modify_time": "2019-03-23 14:19:28", "job": 3, "marriage": 0, "company": "1341234", "create_time": "2019-03-23 14:19:28"}, {"phone": "11341234", "gender": "", "education": 2, "wechat": "12342134", "hometown": "\u6e56\u5317\u6b66\u6c49", "experience": "1234\n1234\n12341234", "name": "xwh817", "birth_year": 89, "email": "13241234", "qq": "12341234", "id": 8, "contact_logs": "tesatsat", "modify_time": "2019-03-23 01:26:05", "job": 3, "marriage": 0, "company": "asdfasdfas", "create_time": "2019-03-23 01:26:05"}, {"phone": "11341234", "gender": "", "education": 2, "wechat": "12342134", "hometown": "\u6e56\u5317\u6b66\u6c49", "experience": "1234\n1234\n12341234", "name": "xwh817", "birth_year": 89, "email": "13241234", "qq": "12341234", "id": 7, "contact_logs": "43563456\n3456\n346", "modify_time": "2019-03-23 01:25:23", "job": 3, "marriage": 0, "company": "asdfasdfas", "create_time": "2019-03-23 01:25:23"}]'
);

Mock.mock(ApiUtil.API_JOB_LIST,
    '[{"id": 1, "name": "Web\u524d\u7aef"}, {"id": 2, "name": "Java\u540e\u53f0"}, {"id": 3, "name": "Andorid"}, {"id": 4, "name": "IOS"}, {"id": 5, "name": "\u6d4b\u8bd5"}]'
);

Mock.mock(ApiUtil.API_STAFF_LIST+"0",
    '[{"phone": "asdfasd", "gender": "", "education": 3, "wechat": "asdfasdfa", "hometown": "asdfa", "experience": "asdfasd\nasdfas\nasdfas", "name": "test", "birth_year": 90, "email": "asdfasdf", "qq": "asdfasdfasdf", "id": 14, "contact_logs": "12341234\n132\n4134\n134", "modify_time": "2019-03-23 14:19:28", "job": 3, "marriage": 0, "company": "1341234", "create_time": "2019-03-23 14:19:28"}, {"phone": "11341234", "gender": "", "education": 2, "wechat": "12342134", "hometown": "\u6e56\u5317\u6b66\u6c49", "experience": "1234\n1234\n12341234", "name": "xwh817", "birth_year": 89, "email": "13241234", "qq": "12341234", "id": 8, "contact_logs": "tesatsat", "modify_time": "2019-03-23 01:26:05", "job": 3, "marriage": 0, "company": "asdfasdfas", "create_time": "2019-03-23 01:26:05"}, {"phone": "11341234", "gender": "", "education": 2, "wechat": "12342134", "hometown": "\u6e56\u5317\u6b66\u6c49", "experience": "1234\n1234\n12341234", "name": "xwh817", "birth_year": 89, "email": "13241234", "qq": "12341234", "id": 7, "contact_logs": "43563456\n3456\n346", "modify_time": "2019-03-23 01:25:23", "job": 3, "marriage": 0, "company": "asdfasdfas", "create_time": "2019-03-23 01:25:23"}]'
);
