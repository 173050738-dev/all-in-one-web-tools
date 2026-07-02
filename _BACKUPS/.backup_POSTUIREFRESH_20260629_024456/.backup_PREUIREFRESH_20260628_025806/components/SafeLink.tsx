'use client';

interface SafeLinkProps {
  href: string;
  children: React.ReactNode;
  locale?: string;
  className?: string;
}

export default function SafeLink({ href, children, className = '' }: SafeLinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center w-full ${className}`}
      rel="noopener noreferrer nofollow"
      target="_blank"
    >
      {children}
    </a>
  );
}

interface SafeLinkButtonProps {
  href: string;
  children: React.ReactNode;
  locale?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function SafeLinkButton({ href, children, className = '', icon }: SafeLinkButtonProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${className}`}
      rel="noopener noreferrer nofollow"
      target="_blank"
    >
      {icon}
      {children}
    </a>
  );
}