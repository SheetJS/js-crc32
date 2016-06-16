#!/bin/bash
# make_baseline.sh -- generate baselines for tests
# Copyright (C) 2016-present  SheetJS
OUTD=../test_files
CATURL=https://mathias.html5.org/data/unicode/8.0.0/categories/
CATF=$OUTD/uccat.txt

ECHORED() { echo -ne '\x1B[0;31m'; echo -n "$1"; echo -ne '\x1B[0m'; echo; }

if [[ "$1" == "clean" ]]; then
	if [ ! -d test_files ]; then cd ..; fi
	if [ -d test_files ]; then cd test_files; fi
	rm -f uccat.txt baseline.*.txt uctable.*.js uctable_*.py
	exit
fi

# shellcheck disable=SC2164
if [ -d misc ]; then cd misc; fi
mkdir -p $OUTD
if [ ! -e $CATF ]; then curl "$CATURL" | grep "code-points" | sed 's/.*="//g;s/-.*//g' > $CATF; fi

while read -r line; do
	JSF=uctable.${line}.js
	PYF=uctable_${line}.py
	BLF=baseline.${line}.txt
	JSURL="https://mathias.html5.org/data/unicode/format?version=8.0.0&category=${line}&type=symbols&prepend=var+unicode%20%3D%20&append=%3Bif(typeof%20module%20!%3D%3D%20'undefined')%20module.exports%20%3D%20unicode%3B"
	if [[ ! -e $OUTD/$JSF || ! -e $OUTD/$PYF || ! -e $OUTD/$BLF ]]; then
		ECHORED "Processing ${line}"
		for i in $JSF $PYF $BLF; do if [[ ! -e $i && -e $OUTD/$i ]]; then mv $OUTD/"$i" .; fi done
		if [ ! -e "$JSF" ]; then
			rm -f "$PYF" "$BLF" "${PYF}c"
			echo "Downloading JS"
			</dev/null curl -o "$JSF" "$JSURL"
		fi
		if [ ! -e "$PYF" ]; then
			echo "Building Python script"
			rm -f "$BLF" "${PYF}c"
			</dev/null node make_unicode.njs "${line}" | sed 's/\[ \[/uctable = \[ \[/' > "$PYF"
		fi
		if [ ! -e "$BLF" ]; then
			echo "Building Baseline text"
			python make_unicode_crc.py "${line}" > "baseline.${line}.txt"
		fi
		for i in $JSF $PYF $BLF; do if [ -e "$i" ]; then mv "$i" $OUTD/; fi; done
		rm -f "uctable_${line}.pyc"
	fi
done < $CATF

