import { Settings, Mail } from "lucide-react";
import StableName from "../components/home/StableName";

// Default stable id. Need to be dynamic depending on user acess
const defaultStableId = 2;

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <Settings className="w-6 h-6 text-gray-700" />

      <div className="text-sm font-light">
        <StableName id={defaultStableId} />
      </div>

      <div className="relative">
        <Mail className="w-6 h-6 text-gray-700" />
        <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
      </div>
    </header>
  );
}
