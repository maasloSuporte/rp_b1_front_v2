import { forwardRef } from 'react';

const baseTextarea =
  'w-full min-h-[6rem] px-4 py-3 text-base text-text-primary placeholder:text-text-secondary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-y';

export interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={`${baseTextarea} ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  )
);

FormTextarea.displayName = 'FormTextarea';
