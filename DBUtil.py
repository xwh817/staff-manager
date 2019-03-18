import mysql.connector
from Staff import Staff
 
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="1986817",
  database="staffInfo"
)

mycursor = mydb.cursor()
 
def getStaff():
    mycursor.execute("select * from t_staff")
    for x in mycursor:
        print(x)


def addStaff():
    sql = "INSERT INTO t_staff (name, job, gender, birth_year, hometown, salary, marriage, \
phone, email, qq, wechat, experience, contact_logs) VALUES \
(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    values = ('范先生',1,'男',87,'广东','',0,\
'13760798503','','969853979','',\
'11年本科毕业，2010.12 - 2013.07汇丰、2013.07 – 至今深圳市网新新思',\
'15.1.12已经跳槽去了一家上市公司。')
    mycursor.execute(sql, values)
    
    mydb.commit()    # 数据表内容有更新，必须使用到该语句
    
    print(mycursor.rowcount, "记录插入成功。")

addStaff()


# mycursor.close()

