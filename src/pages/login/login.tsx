import { LoginUI } from '@ui-pages';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/user-slice';

import type { LocationState } from '@/utils/types';
import type { FC, SyntheticEvent } from 'react';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const { error } = useSelector((state) => state.user);

  const from = state?.from?.pathname ?? '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // Успех: редирект
        void (async (): Promise<void> => {
          await navigate(from ?? '/', { replace: true });
        });
      })
      .catch((error) => {
        console.error('Ошибка входа:', error);
        alert('Не удалось войти. Проверьте логин и пароль.');
      });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
