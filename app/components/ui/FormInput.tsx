import { forwardRef } from 'react';

const baseInput =
  'w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary placeholder:text-text-secondary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseInput} ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  )
);

FormInput.displayName = 'FormInput';
