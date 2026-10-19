<div align="center">

<img src="./docs/architecture.svg" alt="Playwright Infra E2E architecture" width="100%">

<h1>Playwright Infra E2E</h1>

<p><strong>Не только браузер: проверяем API, базу данных, кэш и очередь сообщений в одном E2E-проекте.</strong></p>

<p>
  <a href="https://github.com/microsoft/playwright"><img src="https://img.shields.io/badge/Playwright-1.63-2EAD33?logo=playwright&logoColor=white" alt="Playwright"></a>
  <img src="https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=222" alt="JavaScript ES Modules">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 15">
  <img src="https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white" alt="Redis 7">
  <img src="https://img.shields.io/badge/RabbitMQ-3-FF6600?logo=rabbitmq&logoColor=white" alt="RabbitMQ 3">
  <img src="https://img.shields.io/badge/Reports-Allure-7B4B94?logo=allure&logoColor=white" alt="Allure Reports">
</p>

<p>
  <a href="#-быстрый-старт">Быстрый старт</a> ·
  <a href="#-что-проверяется">Сценарии</a> ·
  <a href="#-отчёты-и-артефакты">Отчёты</a> ·
  <a href="#-структура-проекта">Структура</a>
</p>

</div>

---

## О проекте

Учебный full-stack проект для практики автоматизации на **Playwright**. Он объединяет проверки веб-приложения и API с интеграционными тестами инфраструктурных компонентов. PostgreSQL, Redis и RabbitMQ запускаются локально через Docker Compose.

> **Важно:** PostgreSQL, Redis и RabbitMQ здесь — отдельные тестовые сервисы. Это не утверждение, что они являются внутренними компонентами внешнего demo-магазина.

## ✨ Что проверяется

| Область | Сценарий |
|---|---|
| **API + браузер** | Получение токена и создание заказа через API; в браузере запрос списка заказов перехватывается и проверяется обработка ответа `500`. |
| **PostgreSQL** | Создание таблицы, запись строки и чтение её обратно. |
| **Redis** | Запись тестового значения в кэш и чтение значения по ключу. |
| **RabbitMQ** | Публикация JSON-сообщения в очередь и проверка прочитанного сообщения. |

Заказный сценарий использует `ECOM_USER_EMAIL` и `ECOM_USER_PASSWORD`. Учётные данные не хранятся в репозитории.

## 🎬 Отчёты и артефакты

Каждый запуск сохраняет **скриншот и видео**, а при падении теста — **trace** Playwright. Эти файлы генерируются локально и не коммитятся в Git.

После запуска тестов:

```bash
# Открыть HTML-отчёт Playwright
npx playwright show-report

# Собрать и открыть Allure-отчёт
npm run allure:generate
npm run allure:open
```

Сырые артефакты Playwright находятся в `test-results/`, HTML-отчёт — в `playwright-report/`, результаты Allure — в `allure-results/`.

## 🚀 Быстрый старт

### Требования

- Node.js LTS и npm
- Docker Desktop с Docker Compose
- Учётная запись demo-приложения для API/UI теста

### Установка

```bash
git clone https://github.com/DuishonAbdykerimov/playwright-infra-e2e.git
cd playwright-infra-e2e
npm ci
npx playwright install
```

### Учётные данные

Скопируйте шаблон и заполните `.env` своими данными:

```bash
cp .env.example .env
```

Затем загрузите переменные в текущий shell:

```bash
set -a
source .env
set +a
```

`.env` исключён из Git. Без `ECOM_USER_EMAIL` и `ECOM_USER_PASSWORD` тесту API/UI нечем авторизоваться.

### Запуск

```bash
# Запустить PostgreSQL, Redis и RabbitMQ
docker compose up -d

# Запустить все тесты
npm test
```

Чтобы запустить отдельную инфраструктурную проверку:

```bash
npx playwright test tests/db-test.spec.js
npx playwright test tests/redis-test.spec.js
npx playwright test tests/queue-test.spec.js
```

RabbitMQ Management UI доступен по адресу [http://localhost:15672](http://localhost:15672) (`guest` / `guest`).

## 🧰 Технологии

<p>
  <img src="https://img.shields.io/badge/Playwright-test%20runner-2EAD33?logo=playwright&logoColor=white" alt="Playwright test runner">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker Compose">
  <img src="https://img.shields.io/badge/Allure-reporting-7B4B94?logo=allure&logoColor=white" alt="Allure reporting">
</p>

| Компонент | Роль в проекте |
|---|---|
| Playwright Test | E2E-тесты, браузерная автоматизация, API-запросы и сетевой mocking |
| PostgreSQL (`pg`) | Интеграционная проверка записи и чтения SQL-данных |
| Redis (`redis`) | Интеграционная проверка кэша |
| RabbitMQ (`amqplib`) | Проверка публикации и чтения AMQP-сообщений |
| Docker Compose | Локальный запуск инфраструктурных сервисов |
| Allure | Отчёт с результатами и тестовыми вложениями |

## 📁 Структура проекта

```text
├── API/                 # API-клиент demo-магазина
├── database/            # Клиенты PostgreSQL и Redis
├── docs/                # Графика и документация проекта
├── pages/               # Page Object классы
├── queue/               # Клиент RabbitMQ
├── tests/               # API/UI и инфраструктурные тесты
├── .env.example         # Шаблон переменных окружения
├── docker-compose.yml   # PostgreSQL, Redis и RabbitMQ
└── playwright.config.js # Проекты, reporters и browser artifacts
```

## 🇬🇧 English

**Playwright Infra E2E** is a JavaScript practice project combining API/browser testing with integration checks for PostgreSQL, Redis, and RabbitMQ. Docker Compose provides the local infrastructure; Playwright captures screenshots and videos, while Allure and the built-in HTML reporter provide test reports.

See [Quick Start](#-быстрый-старт) for setup instructions. The API/UI scenario requires `ECOM_USER_EMAIL` and `ECOM_USER_PASSWORD` in a local `.env` file.

---

<div align="center">
  <sub>Автор проекта: <strong>Duishon Abdykerimov</strong></sub>
</div>
