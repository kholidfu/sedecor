# author sopier

import re
from unidecode import unidecode
from datetime import datetime

_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')

def slugify(text, delim=u'-'):
    """Generates an ASCII-only slug."""
    result = []
    for word in _punct_re.split(text.lower()):
        result.extend(unidecode(word).split())
    return unicode(delim.join(result))

def splitter(text, delim=' '):
    """Split string into list, usage {{ string|split }}"""
    return text.split(delim)

def get_first_part(text, delim='-'):
    """Get first part from list of string with - delimiter"""
    return text.split(delim)[0]

def get_last_part(text, delim='-'):
    """Get last part from list of string with - delimiter"""
    return text.split(delim)[-1]

def onlychars(text):
    return " ".join(re.findall("[a-zA-Z0-9]+", text))

def formattime(seconds):
    """Convert seconds into minutes"""
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    return '%02d:%02d:%02d' % (h, m ,s)

def cleanurl(text):
    """Remove url from text"""
    return re.sub(re.compile(r"http://.*? "), '', text)


def removedigits(text):
    """Remove digits from string"""
    return ''.join([i for i in text if not i.isdigit()]).strip()
