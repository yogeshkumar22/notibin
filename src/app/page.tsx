"use client"; // Needed for redirect in newer Next.js app router client components

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/notifications');
  }, [router]);

  return null; // Or a loading spinner
}
