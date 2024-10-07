import { Card, Input, Button, Typography, Dialog } from '@material-tailwind/react';

export function LoginModal({ open, setOpen }) {
  const handleLogin = (e) => {
    e.preventDefault();
    //login logic here
    console.log('login submitted');
    setOpen(false);
  };
  return (
    <Dialog open={open} handler={() => setOpen(false)} size="xs">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Welcome. Enter your details to Sign In.
        </Typography>
        <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            sign In
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            You don't have an account?{' '}
            <a href="#" className="font-medium text-gray-900">
              Sign Up
            </a>
          </Typography>
        </form>
      </Card>
    </Dialog>
  );
}
