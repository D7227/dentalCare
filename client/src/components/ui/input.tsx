import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input border-customGray-200 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && " focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        // style={{
        //   background: 'linear-gradient(114deg, rgba(255, 255, 255, 0.00) 37.13%, rgba(11, 128, 67, 0.10) 98.94%)'
        // }}        
        />
        {/* {error && errorMessage && (
          <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
        )} */}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
