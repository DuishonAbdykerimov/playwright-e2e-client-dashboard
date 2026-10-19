import { CartPage } from './CartPage.js';
import { HomePage } from './HomePage.js';
import {LoginPage} from './LoginPage.js';

test('Full E2E POM: Успешная покупка товара', async({page})=>{
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const cartPage =new CartPage(page);
    //1. авторизация
    await loginPage.goTo();
    await loginPage.validLogin(process.env.ECOM_USER_EMAIL, process.env.ECOM_USER_PASSWORD);
    await expect(page.locator('.welcome-message')).toBeVisible();
    //2. католог выбираем товар и идем в корзину
    await homePage.addProductToCart('ZARA COAT 3');
    await homePage.navigateToCart();
    //3. корзина: переходим к оплате
    await cartPage.proceedToCheckout();
    //4. оплата: заполняем карту и выбираем страну
    await cartPage.fillPaymentDetails('123', 'Snouden');
    await cartPage.selectCountry('Kyrgyzstan');
    await cartPage.submitOrder();
    //5. финальные проверки thank you
    const successMessage = await page.locator('.hero-primary').textContent();
    console.log(`[РЕЗУЛЬТАТ ТЕСТА]: ${successMessage.trim()}`);
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
});