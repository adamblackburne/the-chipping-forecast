import { HTMLAttributes } from "react";

export function MobileShell({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mobile-shell ${className}`} {...props}>
      {children}
    </div>
  );
}
