// database/RedisClient.js
import { createClient } from 'redis';

export class RedisClient {
    constructor() {
        // Подключаемся к Redis на стандартный порт 6379, который мы прописали в Докере
        this.client = createClient({
            url: 'redis://localhost:6379'
        });

        // Обработка ошибок подключения, чтобы тест не вис в случае чего
        this.client.on('error', err => console.error('Redis Client Error', err));
    }

    // Метод для записи значения по ключу (например, сохраняем токен)
    async setKey(key, value) {
        await this.client.connect();
        await this.client.set(key, value);
        await this.client.disconnect();
    }

    // Метод для чтения значения по ключу
    async getKey(key) {
        await this.client.connect();
        const value = await this.client.get(key);
        await this.client.disconnect();
        return value;
    }
}
