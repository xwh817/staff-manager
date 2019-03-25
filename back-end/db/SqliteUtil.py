# -*- coding:utf-8 -*-

import sqlite3, json

db_name = 'staff_manager'

conn = sqlite3.connect(db_name + '.db', check_same_thread=False)
cursor = conn.cursor()

def createTables():
    sql_create_t_job = 'create table IF NOT EXISTS t_job(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(40) NOT NULL)'
    sql_create_t_staff = '''create table IF NOT EXISTS t_staff(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(40) NOT NULL,
    job INTEGER NOT NULL,
    company VARCHAR(100),
    education SMALLINT,
    gender CHAR(2),
    birth_year SMALLINT,
    hometown VARCHAR(40),
    marriage BOOLEAN, 
    phone VARCHAR(20),
    email VARCHAR(100),
    qq VARCHAR(20),
    wechat VARCHAR(20),
    experience TEXT,
    contact_logs TEXT,
    create_time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
    modify_time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime'))
    )'''

    #cursor.execute("drop trigger trigger_auto_timestamp")

    sql_create_trigger_timestamp = '''CREATE TRIGGER IF NOT EXISTS trigger_auto_timestamp 
    AFTER UPDATE ON t_staff
    FOR EACH ROW
    BEGIN
        update t_staff set modify_time=datetime('now','localtime') WHERE id = old.id;
    END;
    '''

    cursor.execute(sql_create_t_job)
    cursor.execute(sql_create_t_staff)
    cursor.execute(sql_create_trigger_timestamp)




createTables()




def getJobList():
  tableName = 't_job'

  sql = "select id, name from %s" % (tableName)
  print(sql)

  cursor.execute(sql)

  listAll = cursor.fetchall()     # fetchall() 获取所有记录
  jobs = []
  for item in listAll:
    job = {
      'id':item[0],
      'name':item[1]
    }
    jobs.append(job)

  json_str = json.dumps(jobs)
  print(json_str)

  return json_str


def addOrUpdateJob(json_str):
  try:
    job = json.loads(json_str)
    id = job.get('id', 0)
    name = job.get('name', '')
    result = ''

    if id == 0:  # 新增
      sql = "insert into t_job (name) VALUES ('%s')" % (name)
      #values = (name)
      print(sql)
      cursor.execute(sql)
      result = '添加成功'
      print(cursor.rowcount, result)
    else:   # 修改
      sql = "update t_job set name='%s' where id=%d" % (name, id)
      print(sql)
      cursor.execute(sql)
      result = '更新成功'
      print(cursor.rowcount, result)

    conn.commit()
    re = {
      'code':0,
      'message':result
    }
    return json.dumps(re)
  except Exception as e:
    re = {
      'code':-1,
      'message':str(e)
    }
    print(str)
    return json.dumps(re)



def deleteJob(id):
  try:
    sql = "delete from t_job where id=%d" % (id)
    print(sql)
    cursor.execute(sql)
    conn.commit()
    re = {
      'code':0,
      'message':'删除成功'
    }
    return json.dumps(re)
  except Exception as e:
    re = {
      'code':-1,
      'message':str(e)
    }
    return json.dumps(re)
  



def addOrUpdateStaff(json_str):
  try:
    print(json_str)
    staff = json.loads(json_str)
    id = staff.get('id', 0)
    result = ''

    if id == 0:  # 新增
      values = (
        staff.get('name', ''),
        staff.get('job', 0),
        staff.get('company', ''),
        staff.get('education', 0),
        staff.get('gender', ''),
        staff.get('birth_year', 0),
        staff.get('hometown', ''),
        staff.get('marriage', 0),
        staff.get('phone', ''),
        staff.get('email', ''),
        staff.get('qq', ''),
        staff.get('wechat', ''),
        staff.get('experience', ''),
        staff.get('contact_logs', '')
      )

      sql = "INSERT INTO t_staff (name, job, company, education, gender, birth_year, hometown, marriage, phone, email, qq, wechat, experience, contact_logs) VALUES %s" % (values.__str__())
      print(sql)
      cursor.execute(sql)
      result = '添加成功'
      print(result,"ID:", cursor.lastrowid)
    else:   # 修改
      update = ''
      isFirst = True
      for key, value in staff.items():
        if key == 'id':
          continue
        if isFirst:
          isFirst = False
        else:
          update += ","
        if isinstance(value, str):
          update += (key + "='" +value + "'")
        else:
          update += (key + "=" +str(value))
        
      where = "where id=" + str(id)
      sql = "update t_staff set %s %s" % (update, where)
      print(sql)
      cursor.execute(sql)
      result = '更新成功'
      print(cursor.rowcount, result)

    conn.commit()
    re = {
      'code':0,
      'message':result
    }
    return json.dumps(re)
  except Exception as e:
    re = {
      'code':-1,
      'message':str(e)
    }
    return json.dumps(re)


def deleteStaff(id):
  try:
    sql = "delete from t_staff where id=%d" % (id)
    print(sql)
    cursor.execute(sql)
    conn.commit()
    re = {
      'code':0,
      'message':'删除成功'
    }
    return json.dumps(re)
  except Exception as e:
    re = {
      'code':-1,
      'message':str(e)
    }
    return json.dumps(re)
  

def getJsonStaffsFromDB(dateList):
  columns = ('id','name', 'job', 'company', 'education', 'gender', 'birth_year', 
  'hometown', 'marriage', 'phone', 'email', 'qq', 'wechat', 'experience', 'contact_logs')

  staffs = []
  for item in dateList:
    staff = {}
    for index, column in enumerate(columns):
      staff[column] = item[index]
    staffs.append(staff)

  json_str = json.dumps(staffs)
  return json_str  
  

def getStaffList(job):
  tableName = 't_staff'
  where = ''

  if job > 0:
      where = ' where job=%d' % (job)

  order = ' order by id desc'
  sql = "select * from %s%s%s" % (tableName, where, order)
  print(sql)

  cursor.execute(sql)

  dateList = cursor.fetchall()     # fetchall() 获取所有记录

  #json_str = json.dumps(getFormatData(tableName, dateList))
  json_str = getJsonStaffsFromDB(dateList)
  print(json_str)

  return json_str


def searchStaff(where):
  try:
    sql_where = ''
    isFirst = True
    for key,value in where.items():
      if value and len(value.strip()) > 0:
        if isFirst:
          sql_where += ' where '
          isFirst = False
        else:
          sql_where += ' or '

        sql_where += (key + " like '%"+value+"%'")

    order = ' order by id desc'
    sql = "select * from t_staff %s%s" % (sql_where, order)
    print(sql)

    cursor.execute(sql)

    dateList = cursor.fetchall()     # fetchall() 获取所有记录

    #json_str = json.dumps(getFormatData(tableName, dateList))
    json_str = getJsonStaffsFromDB(dateList)
    print(json_str)

    return json_str
  except Exception as e:
    print(str(e))
    return '[]'




def insertTestData():
    json_update = '{"education": 3, "experience": "\u300c\u6b66\u5f53\u4e03\u4fa0\u300d\u4e4b\u5e08\uff0c\u5176\u88ab\u63a8\u4e3a\u300c\u5929\u4e0b\u7b2c\u4e00\u9ad8\u624b\u300d\uff0c\u4e43\u540d\u626c\u5929\u4e0b\u7684\u4e00\u4ee3\u6b66\u5b66\u5927\u5e08\u3002", "phone": "13760798503", "qq": "969853979", "name": "\u5f20\u4e09\u4e30", "job": 1, "marriage": 0, "id": 3, "gender": "\u7537", "email": "testemail@163.com", "hometown": "\u6e56\u5317", "company": "\u6b66\u5f53\u6d3e", "contact_logs": "\u9664\u4e03\u4e2a\u5165\u5ba4\u5f1f\u5b50\u5916\uff0c\u95e8\u4eba\u53ef\u8c13\u6843\u674e\u5929\u4e0b\uff0c\u4ee5\u5929\u8d4b\u5353\u7edd\uff0c\u609f\u6027\u8d85\u7136\u81ea\u521b\u6b66\u5f53\u6d3e\uff0c\u540c\u6b66\u6797\u95e8\u6237\u300c\u5c11\u6797\u6d3e\u300d\u5206\u5ead\u6297\u793c\u3002\u5176\u4e3a\u4eba\u6b63\u6c14\u51db\u7136\uff0c\u5bbd\u548c\u4ece\u5bb9\uff0c\u9887\u6709\u4ed9\u98ce\u9053\u9aa8\u4e4b\u59ff\uff0c\u5176\u662f\u5f53\u4e16\u65e0\u51fa\u5176\u53f3\u7684\u6b66\u5b66\u5947\u624d\u3002\u767e\u5c81\u4e4b\u65f6\u81ea\u521b\u300c\u592a\u6781\u62f3\u300d\u3001\u300c\u592a\u6781\u5251\u300d\uff0c\u5c06\u300c\u6b66\u5f53\u6d3e\u300d\u53d1\u626c\u5149\u5927\uff0c\u5a01\u540d\u8fdc\u626c\u6b66\u6797\u8c6a\u6770\u65e0\u4e0d\u62dc\u670d\u3002", "birth_year": 87, "wechat": ""}'
    json_add = '{"education": 3, "experience": "\u300c\u6b66\u5f53\u4e03\u4fa0\u300d\u4e4b\u5e08\uff0c\u5176\u88ab\u63a8\u4e3a\u300c\u5929\u4e0b\u7b2c\u4e00\u9ad8\u624b\u300d\uff0c\u4e43\u540d\u626c\u5929\u4e0b\u7684\u4e00\u4ee3\u6b66\u5b66\u5927\u5e08\u3002", "phone": "888666", "qq": "540311360", "name": "\u5f20\u4e09\u4e30", "job": 1, "marriage": 0, "gender": "\u7537", "email": "testemail@163.com", "hometown": "\u6e56\u5317", "company": "\u6b66\u5f53\u6d3e", "contact_logs": "\u9664\u4e03\u4e2a\u5165\u5ba4\u5f1f\u5b50\u5916\uff0c\u95e8\u4eba\u53ef\u8c13\u6843\u674e\u5929\u4e0b\uff0c\u4ee5\u5929\u8d4b\u5353\u7edd\uff0c\u609f\u6027\u8d85\u7136\u81ea\u521b\u6b66\u5f53\u6d3e\uff0c\u540c\u6b66\u6797\u95e8\u6237\u300c\u5c11\u6797\u6d3e\u300d\u5206\u5ead\u6297\u793c\u3002\u5176\u4e3a\u4eba\u6b63\u6c14\u51db\u7136\uff0c\u5bbd\u548c\u4ece\u5bb9\uff0c\u9887\u6709\u4ed9\u98ce\u9053\u9aa8\u4e4b\u59ff\uff0c\u5176\u662f\u5f53\u4e16\u65e0\u51fa\u5176\u53f3\u7684\u6b66\u5b66\u5947\u624d\u3002\u767e\u5c81\u4e4b\u65f6\u81ea\u521b\u300c\u592a\u6781\u62f3\u300d\u3001\u300c\u592a\u6781\u5251\u300d\uff0c\u5c06\u300c\u6b66\u5f53\u6d3e\u300d\u53d1\u626c\u5149\u5927\uff0c\u5a01\u540d\u8fdc\u626c\u6b66\u6797\u8c6a\u6770\u65e0\u4e0d\u62dc\u670d\u3002", "birth_year": 87, "wechat": "445566"}'
    addOrUpdateStaff(json_update)




#addOrUpdateJob('{"name": "test23", "index": 8}')
#addOrUpdateJob('{"name": "test23", "id": 8, "index": 8}')
#getJobList()

#insertTestData()
 
#getStaffList(0)





