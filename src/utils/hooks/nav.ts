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

export { useGoBack, useGoToMyPost, useGoToProfile };
