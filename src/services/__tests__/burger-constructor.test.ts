import { expect, it, describe } from '@jest/globals';

import {
  initialState,
  constructorSlice,
  clearConstructor,
  addIngredient,
  removeIngredient,
  moveIngredient,
} from '../constructor-slice';

import type { TConstructorIngredient } from '@utils-types';

const mockIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'test-1',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'test-1',
};

const mockBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'test-3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'test-3',
};

const mockIngredients: TConstructorIngredient[] = [
  mockIngredient,
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'test-2',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_mobile: '',
    image_large: '',
    id: 'test-2',
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'test-3',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_mobile: '',
    image_large: '',
    id: 'test-3',
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'test-4',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_mobile: '',
    image_large: '',
    id: 'test-4',
  },
];

describe('Проверка редьюсера burger-constructor', () => {
  it('Проверка addIngredient', () => {
    const prevState = {
      ...initialState,
      ingredients: [],
    };

    const state = constructorSlice.reducer(prevState, addIngredient(mockIngredient));

    expect(state.ingredients).toHaveLength(1);

    const added = state.ingredients[0];

    expect(added.id).toBeDefined();
    expect(added.id).not.toBe(mockIngredient.id);
  });

  it('Проверка добавления булки через addIngredient', () => {
    const prevState = {
      ...initialState,
      bun: null,
    };

    const state = constructorSlice.reducer(prevState, addIngredient(mockBun));

    expect(state.bun).not.toBeNull();
    expect(state.bun?.type).toBe('bun');
    expect(state.bun?.id).toBeDefined();
    expect(state.bun?.id).not.toBe(mockBun.id);
    expect(state.ingredients).toHaveLength(0);
  });

  it('removeIngredient должен удалять ингредиент по id и сдвигать массив', () => {
    const prevState = {
      ...initialState,
      ingredients: [...mockIngredients],
    };

    const indexBefore = prevState.ingredients.findIndex((i) => i.id === 'test-3');

    expect(indexBefore).toBeGreaterThanOrEqual(0);

    const state = constructorSlice.reducer(prevState, removeIngredient('test-3'));

    const existsAfter = state.ingredients.some((i) => i.id === 'test-3');

    expect(existsAfter).toBe(false);

    expect(state.ingredients).toHaveLength(prevState.ingredients.length - 1);
  });

  it('Проверка moveIngredientUp', () => {
    const sliceInitialState = {
      ...initialState,
      ingredients: [...mockIngredients],
    };

    const newState = constructorSlice.reducer(
      sliceInitialState,
      moveIngredient({ index: 0, moveIndex: 1 })
    );

    expect(newState.ingredients[1]).toEqual(mockIngredient);
  });

  it('Проверка moveIngredientDown', () => {
    const sliceInitialState = {
      ...initialState,
      ingredients: [...mockIngredients],
    };

    const newState = constructorSlice.reducer(
      sliceInitialState,
      moveIngredient({ index: 0, moveIndex: 2 })
    );

    expect(newState.ingredients[2]).toEqual(mockIngredient);
  });

  it('Проверка clearConstructor — сброс конструктора после заказа', () => {
    const sliceInitialState = {
      ...initialState,
      bun: mockBun,
      ingredients: [mockIngredient],
    };

    const newState = constructorSlice.reducer(sliceInitialState, clearConstructor());

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toEqual([]);
  });

  it('Проверка UNKNOWN_ACTION', () => {
    const newState = constructorSlice.reducer(undefined, {
      type: 'unknown',
    });

    expect(newState).toEqual(initialState);
  });
});
