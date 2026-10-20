import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchUserOrders } from '../../services/feed-slice';
import { useSelector, useDispatch } from '../../services/store';

import type { FC } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && !userOrders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};