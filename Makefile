STYLES=$(wildcard style/*.json)
REPORTS=$(patsubst style/%.json,report/%.txt,$(STYLES))
 
check: lint

lint:
	./node_modules/.bin/jshint lib

clean:
	rm -rf report

report:
	mkdir -p $@

report/%.txt: style/%.json
	node lib/validate $(CURDIR)/$< > $@ 
	cat $@

$(REPORTS): $(STYLES)

validate: report check $(REPORTS)

.PHONY: check clean init lint validate
