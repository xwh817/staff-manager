class Staff:

    #定义构造方法
    def __init__(self, name, job, gender, birth_year, hometown, \
        salary, marriage, phone, email, qq, wechat, \
            experience, contact_logs):
        self.name = name
        self.job = job
        self.gender = gender
        self.birth_year = birth_year
        self.hometown = hometown
        self.salary = salary
        self.marriage = marriage
        self.phone = phone
        self.email = email
        self.qq = qq
        self.wechat = wechat
        self.experience = experience
        self.contact_logs = contact_logs

    def toString(self):
        print("name:%s" %(self.name))

# test
staff = Staff('范先生',1,'男',87,'广东','',0,\
'13760798503','','969853979','',\
'11年本科毕业，2010.12 - 2013.07汇丰、2013.07 – 至今深圳市网新新思',\
'15.1.12已经跳槽去了一家上市公司。')
staff.toString()