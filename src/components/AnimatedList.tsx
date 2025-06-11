
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedListProps {
  items: string[];
  onItemSelect: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
}

const AnimatedList: React.FC<AnimatedListProps> = ({ 
  items, 
  onItemSelect,
  showGradients = false,
  enableArrowNavigation = false,
  displayScrollbar = false 
}) => {
  return (
    <div className={`max-h-96 overflow-y-auto space-y-2 ${displayScrollbar ? '' : 'scrollbar-hide'}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onItemSelect(item, index)}
          className="p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
        >
          <span className="text-white/90">{item}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedList;
