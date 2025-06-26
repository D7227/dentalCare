// components/shared/CustomButton.tsx

import React from 'react'
import { Button } from '../ui/button'
import { LucideIcon } from 'lucide-react'

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'btn-primary px-4 py-3',
  outline: 'btn-outline px-4 py-3 border border-gray-300 text-black',
  ghost: 'btn-ghost text-gray-500 hover:bg-gray-100',
  default: '',
}

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  variant?: 'primary' | 'outline' | 'ghost' | 'default'
  className?: string
  disabled?: boolean
  children: React.ReactNode
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  variant = 'primary',
  type = 'button',
  ...props
}) => {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 w-full sm:w-fit ${variantClass} ${className}`}
      {...props}
    >
      {LeftIcon && <LeftIcon size={16} className="mr-1" />}
      {children}
      {RightIcon && <RightIcon size={16} className="ml-1" />}
    </Button>
  )
}

export default CustomButton
