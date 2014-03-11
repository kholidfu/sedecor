from pyimagesearch.rgbhistogram import RGBHistogram
from pyimagesearch.searcher import Searcher
import numpy as np

import cPickle
import cv2

desc = RGBHistogram([8, 8, 8])
queryImage = cv2.imread("/home/sopier/sedecor.com/app/walls/img/modern-dining-room-ideas-12-52e542ddd0c46642c531da66.jpg")
queryFeatures = desc.describe(queryImage)

index = cPickle.loads(open("index.cpickle").read())
searcher = Searcher(index)
results = searcher.search(queryFeatures)

print len(results)

for j in xrange(0, 9):
    (score, imageName) = results[j]
    path = "/home/sopier/sedecor.com/app/walls/img" + "/%s" % (imageName)

    result = cv2.imread(path)
    print "t%d. %s : %.3f" % (j + 1, imageName, score)
