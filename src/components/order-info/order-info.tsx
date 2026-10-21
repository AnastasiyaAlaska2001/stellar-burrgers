import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getOrderByNumber } from '../../services/order-slice';
import { useDispatch, useSelector } from '../../services/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

import type { TIngredient, TOrder } from '@utils-types';
import type { FC } from 'react';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  const feedOrders: TOrder[] = useSelector((state) => state.feed?.orders || []);

  const fetchedOrder = useSelector((state) => state.order?.orderByNumber);

  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNum = Number(number);

    return (
      feedOrders.find((item: TOrder) => item.number === orderNum) ||
      (fetchedOrder?.number === orderNum ? fetchedOrder : null)
    );
  }, [number, feedOrders, fetchedOrder]);

  useEffect(() => {
    if (number && !orderData) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing: TIngredient) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
