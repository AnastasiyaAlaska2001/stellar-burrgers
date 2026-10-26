import { expect, it, describe } from '@jest/globals';

import { fetchIngredients, ingredientsSlice, initialState } from '../ingredient-slice';

import type { TIngredient } from '@utils-types';

describe('Проверка редьюсера ingredients', () => {
  it('Проверка fetchIngridients.pending', () => {
    const prevState = {
      ...initialState,
      error: 'test error',
    };

    const action = fetchIngredients.pending('requestId', undefined);
    const state = ingredientsSlice.reducer(prevState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Проверка fetchIngridients.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'test',
        type: 'bun',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 100,
        image: '/',
        image_mobile: '/',
        image_large: '/',
      },
    ];

    const prevState = {
      ...initialState,
      isLoading: true,
    };

    const action = fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined);
    const state = ingredientsSlice.reducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('Проверка fetchIngridients.rejected', () => {
    const prevState = {
      ...initialState,
      isLoading: true,
    };

    const action = fetchIngredients.rejected(null, 'requestId', undefined);
    const state = ingredientsSlice.reducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Rejected');
  });

  it('Проверка UNKNOWN_ACTION', () => {
    const state = ingredientsSlice.reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});
