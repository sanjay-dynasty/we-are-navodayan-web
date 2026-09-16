import type { ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__icon" aria-hidden="true">
          �
        </div>

        <h2>{title}</h2>

        {message && <p>{message}</p>}

        {action && <div className="empty-state__action">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
