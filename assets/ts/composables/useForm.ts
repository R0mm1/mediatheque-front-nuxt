// Utility for converting Vue Formulate schemas to native form components

export interface FormFieldConfig {
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string | number | boolean; label: string }>;
  value?: any;
  validation?: string[];
  error?: string;
}

/**
 * Convert Formulate schema to native form field configs
 *
 * Before:
 * const schema = {
 *   firstName: { type: 'text', label: 'First Name', validation: 'required' },
 *   email: { type: 'email', label: 'Email', validation: 'required|email' }
 * }
 *
 * After: Use the schema directly with FormField component
 */
export function convertFormulateSchema(
  formulateSchema: Record<string, any>
): FormFieldConfig[] {
  return Object.entries(formulateSchema).map(([name, config]) => {
    const fieldConfig: FormFieldConfig = {
      name,
      type: config.type || "text",
      label: config.label,
      placeholder: config.placeholder,
      required: config.validation?.includes("required") || false,
      disabled: config.disabled || false,
      value: config.value,
      validation: config.validation?.split("|") || [],
    };

    // Convert options if it's a select/radio field
    if (
      (config.type === "select" || config.type === "radio") &&
      config.options
    ) {
      fieldConfig.options = Array.isArray(config.options)
        ? config.options
        : Object.entries(config.options).map(([value, label]) => ({
            value,
            label: label as string,
          }));
    }

    return fieldConfig;
  });
}

/**
 * Validate form data against field configs
 */
export function validateForm(
  formData: Record<string, any>,
  fields: FormFieldConfig[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = formData[field.name];

    // Check required
    if (field.required && !value) {
      errors[field.name] = `${field.label || field.name} is required`;
    }

    // Check email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field.name] = `${
          field.label || field.name
        } must be a valid email`;
      }
    }

    // Check number validation
    if (field.type === "number" && value) {
      if (isNaN(value)) {
        errors[field.name] = `${field.label || field.name} must be a number`;
      }
    }

    // Check min length
    if (field.validation?.includes("minLength")) {
      const match = field.validation.find((v) => v.startsWith("minLength:"));
      if (match) {
        const [, len] = match.split(":");
        if (value?.length < parseInt(len)) {
          errors[field.name] = `${
            field.label || field.name
          } must be at least ${len} characters`;
        }
      }
    }
  }

  return errors;
}

/**
 * Emit form submit event with validated data
 */
export function submitForm(
  formData: Record<string, any>,
  fields: FormFieldConfig[]
): {
  valid: boolean;
  data?: Record<string, any>;
  errors?: Record<string, string>;
} {
  const errors = validateForm(formData, fields);

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: formData };
}
