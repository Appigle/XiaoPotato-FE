import { NavLink, useRouteError } from 'react-router-dom';

interface errorType {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as errorType;
  return (
    <div
      id="error-page"
      className="flex h-screen w-screen flex-col items-center justify-center text-2xl"
    >
      <h1 className="py-4 text-4xl font-bold">Oops!</h1>
      <p className="py-4">Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <NavLink to="/" className={'text-md py-8 text-sm font-normal text-blue-500 underline'}>
        Home
      </NavLink>
    </div>
  );
}
