'use client'

import * as React from "react"
import { Input } from "./input"
import { cn } from "../../lib/utils"

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error, ...props }, ref) => {
    const formatPhoneNumber = (value: string) => {
      const phone = value.replace(/\D/g, '')
      if (phone.length < 4) return phone
      if (phone.length < 7) return `${phone.slice(0, 3)} ${phone.slice(3)}`
      return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value)
      e.target.value = formatted
      props.onChange?.(e)
    }

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          +996
        </div>
        <Input
          {...props}
          ref={ref}
          className={cn("pl-14", className)}
          onChange={handleChange}
          maxLength={12}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput } 