import { test, expect } from '@playwright/test';

test.describe('Работа конструктора бургеров', () => {
  test('Отображение ингридиентов', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
  });

  test('Добавление ингридиентов', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('constructor-element-bottom')).toContainText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor-element-top')).toContainText(
      'Выберите булки'
    );

    //Добавим первую булку
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    const bun = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-element-top')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('constructor-element-bottom')).toContainText(
      'Краторная булка N-200i'
    );

    await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();

    const ingredient = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-element').nth(0)).toContainText(
      'Биокотлета из марсианской Магнолии'
    );

    await expect(page.getByText('Соус Spicy-X')).toBeVisible();

    const sauce = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Соус Spicy-X' });

    await sauce.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-element').nth(1)).toContainText(
      'Соус Spicy-X'
    );
  });

  test('Функционал модального окна', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    const ingredient = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Краторная булка N-200i' });

    await expect(page.getByTestId('modal')).not.toBeVisible();
    await ingredient.getByRole('link').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Краторная булка N-200i');
    await expect(page.getByTestId('modal')).toContainText('420');
    await expect(page.getByTestId('modal')).toContainText('80');
    await expect(page.getByTestId('modal')).toContainText('24');
    await expect(page.getByTestId('modal')).toContainText('53');

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await ingredient.getByRole('link').click();
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await ingredient.getByRole('link').click();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Функционал создания заказа', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'refreshToken',
        '6d0ee3f6f91402596d9ee508a0d31ce3a3410a35f862884e8d2e15b9b8acdd0cdd503aed58c6d22a'
      );
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTAwNjZiNmExNzJkMDAxYjk5NDc1YyIsImlhdCI6MTc4OTA1NjMzOCwiZXhwIjoxNzg5MDU3NTM4fQ.NfSRNZsoLElacIRYTXuZKZk4q2bLuv-vQXkZpoYyeIM',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.routeFromHAR('./tests/har-files/user.har', {
      url: '**/api/auth/user',
      notFound: 'abort',
    });

    await page.routeFromHAR('./tests/har-files/order.har', {
      url: '**/api/orders',
      notFound: 'abort',
    });

    await page.goto('/');
    await expect(page.getByText('test-user')).toBeVisible();

    const bun = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const ingredient = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('order-number')).not.toBeVisible();
    await page.getByText('Оформить заказ').click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('order-number')).toBeVisible();
    await expect(page.getByTestId('order-number')).toContainText('110076');

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(page.getByTestId('constructor-element-bottom')).toHaveText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor-element-top')).toHaveText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor-element')).toHaveText('Выберите начинку');
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.routeFromHAR('./tests/har-files/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort',
    });
  });
});
