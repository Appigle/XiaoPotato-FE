import { Button, Card, Dialog, Input, Typography } from '@material-tailwind/react';
import Api from '@src/Api';
import React, { useState } from 'react';
import { FormErrors, validateRegisterForm } from './common/formValidation';

interface RegisterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  openLogin: () => void;
}

export function RegisterModal({ open, setOpen, openLogin }: RegisterModalProps): JSX.Element {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userAccount, setUserAccount] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm({
      firstName,
      lastName,
      userAccount,
      userPassword,
      checkPassword,
      email,
      phone,
      gender,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await Api.xPotatoApi.registerAccount({
        firstName,
        lastName,
        userAccount,
        userPassword,
        checkPassword,
        email,
        phone,
        gender,
      });
      console.log('Sign up successful:', response.data);
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrors({ general: 'Sign up failed. Please try again later.' });
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
      className="flex items-center justify-center bg-potato-white p-5"
    >
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="black">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Create your account to join us.
        </Typography>
        <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-4">
            <Input
              label="First Name"
              id="firstName"
              type="text"
              size="lg"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              required
              crossOrigin="anonymous"
              aria-label="Enter your first name"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}

            <Input
              label="Last Name"
              id="lastName"
              type="text"
              size="lg"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              required
              crossOrigin="anonymous"
              aria-label="Enter your last name"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}

            <Input
              label="User Account"
              id="userAccount"
              type="text"
              size="lg"
              value={userAccount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAccount(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              required
              crossOrigin="anonymous"
              aria-label="Enter your user account"
            />
            {errors.userAccount && (
              <p className="mt-1 text-xs text-red-500">{errors.userAccount}</p>
            )}

            <Input
              label="Password"
              id="userPassword"
              type="password"
              size="lg"
              value={userPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              required
              crossOrigin="anonymous"
              aria-label="Enter your password"
            />
            {errors.userPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.userPassword}</p>
            )}

            <Input
              label="Confirm Password"
              id="checkPassword"
              type="password"
              size="lg"
              value={checkPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCheckPassword(e.target.value)
              }
              className="border-t-potato-light-green focus:border-t-potato-green"
              crossOrigin="anonymous"
              required
              aria-label="Confirm your password"
            />
            {errors.checkPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.checkPassword}</p>
            )}
            <Input
              label="Email (Optional)"
              id="email"
              type="email"
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              crossOrigin="anonymous"
              aria-label="Enter your email address (optional)"
            />

            <Input
              label="Phone Number (Optional)"
              id="phone"
              type="tel"
              size="lg"
              placeholder="123-456-7890"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              crossOrigin="anonymous"
              aria-label="Enter your phone number (optional)"
            />

            <Input
              label="Gender (Optional)"
              id="gender"
              type="text"
              size="lg"
              value={gender}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGender(e.target.value)}
              className="border-t-potato-light-green focus:border-t-potato-green"
              crossOrigin="anonymous"
              aria-label="Enter your gender (optional)"
            />
          </div>
          {errors.general && <p className="mt-1 text-xs text-red-500">{errors.general}</p>}
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
