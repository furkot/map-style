STYLES=$(wildcard style/*.json)
REPORTS=$(patsubst style/%.json,report/%.txt,$(STYLES))
NORMS=$(patsubst style/%.json,report/%.json,$(STYLES))
 
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

report/%.json: style/%.json
	cp -f $< $@
	node lib/normalize $(CURDIR)/$@

$(NORMS): $(STYLES)

normalize: report check $(NORMS)

.PHONY: check clean init lint normalize validate
