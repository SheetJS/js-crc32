LIB=crc32
REQS=
ADDONS=
AUXTARGETS=

ULIB=$(shell echo $(LIB) | tr a-z A-Z)
DEPS=$(sort $(wildcard bits/*.js))
TARGET=$(LIB).js

.PHONY: all
all: $(TARGET) $(AUXTARGETS)

$(TARGET) $(AUXTARGETS): %.js : %.flow.js
	node -e 'process.stdout.write(require("fs").readFileSync("$<","utf8").replace(/^\s*\/\*:[^*]*\*\/\s*(\n)?/gm,"").replace(/\/\*:[^*]*\*\//gm,""))' > $@

$(LIB).flow.js: $(DEPS)
	cat $^ | tr -d '\15\32' > $@

bits/01_version.js: package.json
	echo "CRC32.version = '"`grep version package.json | awk '{gsub(/[^0-9a-z\.-]/,"",$$2); print $$2}'`"';" > $@

.PHONY: clean
clean:
	rm -f $(TARGET)

.PHONY: test mocha
test mocha: test.js
	mocha -R spec -t 20000

.PHONY: ctest
ctest:
	cat misc/*.js > ctest/fixtures.js
	cp -f test.js ctest/test.js
	cp -f $(TARGET) ctest/

.PHONY: lint
lint: $(TARGET) $(AUXTARGETS)
	jshint --show-non-errors $(TARGET) $(AUXTARGETS)
	jshint --show-non-errors package.json
	jscs $(TARGET) $(AUXTARGETS)

.PHONY: flow
flow: lint
	flow check --all --show-all-errors

.PHONY: cov cov-spin
cov: misc/coverage.html
cov-spin:
	make cov & bash misc/spin.sh $$!

COVFMT=$(patsubst %,cov_%,$(FMT))
.PHONY: $(COVFMT)
$(COVFMT): cov_%:
	FMTS=$* make cov

misc/coverage.html: $(TARGET) test.js
	mocha --require blanket -R html-cov -t 20000 > $@

.PHONY: coveralls coveralls-spin
coveralls:
	mocha --require blanket --reporter mocha-lcov-reporter -t 20000 | ./node_modules/coveralls/bin/coveralls.js

coveralls-spin:
	make coveralls & bash misc/spin.sh $$!

.PHONY: perf
perf:
	bash perf/perf.sh

.PHONY: perf-all
perf-all:
	bash misc/perf.sh
