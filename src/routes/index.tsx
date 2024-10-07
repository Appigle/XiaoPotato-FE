import ErrorPage from '@src/views/ErrorPage.tsx';
import Starry from '@src/views/starry';
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
];
const router = createBrowserRouter(routers);
export default router;
