import { Home, Compass, Bookmark, Bell, User, PlusCircle, Lock, MoreHorizontal, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Define nav item type
type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  locked?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/reels' },
  { label: 'Explore', icon: Compass, href: '/reels/explore' },
  { label: 'Saved', icon: Bookmark, href: '/reels/saved' },
];

export default function ReelsNavigation() {
  // Dummy auth/creator logic for demo
  // Replace with your real auth context
  // const { isAuthenticated, isCreator } = useAuth();
  const isAuthenticated = true; // TODO: use real auth
  const isCreator = false; // TODO: use real creator status

  const rightNavItems: NavItem[] = [
    { label: 'Notifications', icon: Bell, href: '/reels/notifications' },
    isAuthenticated ? { label: 'Profile', icon: User, href: '/profile' } : null,
    isCreator
      ? { label: 'Create', icon: PlusCircle, href: '/reels/create' }
      : isAuthenticated
        ? { label: 'Create', icon: Lock, href: '#', locked: true }
        : null,
  ].filter(Boolean) as NavItem[];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 border-t border-border flex justify-around items-center py-2 md:hidden">
        {[...navItems, ...rightNavItems].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center text-xs text-muted-foreground hover:text-reel-purple-500 transition-colors"
            tabIndex={item.locked ? -1 : 0}
            aria-disabled={item.locked}
          >
            <item.icon className={`h-6 w-6 mb-1 ${item.locked ? 'opacity-50' : ''}`} />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Desktop/Tablet Sidebars */}
      {/* Left Sidebar */}
      <aside className="
          hidden md:fixed
          md:top-[112px] md:bottom-0 md:left-0
          md:flex flex-col justify-between
          h-[calc(100vh-112px)] w-48
          bg-background/80 border-r border-border shadow-lg z-40
        ">
        {/* Middle: Nav Icons (row, icon left, text right) */}
        <div className="flex flex-col gap-2 pt-4 flex-1">
          {navItems.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-row items-center text-base text-muted-foreground hover:text-reel-purple-500 transition-colors px-6 py-3 rounded-lg ${idx === 0 ? 'mt-16' : ''}`}
            >
              <item.icon className={`h-7 w-7 mr-4 ${item.locked ? 'opacity-50' : ''}`} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        {/* Bottom: More/Settings */}
        <div className="flex flex-col items-start pb-8 px-6">
          <button className="flex flex-row items-center text-muted-foreground hover:text-reel-purple-500 transition-colors">
            <MoreHorizontal className="h-7 w-7 mr-4" />
            <span>More</span>
          </button>
        </div>
      </aside>
      {/* Right Sidebar */}
      <aside className="
          hidden md:fixed
          md:top-[112px] md:bottom-0 md:right-0
          md:flex flex-col justify-between
          h-[calc(100vh-112px)] w-48
          bg-background/80 border-l border-border shadow-lg z-40
        ">
        {/* Middle: Right Nav Icons (row, icon left, text right) */}
        <div className="flex flex-col gap-2 pt-4 flex-1">
          {rightNavItems.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-row items-center text-base text-muted-foreground hover:text-reel-purple-500 transition-colors px-6 py-3 rounded-lg ${item.locked ? 'opacity-50 pointer-events-none' : ''} ${idx === 0 ? 'mt-16' : ''}`}
              tabIndex={item.locked ? -1 : 0}
              aria-disabled={item.locked}
            >
              <item.icon className="h-7 w-7 mr-4" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        {/* Bottom: Settings */}
        <div className="flex flex-col items-start pb-8 px-6">
          <button className="flex flex-row items-center text-muted-foreground hover:text-reel-purple-500 transition-colors">
            <Settings className="h-7 w-7 mr-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
} 