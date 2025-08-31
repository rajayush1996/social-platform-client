import { ReactNode, useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarnBanner from './EarnBanner';
import AgeConsentCard from './AgeConsentCard';
import CookieConsentCard from './CookieConsentCard';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const [bannerVisible, setBannerVisible] = useState(!isAuthenticated);
  const [showAgeConsent, setShowAgeConsent] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const location = useLocation();
  const isReels = location.pathname === '/reels';

  useEffect(() => {
    const ageDone = localStorage.getItem('ageConsented');
    const cookieDone = localStorage.getItem('cookiesAccepted');
    if (!ageDone) {
      setShowAgeConsent(true);
    } else if (!cookieDone) {
      setShowCookieConsent(true);
    }
  }, []);

  useEffect(() => {
    setBannerVisible(!isAuthenticated);
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

  const handleAgeConfirm = () => {
    localStorage.setItem('ageConsented', 'true');
    setShowAgeConsent(false);
    if (!localStorage.getItem('cookiesAccepted')) {
      setShowCookieConsent(true);
    }
  };

  const handleCookieAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookieConsent(false);
  };

  const handleCookieDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowCookieConsent(false);
  };

  return (
    <>
      <AgeConsentCard open={showAgeConsent} onConfirm={handleAgeConfirm} />
      <CookieConsentCard
        open={showCookieConsent}
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
      <div
        className="min-h-screen flex flex-col bg-background"
        style={
          isReels
            ? ({ '--header-height': `${headerHeight}px` } as React.CSSProperties)
            : {}
        }
      >
        <div ref={bannerRef}>
          {!isAuthenticated && bannerVisible && (
            <EarnBanner onClose={() => setBannerVisible(false)} />
          )}
        </div>
        <div ref={navRef}>
          <Navbar />
        </div>

        <main className="flex-grow" style={{ paddingTop: `var(--header-height)` }}>
          {children}
        </main>
        {/* {showCookieConsent && <CookieConsentCard onAccept={handleCookieAccept} open={false} onDecline={function (): void {
          throw new Error('Function not implemented.');
        } } />} */}

        {!hideFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;
