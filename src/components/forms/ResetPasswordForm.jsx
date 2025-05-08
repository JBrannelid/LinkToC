import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import FormProvider from "./formBuilder/FormProvider";
import FormInput from "./formBuilder/FormInput";
import FormMessage from "./formBuilder/FormMessage";
import authService from "../../api/services/authService";
import { Shield, ArrowLeft } from "lucide-react";
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
      console.log("Token found in URL:", tokenFromUrl);
    } else {
      console.error("No token found in URL");
      setMessage(
        createErrorMessage(
          "Ingen återställningskod hittades. Kontrollera länken i ditt epost"
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
      // Log what we're sending to API
      const resetData = {
        token: token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      };
      console.log("Sending reset data:", resetData);

      const response = await authService.resetPassword(resetData);
      console.log("Reset password response:", response);

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
      onSubmit={onSubmit}
      className="reset-password-form"
      ariaLabel="Reset Password Form"
    >
      <div className="mt-4">
        <FormInput
          name="password"
          label="Nytt lösenord"
          type="password"
          placeholder="Ange nytt lösenord"
          labelPosition="above"
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
          labelPosition="above"
          validation={{
            required: "Vänligen bekräfta ditt lösenord",
          }}
        />
      </div>

      <FormMessage message={message} />

      <div className="mt-5 grid grid-cols-1">
        <Button
          type="primary"
          htmlType="submit"
          className="w-9/10"
          disabled={loading || !token}
          aria-busy={loading}
        >
          <Shield className="h-5 w-5 mr-2" />
          <span>Återställ lösenord</span>
        </Button>
      </div>

      <div className="mt-4 text-center">
        <Button type="button" onClick={handleBackToLogin} className="w-9/10">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Tillbaka till inloggning</span>
        </Button>
      </div>
    </FormProvider>
  );
};

export default ResetPasswordForm;
