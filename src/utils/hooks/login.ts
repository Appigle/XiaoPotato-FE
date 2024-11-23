import xPotatoApi from '@src/Api/xPotatoApi';
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLoginCheck = () => {
  const setUserInfo = useGlobalStore((s) => s.setUserInfo);
  const setUserChecking = useGlobalStore((s) => s.setUserChecking);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    setChecking(true);
    setUserChecking(true);
    xPotatoApi
      .userCurrent()
      .then((res) => {
        if (res.data) {
          setUserInfo(res.data?.user);
          setChecking(false);
          setUserChecking(false);
          if (location.pathname === '/') navigate('/xp/home');
        } else {
          throw new Error('login failed');
        }
        return res.data;
      })
      .catch((e) => {
        if (e.code === 'ERR_CANCELED') return;
        localStorage.removeItem(X_ACCESS_TOKEN);
        setUserInfo(null);
        if (location.pathname !== '/') navigate('/');
      });
  }, [setUserInfo, navigate, setUserChecking]);
  return [checking];
};

export default useLoginCheck;
