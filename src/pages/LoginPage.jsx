import WelcomeLayout from "../components/layout/WelcomeLayout";
import LoginForm from "../components/forms/LoginForm";

const LoginPage = () => {
  return (
    <WelcomeLayout>
      {/* Mobile layout */}
      <div className="flex flex-col min-h-screen lg:hidden">
        {/* Header - fixed img size */}
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[350px]">
          <img
            src="/src/assets/images/LoginBackgroundImage.jpg"
            alt="Horses grazing in a meadow"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-6">
            <div className="bg-light/20 backdrop-blur-[2px] backdrop-brightness-120 px-6 py-2 rounded-sm shadow-sm">
              <h1 className="text-3xl text-black">EQUILOG</h1>
            </div>
          </div>
        </div>

        {/* Login Section for mobile */}
        <section className="flex-1 px-6 py-8 bg-white">
          <LoginForm />
        </section>
      </div>

      {/* Login Section for desktop */}
      <section className="hidden lg:block">
        <LoginForm />
      </section>
    </WelcomeLayout>
  );
};

export default LoginPage;
