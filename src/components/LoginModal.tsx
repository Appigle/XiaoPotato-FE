import React, { useState } from 'react';
import { Card, Input, Button, Typography, Dialog } from '@material-tailwind/react';
import axios from 'axios';

interface LoginModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSignUp: () => void;
}

export function LoginModal({ open, setOpen, openSignUp }: LoginModalProps): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Ziqi API
      const response = await axios.post('/api/login', { email, password });
      console.log('Login successful', response.data);
      // 处理登录成功后的逻辑，例如保存token、更新用户状态等
      setOpen(false);
    } catch (error) {
      console.error('Login failed', axios.isAxiosError(error) ? error.response?.data : error);
      alert('Login failed. Please check your email and password.');
    } finally {
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
      className="flex items-center justify-center bg-gray-300 p-5"
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <Input
              id="email"
              type="email"
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
              crossOrigin="anonymous"
            />

            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
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
