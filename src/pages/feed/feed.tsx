import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeeds } from '../../services/feed-slice';
import { useSelector, useDispatch } from '../../services/store';

import type { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    void (async (): Promise<void> => {
      await dispatch(fetchFeeds());
    })();
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void (async (): Promise<void> => {
      await dispatch(fetchFeeds());
    })();
  };

  // Показываем Preloader только при ВЕРВИЧНОЙ загрузке, когда данных еще нет
  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
