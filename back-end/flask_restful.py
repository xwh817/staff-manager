#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 使用flask提供restful接口 
# 先安装依赖：pip install flask

from flask import Flask, render_template, request
import db.SqliteUtil as DBUtil

import json

# Flask初始化参数尽量使用你的包名，这个初始化方式是官方推荐的，官方解释：http://flask.pocoo.org/docs/0.12/api/#flask.Flask
'''
    template_folder 模板文件所在的目录
    static_folder 静态文件根目录（图片、css、js等）
    static_url_path url访问时根目录对应的path，可以自己改，映射到static_folder。和package.json里的homepage对应
'''
#app = Flask(__name__, static_folder="templates",static_url_path="/staff-manager")
app = Flask(__name__, template_folder='front-build', static_folder="front-build",static_url_path="/staff-manager")


# hello
@app.route('/hello')
def hello_world():
    return "Hello Flask!"

# 默认首页
@app.route('/')
def react():
    return render_template('index.html')

# api接口前缀
apiPrefix = '/api/v1/'

@app.route(apiPrefix + 'getStaffList/<int:job>')
def getStaffList(job):
    return DBUtil.getStaffList(job)

@app.route(apiPrefix + 'updateStaff', methods=['POST'])
def updateStaff():
    data = request.get_data(as_text=True)
    re = DBUtil.addOrUpdateStaff(data)
    return re

@app.route(apiPrefix + 'deleteStaff/<int:id>')
def deleteStaff(id):
    re = DBUtil.deleteStaff(id)
    return re

@app.route(apiPrefix + 'searchStaff')
def searchStaff():
    data = request.args.get('where')
    print("searchStaff:", data);
    where = json.loads(data)
    re = DBUtil.searchStaff(where)
    return re



@app.route(apiPrefix + 'getJobList')
def getJobList():
    return DBUtil.getJobList()

@app.route(apiPrefix + 'updateJob', methods=['POST'])
def updateJob():
    data = request.get_data(as_text=True)
    re = DBUtil.addOrUpdateJob(data)
    return re

@app.route(apiPrefix + 'deleteJob/<int:id>')
def deleteJob(id):
    re = DBUtil.deleteJob(id)
    print(re)
    return re





# if __name__ == '__main__': 确保服务器只会在该脚本被 Python 解释器直接执行的时候才会运行，而不是作为模块导入的时候。
if __name__ == "__main__":
    # 如果不限于本机使用：app.run(host='0.0.0.0')
    # 调试模式，修改文件之后自动更新重启。
    app.run(debug=True)
