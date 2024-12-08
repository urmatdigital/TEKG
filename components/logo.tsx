'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

export function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <NextLink href="/" className="flex items-center">
        <Image 
          src="/tulpar_text_logo.svg"
          alt="Tulpar Express"
          width={120}
          height={24}
          className="h-6 w-auto"
        />
      </NextLink>
    );
  }

  return (
    <NextLink href="/" className="flex items-center">
      <Image 
        src="/tulpar_text_logo.svg"
        alt="Tulpar Express"
        width={120}
        height={24}
        className={`h-6 w-auto ${resolvedTheme === 'dark' ? 'invert' : ''}`}
      />
    </NextLink>
  );
} 