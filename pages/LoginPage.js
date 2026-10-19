export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('#userEmail');
        this.passwordInput = page.locator('#userPassword');
        this.signInButton = page.getByRole('button', { name: 'login' });
    }

    async goTo() {
        await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    }

    async validLogin(username, password) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }
}