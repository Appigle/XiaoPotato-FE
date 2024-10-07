import { user_profile } from '@/@types/request/XPotato';
import HTTP_RES_CODE from '@/utils/request/httpResCode';
import { Button } from '@material-tailwind/react';
import Api from '@src/Api';
import { useCallback, useEffect, useState } from 'react';

const Home = (): JSX.Element => {
  const [userProfile, setUser] = useState<user_profile | null>(null);
  useEffect(() => {
    Api.xPotatoApi.userCurrent().then((res) => {
      if (res.code === HTTP_RES_CODE.SUCCESS) {
        setUser(res.data);
      }
    });
  }, []);
  const onLogin = useCallback(() => {
    Api.xPotatoApi.userLogin({ userAccount: 'ray002', userPassword: 'pwd12345' }).then((res) => {
      const { data, code } = res;
      code === HTTP_RES_CODE.SUCCESS_CODE && setUser(data);
    });
  }, []);
  return (
    <div className="flex w-screen items-center justify-center p-10 text-2xl">
      {userProfile && <>Login Successfully: {JSON.stringify(userProfile, null, 2) || 'Failed'}</>}
      {!userProfile && <Button onClick={onLogin}>Login</Button>}
    </div>
  );
};
export default Home;
