#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 使用flask提供restful接口

from flask import Flask
import DBUtil

# Flask初始化参数尽量使用你的包名，这个初始化方式是官方推荐的，官方解释：http://flask.pocoo.org/docs/0.12/api/#flask.Flask
app = Flask(__name__)


@app.route('/HelloWorld')
def hello_world():
    return "Hello World!"


@app.route('/getStaffList')
def getStaffList():
    return DBUtil.getStaffList(1)

if __name__ == "__main__":
    # 这种是不太推荐的启动方式，我这只是做演示用，官方启动方式参见：http://flask.pocoo.org/docs/0.12/quickstart/#a-minimal-application
    app.run(debug=True)