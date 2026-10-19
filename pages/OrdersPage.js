import { expect } from '@playwright/test';

export class OrdersPage {
    constructor(page) {
        this.page = page;
    }

    async verifyOrderIsPresent(orderId) {
        await this.page.goto('https://rahulshettyacademy.com/client/#/dashboard/myorders');
        await expect(this.page.getByText(orderId, { exact: true })).toBeVisible();
    }
}
