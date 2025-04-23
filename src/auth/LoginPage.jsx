import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Feather, FacebookIcon, LinkedinIcon, RabbitIcon } from "lucide-react";

const LoginForm = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "test@example.com",
      password: "password123",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      await login(data.email, data.password);

      navigate("/select-stable");
    } catch (error) {
      setServerError(error.message || "Fel e-postadress eller lösenord");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Logo Section - Green background */}
      <div className="py-16 flex justify-center items-center bg-[#556B2F]">
        <RabbitIcon className="h-20 w-20">
          {/* Horse rider icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path fill="rgba(200, 200, 200, 0.8)" />
          </svg>
        </RabbitIcon>
      </div>

      {/* Form Section - White background */}
      <div className="flex-1 px-6 py-8 bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="login-heading"
          noValidate
          className="flex flex-col gap-4"
        >
          {serverError && (
            <div
              className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <div className="mb-2">
            <label htmlFor="email" className="sr-only">
              E-postadress
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              className={`w-full px-3 py-4 border ${
                errors.email ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
              {...register("email", {
                required: "E-postadress krävs",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Otillåten epostadress",
                },
              })}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="sr-only">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className={`w-full px-3 py-4 border ${
                errors.password ? "border-red-300" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-olive-500 focus:border-olive-500 text-gray-900`}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              {...register("password", {
                required: "Lösenord krävs",
              })}
            />
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end mb-6">
            <a
              href="/forgot-password"
              className="text-sm text-gray-400 hover:text-gray-500"
            >
              Glömt <span className="text-orange-300">Lösenord</span> ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md text-white font-medium bg-[#556B2F] hover:bg-[#4B5320] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#556B2F]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Vänligen vänta, loggar in...
              </div>
            ) : (
              "Logga in"
            )}
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center space-x-8">
            <button
              type="button"
              aria-label="Sign in with Google"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
            >
              <Feather
                className="h-6 w-6 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              ></Feather>
            </button>
            <button
              type="button"
              aria-label="Sign in with Facebook"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
            >
              <FacebookIcon
                className="h-6 w-6 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              ></FacebookIcon>
            </button>
            <button
              type="button"
              aria-label="Sign in with LinkedIn"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
            >
              <LinkedinIcon
                className="h-6 w-6 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              ></LinkedinIcon>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Saknar du konto?
              <a
                href="/register"
                className="font-medium text-yellow-500 hover:text-yellow-400"
              >
                Logga in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
