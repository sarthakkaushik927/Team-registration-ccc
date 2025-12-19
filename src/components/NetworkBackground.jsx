import React from 'react';

export const NetworkBackground = () => {
  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Blue Glow at Top */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#00aaff]/10 to-transparent blur-[100px]" />
    </div>
  );
};