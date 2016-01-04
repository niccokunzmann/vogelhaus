#!/usr/bin/python3

import os
import time

from bottle import run, request, static_file, route, redirect

location = os.path.dirname(__file__)
static_files = os.path.join(location, 'static')
refresh_after_seconds = 1
last_captured = time.time() - refresh_after_seconds

@route('/')
def home():
    return redirect('/static/index.html')

@route('/static/<filename:path>')
def static(filename):
    return static_file(filename, root = static_files)

@route('/picture.jpg')
def serve_picture():
    global last_captured
    if last_captured + refresh_after_seconds < time.time():
        os.system("raspistill -o picture.jpg -e jpg -vs")
        last_captured = time.time()
    return static_file('picture.jpg', root = location)

if __name__ == "__main__":
    run(host = '', port = 80, debug = True)
