import React, { ReactNode } from "react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button
          className="lightbox-close xl:text-lg lg:text-lg md:text-lg sm:text-md xs:text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
