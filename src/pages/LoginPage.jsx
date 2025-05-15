import WelcomeLayout from "../components/layout/WelcomeLayout";
import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
  return (
    <WelcomeLayout>
      {/* Mobile layout */}
      <div className="flex flex-col max-h-screen md:hidden">
        {/* Login Section for mobile */}
        <section className=" px-6">
          <LoginForm />
        </section>
      </div>

      {/* Login Section for desktop */}
      <section className="hidden md:block">
        <LoginForm />
      </section>
    </WelcomeLayout>
  );
};

export default LoginPage;
