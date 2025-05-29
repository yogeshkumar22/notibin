import { Inbox } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <Link href="/notifications" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Inbox className="h-7 w-7" />
          <h1 className="text-2xl font-bold">NotiBin</h1>
        </Link>
      </div>
    </header>
  );
}
