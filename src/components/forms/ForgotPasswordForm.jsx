import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import authService from "../../api/services/authService";
import FormMessage from "./formBuilder/FormMessage";
import {
  getErrorMessage,
  createSuccessMessage,
  createWarningMessage,
  createErrorMessage,
} from "../../utils/errorUtils.js";
import Button from "../ui/Button.jsx";
import { ROUTES } from "../../routes/index.jsx";
import { useNavigate } from "react-router";

const ForgotPasswordForm = ({ onSuccess, setParentLoading = null }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      email: "",
    },
  });

  // Effect to update parent loading state
  useEffect(() => {
    if (setParentLoading) {
      setParentLoading(loading);
    }
  }, [loading, setParentLoading]);
  const handleGoBack = () => {
    navigate(ROUTES.LOGIN);
  };

  // Effect to handle cooldown timer
  useEffect(() => {
    let timerId;

    if (cooldownRemaining > 0) {
      timerId = setTimeout(() => {
        setCooldownRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [cooldownRemaining]);

  const handleSubmit = async (data) => {
    // Check if we're in the cooldown period
    const now = Date.now();
    if (lastSubmitTime > 0 && now - lastSubmitTime < 60000) {
      const remainingSeconds = Math.ceil(
        (60000 - (now - lastSubmitTime)) / 1000
      );
      setCooldownRemaining(remainingSeconds);
      setMessage(
        createWarningMessage(
          `Please wait ${remainingSeconds} seconds before trying again.`
        )
      );
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authService.forgotPassword(data.email);

      if (
        response &&
        (response.isSuccess ||
          response.statusCode === 200 ||
          response.statusCode === 201)
      ) {
        // Set cooldown timer
        setLastSubmitTime(now);
        setCooldownRemaining(60);

        // Success handling remains the same
        if (
          response.message &&
          response.message.includes("issue sending the email")
        ) {
          setMessage(
            createWarningMessage(
              "Reset request created, but there was an issue sending the email. If you don't receive an email in a few minutes, check your spam folder or contact support."
            )
          );
          setLoading(false);
        } else {
          setMessage(
            createSuccessMessage(
              "Reset link has been sent to your email. Check your inbox (including spam folder)"
            )
          );

          // Set loading to false before calling onSuccess
          setLoading(false);

          if (onSuccess) {
            onSuccess();
          }
        }

        sessionStorage.setItem("resetPasswordEmail", data.email);
      } else {
        console.error("API returned unsuccessful response:", response);
        setMessage(
          createErrorMessage(
            response?.message || "Something went wrong. Please try again."
          )
        );
        setLoading(false);
      }
    } catch (error) {
      setMessage(
        getErrorMessage(error, {
          defaultMessage: "Failed to process request. Please try again later",
        })
      );
      setLoading(false);
    }
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit}
      className="forgot-password-form"
      ariaLabel="Forgot Password Form"
    >
      <div>
        <FormInput
          name="email"
          type="email"
          placeholder="Email..."
          inputClassName="!border-gray !bg-white"
          validation={{
            required: "Please enter a valid email address",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/i,
              message: "Please use a valid email format",
            },
          }}
        />
        <span className="text-xs text-center mt-2 pl-1 text-error-500">
          Check your spam folder
        </span>
      </div>

      {message.type === "warning" && (
        <div className="mt-3 p-3 bg-amber-50 border border-b-warning-300 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm text-error-600">{message.text}</span>
        </div>
      )}

      {message.type && message.type !== "warning" && (
        <FormMessage message={message} className="mb-4" />
      )}

      <div className="mt-30 flex flex-col items-center gap-5 ">
        {/* Action btn with cold-down */}
        <Button
          type="primary"
          htmlType="submit"
          className="w-9/10"
          disabled={loading || cooldownRemaining > 0}
          loading={loading}
          aria-busy={loading}
        >
          <span>
            {cooldownRemaining > 0
              ? `Wait ${cooldownRemaining} seconds...`
              : "Reset password"}
          </span>
        </Button>
        <Button
          type="secondary"
          className="w-9/10 lg:hidden"
          onClick={handleGoBack}
          disabled={loading}
        >
          Back to login
        </Button>

        {/* Lg screen - Hide button and display a go back text */}
      </div>
      <div className="hidden lg:flex lg:justify-center lg:items-center lg:gap-2 lg:mt-4 w-full">
        <span className="text-sm text-gray items-center">
          Remember the Password,
        </span>
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline focus:outline-none"
          onClick={handleGoBack}
        >
          Sign in
        </button>
      </div>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
