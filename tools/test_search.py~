from pyimagesearch.rgbhistogram import RGBHistogram
from pyimagesearch.searcher import Searcher
import numpy as np
import argparse
import cPickle
import cv2

ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", required=True,
                help="Path to the directory that contains the images to be indexed")
ap.add_argument("-i", "--index", required=True,
                help="Path to where the computed index will be stored")
ap.add_argument("-q", "--query", required=True,
                help="Path to query image")
args = vars(ap.parse_args())

print "query: %s" % (args["query"])

desc = RGBHistogram([8, 8, 8])
queryImage = cv2.imread(args["query"])
queryFeatures = desc.describe(queryImage)

index = cPickle.loads(open(args["index"]).read())
searcher = Searcher(index)
results = searcher.search(queryFeatures)

print len(results)

for j in xrange(0, 10):
    (score, imageName) = results[j]
    path = args["dataset"] + "/%s" % (imageName)

    result = cv2.imread(path)
    print "t%d. %s : %.3f" % (j + 1, imageName, score)
