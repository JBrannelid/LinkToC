import WelcomeLayout from "../components/layout/WelcomeLayout";
import RegistrationForm from "../components/forms/RegistrationForm";

const RegistrationPage = () => {
  return (
    <WelcomeLayout>
      {/* Mobile layout */}
      <div className="flex flex-col lg:hidden">
        {/* Registration Section for mobile */}
        <section className="flex-1 py-2 bg-transparent overflow-y-auto">
          <RegistrationForm />
        </section>
      </div>

      {/* Registration Section for desktop */}
      <section className="hidden lg:block">
        <RegistrationForm />
      </section>
    </WelcomeLayout>
  );
};

export default RegistrationPage;
