.PHONY: build clean dev-up

build: node_modules
	pnpm build

clean:
	rm -rf dist

dev-up: node_modules
	pnpm dev

node_modules: package.json pnpm-lock.yaml
	pnpm install
	touch node_modules
