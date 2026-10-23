import { Check, X } from "lucide-react";

export default function PasswordRequirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <X size={16} className="text-gray-300" />
      )}

      <span className={valid ? "text-green-600" : "text-gray-400"}>
        {text}
      </span>
    </div>
  );
}
