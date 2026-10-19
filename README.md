# 🎭 Playwright Full-Stack Infra E2E Testing Framework

![Playwright](https://shields.io)
![Docker](https://shields.io)
![PostgreSQL](https://shields.io)
![RabbitMQ](https://shields.io)
![Redis](https://shields.io)

---

## 🇷🇺 Русский Описание

### 🚀 О Проекте
Продвинутый автоматизированный фреймворк для сквозного тестирования (E2E), сочетающий в себе **UI-автоматизацию веб-интерфейса**, прямое тестирование **REST API** и верификацию всей **инфраструктуры бэкенда** (БД, Кэш, Брокеры сообщений).

---

### 🛠 Технологический Стек & Компоненты

| Слой системы | Инструмент / Технология | Задача в автотестах |
| :--- | :--- | :--- |
| **Тест-раннер** | Playwright (JavaScript) | Запуск сценариев, управление контекстами |
| **Основная БД** | PostgreSQL (драйвер `pg`) | Проверка физической записи данных через SQL (`SELECT`) |
| **In-Memory БД** | Redis (драйвер `redis`) | Тестирование кэширования сессий и JWT-токенов |
| **Очереди** | RabbitMQ (библиотека `amqplib`) | Валидация JSON-событий в AMQP каналах |
| **Окружение** | Docker / Docker Compose | Быстрое развертывание тестовой инфраструктуры |
| **Отчетность** | Allure Report | Интерактивные отчеты со скриншотами и видеозаписями |

---

### ⚡ Покрытые Автотестами Сценарии
* **Hybrid E2E (Token Injection):** Авторизация по API за 0.1 сек., получение JWT-токена и его моментальный вброс в `window.localStorage` браузера до загрузки страницы. Полный обход UI-формы логина.
* **API Chaining:** Динамический запрос активных ID товаров со склада бэкенда для исключения падения тестов из-за устаревших тестовых данных.
* **Network Mocking (`page.route`):** Перехват сетевого трафика и подмена ответов сервера (имитация ошибки `500 Internal Server Error`) для проверки отказоустойчивости фронтенда.
* **PostgreSQL / RabbitMQ / Redis:** Автоматический цикл отправки и вычитывания данных/сообщений напрямую из инфраструктуры бэкенда.

---

## 🇺🇸 English Description

### 🚀 About The Project
An advanced automated framework for Full-Stack End-to-End (E2E) testing that combines **Web UI automation**, direct **REST API testing**, and verification of the entire **backend infrastructure** (Databases, Caching, and Message Brokers).

---

### 🛠 Tech Stack & Components

| System Layer | Tool / Technology | Task in Autotests |
| :--- | :--- | :--- |
| **Test Runner** | Playwright (JavaScript) | Test execution, context management |
| **Main Database** | PostgreSQL (`pg` driver) | Verification of data persistence via SQL (`SELECT`) |
| **In-Memory DB** | Redis (`redis` driver) | Testing session caching and JWT tokens |
| **Message Broker** | RabbitMQ (`amqplib` library) | JSON event validation in AMQP channels |
| **Environment** | Docker / Docker Compose | Local backend infrastructure deployment |
| **Reporting** | Allure Report | Interactive reports with attached screenshots & videos |

---

### ⚡ Automated Test Scenarios
* **Hybrid E2E (Token Injection):** API authentication in 0.1s, retrieving a JWT token, and injecting it directly into the browser's `window.localStorage` before page load to bypass the UI login form.
* **API Chaining:** Dynamically requesting active product IDs from the backend to prevent test failures due to stale database state.
* **Network Mocking (`page.route`):** Intercepting network traffic and mocking server responses (simulating a `500 Internal Server Error`) to test frontend resilience.
* **PostgreSQL / RabbitMQ / Redis:** Automated direct write/read verification flows within the core backend infrastructure components.

---

## 🏗 Project Structure / Структура Проекта
```text
├── API/                 # API Providers and API Chaining logic
├── database/            # Connection clients for PostgreSQL and Redis
├── queue/               # AMQP connection client for RabbitMQ
├── pages/               # Page Object Model (UI locators and methods)
├── tests/               # Test suites (UI, API, DB, Queue, Redis, Mocks)
├── docker-compose.yml   # Docker configuration for backend infrastructure
└── playwright.config.js # Global Playwright and reporters configuration
```

---

## 🚀 Quick Start / Быстрый Старт

**1. Clone the repository / Клонировать репозиторий:**
```bash
git clone https://github.com/DuishonAbdykerimov/playwright-infra-e2e.git
cd playwright-infra-e2e
```

**2. Install dependencies / Установить зависимости:**
```bash
npm install
npx playwright install
```

**3. Configure test credentials / Настроить учетные данные для тестов:**

Copy `.env.example` to `.env`, add `ECOM_USER_EMAIL` and
`ECOM_USER_PASSWORD`, then export them in your shell before running tests:

```bash
cp .env.example .env
set -a
source .env
set +a
```

Do not commit `.env`.

**4. Run backend infrastructure in Docker / Поднять инфраструктуру в Docker:**
```bash
docker compose up -d
```

**5. Execute all tests / Запустить все автотесты:**
```bash
npm run test
```

---

## 📊 Allure Reporting / Отчетность Allure
```bash
npm run allure:generate
npm run allure:open
```

## Автор

Duishon Abdykerimov
