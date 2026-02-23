import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
    test('should return server information from ping endpoint', async ({ request }) => {
        const response = await request.get('http://localhost:3000/api/');
        
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('message');
        expect(data.message).toContain('timeclicker server');
        expect(data).toHaveProperty('version');
    });

    test('should return swagger documentation', async ({ request }) => {
        const response = await request.get('http://localhost:3000/api/swagger.json');
        
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('openapi');
        expect(data).toHaveProperty('info');
    });
});
