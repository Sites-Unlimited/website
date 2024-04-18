#!/usr/bin/env python

"""Cleanup duplicate images."""

import os
import re

safefiles = []
thumbnails = []

def is_thumbnail(filename: str):
    """Check if file is a thumbnail."""
    if m := re.match(r'^(.*)-\d+x\d+(?:@2x)?\.([a-zA-Z]+)$', filename):
        return m[1] + '.' + m[2]
    if m := re.match(r'^(.*)(?:@2x)\.([a-zA-Z]+)$', filename):
        return m[1] + '.' + m[2]
    print("No match: ", filename)
    return filename

try:
  for year in os.listdir('.'):
    for month in os.listdir(year):
      files = {fn: is_thumbnail(fn) for fn in os.listdir(year + "/" + month)}
      for fn, basename in files.items():
        print("Check ", year + "/" + month + "/" + fn + " -> " + basename)
        if fn != basename and basename in files:
          print("Deleting ", year + "/" + month + "/" + fn )
          os.unlink(year + "/" + month + "/" + fn)
except NotADirectoryError:
  pass
