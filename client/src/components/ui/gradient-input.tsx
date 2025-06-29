import React from 'react';

const GradientInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full
        rounded-xl
        border border-[#D9F5E7]
        bg-[linear-gradient(135deg,_#fff_60%,_#E9F8F2_100%)]
        px-4 py-2
        text-base
        text-foreground
        font-medium
        shadow-none
        outline-none
        transition-colors duration-150
        focus:border-[#12B76A]
        placeholder:text-customGray-100
        ${className}
      `}
      {...props}
    />
  )
);

export default GradientInput; 