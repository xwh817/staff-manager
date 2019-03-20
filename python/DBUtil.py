import mysql.connector
import json
 
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="1986817",
  database="staffInfo"
)

mycursor = mydb.cursor()
 

def addStaff():
    sql = "INSERT INTO t_staff (name, job, company, education, gender, birth_year, hometown, marriage, phone, email, qq, wechat, experience, contact_logs) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    values = ('范先生',1,'深圳新思',3,'男',87,'广东',0,'13760798503','testemail@163.com','969853979','','11年本科毕业，2010.12 - 2013.07汇丰、2013.07 – 至今深圳市网新新思','15.1.12已经跳槽去了一家上市公司。')
    mycursor.execute(sql, values)
    
    mydb.commit()    # 数据表内容有更新，必须使用到该语句
    
    print(mycursor.rowcount, "记录插入成功。")


def getStaffList(job):
    where = ''

    if job > 0:
        where = ' where job=%d' % (job)

    sql = "select id, name, job, company, education, gender, birth_year, hometown, marriage, phone, email, qq, wechat, experience, contact_logs from t_staff" + where
    #print(sql)
    
    mycursor.execute(sql)

    myresult = mycursor.fetchall()     # fetchall() 获取所有记录

    json_str = json.dumps(myresult)

    #print(json_str)
    return json_str


#getStaffList(1)


# mycursor.close()

