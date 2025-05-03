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
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

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
          `Vänligen vänta ${remainingSeconds} sekunder innan du försöker igen.`
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
      }
    } catch (error) {
      setMessage(
        getErrorMessage(error, {
          defaultMessage:
            "Misslyckades att bearbeta begäran. Försök igen senare",
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
      footer={{ showFooter: false }}
    >
      <div className="mt-4">
        <FormInput
          name="email"
          label="E-post"
          type="email"
          placeholder="exempel@email.com"
          labelPosition="above"
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
          disabled={loading || cooldownRemaining > 0}
          aria-busy={loading}
        >
          <Send className="h-5 w-5 mr-2" />
          <span>
            {cooldownRemaining > 0
              ? `Vänta ${cooldownRemaining} sekunder...`
              : "Skicka återställningslänk"}
          </span>
        </button>
        <p className="text-xs pt-5 text-error-500">
          <span>OBS: </span>Kontrollera din skräppostmapp
        </p>
      </div>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
