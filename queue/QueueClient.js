// queue/QueueClient.js
import amqp from 'amqplib';

export class QueueClient {
    constructor() {
        // Строка подключения с дефолтными логином и паролем guest:guest
        this.url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
        this.connection = null;
        this.channel = null;
    }

    // Метод для вычитывания ОДНОГО сообщения из конкретной очереди
    async getMessage(queueName) {
        // 1. Устанавливаем соединение с брокером
        this.connection = await amqp.connect(this.url);
        // 2. Создаем канал связи
        this.channel = await this.connection.createChannel();
        // 3. Убеждаемся, что очередь существует
        await this.channel.assertQueue(queueName, { durable: true });

        // 4. Забираем сообщение из очереди без автоматического подтверждения (noAck: true)
        const message = await this.channel.get(queueName, { noAck: true });

        if (message) {
            // Распарсиваем текст сообщения обратно в читаемый JSON-объект
            return JSON.parse(message.content.toString());
        }
        return null;
    }

    // Метод для закрытия соединения в конце тестов
    async close() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
        // Метод для автоматической отправки сообщения в очередь перед тестом
    async publishMessage(queueName, messageObject) {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(queueName, { durable: true });

        // Превращаем JSON-объект в строку и буфер, затем кидаем в RabbitMQ
        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageObject)));

        // Закрываем временный канал
        await this.channel.close();
        await this.connection.close();
    }

}
