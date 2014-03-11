from flask import Flask
from flask.ext.compress import Compress


app = Flask(__name__, 
            static_folder="static", # match with your static folder
            static_url_path="/static" # you can change this to anything other than static, its your URL
)
Compress(app)
from app import views

# logging tools 
# author: https://gist.github.com/mitsuhiko/5659670
# monitor uwsgi access / error :: output di nohup.out

import sys
from logging import Formatter, StreamHandler
handler = StreamHandler(sys.stderr)
handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)
