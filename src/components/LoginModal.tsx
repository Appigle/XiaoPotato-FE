import { Button, Card, Dialog, Input, Typography } from '@material-tailwind/react';
import Api from '@src/Api';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSignUp: () => void;
}

export function LoginModal({ open, setOpen, openSignUp }: LoginModalProps): JSX.Element {
  const [userAccount, setUserAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // Ziqi API
      const response = await Api.xPotatoApi.userLogin({ userAccount, userPassword: password });
      console.log('Login successful', response.data);
      // 处理登录成功后的逻辑，例如保存token、更新用户状态等
      setOpen(false);
      navigate('/home');
    } catch (error) {
      console.error('Login failed', axios.isAxiosError(error) ? error.response?.data : error);

      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    setOpen(false);
    openSignUp();
  };

  return (
    <Dialog
      open={open}
      handler={() => setOpen(false)}
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
        <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLogin}>
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
