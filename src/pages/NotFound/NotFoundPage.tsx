import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go to Home</Link>
    </>
  );
}

export default NotFoundPage;
