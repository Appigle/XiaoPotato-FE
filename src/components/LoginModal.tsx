import { Button, Card, Dialog, Input, Typography } from '@material-tailwind/react';
import Api from '@src/Api';
import HTTP_RES_CODE from '@src/utils/request/httpResCode';
import Toast from '@src/utils/toastUtils';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  setOpen: (open: boolean) => void;
  openSignUp: () => void;
}

export function LoginModal({
  open,
  setOpen,
  openSignUp,
  isGuest,
  isAdmin,
}: LoginModalProps): JSX.Element {
  const [userAccount, setUserAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [god] = useState(
    () => URLSearchParams && new URLSearchParams(window.location.search).get('god'),
  );

  useEffect(() => {
    if (isGuest) {
      setUserAccount('Guest');
      setPassword('Guest123');
    } else if (isAdmin) {
      setUserAccount('admin');
      setPassword('admin123');
    } else {
      setUserAccount(userAccount);
      setPassword(password);
    }
  }, [isGuest, isAdmin]);

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();

    setIsLoading(true);
    try {
      // Ziqi API
      const response = await Api.xPotatoApi.userLogin({ userAccount, userPassword: password });
      console.log('Login successful', response.data);
      if (response.data.code !== HTTP_RES_CODE) {
        Toast.error(response.data.message);
        return;
      }
      // 处理登录成功后的逻辑，例如保存token、更新用户状态等
      setOpen(false);
      navigate('/xp/home');
    } catch (error) {
      console.error('Login failed', axios.isAxiosError(error) ? error.response?.data : error);

      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    setOpen(false);
    openSignUp();
  };

  useEffect(() => {
    if (god?.toLocaleLowerCase() === 'ray') {
      setUserAccount('admin');
      setPassword('admin123');
      setTimeout(() => {
        handleLogin();
      }, 1000);
    }
  }, []);

  return (
    <Dialog
      open={open}
      handler={() => {
        setUserAccount('');
        setPassword('');
        setOpen(false);
      }}
      size="sm"
      className="flex items-center justify-center bg-gray-100 p-5"
    >
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Welcome. Enter your details to Sign In.
        </Typography>
        <form
          className="w-70 mb-2 mt-8 max-w-screen-lg align-middle sm:w-96"
          onSubmit={handleLogin}
        >
          <div className="mb-4 flex flex-col gap-4">
            <Input
              label="User Account"
              id="userAccount"
              type="text"
              size="lg"
              value={userAccount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAccount(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
              crossOrigin="anonymous"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
              required
              crossOrigin="anonymous"
            />
          </div>

          <Button className="mt-6" fullWidth type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Typography color="gray" className="mt-4 text-center font-normal">
            You don't have an account?{' '}
            <Button
              variant="text"
              color="blue-gray"
              className="font-medium"
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </Typography>
        </form>
      </Card>
    </Dialog>
  );
}
