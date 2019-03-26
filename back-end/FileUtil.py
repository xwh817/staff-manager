import os
import shutil
import json

base_path = os.path.abspath(os.path.dirname(__file__))
upload_root_dir = 'uploads'

def fileGetDir(id):
    id_path = str(id) if id > 0 else 'temp'
    upload_dir = os.path.join(base_path, upload_root_dir, id_path)
    return upload_dir

def fileGetPath(id, name):
    upload_dir = fileGetDir(id)
    return os.path.join(upload_dir, name)

def fileUpload(file):
    try:
        # 先放到临时文件夹，等数据库保存成功之后移动到对应的id目录
        upload_dir = fileGetDir(0)
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_path = os.path.join(upload_dir, file.filename)
        file.save(file_path)
        return json.dumps({'code': 0})
    except Exception as e:
        print(str(e))
        return json.dumps({'code': -1, 'message': str(e)})

def fileDelete(id, name):
    try:
        file_path = fileGetPath(id, name)
        if os.path.exists(file_path):
            os.remove(file_path)
            return json.dumps({'code': 0})
        else:
            return json.dumps({'code': -1, 'message': '文件不存在'})
    except Exception as e:
        print(str(e))
        return json.dumps({'code': -1, 'message': str(e)})


def fileDeleteDir(id):
    try:
        upload_dir = fileGetDir(id)
        if os.path.exists(upload_dir):
            shutil.rmtree(upload_dir)    #递归删除文件夹
        return json.dumps({'code': 0})
    except Exception as e:
        return json.dumps({'code': -1, 'message':str(e)})
        print(str(e))

def fileGetList(id):
    upload_dir = fileGetDir(id)
    if os.path.exists(upload_dir):
        files = os.listdir(upload_dir)
    else:
        files = []
    return json.dumps(files)

# 保存数据之后将temp目录下的文件移到对应id
def fileMoveDir(id):
    if (id > 0):
        try:
            upload_dir_temp = fileGetDir(0)
            if os.path.exists(upload_dir_temp):
                upload_dir = fileGetDir(id)
                if os.path.exists(upload_dir):  # 之前id已经存在，合并
                    files = os.listdir(upload_dir_temp)
                    for file in files:
                        os.rename(os.path.join(upload_dir_temp, file), os.path.join(upload_dir, file))
                    os.rmdir(upload_dir_temp)
                else:   # id不存在，重命名
                    os.rename(upload_dir_temp, upload_dir)
        except Exception as e:
            print(str(e))



