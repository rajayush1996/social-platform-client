import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EarnBanner from './EarnBanner';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
    
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed w-full z-50">
        <EarnBanner />
        <Navbar />
      </div>
     
      <main className="flex-grow pt-32">
        {children}
      </main>
      <Footer />
    </div>
    </>
    
  );
};

export default Layout; 