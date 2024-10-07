import { useState } from 'react';
import { Card, Input, Button, Typography, Dialog } from '@material-tailwind/react';
import axios from 'axios';

export function RegisterModal({ open, setOpen, openLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      // Ziqi 's API
      const response = await axios.post('api/register', {
        email,
        password,
      });
      console.log('Sign up successful:', response.data);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert('Sign up failed. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = () => {
    setOpen(false);
    openLogin();
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
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Create your account to join us.
        </Typography>
        <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
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
              required
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
              required
            />
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              size="lg"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-t-blue-gray-200 focus:border-t-gray-900"
            />
          </div>

          <Button className="mt-6" fullWidth type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Have an account?{' '}
            <Button
              variant="text"
              color="blue-gray"
              className="font-medium"
              onClick={handleSignInClick}
            >
              Sign In
            </Button>
          </Typography>
        </form>
      </Card>
    </Dialog>
  );
}
