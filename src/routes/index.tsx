import Email from '@/views/email';
import ErrorPage from '@/views/ErrorPage.tsx';
import Home from '@/views/home/index.tsx';
import ProfilePage from '@/views/profile/ProfileIndex.tsx';
import Starry from '@/views/starry';
import HeroSection from '@src/views/About.tsx';
import Admin from '@src/views/admin/Admin.tsx';
import AdminPostsPage from '@src/views/admin/AdminPostsPage.tsx';
import IELTSTraining from '@src/views/IELTS/IELTSTraining.tsx';
import PostList from '@src/views/index.tsx';
import UserPostsPage from '@src/views/myPosts/myPosts.tsx';
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
    path: '/xp',
    element: <PostList />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'profile/:userId?',
        element: <ProfilePage />,
      },
      {
        path: 'profile/:userId/posts',
        element: <UserPostsPage />,
      },
      {
        path: 'email',
        element: <Email />,
      },
    ],
  },
  {
    path: '/profile/:userId',
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile/:userId/posts',
    element: <UserPostsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/about',
    element: <HeroSection />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'admin/users',
    element: <Admin />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'admin/posts',
    element: <AdminPostsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/ielts',
    element: <IELTSTraining />,
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routers);
export default router;
