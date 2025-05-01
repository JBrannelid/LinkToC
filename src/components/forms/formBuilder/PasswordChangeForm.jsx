import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Button from "../../ui/Button";
import FormInput from "../formBuilder/FormInput";

const PasswordChangeForm = ({ onCancel }) => {
  const [step, setStep] = useState(1); // 1 = original, 2 = new password
  const {
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useFormContext();

  const newPassword = watch("new_password");

  const verifyCurrentPassword = (data) => {
    // Ask BE how we will procced with password changes.
    // Send a API response to verifiy password here

    // Go to step-2 if response 200 sucesse
    setStep(2);
  };

  const resetForm = () => {
    reset();
    setStep(1);
    onCancel();
  };
  return (
    <div className="bg-white rounded-lg p-4 border border-primary-light">
      <h3 className="font-semibold mb-4">Ändra lösenord</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <p className="text-sm mb-4">
              För att ändra ditt lösenord, vänligen ange ditt nuvarande lösenord
              först.
            </p>

            <div className="mb-4">
              <FormInput
                name="current_password"
                label="Nuvarande lösenord"
                type="password"
                labelPosition="above"
                validation={{
                  required: "Vänligen ange ditt nuvarande lösenord",
                }}
              />
            </div>

            <div className="flex justify-between">
              <Button type="secondary" onClick={resetForm}>
                Avbryt
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit(verifyCurrentPassword)}
              >
                Fortsätt
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm mb-4">
              Ange och bekräfta ditt nya lösenord. Det måste vara minst 6 tecken
              långt.
            </p>

            <div className="mb-4">
              <FormInput
                name="new_password"
                label="Nytt lösenord"
                type="password"
                labelPosition="above"
                validation={{
                  required: "Vänligen ange ditt nya lösenord",
                  minLength: {
                    value: 6,
                    message: "Lösenordet måste vara minst 6 tecken långt",
                  },
                }}
              />
            </div>

            <div className="mb-4">
              <FormInput
                name="confirm_password"
                label="Bekräfta nytt lösenord"
                type="password"
                labelPosition="above"
                validation={{
                  required: "Vänligen bekräfta ditt nya lösenord",
                  validate: (value) =>
                    value === newPassword || "Lösenorden matchar inte",
                }}
              />
            </div>

            <div className="flex justify-between">
              <Button type="secondary" onClick={() => setStep(1)}>
                Tillbaka
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit((data) => {
                  // Send a API call with new password to BE
                  resetForm();
                })}
              >
                Uppdatera lösenord
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default PasswordChangeForm;
