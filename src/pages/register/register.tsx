import { RegisterUI } from '@ui-pages';
import { useState } from 'react';

import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/user-slice';

import type { FC, SyntheticEvent } from 'react';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    );
  };

  return (
    <RegisterUI
      errorText=""
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
