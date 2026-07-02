'use client';

import { safeNavigate } from '@/lib/url-whitelist';
import { MouseEvent } from 'react';

interface SafeLinkProps {
  href: string;
  children: React.ReactNode;
  locale?: string;
  className?: string;
}

function handleSafeClick(e: MouseEvent<HTMLAnchorElement>, href: string, target: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  safeNavigate(href, target === '_self' ? '_self' : '_blank');
}

export default function SafeLink({ href, children, className = '' }: SafeLinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center w-full ${className}`}
      rel="noopener noreferrer nofollow"
      target="_blank"
      onClick={(e) => handleSafeClick(e, href, '_blank')}
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
      onClick={(e) => handleSafeClick(e, href, '_blank')}
    >
      {icon}
      {children}
    </a>
  );
}
