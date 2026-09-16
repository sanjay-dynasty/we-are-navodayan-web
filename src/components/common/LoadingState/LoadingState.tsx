import Spinner from '../../ui/Spinner/Spinner';
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Spinner />
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
