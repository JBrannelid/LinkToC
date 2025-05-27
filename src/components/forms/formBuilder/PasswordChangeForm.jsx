import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router";
import FormInput from "./FormInput";
import authService from "../../../api/services/authService";
import { useAuth } from "../../../hooks/useAuth.js";
import { ROUTES } from "../../../routes/index.jsx";
import {
  getErrorMessage,
  createSuccessMessage,
} from "../../../utils/errorUtils";
import ModalHeader from "../../layout/ModalHeader";
import Button from "../../ui/Button";

const PasswordChangeForm = ({ onCancel }) => {
  const [step, setStep] = useState(1); // 1 = verify current, 2 = new password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const {
    formState: { errors: _errors },
    watch,
    handleSubmit,
    reset,
    register: _register,
  } = useFormContext();

  const newPassword = watch("new_password");
  const { user, logout } = useAuth();

  const verifyCurrentPassword = async (data) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Attempt to authenticate with current password
      await authService.login({
        email: user.email,
        password: data.current_password,
      });

      // If login succeeds, proceed to step 2
      setStep(2);
    } catch {
      setMessage({
        type: "error",
        text: "Incorrect password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await authService.changePassword({
        userId: user.id,
        newPassword: data.new_password,
        confirmPassword: data.confirm_password,
      });

      if (result?.isSuccess) {
        setMessage(
          createSuccessMessage(
            "Password updated successfully. Logging you out for security..."
          )
        );

        setTimeout(async () => {
          await logout();
          navigate(ROUTES.LOGIN);
        }, 1500);
      }
    } catch (error) {
      setMessage(
        getErrorMessage(error, {
          defaultMessage: "Unable to update password. Please try again.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setStep(1);
    setMessage({ type: "", text: "" });
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white md:bg-black/40 shadow-md flex flex-col md:items-center md:justify-center">
      <div className="w-full h-full md:max-h-8/10 md:w-xl overflow-y-auto bg-background shadow-md rounded flex flex-col relative">
        <ModalHeader
          title="Change Password"
          showCloseBtn={true}
          onCloseClick={resetForm}
          className="bg-primary-light"
        />

        <div className="p-6">
          <form id="password-change-form" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <FormInput
                    name="current_password"
                    label="Current Password"
                    type="password"
                    labelPosition="above"
                    autoComplete="current-password"
                    showPasswordToggle={true}
                    validation={{
                      required: "Please enter your current password",
                    }}
                  />
                </div>

                {message.text && (
                  <div
                    className={`mb-4 p-3 rounded ${
                      message.type === "success"
                        ? "bg-primary-light text-primary"
                        : "bg-red-50 text-error-600"
                    }`}
                  >
                    <p>Oops! That’s not quite the magic word.</p>
                  </div>
                )}
                <p className="text-sm mb-4">
                  For your security, please verify your current password to
                  continue.
                </p>

                <div className="flex justify-between">
                  <Button
                    type="secondary"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleSubmit(verifyCurrentPassword)}
                    loading={loading}
                    disabled={loading}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm mb-4">
                  Create a strong password with at least 8 characters.
                </p>

                <div className="mb-4">
                  <FormInput
                    name="new_password"
                    label="New Password"
                    type="password"
                    labelPosition="above"
                    autoComplete="new-password"
                    showPasswordToggle={true}
                    validation={{
                      required: "Please enter your new password",
                      minLength: {
                        value: 8,
                        message:
                          "Needs 8+ chars, 1 big letter & 1 special sign",
                      },
                    }}
                  />
                </div>

                <div className="mb-4">
                  <FormInput
                    name="confirm_password"
                    label="Confirm New Password"
                    type="password"
                    labelPosition="above"
                    autoComplete="new-password"
                    showPasswordToggle={true}
                    validation={{
                      required: "Please confirm your new password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    }}
                  />
                </div>

                {message.text && (
                  <div
                    className={`mb-4 p-3 rounded ${
                      message.type === "success"
                        ? "bg-primary-light text-primary"
                        : "bg-red-50 text-error-600"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="secondary"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleSubmit(handlePasswordChange)}
                    loading={loading}
                    disabled={loading}
                  >
                    Update Password
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
