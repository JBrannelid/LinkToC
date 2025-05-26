import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormInput from "./formBuilder/FormInput";
import FormProvider from "./formBuilder/FormProvider";
import authService from "../../api/services/authService";
import { useAuth } from "../../context/AuthContext";
import { useLoadingState } from "../../hooks/useLoadingState";
import { ROUTES } from "../../routes/index.jsx";
import {
  createSuccessMessage,
  getErrorMessage,
} from "../../utils/errorUtils.js";
import Button from "../ui/Button";

const RegistrationForm = () => {
  const uniqueId = useId();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_message, setMessage] = useState({ type: "", text: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const [operationType, setOperationType] = useState("create");
  const loadingState = useLoadingState(isSubmitting, operationType);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setOperationType("create");
      setServerError("");

      // Submit registration data and get response
      const response = await authService.register(data);

      // Check if the registration was successful
      if (response && response.isSuccess) {
        // Attempt to log in with the newly registered credentials
        try {
          await login(data.email, data.password);
          sessionStorage.setItem("isFirstLogin", "true");
          navigate(ROUTES.STABLE_ONBOARDING);
        } catch {
          navigate(ROUTES.LOGIN);
          setMessage(
            createSuccessMessage(
              "Registration successful. Please log in with your credentials."
            )
          );
        }
      } else {
        // Handle API response indicating failure
        throw new Error(response?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error details:", error);
      const errorMessage = getErrorMessage(error, {
        defaultMessage: "Registration failed. Please try again later.",
      });
      setServerError(errorMessage.text);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg: max-h-screen">
      {/* Desktop heading */}
      <h2 className="hidden lg:block lg:text-2xl lg:text-center">Sign up</h2>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {serverError && (
          <div
            className="bg-red-50 border-l-3 border-error-400 p-3 rounded-md mb-4"
            role="alert"
            aria-live="assertive"
          >
            <p className="text-sm text-error-600">{serverError}</p>
          </div>
        )}

        {/* First Name */}
        <FormInput
          name="firstName"
          type="text"
          placeholder="First name..."
          id={`${uniqueId}-firstName`}
          validation={{
            required: "First name is required",
          }}
          inputClassName={`w-full px-3 py-4 border ${
            methods.formState.errors.firstName
              ? "border-error-400"
              : "border-gray"
          } rounded-md !border-gray focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary`}
          disabled={isSubmitting}
          className="mb-2"
        />

        {/* Last Name */}
        <FormInput
          name="lastName"
          type="text"
          placeholder="Last name..."
          id={`${uniqueId}-lastName`}
          validation={{
            required: "Last name is required",
          }}
          inputClassName={`w-full px-3 py-4 border ${
            methods.formState.errors.lastName
              ? "border-error-400"
              : "border-gray"
          } rounded-md !border-gray focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary`}
          disabled={isSubmitting}
          className="mb-2"
        />

        {/* Phone Number (optional) */}
        <FormInput
          name="phoneNumber"
          type="tel"
          placeholder="Phone number (optional)"
          id={`${uniqueId}-phoneNumber`}
          autoComplete="tel"
          inputClassName="w-full px-3 py-4 border !border-gray rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary"
          disabled={isSubmitting}
          className="mb-2"
        />

        {/* Email */}
        <FormInput
          name="email"
          type="email"
          placeholder="Email..."
          id={`${uniqueId}-email`}
          autoComplete="email"
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          inputClassName={`w-full px-3 py-4 border ${
            methods.formState.errors.email ? "border-error-400" : "border-gray"
          } rounded-md !border-gray focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary`}
          disabled={isSubmitting}
          className="mb-2"
        />

        {/* Password */}
        <FormInput
          name="password"
          type="password"
          placeholder="Password..."
          labelPosition="above"
          label="Password needs to be at least 8 characters long, contain a capital letter and a special sign"
          id={`${uniqueId}-password`}
          autoComplete="new-password"
          showPasswordToggle={true}
          validation={{
            required: "Please enter your new password",
            minLength: {
              value: 8,
              message: "Needs 8+ chars, 1 big letter & 1 special sign",
            },
          }}
          inputClassName={`w-full px-3 py-4 border ${
            methods.formState.errors.password
              ? "border-error-400"
              : "border-gray"
          } rounded-md !border-gray focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary`}
          disabled={isSubmitting}
          className="mb-6"
        />

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <Button
            type="primary"
            htmlType="submit"
            className="w-9/10 hover:scale-101 transition-transform duration-300"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? loadingState.getMessage() : "Create account"}
          </Button>
          <Button
            type="secondary"
            className="w-9/10 lg:hidden"
            onClick={() => navigate(ROUTES.LOGIN)}
            disabled={isSubmitting}
          >
            Back to login
          </Button>
          {/* Lg screen - Hide button and display a go back text */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 lg:mt-2">
            <span className="text-sm text-gray">Already have an account,</span>
            <button
              type="button"
              className="text-sm font-semibold text-primary hover:underline focus:outline-none"
              onClick={() => navigate(ROUTES.LOGIN)}
              disabled={isSubmitting}
            >
              Sign in
            </button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default RegistrationForm;
