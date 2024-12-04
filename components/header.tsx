'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const routes = [
  {
    label: 'home',
    link: '/',
  },
  {
    label: 'posts',
    link: '/notes',
  },
];

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMounted) return;
    setIsMounted(true);
  }, [isMounted]);

  return (
    <header className='border-b p-4 flex justify-between items-center'>
      <Link
        href='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-300 via-indigo-500 to-blue-600 rounded-lg'>
          NoteMaestro
        </span>
      </Link>
      <form>
        <div className='relative lg:flex items-center gap-2 hidden border min-w-80 rounded-lg'>
          <Input
            type='text'
            placeholder='Search...'
            className='border-none w-full'
          />
          <Button className='absolute border-transparent right-0 bg-transparent hover:bg-transparent hover:text-gray-100'>
            <Search className='size-4 text-gray-300 ' />
          </Button>
        </div>
      </form>
      <nav className='flex gap-10'>
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.link}
            className={cn(
              'uppercase text-sm font-semibold transition hover:text-gray-300',
              route.link === pathname ? 'text-indigo-400' : ''
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <div className='flex gap-2'>
        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: dark,
            }}
          />
        </SignedIn>
        <SignedOut>
          <Link href='/sign-in'>
            <Button variant='outline'>
              Sign in
              {/* <SignInButton /> */}
            </Button>
          </Link>
        </SignedOut>

        <ModeToggle />
      </div>
    </header>
  );
}
