import useGlobalStore from '@src/stores/useGlobalStore';
import { useCallback } from 'react';
import { useNavigate, type To } from 'react-router-dom';
import Toast from '../toastUtils';

const useGoBack = () => {
  const navigate = useNavigate();
  return useCallback(
    (path?: string | undefined) => {
      navigate((path || history.length > 1 ? -1 : '/xp/home') as To);
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
  const userInfo = useGlobalStore((s) => s.userInfo);
  return useCallback(() => {
    if (!userInfo?.id) {
      Toast.error('User id is null!');
      return;
    }
    navigate(`/xp/profile/${userInfo.id}`);
  }, [navigate, userInfo?.id]);
};

export { useGoBack, useGoToMyPost, useGoToProfile };
