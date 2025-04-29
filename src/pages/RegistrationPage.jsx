import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import authService from "../api/services/authService.js";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import { useLoadingState } from "../hooks/useLoadingState";
import {createSuccessMessage, getErrorMessage} from "../utils/errorUtils.js";
import { ROUTES } from "../routes";

const RegistrationPage = () => {
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({type: "", text: "",});
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
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

      console.log("Submitting registration data:", data);

      // Submit registration data and get response
      const response = await authService.register(data);

      // Check if the registration was successful
      if (response && response.isSuccess) {
       
        // Attempt to log in with the newly registered credentials
        try {
          await login(data.email, data.password);
          // Redirect to dashboard or home page after successful login
          navigate(ROUTES.STABLE_ONBOARDING);
        } catch (loginError) {
          navigate(ROUTES.LOGIN);
          setMessage(createSuccessMessage(
              "Registration successful. Please log in with your credentials."
          ));
        }
      } else {
        // Handle API response indicating failure
        throw new Error(response?.message || "Registration failed");
      }
    } catch (error) {
      setServerError(getErrorMessage(error, {
        defaultMessage: "Registration failed. Please try again."
      }).text);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Responsive header with background image */}
      <div
        className="relative w-full"
        style={{ height: "clamp(200px, 30vh, 400px)" }}
      >
        <img
          src="/src/assets/images/LoginBackgroundImage.jpg"
          alt="Horse Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ maxHeight: "none" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="bg-light/20 backdrop-blur-[2px] backdrop-brightness-120 px-4 py-1 rounded-sm shadow-sm">
            <h1 className="text-3xl text-black">EQUILOG</h1>
          </div>
          {/* <p className="mt-2 text-white text-lg drop-shadow-md">
            Välkommen till ditt stalls digitala hjälpreda
          </p> */}
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-6 py-8 bg-white overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="register-heading"
          noValidate
          className="flex flex-col gap-4"
        >
          {serverError && (
            <div
              className="bg-red-50 border-l-3 border-error-400 p-3 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-sm text-error-600">{serverError}</p>
            </div>
          )}

          <div className="mb-2">
            <label htmlFor="firstName" className="sr-only">
              Förnamn
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Förnamn"
              className={`w-full px-3 py-4 border ${
                errors.firstName ? "border-error-400" : "border-gray"
              } rounded-md focus:outline-none  focus:ring-primary focus:ring-1 focus:border-primary`}
              aria-invalid={errors.firstName ? "true" : "false"}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
              disabled={isSubmitting}
              {...register("firstName", {
                required: "Förnamn krävs",
              })}
            />
            {errors.firstName && (
              <p
                id="firstName-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="lastName" className="sr-only">
              Efternamn
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Efternamn"
              className={`w-full px-3 py-4 border ${
                errors.lastName ? "border-error-400" : "border-gray"
              } rounded-md focus:outline-none  focus:ring-primary focus:ring-1 focus:border-primary`}
              aria-invalid={errors.lastName ? "true" : "false"}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              disabled={isSubmitting}
              {...register("lastName", {
                required: "Efternamn krävs",
              })}
            />
            {errors.lastName && (
              <p
                id="firstName-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="mb-2">
            <label htmlFor="userName" className="sr-only">
              Användarnamn
            </label>
            <input
              id="userName"
              type="text"
              autoComplete="username"
              placeholder="Användarnamn"
              className={`w-full px-3 py-4 border ${
                errors.userName ? "border-error-400" : "border-gray"
              } rounded-md focus:outline-none  focus:ring-primary focus:ring-1 focus:border-primary`}
              aria-invalid={errors.userName ? "true" : "false"}
              aria-describedby={errors.userName ? "userName-error" : undefined}
              disabled={isSubmitting}
              {...register("userName", {
                required: "Användarnamn krävs",
                minLength: {
                  value: 3,
                  message: "Användarnamn måste vara minst 3 tecken",
                },
              })}
            />
            {errors.userName && (
              <p
                id="userName-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* No requiered validation for phonenumber sense it is optional */}
          <div className="mb-2">
            <label htmlFor="phoneNumber" className="sr-only">
              Telefonnummer
            </label>
            <input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="Telefonnummer (valfritt)"
              className="w-full px-3 py-4 border border-gray rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary"
              disabled={isSubmitting}
              {...register("phoneNumber")}
            />
          </div>

          <div className="mb-2">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              className={`w-full px-3 py-4 border ${
                errors.email ? "border-error-400" : "border-gray"
              } rounded-md focus:outline-none  focus:ring-primary focus:ring-1 focus:border-primary`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              disabled={isSubmitting}
              {...register("email", {
                required: "Email krävs",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ogiltig email adress",
                },
              })}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-error-400"
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
              autoComplete="new-password"
              placeholder="Lösenord"
              className={`w-full px-3 py-4 border ${
                errors.password ? "border-error-400" : "border-gray"
              } rounded-md focus:outline-none  focus:ring-primary focus:ring-1 focus:border-primary`}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              {...register("password", {
                required: "Lösenord krävs",
                minLength: {
                  value: 6,
                  message: "Lösenord måste vara minst 6 tecken",
                },
              })}
            />
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-error-600"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? loadingState.getMessage() : "Skapa konto"}
          </Button>

          <Button
            type="secondary"
            htmlType="button"
            className="w-full mt-3"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Redan Registrerad
          </Button>
        </form>
      </div>
    </div>
  );
};
export default RegistrationPage;
