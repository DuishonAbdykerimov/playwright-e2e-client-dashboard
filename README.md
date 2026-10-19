<div align="center">

<img src="./docs/architecture.svg" alt="Playwright Infra E2E architecture" width="100%">

<h1>Playwright Infra E2E</h1>

<p><strong>One JavaScript test project for browser flows, APIs, databases, cache, and message queues.</strong></p>

<p>
  <a href="https://github.com/microsoft/playwright"><img src="https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright&logoColor=white" alt="Playwright"></a>
  <img src="https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=222" alt="JavaScript ES Modules">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 15">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis 7">
  <img src="https://img.shields.io/badge/RabbitMQ-3-FF6600?logo=rabbitmq&logoColor=white" alt="RabbitMQ 3">
  <img src="https://img.shields.io/badge/Reports-HTML%20%7C%20Allure-7B4B94?logo=allure&logoColor=white" alt="HTML and Allure reports">
</p>

<p>
  <a href="#-overview">Overview</a> ·
  <a href="#-test-coverage">Test coverage</a> ·
  <a href="#-quick-start">Quick start</a> ·
  <a href="#-reports--debugging-artifacts">Reports</a> ·
  <a href="#-project-structure">Project structure</a>
</p>

<p><a href="#-русская-версия">Русская версия ↓</a></p>

</div>

---

## 🚀 Overview

**Playwright Infra E2E** is a JavaScript automation project that demonstrates how to test beyond the browser. It combines a hybrid API/browser scenario with integration checks for a local PostgreSQL database, Redis cache, and RabbitMQ message broker.

The infrastructure services run locally through Docker Compose. Playwright Test runs the suite in Chromium, while the HTML and Allure reporters provide test results and debugging evidence.

> **Scope note:** PostgreSQL, Redis, and RabbitMQ are standalone services used by this project's integration tests. They are not represented as internal components of the external demo e-commerce application.

## ✨ Test coverage

| Test area | What it verifies |
|---|---|
| **API + browser** | Authenticates against the demo application's API, retrieves a product, creates an order, and cleans it up after the test run. A browser test injects the token before page scripts execute, mocks the order-history API with HTTP `500`, and verifies the response status. |
| **PostgreSQL** | Creates a test table if needed, inserts a uniquely identified row, reads it back, and checks the returned data. |
| **Redis** | Writes a mock session value to Redis and verifies it can be read back. |
| **RabbitMQ** | Publishes a JSON order message to a queue, consumes it, and checks its fields. |

The API/browser scenario requires a valid demo-app account, provided through `ECOM_USER_EMAIL` and `ECOM_USER_PASSWORD`. Credentials are not committed to the repository.

## 🧱 Technology stack

| Technology | How it is used |
|---|---|
| **Playwright Test** | Test runner, browser automation, API requests, assertions, network interception, and test artifacts |
| **JavaScript (ES Modules)** | Project language and module system |
| **PostgreSQL 15 + `pg`** | SQL integration test |
| **Redis 7 + `redis`** | Cache integration test |
| **RabbitMQ 3 + `amqplib`** | AMQP publish/consume integration test |
| **Docker Compose** | Local, repeatable infrastructure setup |
| **HTML reporter + Allure** | Test reporting |

## 🎬 Reports & debugging artifacts

The Playwright configuration records a **screenshot and video for every test**. A **trace is retained when a test fails**, which can be inspected with Playwright's Trace Viewer.

Run the tests first, then open the reports:

```bash
# Open the Playwright HTML report
npx playwright show-report

# Generate and open the Allure report
npm run allure:generate
npm run allure:open
```

Generated files are kept locally and excluded from Git:

| Artifact | Location |
|---|---|
| Screenshots, videos, traces, and test results | `test-results/` |
| Playwright HTML report | `playwright-report/` |
| Raw Allure results and attachments | `allure-results/` |
| Generated Allure site | `allure-report/` |

The repository does not include fabricated screenshots or sample videos. The actual screenshots and recordings are produced when you run the tests.

## 🚀 Quick start

### Prerequisites

- Node.js LTS and npm
- Docker Desktop (or Docker Engine) with Docker Compose
- A valid account for the demo e-commerce application to run the API/browser test

### 1. Clone and install

```bash
git clone https://github.com/DuishonAbdykerimov/playwright-infra-e2e.git
cd playwright-infra-e2e
npm ci
npx playwright install
```

On Linux CI machines, install the browser system dependencies as well:

```bash
npx playwright install --with-deps
```

### 2. Configure demo-app credentials

Copy the example environment file:

```bash
cp .env.example .env
```

Add your demo-app credentials to `.env`:

```dotenv
ECOM_USER_EMAIL=your-demo-account-email
ECOM_USER_PASSWORD=your-demo-account-password
```

Export the variables into the current shell before running the tests:

```bash
set -a
source .env
set +a
```

`.env` is ignored by Git. Never commit real credentials. The API/browser test will stop with a clear error if either variable is missing.

### 3. Start local infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432`, Redis on `localhost:6379`, and RabbitMQ on `localhost:5672`. The RabbitMQ management console is available at [http://localhost:15672](http://localhost:15672).

> The credentials in `docker-compose.yml` are local development defaults for this disposable test environment. Do not reuse them for a public or production deployment.

### 4. Run the test suite

```bash
npm test
```

Run an individual infrastructure test:

```bash
npx playwright test tests/db-test.spec.js
npx playwright test tests/redis-test.spec.js
npx playwright test tests/queue-test.spec.js
```

Run only the API/browser spec:

```bash
npx playwright test tests/e2e-order.spec.js
```

### 5. Stop the local services

```bash
docker compose down
```

To also remove the local PostgreSQL volume and its data, use `docker compose down -v`.

## 📁 Project structure

```text
├── API/                 # API client for the demo e-commerce application
├── database/            # PostgreSQL and Redis clients
├── docs/                # Project architecture illustration
├── pages/               # Page Object Model classes
├── queue/               # RabbitMQ client
├── tests/               # API/browser and infrastructure test specs
├── .env.example         # Environment variable template
├── docker-compose.yml   # Local PostgreSQL, Redis, and RabbitMQ services
└── playwright.config.js # Browser project, reporters, and artifacts
```

## 🗺️ Possible next steps

- Add CI service containers for PostgreSQL, Redis, and RabbitMQ.
- Store demo-app credentials as CI secrets.
- Add readiness checks and health checks for infrastructure services.
- Expand coverage with positive UI checkout and API validation scenarios.

## 🇷🇺 Русская версия

### О проекте

**Playwright Infra E2E** — проект на JavaScript для практики автоматизации: он объединяет гибридный API/browser-сценарий и интеграционные проверки PostgreSQL, Redis и RabbitMQ. Локальные сервисы запускаются через Docker Compose. Это отдельная тестовая инфраструктура, а не описание внутреннего устройства demo-магазина.

### Покрытие тестами

| Область | Что проверяется |
|---|---|
| **API + браузер** | API-авторизация, получение товара и создание заказа с последующей очисткой. В браузер заранее передаётся токен, ответ API истории заказов подменяется на HTTP `500`, проверяется статус ответа. |
| **PostgreSQL** | Создание таблицы, запись уникальной строки и проверка чтения данных. |
| **Redis** | Запись mock-значения сессии и чтение его обратно. |
| **RabbitMQ** | Публикация JSON-сообщения, чтение из очереди и проверка полей. |

Для API/browser-теста нужны `ECOM_USER_EMAIL` и `ECOM_USER_PASSWORD` — учётные данные demo-приложения. Не сохраняйте их в Git.

### Быстрый запуск

Нужны Node.js LTS, Docker Compose и учётная запись demo-приложения.

```bash
git clone https://github.com/DuishonAbdykerimov/playwright-infra-e2e.git
cd playwright-infra-e2e
npm ci
npx playwright install
cp .env.example .env
```

Добавьте учётные данные в `.env`, затем загрузите переменные в shell и запустите инфраструктуру с тестами:

```bash
set -a
source .env
set +a
docker compose up -d
npm test
```

Чтобы остановить сервисы: `docker compose down`.

### Отчёты и артефакты

Playwright записывает скриншот и видео каждого теста, а при падении сохраняет trace. После запуска тестов откройте отчёты:

```bash
npx playwright show-report
npm run allure:generate
npm run allure:open
```

Артефакты создаются локально в `test-results/`, `playwright-report/`, `allure-results/` и `allure-report/` и не коммитятся в репозиторий.

---

<div align="center">
  <sub>Project author: <strong>Duishon Abdykerimov</strong></sub>
</div>
