import ErrorPage from '@/views/ErrorPage.tsx';
import Home from '@/views/home/index.tsx';
import Starry from '@/views/starry';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';

const routers: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // {
      //   path: 'demo/request',
      //   element: <RequestTest />,
      // },
    ],
  },
  {
    path: '/demo/starry',
    element: <Starry />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/home',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routers);
export default router;
