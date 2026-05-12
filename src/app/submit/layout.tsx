import React from 'react';

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md -z-10 pointer-events-none" />
      {children}
    </>
  );
}
