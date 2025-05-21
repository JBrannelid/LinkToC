import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import FormMessage from "./formBuilder/FormMessage";
import authService from "../../api/services/authService";
import { ROUTES } from "../../routes/index.jsx";
import {
  getErrorMessage,
  createSuccessMessage,
  createErrorMessage,
} from "../../utils/errorUtils";
import Button from "../ui/Button";

const ResetPasswordForm = ({ setParentLoading = null }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Extract token from URL if present
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      console.error("No token found in URL");
      setMessage(
        createErrorMessage(
          "No reset code found. Please check the link in your email"
        )
      );
    }
  }, [location]);

  useEffect(() => {
    if (setParentLoading) {
      setParentLoading(loading);
    }
  }, [loading, setParentLoading]);

  const handleBackToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const onSubmit = async (data) => {
    if (!token) {
      setMessage(
        createErrorMessage(
          "No reset code available. Please request a new reset link."
        )
      );
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMessage(
        createErrorMessage("Passwords don't match. Please try again.")
      );
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Log what we're sending to API
      const resetData = {
        token: token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await authService.resetPassword(resetData);

      if (response && response.isSuccess) {
        setMessage(
          createSuccessMessage(
            "Your password has been reset. You will be redirected to the login page."
          )
        );

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
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
          defaultMessage: "Failed to reset password. Please try again later.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      className="w-full"
      ariaLabel="Reset Password Form"
    >
      <div className="mt-4">
        <FormInput
          name="password"
          type="password"
          placeholder="Enter new password"
          showPasswordToggle={true}
          inputClassName="w-full px-3 py-4 border !bg-white !border-gray rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary"
          validation={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
        />
      </div>

      <div className="mt-4">
        <FormInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          showPasswordToggle={true}
          inputClassName="w-full px-3 py-4 border !bg-white !border-gray rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary"
          validation={{
            required: "Please confirm your password",
          }}
        />
      </div>

      <FormMessage message={message} className="mt-4" />

      <div className="mt-6 flex flex-col items-center gap-4">
        <Button
          type="primary"
          htmlType="submit"
          className="w-9/10"
          disabled={loading || !token}
          aria-busy={loading}
        >
          <span>Reset Password</span>
        </Button>

        <Button
          type="secondary"
          onClick={handleBackToLogin}
          className="w-9/10 lg:hidden"
        >
          <span>Back to Login</span>
        </Button>
        <div className="hidden lg:flex lg:justify-center lg:items-center lg:gap-2 lg:mt-2 w-full">
          <span className="text-sm text-gray items-center">Go back to</span>
          <button
            type="button"
            className="text-sm font-semibold text-primary hover:underline focus:outline-none"
            onClick={handleBackToLogin}
          >
            Sign in
          </button>
        </div>
      </div>
    </FormProvider>
  );
};

export default ResetPasswordForm;
