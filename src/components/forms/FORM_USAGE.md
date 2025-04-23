# Form Components Usage Guide

### FormProvider
Wraps forms with React Hook Form context.

```jsx
const methods = useForm();
<FormProvider methods={methods} onSubmit={handleSubmit} />
```

**Props:**
- `methods` - Form methods from useForm hook
- `onSubmit` - Form submission handler
- `children` - Form content
- `className` - Additional CSS classes
- `name` - Field name for react-hook-form
- `label` - Label text
- `type` - Input type (default: "text")
- `placeholder` - Placeholder text
- `validation` - Validation rules
- `className` - Additional CSS classes

## Common Validation Rules
```jsx
// Required field
validation={{ required: "Error message" }}

// Min/max length
validation={{ 
  minLength: { value: 3, message: "Too short" },
  maxLength: { value: 50, message: "Too long" }
}}

// Pattern matching
validation={{ 
  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
}}
```
