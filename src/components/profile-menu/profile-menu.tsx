import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/user-slice';

import type { FC } from 'react';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
