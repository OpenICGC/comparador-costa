#!/bin/bash

rm -fr /home/tic/comparador-costa
cp -r tmp /home/tic/comparador-costa

service nginx stop
rm -fr /var/www/html/costa/*
cp -r /home/tic/comparador-costa/*  /var/www/html/costa/

service nginx start
