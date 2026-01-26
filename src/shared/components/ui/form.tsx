import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { Label } from "./label"

interface FormFieldContextValue {
  id: string
  name: string
  error?: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined)

interface FormFieldProps {
  name: string
  children: React.ReactNode
  error?: string
}

function FormField({ name, children, error }: FormFieldProps) {
  const id = React.useId()

  return (
    <FormFieldContext.Provider value={{ id, name, error }}>
      <div className="space-y-2">
        {children}
      </div>
    </FormFieldContext.Provider>
  )
}

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

function FormLabel({ className, ...props }: FormLabelProps) {
  const context = React.useContext(FormFieldContext)
  
  return (
    <Label
      htmlFor={context?.id}
      className={cn(context?.error && "text-destructive", className)}
      {...props}
    />
  )
}

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

function FormControl({ ...props }: FormControlProps) {
  const context = React.useContext(FormFieldContext)
  
  return (
    <div id={context?.id} {...props} />
  )
}

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function FormDescription({ className, ...props }: FormDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function FormMessage({ className, children, ...props }: FormMessageProps) {
  const context = React.useContext(FormFieldContext)
  const body = context?.error || children

  if (!body) {
    return null
  }

  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export { FormField, FormLabel, FormControl, FormDescription, FormMessage }
