import React from 'react';
import { motion } from 'motion/react';

interface MeshBackgroundProps {
  intensity?: string;
}

const MeshBackground: React.FC<MeshBackgroundProps> = ({ intensity = 'opacity-50' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${intensity} select-none`}>
      {/* Top Left: Mint Green to Light Blue */}
      <motion.div 
        animate={{ 
          x: [0, 50, -30, 0], 
          y: [0, -30, 40, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] bg-emerald-100/40 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 60, 0], 
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[5%] w-[60%] h-[50%] bg-sky-100/30 rounded-full blur-[100px]"
      />
      
      {/* Top Right to Bottom Right: Cream Yellow to Light Orange */}
      <motion.div 
        animate={{ 
          x: [0, 30, -40, 0], 
          y: [0, 60, -30, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-5%] right-[-5%] w-[55%] h-[55%] bg-amber-50/50 rounded-full blur-[110px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 30, 0], 
          y: [0, -30, 50, 0],
          scale: [1, 1.1, 0.8, 1]
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-orange-50/40 rounded-full blur-[130px]"
      />

      {/* Top Center: Bright Gray / White */}
      <div className="absolute top-[-10%] left-[30%] w-[40%] h-[30%] bg-slate-100/30 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] bg-white/30 blur-[150px] opacity-60 rounded-full" />
    </div>
  );
};

export default MeshBackground;
