// tests/queue-test.spec.js
import { test, expect } from '@playwright/test';
import { QueueClient } from '../queue/QueueClient.js';

test('Проверка интеграции с RabbitMQ: Полный цикл отправки и чтения', async () => {
    const queueCtrl = new QueueClient();
    const queueName = 'ecom_orders_queue';

    const testOrder = {
        orderId: 'AUTO_POM_999',
        status: 'PAID',
        userEmail: 'qa@example.test'
    };

    // 1. ПОДГОТОВКА: Сам тест автоматически создает и отправляет сообщение в ящик
    await queueCtrl.publishMessage(queueName, testOrder);
    console.log('[RabbitMQ Write] Сообщение автоматически отправлено в очередь.');

    // 2. ДЕЙСТВИЕ: Читаем его из очереди
    const orderMessage = await queueCtrl.getMessage(queueName);
    console.log('[RabbitMQ Read] Данные успешно вычитаны:', orderMessage);

    // 3. ПРОВЕРКИ (Assertions)
    expect(orderMessage).not.toBeNull();
    expect(orderMessage.userEmail).toBe(testOrder.userEmail);
    expect(orderMessage.status).toBe(testOrder.status);
    expect(orderMessage.orderId).toBe(testOrder.orderId);

    // 4. ОЧИСТКА: Закрываем соединение
    await queueCtrl.close();
});
