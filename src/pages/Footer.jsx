import { Home, Warehouse, User, Rabbit } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between p-4 bg-white shadow-md">
      <Home className="w-6 h-6 text-gray-700" />
      <Warehouse className="w-6 h-6 text-gray-700" />
      <Rabbit className="w-6 h-6 text-gray-700" />
      <User className="w-6 h-6 text-gray-700" />
    </footer>
  );
}
