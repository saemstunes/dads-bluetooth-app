"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: any) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer outline-none ${
        className || 'bg-gray-900/80 border-white/20 hover:bg-gray-800/90 hover:border-white/40 shadow-lg hover:shadow-xl'
      }`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
}

function DockLabel({ children, className = "", ...rest }: any) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered?.on?.("change", (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe?.();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 px-3 py-1 bg-gray-900/90 text-white text-sm rounded-lg backdrop-blur-md border border-white/20 whitespace-nowrap ${className}`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }: any) {
  return <div className={`flex items-center justify-center text-white/80 ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}: any) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxHeight = useMemo(
    () => Math.max(Number(dockHeight), Number(magnification) + 20),
    [magnification, dockHeight]
  );

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, {
    ...spring,
    damping: 15 // Slightly higher damping to reduce oscillation
  });

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        height,
        minHeight: panelHeight // Ensure minimum height
      }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-end"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          // Only update if we're actually hovering
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            if (pageX >= rect.left && pageX <= rect.right) {
              isHovered.set(1);
              mouseX.set(pageX);
            }
          }
        }}
        onMouseEnter={() => {
          isHovered.set(1);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`flex items-end gap-4 px-4 py-2 rounded-2xl backdrop-blur-md bg-gray-900/80 border border-white/20 shadow-2xl ${className}`}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item: any, index: number) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Example usage component
function DockExample() {
  const items = [
    {
      label: "Home",
      icon: "🏠",
      onClick: () => console.log("Home clicked")
    },
    {
      label: "Search",
      icon: "🔍",
      onClick: () => console.log("Search clicked")
    },
    {
      label: "Messages",
      icon: "💬",
      onClick: () => console.log("Messages clicked")
    },
    {
      label: "Settings",
      icon: "⚙️",
      onClick: () => console.log("Settings clicked")
    },
    {
      label: "Profile",
      icon: "👤",
      onClick: () => console.log("Profile clicked")
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-xl">Hover over the dock at the bottom!</p>
      </div>
      <Dock items={items} />
    </div>
  );
}
