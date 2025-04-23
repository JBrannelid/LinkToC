import { Settings, Mail } from "lucide-react";
import StableName from "../components/home/StableName";
import { useAppContext } from "../context/AppContext";

export default function Header() {
  const { currentStable } = useAppContext();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <Settings className="w-6 h-6 text-gray-700" />

      <div className="text-sm font-light">
        <StableName currentStableId={currentStable.id} />
      </div>

      <div className="relative">
        <Mail className="w-6 h-6 text-gray-700" />
        <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
      </div>
    </header>
  );
}
