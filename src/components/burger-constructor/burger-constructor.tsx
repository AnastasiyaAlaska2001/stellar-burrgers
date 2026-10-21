import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearConstructor } from '../../services/constructor-slice';
import { placeOrder, resetOrderModal } from '../../services/order-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';
import type { FC } from 'react';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void (async (): Promise<void> => {
        try {
          await navigate('/login');
          return;
        } catch (error) {
          console.error(error);
        }
      });
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item: TConstructorIngredient) => item._id),
      constructorItems.bun._id,
    ];

    try {
      const action = dispatch(placeOrder(ingredientIds));

      if (placeOrder.fulfilled.match(action)) {
        dispatch(clearConstructor());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeOrderModal = (): void => {
    dispatch(resetOrderModal());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
