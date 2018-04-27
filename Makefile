PEGJS := $(shell npm bin)/pegjs
BABEL := $(shell npm bin)/babel
BROWSERIFY := $(shell npm bin)/browserify

all: node_modules index.js

node_modules: package.json
	npm install
	npm prune

json_ast.js: json_ast.pegjs
	${PEGJS} -o $@ $<

index.js: waste.js json_ast.js
	${BROWSERIFY} -o $@ $<

clean:
	rm -rf node_modules json_ast.js
