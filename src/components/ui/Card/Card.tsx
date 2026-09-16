import type { HTMLAttributes } from 'react';
import './Card.css';

function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`ui-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default Card;
