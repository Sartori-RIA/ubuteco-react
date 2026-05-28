import Link from "next/link";
import {ReactNode} from "react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({title, subtitle, children, footer}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

export function AuthFooterLink({href, children}: { href: string; children: ReactNode }) {
  return (
    <p className="text-center text-sm text-gray-600">
      <Link href={href} className="font-medium text-blue-600 hover:text-blue-700">
        {children}
      </Link>
    </p>
  );
}
