import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import FormMessage from "./formBuilder/FormMessage";
import authService from "../../api/services/authService";
import { Shield, ArrowLeft } from "lucide-react";
import { ROUTES } from "../../routes/routeConstants";
import {
  getErrorMessage,
  createSuccessMessage,
  createErrorMessage,
} from "../../utils/errorUtils";

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
      // If no token in URL, show error message
      setMessage(
        createErrorMessage(
          "Ingen återställningskod hittades i URL:en. Kontrollera länken i ditt e-postmeddelande."
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
          "Ingen återställningskod tillgänglig. Begär en ny återställningslänk."
        )
      );
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMessage(createErrorMessage("Lösenorden matchar inte. Försök igen."));
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const resetData = {
        token: token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await authService.resetPassword(resetData);

      if (response && response.isSuccess) {
        setMessage(
          createSuccessMessage(
            "Ditt lösenord har återställts. Du kommer att omdirigeras till inloggningssidan."
          )
        );

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      } else {
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
            "Misslyckades att återställa lösenordet. Försök igen senare.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      footer={{ showFooter: false }}
    >
      <div className="mt-4">
        <FormInput
          name="password"
          label="Nytt lösenord"
          type="password"
          placeholder="Ange nytt lösenord"
          validation={{
            required: "Lösenord krävs",
            minLength: {
              value: 8,
              message: "Lösenordet måste vara minst 8 tecken",
            },
          }}
        />
      </div>

      <div className="mt-4">
        <FormInput
          name="confirmPassword"
          label="Bekräfta lösenord"
          type="password"
          placeholder="Bekräfta ditt nya lösenord"
          validation={{
            required: "Vänligen bekräfta ditt lösenord",
          }}
        />
      </div>

      <FormMessage message={message} />

      <div className="mt-5">
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 p-2 rounded-md text-white flex items-center justify-center"
          disabled={loading || !token}
          aria-busy={loading}
        >
          <Shield className="h-5 w-5 mr-2" />
          <span>Återställ lösenord</span>
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleBackToLogin}
          className="flex items-center justify-center mx-auto text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Tillbaka till inloggning</span>
        </button>
      </div>
    </FormProvider>
  );
};

export default ResetPasswordForm;
