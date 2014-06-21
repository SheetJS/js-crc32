#!/bin/bash

cd misc &>/dev/null

git_module() {
	if [ ! -e "$1/" ]; then git clone $2; fi
	cd "$1"
	git pull
	cd - &>/dev/null
}

echo "::: downloading modules"
npm install crc-32 2>/dev/null
git_module node-crc https://github.com/alexgorbatchev/node-crc 2>/dev/null # crc
git_module crc32 https://github.com/beatgammit/crc32 2>/dev/null # crc32
git_module buffer-crc32 https://github.com/brianloveswords/buffer-crc32 2>/dev/null # buffer-crc32

for i in A B C D E F G H I; do MODE="$i" node integration.js "$1"; done
