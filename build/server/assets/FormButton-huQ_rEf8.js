import { jsxs, jsx } from "react/jsx-runtime";
import React, { forwardRef, useMemo, Children, isValidElement } from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
const baseInput = "w-full min-h-[2.75rem] px-4 py-3 text-base text-text-primary placeholder:text-text-secondary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200";
const FormInput = forwardRef(
  ({ label, error, required, className = "", ...props }, ref) => /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label && /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-error", children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref,
        className: `${baseInput} ${error ? "border-error focus:border-error focus:ring-error/20" : ""} ${className}`,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-error", children: error })
  ] })
);
FormInput.displayName = "FormInput";
const buttonBase = "relative w-full min-h-[2.75rem] pl-4 pr-10 py-3 text-left text-base text-text-primary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 cursor-pointer";
const optionsBase = "max-h-60 w-[var(--button-width)] overflow-auto rounded-xl border-2 border-border-form bg-white py-1 shadow-lg focus:outline-none";
const optionBase = "relative cursor-pointer select-none py-2.5 pl-4 pr-10 text-base text-text-primary data-focus:bg-primary/10 data-selected:font-medium";
function parseOptionsFromChildren(children) {
  const options = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === "option") {
      const { value, children: label } = child.props;
      options.push({ value: value ?? "", label: label ?? String(value) });
    }
  });
  return options;
}
const FormSelect = React.forwardRef(function FormSelect2({
  label,
  error,
  required,
  className = "",
  children,
  value,
  onChange,
  onBlur,
  name,
  disabled,
  ...rest
}, ref) {
  const options = useMemo(() => parseOptionsFromChildren(children), [children]);
  const selectableOptions = useMemo(
    () => options.filter((o) => o.value !== 0 && o.value !== ""),
    [options]
  );
  const currentValue = value === void 0 ? "" : value;
  const selectedOption = options.find((o) => String(o.value) === String(currentValue));
  const displayLabel = selectedOption != null ? selectedOption.label ?? "" : "";
  const handleChange = (newValue) => {
    if (typeof onChange === "function") {
      const event = {
        target: { name: name ?? "", value: newValue ?? "", valueAsNumber: Number(newValue) }
      };
      onChange(event);
    }
    onBlur?.();
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label && /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-error", children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "hidden",
        name,
        value: String(currentValue),
        ref,
        readOnly: true,
        "aria-hidden": true
      }
    ),
    /* @__PURE__ */ jsxs(
      Listbox,
      {
        as: "div",
        value: currentValue,
        onChange: handleChange,
        disabled,
        className: "relative",
        children: [
          /* @__PURE__ */ jsxs(
            ListboxButton,
            {
              className: `${buttonBase} ${error ? "border-error focus:border-error focus:ring-error/20" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: selectedOption ? "block truncate" : "block truncate text-text-secondary", children: displayLabel }),
                /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3", children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "h-5 w-5 text-text-secondary", "aria-hidden": true }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            ListboxOptions,
            {
              anchor: "bottom start",
              transition: true,
              className: `${optionsBase} [--anchor-gap:4px] origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0`,
              children: selectableOptions.map((opt) => /* @__PURE__ */ jsx(
                ListboxOption,
                {
                  value: opt.value,
                  className: `group ${optionBase}`,
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "flex-1 truncate", children: opt.label }),
                    /* @__PURE__ */ jsx("span", { className: "invisible group-data-[selected]:visible absolute inset-y-0 right-0 flex items-center pr-3 text-primary", children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-5 w-5" }) })
                  ] })
                },
                String(opt.value)
              ))
            }
          )
        ]
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-error", children: error })
  ] });
});
FormSelect.displayName = "FormSelect";
const baseTextarea = "w-full min-h-[6rem] px-4 py-3 text-base text-text-primary placeholder:text-text-secondary bg-white border-2 border-border-form rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-y";
const FormTextarea = forwardRef(
  ({ label, error, required, className = "", ...props }, ref) => /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label && /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold text-text-primary mb-2", children: [
      label,
      " ",
      required && /* @__PURE__ */ jsx("span", { className: "text-error", children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        ref,
        className: `${baseTextarea} ${error ? "border-error focus:border-error focus:ring-error/20" : ""} ${className}`,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-error", children: error })
  ] })
);
FormTextarea.displayName = "FormTextarea";
const base = "inline-flex items-center justify-center font-semibold text-base rounded-xl transition-all duration-200 min-h-[3.5rem] px-8 py-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const variants = {
  primary: "bg-orange text-white shadow-sm hover:shadow-md hover:bg-orange/90 active:scale-[0.98]",
  secondary: "bg-purple-100 text-purple border-2 border-purple/20 hover:bg-purple-100/80 hover:border-purple/30 active:scale-[0.98]"
};
function FormButton({
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: props.type ?? "button",
      className: `${base} ${variants[variant]} ${className}`,
      ...props,
      children
    }
  );
}
export {
  FormInput as F,
  FormSelect as a,
  FormTextarea as b,
  FormButton as c
};
