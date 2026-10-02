import React from 'react';
import LoginModal from '@/components/LoginModal';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <LoginModal />
    </>
  );
};

export default layout;
