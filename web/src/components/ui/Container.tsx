import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Container({ children, className = "", id }: ContainerProps) {
  return (
    <div
      id={id}
      className={`max-w-[1100px] 2xl:max-w-[1200px] w-full mx-auto ${className}`}
      style={{ paddingInline: "var(--pad-container)" }}
    >
      {children}
    </div>
  );
}
