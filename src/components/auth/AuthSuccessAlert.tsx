import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AuthSuccessAlertProps {
  message: string | null;
}

export const AuthSuccessAlert: React.FC<AuthSuccessAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-caption font-bold flex items-center gap-2.5 animate-in fade-in shadow-xs"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      <span className="flex-1 leading-snug">{message}</span>
    </div>
  );
};
