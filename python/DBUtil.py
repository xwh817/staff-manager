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
 

def addStaff(values):
    sql = "INSERT INTO t_staff (name, job, company, education, gender, birth_year, hometown, marriage, phone, email, qq, wechat, experience, contact_logs) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    mycursor.execute(sql, values)
    
    mydb.commit()    # 数据表内容有更新，必须使用到该语句
    
    print(mycursor.rowcount, "记录插入成功。")


def getStaffList(job):
    where = ''

    if job > 0:
        where = ' where job=%d' % (job)

    sql = "select * from t_staff" + where
    print(sql)
    
    mycursor.execute(sql)

    listAll = mycursor.fetchall()     # fetchall() 获取所有记录

    json_str = json.dumps(getFormatData('t_staff', listAll))

    return json_str


def getFormatData(table, dateList):
    
    sql = "select column_name, column_type from information_schema.columns where table_schema ='%s' and table_name = '%s'" % (database, table)
    print(sql)
    
    mycursor.execute(sql)

    tableSchema = mycursor.fetchall()
    print('tableSchema: ' , tableSchema)

    formatData = []

    for item in dateList:
      staff = {}

      i = 0
      for columnName, columnType in tableSchema:
        if (columnType==b'timestamp' or columnType==b'datetime'):
          staff[columnName] = item[i].strftime('%Y-%m-%d %H:%M:%S')
        else:
          staff[columnName] = item[i]
        i+=1

      print('item: ' , staff)
      formatData.append(staff)

    return formatData;


def insertTestData():
  values = ('张三丰',1,'武当派',3,'男',87,'湖北',0,'13760798503','testemail@163.com','969853979','','「武当七侠」之师，其被推为「天下第一高手」，乃名扬天下的一代武学大师。','除七个入室弟子外，门人可谓桃李天下，以天赋卓绝，悟性超然自创武当派，同武林门户「少林派」分庭抗礼。其为人正气凛然，宽和从容，颇有仙风道骨之姿，其是当世无出其右的武学奇才。百岁之时自创「太极拳」、「太极剑」，将「武当派」发扬光大，威名远扬武林豪杰无不拜服。')
  
  for i in range(1,10):
    addStaff(values)
  



#addStaff()
#insertTestData()
#getStaffList(1)

