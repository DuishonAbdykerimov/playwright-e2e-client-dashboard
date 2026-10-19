export class CartPage{
    constructor(page){
        this.page=page;
        this.checkoutButton=page.getByRole('button', { name: 'Checkout' }).click();
        //элементы оплаты
        this.cardNumberInput = page.locator('input[value="4542 9931 9292 2293"]');
        this.expMonthSelect = page.locator('select.ddl').first();
        this.expYearSelect = page.locator('select.ddl').last();
        this.cvvInput = page.locator('.input.txt').nth(1);
        this.cardNameInput= page.locator('.input.txt').nth(2);
        //элементы выбора стран
        this.countryInput= page.locator("input[placeholder*='Select Country']");
        this.countryDropdownOption =page.locator('button.ta-item');
        //финальная кнопка
        this.placeOrderButton= page.getByText('PLACE ORDER');
    }
    async proceedToCheckout(){
        await this.checkoutButton.click();
    }
    async fillPaymentDetails(){
        await this.cardNameInput.fill('4542993192922293');
        await this.expMonthSelect.selectOption('01');
        await this.expYearSelect.selectOption('27');
        //передаем имя CVV
        await this.cvvInput.fill(cvv);
        await this.cardNameInput.fill(name);
    }
    async selectCountry(countryName){
        await this.countryInput.pressSequntially(countryName,{delay:100});
        await this.countryDropdownOption.filter({hasText:countryName}).first();
    }
    async submitOrder(){
        await this.placeOrderButton.click();
    }
}