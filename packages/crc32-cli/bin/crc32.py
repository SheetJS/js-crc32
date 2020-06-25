#!/usr/bin/env python
# crc32.py -- calculate crc32 checksum of data
# Copyright (C) 2016-present  SheetJS
from zlib import crc32
from sys import argv, stdin

args=argv[1:]
payload=""
if len(args) == 0 or args[0] == "-":
	payload = stdin.read()
else:
	payload = open(args[0],"rb").read()

# NOTE: python 2 returns a signed value; python3 is unsigned
print crc32(payload)
