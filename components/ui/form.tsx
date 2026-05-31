"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Controller,
  FormProvider,
  useFormContext,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
  );

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> =
    FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider
      value={{ name: props.name }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext =
    React.useContext(FormFieldContext);

  const { getFieldState, formState } =
    useFormContext();

  const fieldState = getFieldState(
    fieldContext.name,
    formState
  );

  return {
    name: fieldContext.name,
    ...fieldState,
  };
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  />
));

FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<
    typeof LabelPrimitive.Root
  >
>(({ className, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        error && "text-destructive",
        className
      )}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div ref={ref} {...props} />
));

FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  const { error } = useFormField();

  if (!error?.message) return null;

  return (
    <p
      ref={ref}
      className="text-sm text-destructive"
      {...props}
    >
      {String(error.message)}
    </p>
  );
});

FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
};