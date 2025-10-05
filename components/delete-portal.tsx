// components/Portal.js
'use client'
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const portalElement = document.querySelector('#modal');

  if (!portalElement) {
    console.error(`Portal target element with selector "modal" not found.`);
    return null;
  }

  return createPortal(children, portalElement);
};

export default Portal;