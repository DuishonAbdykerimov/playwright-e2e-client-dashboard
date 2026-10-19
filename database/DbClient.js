// database/DbClient.js
import pkg from 'pg';
const { Pool } = pkg;

export class DbClient {
    constructor() {
        // Передаем настройки подключения ровно те, что мы прописали в docker-compose.yml
        this.pool = new Pool({
            user: process.env.POSTGRES_USER ?? 'qa_user',
            host: process.env.POSTGRES_HOST ?? 'localhost',
            database: process.env.POSTGRES_DB ?? 'ecom_test_db',
            password: process.env.POSTGRES_PASSWORD ?? 'qa_password123',
            port: Number(process.env.POSTGRES_PORT ?? 5432),
        });
    }

    // Универсальный метод для отправки любых SQL-запросов к БД
    async query(sql, params) {
        const client = await this.pool.connect();
        try {
            const res = await client.query(sql, params);
            return res.rows; // Возвращаем только строки из таблицы
        } finally {
            client.release(); // Обязательно освобождаем подключение обратно в пул
        }
    }

    // Метод для закрытия всех соединений при завершении тестов
    async close() {
        await this.pool.end();
    }
}
