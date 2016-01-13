#!/usr/bin/env python
# make_unicode_crc.py -- generate baselines for tests
# Copyright (C) 2016-present  SheetJS

from zlib import crc32
from array import array
from sys import argv, stderr, exit
from importlib import import_module

args = argv[1:]

if len(args) < 1:
	print >>stderr, "usage: " + argv[0] + " <category>"
	exit(1)

uctable = import_module("uctable_" + args[0]).uctable

for z in uctable:
	print crc32(array('B', z));
