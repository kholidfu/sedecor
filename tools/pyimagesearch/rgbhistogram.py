# import the necessary packages
import numpy as np
import cv2

class RGBHistogram:
    def __init__(self, bins):
        self.bins = bins

    def describe(self, image):
        hist = cv2.calcHist([image], [0, 1, 2],
                            None, self.bins, [0, 256, 0, 256, 0, 256])
        hist = cv2.normalize(hist)
        return hist.flatten()

class Searcher:
    def __init__(self, index):
        self.index = index

    def search(self, queryFeatures):
        results = {}

        for (k, features) in self.index.items():
            d = self.chi2_distance(features, queryFeatures)
            result[k] = d

            results = sorted([(v, k) for (k, v) in results.items()])
        return results

    def chi2_distance(self, histA, histB, eps=1e-10):
        d = 0.5*np.sum([((a -b) ** 2) / (a+b+eps) for (a, b) in zip(histA, histB)])
        return d
