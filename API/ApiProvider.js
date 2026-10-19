export class ApiProvider{
    constructor(request){
        this.request=request;
        this.baseUrl='https://rahulshettyacademy.com';
    }
    // Метод для авторизации и получения токена
    async getToken(email, password) {
        // Должно быть строго `this.request.post`, потому что мы берем объект из конструктора класса!
        const response = await this.request.post(`${this.baseUrl}/api/ecom/auth/login`, {
            data: { userEmail: email, userPassword: password }
        });

        if (!response.ok()) {
            throw new Error(`Логин по API провалился! Статус: ${response.status()}`);
        }

        const responseJson = await response.json();
        return responseJson.token;
    }

    //метод для создания заказа напрямую в базу данных
    async createOrder(token, productId) {
        const response = await this.request.post(`${this.baseUrl}/api/ecom/order/create-order`, {
            data: {
                orders: [
                    {
                        country: "Kyrgyzstan",
                        productOrderedId: productId
                    }
                ]
            },
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        // 🧠 Хитрый трюк для отладки: если сервер вернул 400, давай прочитаем его реальный ответ!
        if (!response.ok()) {
            const errorBody = await response.text();
            console.error(`[API Error Response]: ${errorBody}`);
            throw new Error(`Создание заказа по API провалилось! Статус: ${response.status()}`);
        }

        const responseJson = await response.json();
        const orderId = responseJson.orders?.[0];
        if (!orderId) {
            throw new Error('Создание заказа по API не вернуло ID заказа.');
        }

        return orderId;
    }
    // 3. Динамически запрашиваем список всех доступных товаров
    async getFirstProductId(token) {
        const response = await this.request.post(`${this.baseUrl}/api/ecom/product/get-all-products`, {
            data: {}, // Сервер ждет пустой объект для выгрузки всех товаров
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Не удалось получить список товаров! Статус: ${response.status()}`);
        }

        const responseJson = await response.json();
        // Забираем ID самого первого товара, который сейчас реально существует в базе данных
        return responseJson.data[0]._id;
    }

    // Метод для удаления заказа по API после окончания теста
    async deleteOrder(token, orderId) {
        const response = await this.request.delete(`${this.baseUrl}/api/ecom/order/delete-order/${orderId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok()) {
            console.error(`[API Cleanup Error]: Не удалось удалить заказ ${orderId}`);
        } else {
            console.log(`[API Cleanup]: Заказ ${orderId} успешно удален из базы данных.`);
        }
    }


}