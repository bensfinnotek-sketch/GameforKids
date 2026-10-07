import React from 'react';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({
  label = 'hoặc đăng nhập bằng email',
}) => {
  return (
    <div className="relative my-5 select-none">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200/90" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-slate-400 font-semibold tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
};
