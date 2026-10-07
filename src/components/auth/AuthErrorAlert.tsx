import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AuthErrorAlertProps {
  message: string | null;
  onDismiss?: () => void;
}

export const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-caption font-bold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 shadow-xs"
    >
      <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-snug">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-600 p-0.5"
          aria-label="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
