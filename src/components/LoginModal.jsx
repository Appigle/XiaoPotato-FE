import { useState } from 'react';
import { Card, Input, Button, Typography, Dialog } from '@material-tailwind/react';
import axios from 'axios';

export function LoginModal({ open, setOpen, openSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
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
      console.error('Login failed', error.response?.data || error.message);
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
              onChange={(e) => setEmail(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
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
              onChange={(e) => setPassword(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
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

// set the login function
async function loginFunction(email, password) {
  // 模拟 API 调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
}
