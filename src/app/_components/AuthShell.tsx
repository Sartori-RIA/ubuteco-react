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
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-8 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

export function AuthFooterLink({href, children}: { href: string; children: ReactNode }) {
  return (
    <p className="text-center text-sm text-muted">
      <Link href={href} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
        {children}
      </Link>
    </p>
  );
}
