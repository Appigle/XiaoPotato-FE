import xPotatoApi from '@src/Api/xPotatoApi';
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useLoginCheck = () => {
  const setUserInfo = useGlobalStore((s) => s.setUserInfo);
  const navigate = useNavigate();
  useEffect(() => {
    xPotatoApi
      .userCurrent()
      .then((res) => {
        if (res.data) {
          setUserInfo(res.data);
          if (location.pathname === '/') navigate('/home');
        } else {
          throw new Error('login failed');
        }
        return res.data;
      })
      .catch((e) => {
        console.log('%c [ e ]-23', 'font-size:13px; background:pink; color:#bf2c9f;', e);
        if (e.code === 'ERR_CANCELED') return;
        localStorage.removeItem(X_ACCESS_TOKEN);
        setUserInfo(null);
        if (location.pathname !== '/') navigate('/');
      });
  }, []);
};

export default useLoginCheck;
