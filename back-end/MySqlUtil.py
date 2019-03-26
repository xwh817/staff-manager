# -*- coding:utf-8 -*-

import mysql.connector
import json

# 安装 mysql-connector：
# python -m pip install mysql-connector
 
database="staff_manager" 
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="1986817",
  database=database
)

mycursor = mydb.cursor()
 

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

      sql = "INSERT INTO t_staff (name, job, company, education, gender, birth_year, hometown, marriage, phone, email, qq, wechat, experience, contact_logs) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
      print(sql)
      mycursor.execute(sql, values)
      result = '添加成功'
      print(result,"ID:", mycursor.lastrowid)
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
      mycursor.execute(sql)
      result = '更新成功'
      print(mycursor.rowcount, result)

    mydb.commit()
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
    mycursor.execute(sql)
    mydb.commit()
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

  mycursor.execute(sql)

  dateList = mycursor.fetchall()     # fetchall() 获取所有记录

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

    mycursor.execute(sql)

    dateList = mycursor.fetchall()     # fetchall() 获取所有记录

    #json_str = json.dumps(getFormatData(tableName, dateList))
    json_str = getJsonStaffsFromDB(dateList)
    print(json_str)

    return json_str
  except Exception as e:
    print(str(e))
    return '[]'

'''
  根据表结构将数据库查询到的结构转成json对象
  需要从columns表中查到表的字段名，
  注意order by ordinal_position保证返回的顺序和数据字段顺序一致
'''
def getFormatData(table, dateList):
  
  sql = "select column_name, column_type from information_schema.columns \
  where table_schema ='%s' and table_name = '%s' order by ordinal_position" % (database, table)
  
  mycursor.execute(sql)

  tableSchema = mycursor.fetchall()
  print('tableSchema: ' , tableSchema)

  formatData = []

  for item in dateList:
    staff = {}

    i = 0
    for columnName, columnType in tableSchema:
      if (columnType==b'timestamp' or columnType==b'datetime'):
      #if (columnType=='timestamp' or columnType=='datetime'):
        staff[columnName] = item[i].strftime('%Y-%m-%d %H:%M:%S')
      else:
        staff[columnName] = item[i]
      i+=1

    #print('item: ' , staff)
    formatData.append(staff)

  return formatData



def getJobList():
  tableName = 't_job'

  sql = "select id, name from %s" % (tableName)
  print(sql)

  mycursor.execute(sql)

  listAll = mycursor.fetchall()     # fetchall() 获取所有记录
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
      mycursor.execute(sql)
      result = '添加成功'
      print(mycursor.rowcount, result)
    else:   # 修改
      sql = "update t_job set name='%s' where id=%d" % (name, id)
      print(sql)
      mycursor.execute(sql)
      result = '更新成功'
      print(mycursor.rowcount, result)

    mydb.commit()
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
    mycursor.execute(sql)
    mydb.commit()
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
  




def insertTestData():
  #values = ('张三丰',1,'武当派',3,'男',87,'湖北',0,'13760798503','testemail@163.com','969853979','','「武当七侠」之师，其被推为「天下第一高手」，乃名扬天下的一代武学大师。','除七个入室弟子外，门人可谓桃李天下，以天赋卓绝，悟性超然自创武当派，同武林门户「少林派」分庭抗礼。其为人正气凛然，宽和从容，颇有仙风道骨之姿，其是当世无出其右的武学奇才。百岁之时自创「太极拳」、「太极剑」，将「武当派」发扬光大，威名远扬武林豪杰无不拜服。')
  
  json_update = '{"create_time": "2019-03-23 00:23:47", "eduion": 3, "experience": "\u300c\u6b66\u5f53\u4e03\u4fa0\u300d\u4e4b\u5e08\uff0c\u5176\u88ab\u63a8\u4e3a\u300c\u5929\u4e0b\u7b2c\u4e00\u9ad8\u624b\u300d\uff0c\u4e43\u540d\u626c\u5929\u4e0b\u7684\u4e00\u4ee3\u6b66\u5b66\u5927\u5e08\u3002", "phone": "13760798503", "qq": "969853979", "name": "\u5f20\u4e09\u4e30", "job": 1, "marriage": 0, "id": 3, "gender": "\u7537", "email": "testemail@163.com", "modify_time": "2019-03-23 00:23:47", "hometown": "\u6e56\u5317", "company": "\u6b66\u5f53\u6d3e", "contact_logs": "\u9664\u4e03\u4e2a\u5165\u5ba4\u5f1f\u5b50\u5916\uff0c\u95e8\u4eba\u53ef\u8c13\u6843\u674e\u5929\u4e0b\uff0c\u4ee5\u5929\u8d4b\u5353\u7edd\uff0c\u609f\u6027\u8d85\u7136\u81ea\u521b\u6b66\u5f53\u6d3e\uff0c\u540c\u6b66\u6797\u95e8\u6237\u300c\u5c11\u6797\u6d3e\u300d\u5206\u5ead\u6297\u793c\u3002\u5176\u4e3a\u4eba\u6b63\u6c14\u51db\u7136\uff0c\u5bbd\u548c\u4ece\u5bb9\uff0c\u9887\u6709\u4ed9\u98ce\u9053\u9aa8\u4e4b\u59ff\uff0c\u5176\u662f\u5f53\u4e16\u65e0\u51fa\u5176\u53f3\u7684\u6b66\u5b66\u5947\u624d\u3002\u767e\u5c81\u4e4b\u65f6\u81ea\u521b\u300c\u592a\u6781\u62f3\u300d\u3001\u300c\u592a\u6781\u5251\u300d\uff0c\u5c06\u300c\u6b66\u5f53\u6d3e\u300d\u53d1\u626c\u5149\u5927\uff0c\u5a01\u540d\u8fdc\u626c\u6b66\u6797\u8c6a\u6770\u65e0\u4e0d\u62dc\u670d\u3002", "birth_year": 87, "wechat": ""}'
  json_add = '{"create_time": "2019-03-23 00:23:47", "education": 3, "experience": "\u300c\u6b66\u5f53\u4e03\u4fa0\u300d\u4e4b\u5e08\uff0c\u5176\u88ab\u63a8\u4e3a\u300c\u5929\u4e0b\u7b2c\u4e00\u9ad8\u624b\u300d\uff0c\u4e43\u540d\u626c\u5929\u4e0b\u7684\u4e00\u4ee3\u6b66\u5b66\u5927\u5e08\u3002", "phone": "888666", "qq": "540311360", "name": "\u5f20\u4e09\u4e30", "job": 1, "marriage": 0, "gender": "\u7537", "email": "testemail@163.com", "modify_time": "2019-03-23 00:23:47", "hometown": "\u6e56\u5317", "company": "\u6b66\u5f53\u6d3e", "contact_logs": "\u9664\u4e03\u4e2a\u5165\u5ba4\u5f1f\u5b50\u5916\uff0c\u95e8\u4eba\u53ef\u8c13\u6843\u674e\u5929\u4e0b\uff0c\u4ee5\u5929\u8d4b\u5353\u7edd\uff0c\u609f\u6027\u8d85\u7136\u81ea\u521b\u6b66\u5f53\u6d3e\uff0c\u540c\u6b66\u6797\u95e8\u6237\u300c\u5c11\u6797\u6d3e\u300d\u5206\u5ead\u6297\u793c\u3002\u5176\u4e3a\u4eba\u6b63\u6c14\u51db\u7136\uff0c\u5bbd\u548c\u4ece\u5bb9\uff0c\u9887\u6709\u4ed9\u98ce\u9053\u9aa8\u4e4b\u59ff\uff0c\u5176\u662f\u5f53\u4e16\u65e0\u51fa\u5176\u53f3\u7684\u6b66\u5b66\u5947\u624d\u3002\u767e\u5c81\u4e4b\u65f6\u81ea\u521b\u300c\u592a\u6781\u62f3\u300d\u3001\u300c\u592a\u6781\u5251\u300d\uff0c\u5c06\u300c\u6b66\u5f53\u6d3e\u300d\u53d1\u626c\u5149\u5927\uff0c\u5a01\u540d\u8fdc\u626c\u6b66\u6797\u8c6a\u6770\u65e0\u4e0d\u62dc\u670d\u3002", "birth_year": 87, "wechat": "445566"}'
  #for i in range(1,3):
  addOrUpdateStaff(json_add)
  



#addStaff()
# 
#insertTestData()

#getStaffList(1)

#getJobList()

#addOrUpdateJob('{"name": "test23", "id": 8, "key": "8", "index": 8}')

#addOrUpdateStaff('{"name": "test54455"}')

""" where={
  'phone' : '  ',
  'qq':'5403',
  'wechat':'5566',
}
searchStaff(where) """
