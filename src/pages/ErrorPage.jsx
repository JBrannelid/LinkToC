import { useRouteError, Link } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-6">Ett fel har inträffat</p>
      <p className="text-gray-600 mb-8">
        {error?.statusText || error?.message || "Okänt fel"}
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        Gå tillbaka till huvudmenyn
      </Link>
    </div>
  );
}
