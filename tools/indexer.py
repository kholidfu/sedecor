from pyimagesearch.rgbhistogram import RGBHistogram
import argparse
import cPickle
import glob
import cv2
import datetime

print "Job starting at %s" % datetime.datetime.now()

index = {}

desc = RGBHistogram([8, 8, 8])

for imagePath in glob.glob("/home/sopier/sedecor.com/app/walls/img/*"):
    k = imagePath[imagePath.rfind("/") + 1:]
    image = cv2.imread(imagePath)
    features = desc.describe(image)
    index[k] = features

with open("index.cpickle", "w") as f:
    f.write(cPickle.dumps(index))

print "Job ended at %s" % datetime.datetime.now()
