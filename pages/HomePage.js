 export class HomePage{
    constructor(page){
        this.page=page;
        this.products=page.locator('.card-body');
        this.cartButton=page.locator("button[routerlink*='cart']");
    }
    async addProductToCart(productName){
        const productCard=this.products.filter({hasText:productName});
        await productCard.getByRole('button',{name:'Add To Cart'}).click();
    }
    async navigateToCart(){
        await this.cartButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}