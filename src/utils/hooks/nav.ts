import { useCallback } from 'react';
import { useNavigate, type To } from 'react-router-dom';
import Toast from '../toastUtils';

// const useGoBack = () => {
//   const navigate = useNavigate();
//   return useCallback(
//     (path?: string | undefined) => {
//       navigate((path || history.length > 1 ? -1 : '/xp/home') as To);
//     },
//     [navigate],
//   );
// };
const useGoBack = () => {
  const navigate = useNavigate();
  return useCallback(
    (e?: React.MouseEvent<HTMLDivElement> | string) => {
      if (typeof e === 'string') {
        navigate(e);
      } else {
        navigate((history.length > 1 ? -1 : '/xp/home') as To);
      }
    },
    [navigate],
  );
};
const useGoToMyPost = () => {
  const navigate = useNavigate();
  return useCallback(() => {
    navigate('/myPosts');
  }, [navigate]);
};

const useGoToProfile = () => {
  const navigate = useNavigate();
  return useCallback(
    (userId: string | number) => {
      if (!userId) {
        Toast.error('User id is null!');
        return;
      }
      navigate(`/xp/profile/${userId}`);
    },
    [navigate],
  );
};

const useCheckIsRoute = (routes: string[] | string = [], exact: boolean = false) => {
  const path = window.location.pathname || '';
  const routesArray = Array.isArray(routes) ? routes : [routes];
  if (exact) {
    return routesArray.includes(path);
  } else {
    return routesArray.some((route) => path.includes(route));
  }
};

export { useCheckIsRoute, useGoBack, useGoToMyPost, useGoToProfile };
