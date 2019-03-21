#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 使用flask提供restful接口 
# 先安装依赖：pip install flask

from flask import Flask, render_template
import DBUtil

# Flask初始化参数尽量使用你的包名，这个初始化方式是官方推荐的，官方解释：http://flask.pocoo.org/docs/0.12/api/#flask.Flask
app = Flask(__name__)


# 默认首页和hello
@app.route('/')
@app.route('/hello')
def hello_world():
    return "Hello Flask!"

@app.route('/react')
def react():
    return render_template('index.html')

# api接口前缀
apiPrefix = '/api/v1/'

@app.route(apiPrefix + 'getStaffList/<int:job>')
def getStaffList(job):
    return DBUtil.getStaffList(job)


@app.route(apiPrefix + 'addStaff', methods=['POST'])
def addStaff():
    return DBUtil.getStaffList(1)


# if __name__ == '__main__': 确保服务器只会在该脚本被 Python 解释器直接执行的时候才会运行，而不是作为模块导入的时候。
if __name__ == "__main__":
    # 如果不限于本机使用：app.run(host='0.0.0.0')
    # 调试模式，修改文件之后自动更新重启。
    app.run(debug=True)
