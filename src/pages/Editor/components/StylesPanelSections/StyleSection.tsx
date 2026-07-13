import type { ReactNode } from "react";

export interface StyleSectionProps {
  title: string;
  children: ReactNode;
}

export default function StyleSection({ title, children }: StyleSectionProps) {
  return (
    <div className="flex flex-col gap-4 my-8 px-2">
      <h4 className="text-xs uppercase text-primary-500">{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
