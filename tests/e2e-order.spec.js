import { test, expect } from '@playwright/test';
import { ApiProvider } from '../API/ApiProvider.js';
import { OrdersPage } from '../pages/OrdersPage.js';

const userEmail = process.env.ECOM_USER_EMAIL;
const userPassword = process.env.ECOM_USER_PASSWORD;

let token;
let orderId;

test.beforeAll(async ({ request }) => {
    if (!userEmail || !userPassword) {
        throw new Error('Set ECOM_USER_EMAIL and ECOM_USER_PASSWORD environment variables to run order tests.');
    }

    const api = new ApiProvider(request);

    token = await api.getToken(userEmail, userPassword);
    const productId = await api.getFirstProductId(token);
    orderId = await api.createOrder(token, productId);

    console.log(`[API Бэкенд]: Создан заказ с ID: ${orderId}`);
});
// Этот блок сработает автоматически ПОСЛЕ всех тестов в этом файле
test.afterAll(async ({ request }) => {
    const api = new ApiProvider(request);

    // Если токен и заказ были успешно созданы — удаляем этот заказ через API
    if (token && orderId) {
        await api.deleteOrder(token, orderId);
    }
    // Этот блок сработает автоматически ПОСЛЕ всех тестов в этом файле

});



// tests/e2e-order.spec.js

test('Негативный сценарий: Бэкенд упал (500 Error Mocking)', async ({ page }) => {
    await page.route('**/api/ecom/order/get-orders-for-customer**', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Internal Server Error' }),
        });
    });

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    const ordersResponsePromise = page.waitForResponse(response =>
        response.url().includes('/api/ecom/order/get-orders-for-customer'),
    );

    await page.goto('https://rahulshettyacademy.com/client/#/dashboard/myorders');
    const ordersResponse = await ordersResponsePromise;

    expect(ordersResponse.status()).toBe(500);
});
