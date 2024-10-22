import { useCallback } from 'react';
import { useNavigate, type To } from 'react-router-dom';

const useGoBack = () => {
  const navigate = useNavigate();
  return useCallback(
    (path?: string | undefined) => {
      navigate((path || history.length > 1 ? -1 : '/home') as To);
    },
    [navigate],
  );
};

export { useGoBack };
