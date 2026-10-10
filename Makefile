RUN = docker compose run --rm web

.PHONY: up down logs install lint format build clean shell e2e locales

up: ## start the dev server on http://localhost:3000
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f web

install: ## run once after cloning and after changing package.json
	$(RUN) yarn install --frozen-lockfile

lint:
	$(RUN) yarn lint

format:
	$(RUN) yarn format

build: ## production build into .next-check, safe to run next to the dev server
	docker compose run --rm -e NEXT_DIST_DIR=.next-check web yarn build

clean: ## free disk space: drop the build caches (.next volume, .next-check); they are rebuilt on demand
	$(RUN) rm -rf .next-check
	docker compose down -v

shell:
	$(RUN) bash

locales: ## ru.js and en.js must have the same keys
	$(RUN) yarn check:locales

e2e: ## browser tests of the whole product (throwaway stack from ../Logos-api)
	$(MAKE) -C ../Logos-api e2e-ui
