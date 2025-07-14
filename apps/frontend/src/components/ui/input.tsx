import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  success?: boolean;
  showClear?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      iconLeft,
      iconRight,
      success = false,
      showClear = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      props.value || props.defaultValue || ""
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    const finalRef = ref || inputRef;

    React.useEffect(() => {
      if (props.value !== undefined) {
        setInternalValue(props.value);
      }
    }, [props.value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const handleClear = () => {
      const input = (finalRef as React.RefObject<HTMLInputElement>)?.current;
      if (input) {
        const event = new Event("input", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: false,
          value: input,
        });

        input.value = "";
        setInternalValue("");

        if (props.onChange) {
          props.onChange(event as any);
        }

        input.focus();
      }
    };

    const hasValue = String(internalValue).length > 0;
    const showClearIcon = showClear && hasValue;

    return (
      <div className="relative flex items-center w-full">
        {iconLeft && (
          <div
            className={cn(
              "absolute left-3 flex items-center pointer-events-none text-muted-foreground",
              success && "text-success transition-colors"
            )}
          >
            {iconLeft}
          </div>
        )}
        <input
          type={type}
          ref={finalRef}
          data-slot="input"
          className={cn(
            "file:text-foreground max-w-[32rem] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-15 w-full min-w-0 rounded-xl  border-1 border-accent bg-muted px-3 py-1 text-sm md:text-lg shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            success &&
              "bg-success-foreground border-success ring-success-foreground transition-all focus-visible:border-success",
            iconLeft && "pl-12",
            (iconRight || showClearIcon) && "pr-12",
            iconRight && showClearIcon && "pr-20",
            className
          )}
          {...props}
          onChange={handleInputChange}
        />

        {showClearIcon && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-sm hover:bg-muted-foreground/10",
              iconRight ? "right-12" : "right-3"
            )}
            tabIndex={0}
            aria-label="Clear input"
          >
            <X size={26} />
          </button>
        )}

        {iconRight && (
          <div className="absolute right-3 flex items-center text-muted-foreground">
            {iconRight}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
