import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Send, AlertCircle } from "lucide-react";
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

const ForgotPasswordForm = ({ onSuccess, setParentLoading = null }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const methods = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (setParentLoading) {
      setParentLoading(loading);
    }
  }, [loading, setParentLoading]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      console.log("Attempting to send password reset email to:", data.email);

      const response = await authService.forgotPassword(data.email);

      // Log the full response for debugging
      console.log("Password reset API response:", response);

      if (
        response &&
        (response.isSuccess ||
          response.statusCode === 200 ||
          response.statusCode === 201)
      ) {
        // Success handling remains the same
        if (
          response.message &&
          response.message.includes("issue sending the email")
        ) {
          setMessage(
            createWarningMessage(
              "Återställningsbegäran har skapats, men det uppstod ett problem med att skicka e-post. Om du inte får e-post inom några minuter, kontrollera din skräppostmapp eller kontakta support."
            )
          );
        } else {
          setMessage(
            createSuccessMessage(
              "Återställningslänk har skickats till din e-post. Kontrollera din inkorg (inklusive skräppostmappen)"
            )
          );
        }
        sessionStorage.setItem("resetPasswordEmail", data.email);

        if (onSuccess) onSuccess();
      } else {
        console.error("API returned unsuccessful response:", response);
        setMessage(
          createErrorMessage(
            response?.message || "Något gick fel. Vänligen försök igen."
          )
        );
        setLoading(false);
      }
    } catch (error) {
      // Enhanced error logging
      console.error("Detailed password reset error:", error);

      // If there's error.response from axios, log that too
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      }

      // If there's a specific error type or status, log it
      if (error.type || error.status) {
        console.error("Error type:", error.type);
        console.error("Error status:", error.status);
      }

      setMessage(
        getErrorMessage(error, {
          defaultMessage:
            "Misslyckades att bearbeta begäran. Försök igen senare",
        })
      );
      setLoading(false);
    }
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit}
      footer={{ showFooter: false }}
    >
      <p className="text-xs mt-2">
        <span>OBS: </span>Kontrollera din skräppostmapp
      </p>

      <div className="mt-4">
        <FormInput
          name="email"
          label="E-post"
          type="email"
          placeholder="exempel@email.com"
          validation={{
            required: "Vänligen ange en giltig e-postadress",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/i,
              message: "Vänligen använd ett giltigt e-postformat",
            },
          }}
        />
      </div>

      {message.type === "warning" && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm text-amber-800">{message.text}</span>
        </div>
      )}

      <FormMessage message={message} />

      <div className="mt-5">
        <button
          type="submit"
          className="w-full bg-[#556B2F] hover:bg-[#4B5320] p-2 rounded-md text-white flex items-center justify-center"
          disabled={loading}
          aria-busy={loading}
        >
          <Send className="h-5 w-5 mr-2" />
          <span>Skicka återställningslänk</span>
        </button>
      </div>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
