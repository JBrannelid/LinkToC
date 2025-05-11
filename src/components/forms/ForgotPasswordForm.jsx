import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Send, AlertCircle, ArrowLeft } from "lucide-react";
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
        } else {
          setMessage(
            createSuccessMessage(
              "Reset link has been sent to your email. Check your inbox (including spam folder)"
            )
          );
        }
        sessionStorage.setItem("resetPasswordEmail", data.email);

        if (onSuccess) onSuccess();
      } else {
        console.error("API returned unsuccessful response:", response);
        setMessage(
          createErrorMessage(
            response?.message || "Something went wrong. Please try again."
          )
        );
      }
    } catch (error) {
      setMessage(
        getErrorMessage(error, {
          defaultMessage: "Failed to process request. Please try again later",
        })
      );
    } finally {
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
      <div className="mt-4">
        <FormInput
          name="email"
          label="E-post"
          type="email"
          placeholder="exempel@email.com"
          labelPosition="above"
          validation={{
            required: "Please enter a valid email address",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/i,
              message: "Please use a valid email format",
            },
          }}
        />
      </div>

      {message.type === "warning" && (
        <div className="mt-3 p-3 bg-amber-50 border border-b-warning-300 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm text-error-600">{message.text}</span>
        </div>
      )}

      <FormMessage message={message} />

      <div className="mt-5">
        <Button
          type="primary"
          htmlType="submit"
          disabled={loading || cooldownRemaining > 0}
          aria-busy={loading}
        >
          <Send className="h-5 w-5 mr-2" />
          <span>
            {cooldownRemaining > 0
              ? `Wait ${cooldownRemaining} seconds...`
              : "Send reset link"}
          </span>
        </Button>
        <Button
          type="secondary"
          onClick={handleGoBack}
          className="mt-5 flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </Button>
        <p className="text-xs pt-5 text-error-500">
          <span>NOTE: </span>Check your spam folder
        </p>
      </div>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
