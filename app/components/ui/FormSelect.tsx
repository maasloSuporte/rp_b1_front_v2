import React, { Children, isValidElement, useMemo } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const buttonBase =
  'relative w-full min-h-[2.75rem] pl-4 pr-10 py-3 text-left text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 cursor-pointer';
const optionsBase =
  'max-h-60 w-[var(--button-width)] overflow-auto rounded-xl border-2 border-border-form bg-white py-1 shadow-lg focus:outline-none';
const optionBase =
  'relative cursor-pointer select-none py-2.5 pl-4 pr-10 text-base text-text-primary data-focus:bg-primary/10 data-selected:font-medium';

export interface FormSelectOption {
  value: string | number;
  label: React.ReactNode;
}

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children'> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

function parseOptionsFromChildren(children: React.ReactNode): FormSelectOption[] {
  const options: FormSelectOption[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === 'option') {
      const { value, children: label } = child.props as { value?: string | number; children?: React.ReactNode };
      options.push({ value: value ?? '', label: label ?? String(value) });
    }
  });
  return options;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(function FormSelect(
  {
    label,
    error,
    required,
    className = '',
    children,
    value,
    onChange,
    onBlur,
    name,
    disabled,
    ...rest
  },
  ref
) {
  const options = useMemo(() => parseOptionsFromChildren(children), [children]);
  /** Opções que aparecem no dropdown (exclui placeholder value 0 ou '') */
  const selectableOptions = useMemo(
    () => options.filter((o) => o.value !== 0 && o.value !== ''),
    [options]
  );

  const currentValue = value === undefined ? '' : value;
  const selectedOption = options.find((o) => String(o.value) === String(currentValue));
  const displayLabel = selectedOption != null ? (selectedOption.label ?? '') : '';

  const handleChange = (newValue: string | number | undefined) => {
    if (typeof onChange === 'function') {
      const event = {
        target: { name: name ?? '', value: newValue ?? '', valueAsNumber: Number(newValue) },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
    onBlur?.();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        type="hidden"
        name={name}
        value={String(currentValue)}
        ref={ref as React.Ref<HTMLInputElement>}
        readOnly
        aria-hidden
      />
      <Listbox
        as="div"
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        className="relative"
      >
        <ListboxButton
          className={`${buttonBase} ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
        >
          <span className={selectedOption ? 'block truncate' : 'block truncate text-text-secondary'}>
            {displayLabel}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon className="h-5 w-5 text-text-secondary" aria-hidden />
          </span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          transition
          className={`${optionsBase} [--anchor-gap:4px] origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0`}
        >
          {selectableOptions.map((opt) => (
            <ListboxOption
              key={String(opt.value)}
              value={opt.value}
              className={`group ${optionBase}`}
            >
              <span className="flex items-center">
                <span className="flex-1 truncate">{opt.label}</span>
                <span className="invisible group-data-[selected]:visible absolute inset-y-0 right-0 flex items-center pr-3 text-primary">
                  <CheckIcon className="h-5 w-5" />
                </span>
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';
