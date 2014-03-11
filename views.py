# author: @sopier

from flask import render_template, request, redirect, send_from_directory
from flask import make_response # untuk sitemap
from app import app
# untuk find_one based on data id => db.freewaredata.find_one({'_id': ObjectId(file_id)})
# atom feed
from werkzeug.contrib.atom import AtomFeed
from bson.objectid import ObjectId
from filters import slugify, splitter, onlychars, get_first_part, get_last_part, formattime, cleanurl, removedigits
import pymongo
import datetime
from PIL import Image, ImageOps, ImageFilter
from cStringIO import StringIO
import os


@app.template_filter()
def slug(s):
    """
    transform words into slug
    usage: {{ string|slug }}
    """
    return slugify(s)

@app.template_filter()
def split(s):
    """
    split string s with delimiter '-'
    return list object
    usage: {{ string|split }}
    """
    return splitter(s, '-')

@app.template_filter()
def getlast(text, delim=' '):
    """
    get last word from string with delimiter ' '
    usage: {{ string|getlast }}
    """
    return get_last_part(text, delim)

@app.template_filter()
def getfirst(text, delim=' '):
    """
    get first word from string with delimiter '-'
    usage: {{ string|getfirst }}
    """
    return get_first_part(text, delim)

@app.template_filter()
def getchars(text):
    """
    get characters and numbers only from string
    usage: {{ string|getchars }}
    """
    return onlychars(text)

@app.template_filter()
def sectomins(seconds):
    """
    convert seconds to hh:mm:ss
    usage: {{ seconds|sectomins }}
    """
    return formattime(seconds)

@app.template_filter()
def urlcleaner(text):
    """
    clean url from string
    """
    return cleanurl(text)

@app.template_filter()
def rmdigit(text):
    """remove digit from text"""
    return removedigits(text)

# handle robots.txt file
@app.route("/robots.txt")
def robots():
    # point to robots.txt files
    return send_from_directory(app.static_folder, request.path[1:])

c = pymongo.Connection()
db = c['images']

from random import randint

@app.route("/")
def index():
    """get random image from dbase"""
    datashow = 15
    datalen = db.image.find().count()
    rand = randint(0, datalen-datashow)
    #data = [i for i in db.image.find().sort("_id", -1).limit(24)]
    data = [i for i in db.image.find().limit(24).skip(rand)]
    #data = [i for i in db.image.find()]
    return render_template("index.html", data=data)

@app.route("/new")
def latest():
    """get new images from dbase"""
    data = [i for i in db.image.find().sort("_id", -1).limit(24)]
    return render_template("new.html", data=data)

@app.route("/top")
def tophits():
    """get popular image from dbase"""
    data = [i for i in db.image.find().sort("hits", -1).limit(24)]
    return render_template("top.html", data=data)

def resize_and_crop(img_path, buf, size, crop_type='top'):
    """
    Resize and crop an image to fit the specified size.
    https://gist.github.com/sigilioso/2957026
    args:
        img_path: path for the image to resize.
        modified_path: path to store the modified image.
        size: `(width, height)` tuple.
        crop_type: can be 'top', 'middle' or 'bottom', depending on this
            value, the image will cropped getting the 'top/left', 'midle' or
            'bottom/rigth' of the image to fit the size.
    raises:
        Exception: if can not open the file in img_path of there is problems
            to save the image.
        ValueError: if an invalid `crop_type` is provided.
    """
    # If height is higher we resize vertically, if not we resize horizontally
    img = Image.open(img_path)
    # Get current and desired ratio for the images
    img_ratio = img.size[0] / float(img.size[1])
    ratio = size[0] / float(size[1])
    #The image is scaled/cropped vertically or horizontally depending on the ratio
    if ratio > img_ratio:
        img = img.resize((size[0], size[0] * img.size[1] / img.size[0]),
                Image.ANTIALIAS)
        # Crop in the top, middle or bottom
        if crop_type == 'top':
            box = (0, 0, img.size[0], size[1])
        elif crop_type == 'middle':
            box = (0, (img.size[1] - size[1]) / 2, img.size[0], (img.size[1] + size[1]) / 2)
        elif crop_type == 'bottom':
            box = (0, img.size[1] - size[1], img.size[0], img.size[1])
        else :
            raise ValueError('ERROR: invalid value for crop_type')
        img = img.crop(box)
    elif ratio < img_ratio:
        img = img.resize((size[1] * img.size[0] / img.size[1], size[1]),
                Image.ANTIALIAS)
        # Crop in the top, middle or bottom
        if crop_type == 'top':
            box = (0, 0, size[0], img.size[1])
        elif crop_type == 'middle':
            box = ((img.size[0] - size[0]) / 2, 0, (img.size[0] + size[0]) / 2, img.size[1])
        elif crop_type == 'bottom':
            box = (img.size[0] - size[0], 0, img.size[0], img.size[1])
        else :
            raise ValueError('ERROR: invalid value for crop_type')
        img = img.crop(box)
    else :
        img = img.resize((size[0], size[1]),
                Image.ANTIALIAS)
        # If the scale is the same, we do not need to crop
    img.save(buf, format="JPEG")


# ini untuk halaman selain download, ukuran fixed ratio
@app.route("/collections/<filename>")
def imgprocessor(filename):
    """processing single image into multiple resolution"""
    buf = StringIO()
    path = os.getcwd()
    path = path + "/app/walls/img/"
    resize_and_crop(path+filename, buf, (160,160), "middle")
    imgstring = buf.getvalue()
    response = make_response(imgstring)
    response.headers['Content-Type'] = 'image/jpeg'
    response.headers['Cache-Control'] = 'public, max-age=43200'
    response.headers['Content-Disposition'] = 'inline; filename=sedecor.jpg'
    return response

# http://united-coders.com/christian-harms/image-resizing-tips-every-coder-should-know/

# ini untuk halaman download, ukuran kita paksa
@app.route("/download/<imgsize>/<imgid>")
def imgprocfordownload(imgsize, imgid):
    """processing image into multiple [forced] resolution"""
    imgdata = db.image.find_one({'_id': ObjectId(imgid)})
    buf = StringIO()
    path = os.getcwd()
    path = path + "/app/walls/img/"
    im = Image.open(path + imgdata['filename'])
    # resize here
    dims = [int(i) for i in imgsize.split('x')]
    # resize with fixed ratio (geometry)
    im = im.resize((dims), Image.ANTIALIAS)
    im.save(buf, format="JPEG")
    imgstring = buf.getvalue()
    response = make_response(imgstring)
    response.headers['Content-Type'] = 'image/jpeg'
    response.headers['Cache-Control'] = 'public, max-age=43200'
    response.headers['Content-Disposition'] = 'inline; filename=sedecor.jpg'
    return response

from PIL import ImageEnhance

# ini untuk halaman single, ukuran menyesuaikan geometri
@app.route("/single/<imgsize>/<imgid>.jpg")
def imgprocforsingle(imgsize, imgid):
    """processing image into multiple [forced] resolution"""
    imgdata = db.image.find_one({'_id': ObjectId(imgid)})
    buf = StringIO()
    path = os.getcwd()
    path = path + "/app/walls/img/"
    im = Image.open(path + imgdata['filename'])
    # crop
    size = imgdata['dims']
    im = im.crop((11, 15, size[0]-8, size[1]-18))
    # mirror
    im = ImageOps.mirror(im)
    # rotate
    # detail
    im = im.filter(ImageFilter.DETAIL)
    # edge enhance
    #im = im.filter(ImageFilter.EDGE_ENHANCE_MORE)
    # unsharp mask
    im = im.filter(ImageFilter.UnsharpMask)
    # smooth
    im = im.filter(ImageFilter.SMOOTH_MORE)
    # sharper
    im = im.filter(ImageFilter.SHARPEN)
    # RGB
    im = ImageEnhance.Color(im).enhance(1.2)
    # resize here
    dims = [int(i) for i in imgsize.split('x')]
    im.thumbnail((dims), Image.ANTIALIAS)
    im.save(buf, format="JPEG")
    imgstring = buf.getvalue()
    response = make_response(imgstring)
    response.headers['Content-Type'] = 'image/jpeg'
    response.headers['Cache-Control'] = 'public, max-age=43200'
    response.headers['Content-Disposition'] = 'inline; filename=sedecor.jpg'
    return response

@app.route("/view/<imgid>")
def single(imgid):
    """get single page, title field: full text search"""
    # handle old error page
    if db.image.find_one({"_id": ObjectId(imgid)}) is None:
        return redirect("/", 301)
    # setiap diakses, hits tambah 1
    db.image.update({"_id": ObjectId(imgid)}, {"$inc": {"hits": 1}})
    # get the data
    data = db.image.find_one({'_id': ObjectId(imgid)})
    title = data['title'].replace('-', ' ')
    # get related data
    reldata = db.command('text', 'image', search=title, limit=9)
    return render_template("single.html", data=data, reldata=reldata)

@app.route("/similar/<filename>")
def similar(filename):
    """field title dibikin fulltext, biar bisa cari similar."""
    """processing single image into multiple resolution"""
    buf = StringIO()
    path = os.getcwd()
    path = path + "/app/walls/img/"
    resize_and_crop(path+filename, buf, (80,80), "middle")
    imgstring = buf.getvalue()
    response = make_response(imgstring)
    response.headers['Content-Type'] = 'image/jpeg'
    response.headers['Cache-Control'] = 'public, max-age=43200'
    response.headers['Content-Disposition'] = 'inline; filename=sedecor.jpg'
    return response

@app.route("/sitemap.xml")
def sitemap():
    data = db.image.find().sort("_id", -1)
    sitemap_xml = render_template("sitemap.xml", data=data)
    response = make_response(sitemap_xml)
    response.headers['Content-Type'] = 'application/xml'

    return response

@app.route('/recent.atom')
def recent_feed():
    # http://werkzeug.pocoo.org/docs/contrib/atom/
    # wajibun: id(link) dan updated
    # feed = AtomFeed('Recent Articles',
    #                feed_url = request.url, url=request.url_root)
    # data = datas
    # for d in data:
    #    feed.add(d['nama'], content_type='html', id=d['id'], updated=datetime.datetime.now())
    # return feed.get_response()
    pass
