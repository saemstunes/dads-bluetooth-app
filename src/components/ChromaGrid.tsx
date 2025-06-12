
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChromaGridItem {
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  url: string;
}

interface ChromaGridProps {
  items: ChromaGridItem[];
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

const ChromaGrid: React.FC<ChromaGridProps> = ({ 
  items,
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out"
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-full">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative overflow-hidden rounded-2xl aspect-square">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              style={{ background: item.gradient }}
            />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm opacity-90">{item.subtitle}</p>
              <p className="text-xs opacity-70 mt-1">{item.handle}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChromaGrid;
