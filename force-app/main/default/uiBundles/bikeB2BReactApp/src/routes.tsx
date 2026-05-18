import type { RouteObject } from 'react-router';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from './pages/Home/HomePage';
import CatalogPage from './pages/Catalog/CatalogPage';
import OrdersPage from './pages/Orders/OrdersPage';
import NotFound from './pages/NotFound';

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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
