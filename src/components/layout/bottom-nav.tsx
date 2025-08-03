'use client';

import {
  HomeIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ClockIcon as ClockIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    id: 'stats',
    label: 'Stats',
    href: '/stats',
    icon: ChartBarIcon,
    activeIcon: ChartBarIconSolid,
  },
  {
    id: 'shoot',
    label: 'SHOOT',
    href: '/scoring',
    icon: PlusCircleIcon,
    activeIcon: PlusCircleIcon,
  },
  {
    id: 'history',
    label: 'History',
    href: '/history',
    icon: ClockIcon,
    activeIcon: ClockIconSolid,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: UserIcon,
    activeIcon: UserIconSolid,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string, id: string) => {
    if (id === 'shoot') {
      // Special handling for the SHOOT button - could open modal or navigate
      router.push('/scoring');
    } else {
      router.push(href);
    }
  };

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white border-t border-clay-border shadow-lg z-50'>
      <div className='container mx-auto px-2'>
        <div className='flex items-center justify-around py-2'>
          {navItems.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = isActive ? item.activeIcon : item.icon;
            const isShootButton = item.id === 'shoot';

            if (isShootButton) {
              return (
                <div key={item.id} className='flex flex-col items-center'>
                  <Button
                    variant='default'
                    size='icon'
                    onClick={() => handleNavigation(item.href, item.id)}
                    className='nav-shoot-button w-14 h-14 rounded-full shadow-lg transform transition-transform active:scale-95'
                  >
                    <Icon className='h-8 w-8' />
                  </Button>
                  <span className='text-xs font-bold text-clay-primary mt-1'>
                    {item.label}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href, item.id)}
                className={`flex flex-col items-center py-2 px-3 min-w-[60px] transition-colors ${
                  isActive
                    ? 'text-clay-primary'
                    : 'text-clay-text-secondary hover:text-clay-primary'
                }`}
              >
                <Icon className='h-6 w-6 mb-1' />
                <span className='text-xs font-medium'>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
