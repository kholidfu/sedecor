from PIL import Image # pip install pillow
import os
from datetime import datetime
import shutil
import pymongo
from bson.objectid import ObjectId

"""
{
'filename': 'thefilename',
'title': 'thetitle',
'size': 'imgsize',
'dim': 'img_dimension', # tuple
'format': 'img_type', # jpeg, png
'added': datetime.now(),
'hits': 0,
}
"""

c = pymongo.Connection()
#c.drop_database('images')
db = c['images']

thepath = os.getcwd()
thepath = os.path.dirname(os.path.dirname(thepath))

for fn in os.listdir(thepath + '/app/walls/img_temp'):
    filename, filext = os.path.splitext(fn)
    im = Image.open(thepath + '/app/walls/img_temp/' + fn)
    imgid = db.image.insert({
        'filename': filename,
        'title': filename.replace('-', ' ').replace('_', ' '),
        'size': os.stat(thepath + '/app/walls/img_temp/' + fn).st_size,
        'format': im.format,
        'dims': im.size,
        'added': datetime.now(),
        'hits': 0,
    })
    db.image.update({"_id": ObjectId(imgid)}, {"$set": {"filename": filename + "-" + str(imgid) + filext}}, False)
    shutil.move(thepath + '/app/walls/img_temp/' + filename + filext, thepath + '/app/walls/img/' + filename + "-" + str(imgid) + filext)
