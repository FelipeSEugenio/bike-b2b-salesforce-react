import type { RouteObject } from 'react-router';
import AppLayout from '@/shared/components/layout/AppLayout';
import HomePage from './pages/HomePage';
import CatalogPage from '@/features/bikes/components/CatalogPage';
import OrdersPage from '@/features/orders/components/OrdersPage';
import DashboardPage from '@/features/dashboard/components/DashboardPage';
import NotFound from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
