#!/usr/bin/python3

import os
import sys
import time
import threading
import subprocess

from bottle import run, request, static_file, route, redirect, parse_date, HTTPResponse

location = os.path.dirname(__file__)
static_files = os.path.join(location, 'static')

class Picture:
    refresh_after_seconds = 5
    
    def __init__(self):
        self.content = self.get_content()
        self.time = time.time()
        self.next_refresh_time = self.time + self.refresh_after_seconds
        
    @staticmethod
    def get_content():
        return subprocess.check_output(
            "raspistill -o - -e jpg -ex night -w 640 -h 480 -t 100".split(), 
            stderr = sys.stderr)
    
    def is_outdated(self):
        return self.next_refresh_time < time.time()

capture_lock = threading.Lock()
capturing = False
picture = Picture()

@route('/')
def home():
    return redirect('/static/index.html')

@route('/static/<filename:path>')
def static(filename):
    return static_file(filename, root = static_files)

def renew_picture():
    global capturing, picture
    with capture_lock:
        to_capture = not capturing and picture.is_outdated()
        if to_capture:
            capturing = True # critical section
    if to_capture:
        picture = Picture()
        capturing = False

@route('/picture.jpg')
def serve_picture():
    renew_picture()
    _picture = picture
    
    # from bottle.static_file
    headers = dict()
    headers['Content-Type'] = 'image/jpeg'

    headers['Content-Length'] = clen = len(_picture.content)
    lm = time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime(_picture.time))
    headers['Last-Modified'] = lm

    ims = request.get_header('If-Modified-Since')
    if not ims:
      ims = request.environ.get('HTTP_IF_MODIFIED_SINCE')
    if ims:
        ims = parse_date(ims.split(";")[0].strip())
    if ims is not None and ims >= int(_picture.time):
        headers['Date'] = time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime())
        return HTTPResponse(status=304, **headers)

    body = '' if request.method == 'HEAD' else _picture.content
    return HTTPResponse(body, **headers)


if __name__ == "__main__":
    # server option: http://bottlepy.org/docs/dev/deployment.html#server-options
    run(host = '0.0.0.0', port = 80, debug = True, server='cherrypy')
