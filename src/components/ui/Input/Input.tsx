import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="ui-input">
      {label && (
        <label className="ui-input__label" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        className={`ui-input__field ${error ? 'ui-input__field--error' : ''} ${className}`.trim()}
        {...props}
      />

      {error && <span className="ui-input__error">{error}</span>}
    </div>
  );
}

export default Input;
