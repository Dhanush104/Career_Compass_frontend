import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, className = '', hideHeader = false, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {!hideHeader && <Header />}
      
      <main className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hideHeader: PropTypes.bool,
  hideFooter: PropTypes.bool,
};

export default Layout;
