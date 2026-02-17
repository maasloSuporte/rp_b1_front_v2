import type { ButtonHTMLAttributes } from 'react';

const base =
  'inline-flex items-center justify-center font-semibold text-base rounded-xl transition-all duration-200 min-h-[3.5rem] px-8 py-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary:
    'bg-orange text-white shadow-sm hover:shadow-md hover:bg-orange/90 active:scale-[0.98]',
  secondary:
    'bg-purple-100 text-purple border-2 border-purple/20 hover:bg-purple-100/80 hover:border-purple/30 active:scale-[0.98]',
};

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function FormButton({
  variant = 'primary',
  children,
  className = '',
  ...props
}: FormButtonProps) {
  return (
    <button
      type={props.type ?? 'button'}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
