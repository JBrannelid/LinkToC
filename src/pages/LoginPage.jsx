import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { ROUTES } from "../routes/routeConstants";
import { useLoadingState } from "../hooks/useLoadingState";
import FacebookIcon from "../assets/icons/FacebookIcon";
import LinkedinIcon from "../assets/icons/LinkedInIcon";

const LoginForm = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [operationType, setOperationType] = useState("fetch");
  const loadingState = useLoadingState(isSubmitting, operationType);

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
    setOperationType("fetch");
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

  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER);
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
      <div className="flex-1 px-6 py-8 bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="login-heading"
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
            <label htmlFor="email" className="sr-only">
              E-postadress
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
                className="mt-1 text-sm text-error-500"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className={`w-full px-3 py-4 border ${
                errors.password ? "border-error-400" : "border-gray"
              } rounded-md focus:outline-none  focus:ring-primary focus:ring-1 focus:border-primary`}
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
                className="mt-1 text-sm text-error-500"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end mb-10">
            <p className="text-sm text-gray">
              Glömt
              <a
                href="/forgot-password"
                className="font-medium text-accent-orange pl-2"
              >
                Lösenord
              </a>
            </p>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? loadingState.getMessage() : "Logga in"}
          </Button>

          <Button
            type="secondary"
            className="w-full"
            onClick={handleRegisterClick}
            disabled={isSubmitting}
          >
            Skapa konto
          </Button>

          <div className="my-7 flex items-center">
            <hr className="flex-1 border-gray" />
            <span className="px-4 text-sm text-gray-500">eller</span>
            <hr className="flex-1 border-gray" />
          </div>

          <div className="flex justify-center space-x-8 mt-2">
            <Button
              variant="icon"
              size="medium"
              className="bg-gray text-white"
              aria-label="Sign in with Google"
            >
              <img
                src="../assets/icons/google.svg"
                alt="Horse icon"
                className="h-6 w-6 filter brightness-0 invert"
              />
            </Button>

            <Button
              variant="icon"
              size="medium"
              className="bg-gray text-white"
              aria-label="Sign in with Facebook"
            >
              <FacebookIcon
                className="h-6 w-6 "
                fill="currentColor"
              ></FacebookIcon>
            </Button>

            <Button
              variant="icon"
              size="medium"
              className="bg-gray text-white"
              aria-label="Sign in with LinkedIn"
            >
              <LinkedinIcon className="h-6 w-6" fill="currentColor" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
