
'use client'

import { useTheme } from 'next-themes';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';
import { cn } from '@/lib/utils';

function LogoSidebar() {
  const { theme } = useTheme()
  const isCollapsed = useSidebarCollapsed();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch or wrong theme
  if (!isMounted) return null;

  return (
    <Link
      href="/dashboard"
      className={cn(
        'sidebar-logo h-[72px] py-3.5 flex items-center justify-center border-b border-neutral-100 dark:border-slate-700',
        isCollapsed ? 'px-1' : 'px-4'
      )}
    >
      <Image
        src={
          isCollapsed
            ? '/assets/images/logo-icon.png'
            : theme === 'dark'
              ? '/assets/images/logo-light.png'
              : '/assets/images/logo.png'
        }
        alt="Logo"
        width={isCollapsed ? 44 : 168}
        height={40}
        priority
      />
    </Link>
  )
}

export default LogoSidebar
