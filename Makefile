LIB=crc32
DEPS=$(sort $(wildcard bits/*.js))
TARGET=$(LIB).js

$(TARGET): $(DEPS)
	cat $^ | tr -d '\15\32' > $@
	cp -f $@ ctest/ 

bits/01_version.js: package.json
	echo "CRC32.version = '"`grep version package.json | awk '{gsub(/[^0-9a-z\.-]/,"",$$2); print $$2}'`"';" > $@

.PHONY: clean
clean:
	rm -f $(TARGET)

.PHONY: test mocha
test mocha: test.js
	mocha -R spec

.PHONY: ctest
ctest:
	cat misc/*.js > ctest/fixtures.js
	cp -f test.js ctest/test.js
	cp -f $(TARGET) ctest/ 

.PHONY: lint
lint: $(TARGET)
	jshint --show-non-errors $(TARGET)
	jscs $(TARGET)

.PHONY: cov cov-spin
cov: misc/coverage.html
cov-spin:
	make cov & bash misc/spin.sh $$!

COVFMT=$(patsubst %,cov_%,$(FMT))
.PHONY: $(COVFMT)
$(COVFMT): cov_%:
	FMTS=$* make cov

misc/coverage.html: $(TARGET) test.js
	mocha --require blanket -R html-cov > $@

.PHONY: coveralls coveralls-spin
coveralls:
	mocha --require blanket --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

coveralls-spin:
	make coveralls & bash misc/spin.sh $$!

.PHONY: perf
perf:
	bash perf/perf.sh

.PHONY: perf-all
perf-all:
	bash misc/perf.sh
