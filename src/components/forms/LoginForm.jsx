import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { ROUTES } from "../../routes/index.jsx";
import { useLoadingState } from "../../hooks/useLoadingState";
import FacebookIcon from "../../assets/icons/FacebookIcon";
import LinkedinIcon from "../../assets/icons/LinkedinIcon";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";

const LoginForm = () => {
  const uniqueId = useId();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [operationType, setOperationType] = useState("fetch");
  const loadingState = useLoadingState(isSubmitting, operationType);

  const methods = useForm({
    defaultValues: {
      email: "test@example.com",
      password: "Password123!",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setOperationType("fetch");
    setServerError("");

    try {
      const result = await login(data.email, data.password);

      // Check if user has a previously selected stable
      if (result.hasStable) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.SELECT_STABLE);
      }
    } catch (error) {
      setServerError(error.message || "Incorrect email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate(ROUTES.FORGOT_PASSWORD);
  };

  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <>
      <h2 className="hidden lg:block text-2xl font-medium text-center mb-8">
        Welcome
      </h2>

      {/* Form provider */}
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

        {/* Email input field */}
        <FormInput
          name="email"
          type="email"
          placeholder="Email..."
          id={`${uniqueId}-email`}
          autoComplete="username email"
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          inputClassName={`w-full px-3 py-4 border ${
            methods.formState.errors.email ? "border-error-400" : "border-gray"
          } rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary`}
          disabled={isSubmitting}
          className="mb-2"
        />

        {/* Password input field */}
        <FormInput
          name="password"
          type="password"
          placeholder="Password..."
          id={`${uniqueId}-password`}
          autoComplete="current-password"
          showPasswordToggle={true}
          validation={{
            required: "Password is required",
          }}
          inputClassName={`w-full px-3 py-4 border ${
            methods.formState.errors.password
              ? "border-error-400"
              : "border-gray"
          } rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary`}
          disabled={isSubmitting}
        />

        <div className="flex justify-end mb-10">
          <button
            type="button"
            className="text-sm text-primary hover:underline focus:outline-none"
            onClick={handleForgotPassword}
            disabled={isSubmitting}
          >
            Forgot Password?
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 mb-15">
          <Button
            type="primary"
            htmlType="submit"
            className="w-9/10 hover:scale-101 transition-transform duration-300"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? loadingState.getMessage() : "Sign in"}
          </Button>

          <Button
            type="secondary"
            className="w-9/10 hover:scale-101 transition-transform duration-300"
            onClick={handleRegisterClick}
            disabled={isSubmitting}
          >
            Create account
          </Button>
        </div>

        {/* Sign in with social media */}
        <div className="my-7 flex items-center">
          <hr className="flex-1 border-gray" />
          <span className="px-4 text-sm text-gray">sign in with</span>
          <hr className="flex-1 border-gray" />
        </div>

        <div className="flex justify-center space-x-8 mt-15">
          <Button
            variant="icon"
            size="medium"
            className="hover:transform hover:scale-105 transition-transform duration-300"
            aria-label="Sign in with Google"
          >
            <GoogleIcon className="w-5 h-5 text-primary" />
          </Button>

          <Button
            variant="icon"
            size="medium"
            className="hover:transform hover:scale-105 transition-transform duration-300"
            aria-label="Sign in with Facebook"
          >
            <FacebookIcon className="w-10 h-10 text-primary" />
          </Button>

          <Button
            variant="icon"
            size="medium"
            className="hover:transform hover:scale-105 transition-transform duration-300"
            aria-label="Sign in with LinkedIn"
          >
            <LinkedinIcon className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </FormProvider>
    </>
  );
};

export default LoginForm;
