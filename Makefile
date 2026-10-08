RUN = docker compose run --rm web

.PHONY: up down logs install lint format build shell

up: ## start the dev server on http://localhost:3000
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f web

install: ## run after changing package.json
	$(RUN) yarn install

lint:
	$(RUN) yarn lint

format:
	$(RUN) yarn format

build:
	$(RUN) yarn build

shell:
	$(RUN) bash
