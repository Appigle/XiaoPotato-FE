import xPotatoApi from '@src/Api/xPotatoApi';
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGod from './god';

const useLoginCheck = () => {
  const setUserInfo = useGlobalStore((s) => s.setUserInfo);
  const setUserChecking = useGlobalStore((s) => s.setUserChecking);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isGod] = useGod();
  useEffect(() => {
    setChecking(true);
    setUserChecking(true);
    if (!localStorage.getItem(X_ACCESS_TOKEN) || isGod) {
      setChecking(false);
      setUserChecking(false);
      return;
    }
    xPotatoApi
      .userCurrent()
      .then((res) => {
        if (res.data) {
          setUserInfo(res.data?.user);
          setChecking(false);
          if (location.pathname === '/') navigate('/xp/home');
        } else {
          throw new Error('Auto login failed');
        }
        return res.data;
      })
      .catch((e) => {
        if (e.code === 'ERR_CANCELED') return;
        localStorage.removeItem(X_ACCESS_TOKEN);
        setUserInfo(null);
        if (location.pathname !== '/') navigate('/');
      })
      .finally(() => {
        setUserChecking(false);
      });
  }, [setUserInfo, navigate, setUserChecking]);
  return [checking];
};

export default useLoginCheck;
