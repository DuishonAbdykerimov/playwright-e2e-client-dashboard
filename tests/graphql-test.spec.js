import { test, expect } from '@playwright/test';

test('Проверка интеграции с GraphQL: Получение данных о запусках SpaceX', async ({ request }) => {
    const graphqlEndpoint = 'https://spacex-api.fly.dev/graphql/';

    const graphqlQuery = {
        query: `
            query GetSpaceXCompanyInfo {
              company {
                name
                founder
                ceo
              }
            }
        `
    };

    const response = await request.post(graphqlEndpoint, {
        data: graphqlQuery,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    expect(
        response.ok(),
        `GraphQL request failed: ${response.status()} ${response.statusText()}`,
    ).toBeTruthy();

    const responseJson = await response.json();
    console.log('[GraphQL Response]:', JSON.stringify(responseJson, null, 2));

    const companyData = responseJson.data.company;

    expect(companyData.name).toBe('SpaceX');
    expect(companyData.founder).toBe('Elon Musk');
    expect(companyData.ceo).toBe('Elon Musk');

    console.log(`[GraphQL Success]: Данные проверены. CEO компании ${companyData.name} — это действительно ${companyData.ceo}.`);
});
