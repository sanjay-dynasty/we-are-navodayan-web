import type { ReactNode } from 'react';
import './ErrorState.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

function ErrorState({
  title = 'Something went wrong',
  message = 'We were unable to complete your request. Please try again.',
  action,
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__content">
        <div className="error-state__icon" aria-hidden="true">
          !
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        {action && <div className="error-state__action">{action}</div>}
      </div>
    </div>
  );
}

export default ErrorState;
