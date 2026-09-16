import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

function Spinner({ size = 'md' }: SpinnerProps) {
  return <span className={`ui-spinner ui-spinner--${size}`} role="status" aria-label="Loading" />;
}

export default Spinner;
