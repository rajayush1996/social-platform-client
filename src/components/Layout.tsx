 
// components/Layout.tsx
import { ReactNode, useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarnBanner from './EarnBanner';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const [bannerVisible, setBannerVisible] = useState(!isAuthenticated);
  const bannerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const location = useLocation();
  const isReels = location.pathname === '/reels';

  useEffect(() => {
    if (isAuthenticated) {
      setBannerVisible(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const measure = () => {
      let h = 0;
      if (!isAuthenticated && bannerVisible && bannerRef.current) {
        h += bannerRef.current.getBoundingClientRect().height;
      }
      if (navRef.current) {
        h += navRef.current.getBoundingClientRect().height;
      }
      setHeaderHeight(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [bannerVisible, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-background"
          style={
        isReels
          ? { '--header-height': `${headerHeight}px` } as React.CSSProperties
          : {}
      }>
      <div ref={bannerRef}>
        {!isAuthenticated && bannerVisible && (
          <EarnBanner onClose={() => setBannerVisible(false)} />
        )}
      </div>
      <div ref={navRef}>
        <Navbar />
      </div>

      <main className="flex-grow"
            style={{ paddingTop: `var(--header-height)` }}>
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
