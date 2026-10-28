import { test, expect } from '@playwright/test';

test.describe('Работа конструктора бургеров', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/har-files/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'fallback',
    });
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();

    await page
      .evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      })
      .catch((e) => {
        console.error(e);
      });
  });

  test('Отображение ингредиентов', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
  });

  test('Добавление ингредиентов', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('constructor-element-bottom')).toContainText(
      'Выберите булки'
    );

    await expect(page.getByTestId('constructor-element-top')).toContainText(
      'Выберите булки'
    );

    // Добавляем булку
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

    // Добавляем начинку
    await expect(page.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();

    const ingredient = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-element').nth(0)).toContainText(
      'Биокотлета из марсианской Магнолии'
    );

    // Добавляем соус
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

    // Закрытие кнопкой
    await page.getByTestId('modal-close').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Закрытие кликом по оверлею
    await ingredient.getByRole('link').click();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 },
    });

    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Закрытие клавишей Escape
    await ingredient.getByRole('link').click();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Функционал создания заказа', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'refreshToken',
        '4c699a90f721f950be38a9a3799696695db632064105a3c5706718cc3c8466d738b3e7b2837548de'
      );
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZTBhY2FjOWMxN2M0NmViNjc2MWRmNyIsImlhdCI6MTc5MzEwOTE2NCwiZXhwIjoxNzkzMTEwMzY0fQ.O6fxeBH0FtvJxxW1u7_ga0QVte3NQ4vgIf_JfTPLlr8',
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

    // Добавляем булку
    const bun = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    // Добавляем начинку
    const ingredient = page
      .getByTestId('ingredient-element')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('order-number')).not.toBeVisible();

    await page.getByText('Оформить заказ').click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await expect(page.getByTestId('order-number')).toBeVisible();

    await expect(page.getByTestId('order-number')).toContainText('110076');

    // Закрываем модальное окно заказа
    await page.getByTestId('modal-close').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Проверяем, что конструктор очищен
    await expect(page.getByTestId('constructor-element-bottom')).toHaveText(
      'Выберите булки'
    );

    await expect(page.getByTestId('constructor-element-top')).toHaveText(
      'Выберите булки'
    );

    await expect(page.getByTestId('constructor-element')).toHaveText('Выберите начинку');
  });
});
