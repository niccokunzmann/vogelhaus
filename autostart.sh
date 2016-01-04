#!/bin/bash

cd `dirname $0`

log="./webserver.log"


echo '----------------------------------------' >> $log
./webserver.py 1>> $log 2>>$log &
echo $! > webserver.pid


