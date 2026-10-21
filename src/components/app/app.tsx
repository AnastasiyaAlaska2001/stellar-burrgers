import { Modal, OrderInfo, IngredientDetails, AppHeader } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredient-slice';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/user-slice';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { FC } from 'react';

export const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Сохраняем фоновый маршрут для корректного открытия модальных окон поверх текущей страницы
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    // 1. Проверяем статус авторизации пользователя (внутри проверяется наличие refreshToken)
    dispatch(checkUserAuth());
    // 2. Первоначальная загрузка ингредиентов
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    // Возвращаемся на предыдущий маршрут при закрытии модального окна
    navigate(-1);
  };

  return (
    <div className="app">
      <AppHeader />

      {/* Основные маршруты */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* Роуты только для НЕавторизованных пользователей */}
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищённые роуты (только для авторизованных) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Прямые переходы по ссылкам на отдельные страницы (без модалки/фона) */}
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Маршрут 404 */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Роуты модальных окон, отображаемые поверх фонового экрана */}
      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="Детали заказа" onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Детали заказа" onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
