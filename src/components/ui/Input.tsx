import { cn } from "@/lib/cn";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, success, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "h-9 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-neutral-900 outline-none transition-colors",
            "placeholder:text-neutral-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !error &&
              "border-neutral-300 hover:border-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200",
            error &&
              "border-rose-500  bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-100",
            success &&
              "border-green-500 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-100",
            isPassword && "pr-10",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
