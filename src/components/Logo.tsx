
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-10 w-10 bg-guardian rounded-full flex items-center justify-center">
        <div className="h-6 w-6 bg-white/90 rounded-full" />
      </div>
      <img 
        src="/logo.png" 
        alt="Ange Gardien Live" 
        className="h-8 md:h-10" 
      />
    </Link>
  );
};

export default Logo;
