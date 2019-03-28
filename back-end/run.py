#! /usr/bin/env python
# -*- coding: utf-8 -*-
# 使用flask提供restful接口
# 先安装依赖：pip install flask

from flask import Flask, render_template, request, send_from_directory
import os
import SqliteUtil as DBUtil
import json
import FileUtil

upload_root_dir = 'uploads'

# Flask初始化参数尽量使用你的包名，这个初始化方式是官方推荐的，官方解释：http://flask.pocoo.org/docs/0.12/api/#flask.Flask
'''
    template_folder 模板文件所在的目录
    static_folder 静态文件根目录（图片、css、js等）
    static_url_path url访问时根目录对应的path，可以自己改，映射到static_folder。和package.json里的homepage对应
'''
#app = Flask(__name__, static_folder="templates",static_url_path="/staff-manager")
app = Flask(__name__, template_folder='front-build', static_folder="front-build", static_url_path="/staff-manager")


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



##################  Job接口  ###############

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



##################  Staff接口  ###############

@app.route(apiPrefix + 'getStaffList/<int:job>')
def getStaffList(job):
    array = DBUtil.getStaffList(job)
    jsonStaffs = DBUtil.getStaffsFromData(array)
    return json.dumps(jsonStaffs)


@app.route(apiPrefix + 'updateStaff', methods=['POST'])
def updateStaff():
    data = request.get_data(as_text=True)
    re = DBUtil.addOrUpdateStaff(data)
    if re['code'] >= 0: # 数据保存成功，移动附件
        FileUtil.fileMoveDir(re['id'])
    return json.dumps(re)


@app.route(apiPrefix + 'deleteStaff/<int:id>')
def deleteStaff(id):
    FileUtil.fileDeleteDir(id)  # 文件删掉
    re = DBUtil.deleteStaff(id)
    return re


@app.route(apiPrefix + 'searchStaff')
def searchStaff():
    data = request.args.get('where')
    print("searchStaff:", data)
    where = json.loads(data)
    array = DBUtil.searchStaff(where)
    jsonStaffs = DBUtil.getStaffsFromData(array)
    re = json.dumps(jsonStaffs)
    return re



##################  File接口  ###############

@app.route(apiPrefix + 'fileUpload', methods=['POST'])
def fileUpload():
    f = request.files["file"]
    return FileUtil.fileUpload(f)


@app.route(apiPrefix + 'fileDelete/<int:id>/<name>', methods=['GET'])
def fileDelete(id, name):
    return FileUtil.fileDelete(id, name)


@app.route(apiPrefix + 'fileDeleteDir/<int:id>', methods=['GET'])
def fileDeleteDir(id):
    return FileUtil.fileDeleteDir(id)


@app.route(apiPrefix + 'fileGetList/<int:id>', methods=['GET'])
def fileGetList(id):
    return FileUtil.fileGetList(id)


@app.route(apiPrefix + 'fileGet/<int:id>/<name>', methods=['GET'])
def fileGet(id, name):
    path = FileUtil.fileGetDir(id)
    # 参数as_attachment=True，否则对于图片格式、txt格式，会把文件内容直接显示在浏览器，对于xlsx等格式，虽然会下载，但是下载的文件名也不正确
    return send_from_directory(path, name, as_attachment=True)

@app.route(apiPrefix + 'fileBackup')
def fileBackup():
    return DBUtil.saveStaffToCVX(0)

@app.route(apiPrefix + 'fileGetBackup')
def fileGetBackup():
    path = './backup/'
    return send_from_directory(path, 'staffList.csv', as_attachment=True)






# if __name__ == '__main__': 确保服务器只会在该脚本被 Python 解释器直接执行的时候才会运行，而不是作为模块导入的时候。
if __name__ == "__main__":
    # 如果不限于本机使用：app.run(host='0.0.0.0')
    # 调试模式，修改文件之后自动更新重启。
    app.run(debug=True)
