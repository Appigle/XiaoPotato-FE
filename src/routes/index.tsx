import ErrorPage from '@/views/ErrorPage.tsx';
import Home from '@/views/home/index.tsx';
import Starry from '@/views/starry';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import ProfilePage from '@/views/profile/ProfileIndex.tsx';
import UserPostsPage from '@src/views/myPosts/myPosts.tsx';

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
  {
    path: '/profile',
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile/:userId/posts',
    element: <UserPostsPage />,
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routers);
export default router;
