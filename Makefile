# ----------------------------
# Help
# ----------------------------
help:
	@echo "Available make commands:"
	@echo "  build                - Build all Docker services"
	@echo "  build-gateway-service - Build only the gateway service"
	@echo "  build-email-service   - Build only the email service"
	@echo "  build-template-service- Build only the template service"
	@echo "  build-user-service    - Build only the user service"
	@echo "  build-push-service    - Build only the push service"
	@echo "  up                   - Start all services in detached mode"
	@echo "  up-build             - Start all services with build"
	@echo "  down                 - Stop all services"
	@echo "  restart              - Restart all services"
	@echo "  logs                 - Show logs for all services"
	@echo "  logs-gateway         - Show logs for gateway service"
	@echo "  logs-email           - Show logs for email service"
	@echo "  logs-template        - Show logs for template service"
	@echo "  logs-user            - Show logs for user service"
	@echo "  logs-push            - Show logs for push service"
	@echo "  logs-rabbitmq        - Show logs for rabbitmq"
	@echo "  logs-mysql           - Show logs for mysql"
	@echo "  clean                - Remove containers and prune system"
	@echo "  ps                   - List running containers"
	@echo "  shell-gateway        - Shell into gateway service"
	@echo "  shell-email          - Shell into email service"
	@echo "  shell-template       - Shell into template service"
	@echo "  shell-user           - Shell into user service"
	@echo "  shell-push           - Shell into push service"
	@echo "  shell-mysql          - MySQL shell"
	@echo "  dev                  - Start all services in dev mode"
	@echo "  dev-build            - Build and start all services in dev mode"
	@echo "  dev-build-gateway    - Build gateway service in dev mode"
	@echo "  dev-build-email      - Build email service in dev mode"
	@echo "  dev-build-template   - Build template service in dev mode"
	@echo "  dev-build-user       - Build user service in dev mode"
	@echo "  dev-build-push       - Build push service in dev mode"
	@echo "  dev-down             - Stop all dev services"
	@echo "  dev-logs             - Show logs for all dev services"
	@echo "  dev-logs-gateway     - Show logs for gateway dev service"
	@echo "  dev-logs-email       - Show logs for email dev service"
	@echo "  dev-logs-template    - Show logs for template dev service"
	@echo "  dev-logs-user        - Show logs for user dev service"
	@echo "  dev-logs-push        - Show logs for push dev service"
	@echo "  dev-gateway          - Start only gateway service in dev mode"
	@echo "  dev-email            - Start only email service in dev mode"
	@echo "  dev-template         - Start only template service in dev mode"
	@echo "  dev-user             - Start only user service in dev mode"
	@echo "  dev-push             - Start only push service in dev mode"
	@echo "  rebuild-gateway      - Rebuild and restart gateway service"
	@echo "  rebuild-email        - Rebuild and restart email service"
	@echo "  rebuild-template     - Rebuild and restart template service"
	@echo "  rebuild-user         - Rebuild and restart user service"
	@echo "  rebuild-push         - Rebuild and restart push service"
	@echo "  health               - Check health of all services"
# ----------------------------
# Docker management (production)
# ----------------------------
build:
	docker-compose build

# Build single services
build-gateway-service:
	docker-compose build gateway-service

build-email-service:
	docker-compose build email-service

build-template-service:
	docker-compose build template-service

build-user-service:
	docker-compose build user-service

build-push-service:
	docker-compose build push-service

up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-gateway:
	docker-compose logs -f gateway-service

logs-email:
	docker-compose logs -f email-service

logs-template:
	docker-compose logs -f template-service

logs-user:
	docker-compose logs -f user-service

logs-push:
	docker-compose logs -f push-service

logs-rabbitmq:
	docker-compose logs -f rabbitmq

logs-mysql:
	docker-compose logs -f mysql

clean:
	docker-compose down -v
	docker system prune -f

ps:
	docker-compose ps

# ----------------------------
# Single service shells
# ----------------------------
shell-gateway:
	docker-compose exec gateway-service sh

shell-email:
	docker-compose exec email-service sh

shell-template:
	docker-compose exec template-service sh

shell-user:
	docker-compose exec user-service sh

shell-push:
	docker-compose exec push-service sh

shell-mysql:
	docker-compose exec mysql mysql -u template_user -p

# ----------------------------
# Development mode (merged with docker-compose.dev.yml)
# ----------------------------
DEV_COMPOSE=-f docker-compose.yml -f docker-compose.dev.yml

dev:
	docker-compose $(DEV_COMPOSE) up -d

dev-build:
	docker-compose $(DEV_COMPOSE) up -d --build

dev-build-gateway:
	docker-compose $(DEV_COMPOSE) build --no-cache gateway-service

dev-build-email:
	docker-compose $(DEV_COMPOSE) build --no-cache email-service

dev-build-template:
	docker-compose $(DEV_COMPOSE) build --no-cache template-service

dev-build-user:
	docker-compose $(DEV_COMPOSE) build --no-cache user-service

dev-build-push:
	docker-compose $(DEV_COMPOSE) build --no-cache push-service

dev-down:
	docker-compose $(DEV_COMPOSE) down

dev-logs:
	docker-compose $(DEV_COMPOSE) logs -f

dev-logs-gateway:
	docker-compose $(DEV_COMPOSE) logs -f gateway-service

dev-logs-email:
	docker-compose $(DEV_COMPOSE) logs -f email-service

dev-logs-template:
	docker-compose $(DEV_COMPOSE) logs -f template-service

dev-logs-user:
	docker-compose $(DEV_COMPOSE) logs -f user-service

dev-logs-push:
	docker-compose $(DEV_COMPOSE) logs -f push-service

# Single service dev starts
dev-gateway:
	docker-compose $(DEV_COMPOSE) up -d gateway-service

dev-email:
	docker-compose $(DEV_COMPOSE) up -d email-service

dev-template:
	docker-compose $(DEV_COMPOSE) up -d template-service

dev-user:
	docker-compose $(DEV_COMPOSE) up -d user-service

dev-push:
	docker-compose $(DEV_COMPOSE) up -d push-service

# ----------------------------
# Rebuild specific service
# ----------------------------
rebuild-gateway:
	docker-compose build --no-cache gateway-service
	docker-compose up -d gateway-service

rebuild-email:
	docker-compose build --no-cache email-service
	docker-compose up -d email-service

rebuild-template:
	docker-compose build --no-cache template-service
	docker-compose up -d template-service

rebuild-user:
	docker-compose build --no-cache user-service
	docker-compose up -d user-service

rebuild-push:
	docker-compose build --no-cache push-service
	docker-compose up -d push-service

# ----------------------------
# Health check
# ----------------------------
health:
	@echo "Checking service health..."
	@curl -f http://localhost:3000/health || echo "Gateway Service: DOWN"
	@curl -f http://localhost:3001/health || echo "Email Service: DOWN"
	@curl -f http://localhost:3002/health || echo "Template Service: DOWN"
	@curl -f http://localhost:8000/health || echo "User Service: DOWN"
	@curl -f http://localhost:3003/health || echo "Push Service: DOWN"
