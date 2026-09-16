import { Link, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  return (
    <>
      <h1>Something went wrong</h1>
      <p>We couldn't load this page.</p>
      <Link to="/">Go to Home</Link>
    </>
  );
}

export default ErrorPage;
