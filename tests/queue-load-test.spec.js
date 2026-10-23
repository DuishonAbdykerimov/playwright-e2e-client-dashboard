// tests/queue-load-test.spec.js
import { test } from '@playwright/test';
import { QueueClient } from '../queue/QueueClient.js';

test('Нагрузочный тест для мониторинга Grafana: Отправка 100 сообщений', async () => {
    const queueCtrl = new QueueClient();
    const queueName = 'ecom_orders_queue';

    console.log('[Grafana Load] Начинаем массированную отправку сообщений...');

    // 1. Отправляем 100 фейковых заказов подряд без остановки
    for (let i = 1; i <= 100; i++) {
        await queueCtrl.publishMessage(queueName, {
            orderId: `LOAD_TEST_ORDER_${i}`,
            status: 'PENDING',
            userEmail: 'load-test@example.com'
        });
    }
    console.log('[Grafana Load] 100 сообщений успешно закинуты в RabbitMQ!');

    // 2. Искусственно засыпаем на 15 секунд, чтобы мы успели увидеть в Графане число 100!
    await new Promise(resolve => setTimeout(resolve, 15000));

    console.log('[Grafana Load] Начинаем массовую очистку очереди...');

    // 3. Вычитываем все сообщения обратно, чтобы опустошить очередь
    let message;
    let count = 0;
    do {
        message = await queueCtrl.getMessage(queueName);
        if (message) count++;
    } while (message);

    console.log(`[Grafana Load] Очередь полностью очищена. Забрано сообщений: ${count}`);
    await queueCtrl.close();
});
