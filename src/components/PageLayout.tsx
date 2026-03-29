import React from 'react';
import { motion } from 'framer-motion';
import QuickAccessBar from '@/components/QuickAccessBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, showFooter = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-visible bg-background isolate"
      style={{ '--quick-access-height': '3rem' } as React.CSSProperties}
    >
      <QuickAccessBar />
      <Header />
      <main className="relative z-0">{children}</main>
      {showFooter && <Footer />}
    </motion.div>
  );
};

export default PageLayout;
