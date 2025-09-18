import { ReactNode, useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarnBanner from './EarnBanner';
import AgeConsentCard from './AgeConsentCard';
import CookieConsentCard from './CookieConsentCard';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ExoClickAd from '@/components/ads/ExoClickAd';
import { exoClickAdConfig } from '@/config/ads.config';

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

  const { sideLeft, sideRight, mobileBanner } = exoClickAdConfig;
  const [hideLeftAd, setHideLeftAd] = useState(false);
  const [hideRightAd, setHideRightAd] = useState(false);
  const [hideMobileAd, setHideMobileAd] = useState(false);
  const showLeftAd = Boolean(sideLeft.zoneId) && !hideLeftAd;
  const showRightAd = Boolean(sideRight.zoneId) && !hideRightAd;
  const showMobileAd = Boolean(mobileBanner.zoneId) && !hideMobileAd;

  useEffect(() => {
    setHideLeftAd(false);
    setHideRightAd(false);
    setHideMobileAd(false);
  }, [location.pathname]);

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

        {!isReels && (
          <>
            {showLeftAd && (
              <div
                className="fixed left-4 top-0 hidden xl:block z-[60]"
                style={{ top: headerHeight + 16 }}
              >
                <div className="relative rounded-lg bg-background/80 p-2 shadow-lg">
                  <button
                    type="button"
                    aria-label="Close advertisement"
                    onClick={() => setHideLeftAd(true)}
                    className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white transition hover:bg-black/80"
                  >
                    ×
                  </button>
                  <ExoClickAd
                    zoneId={sideLeft.zoneId}
                    width={sideLeft.width}
                    height={sideLeft.height}
                    title="Advertisement - Left"
                  />
                </div>
              </div>
            )}

            {showRightAd && (
              <div
                className="fixed top-0 hidden xl:block z-[60]"
                style={{
                  top: headerHeight + 16,
                  right: '1rem',
                }}
              >
                <div className="relative rounded-lg bg-background/80 p-2 shadow-lg">
                  <button
                    type="button"
                    aria-label="Close advertisement"
                    onClick={() => setHideRightAd(true)}
                    className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white transition hover:bg-black/80"
                  >
                    ×
                  </button>
                  <ExoClickAd
                    zoneId={sideRight.zoneId}
                    width={sideRight.width}
                    height={sideRight.height}
                    title="Advertisement - Right"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {!isReels && showMobileAd && (
          <div className="fixed left-1/2 top-1/2 z-[60] flex w-full max-w-[360px] -translate-x-1/2 -translate-y-1/2 justify-center px-4 xl:hidden">
            <div className="relative w-full rounded-xl bg-background/85 p-2 shadow-xl">
              <button
                type="button"
                aria-label="Close advertisement"
                onClick={() => setHideMobileAd(true)}
                className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white transition hover:bg-black/80"
              >
                ×
              </button>
              <ExoClickAd
                zoneId={mobileBanner.zoneId}
                width={mobileBanner.width}
                height={mobileBanner.height}
                title="Advertisement - Mobile"
              />
            </div>
          </div>
        )}

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
