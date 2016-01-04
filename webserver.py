#!/usr/bin/python3

import os
import time
import threading

from bottle import run, request, static_file, route, redirect

location = os.path.dirname(__file__)
static_files = os.path.join(location, 'static')

refresh_after_seconds = 1
last_captured = time.time() - refresh_after_seconds
capture_lock = threading.Lock()

@route('/')
def home():
    return redirect('/static/index.html')

@route('/static/<filename:path>')
def static(filename):
    return static_file(filename, root = static_files)

@route('/picture.jpg')
def serve_picture():
    global last_captured
    with capture_lock:
        to_capture = last_captured + refresh_after_seconds < time.time()
        if to_capture:
            last_captured = time.time()
    if to_capture:
        # TODO: what if capturing lasts longer that refresh_after_seconds?
        os.system("raspistill -o picture.jpg -e jpg -ex night -w 640 -h 480 -t 100")
    return static_file('picture.jpg', root = location)

if __name__ == "__main__":
    # server option: http://bottlepy.org/docs/dev/deployment.html#server-options
    run(host = '0.0.0.0', port = 80, debug = True, server='cherrypy')
