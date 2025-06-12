
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

import "./Dock.css";

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
      width: Number(baseItemSize),
    };
    return val - rect.x - Number(baseItemSize) / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-Number(distance), 0, Number(distance)],
    [Number(baseItemSize), Number(magnification), Number(baseItemSize)]
  );
  
  // Smoother spring configuration to reduce jitter
  const smoothSpring = { mass: 0.1, stiffness: 200, damping: 20 };
  const size = useSpring(targetSize, smoothSpring);

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
      className={`dock-item ${className}`}
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
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }: any) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 180, damping: 18 },
  magnification = 70,
  distance = 150,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}: any) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(Number(dockHeight), Number(magnification) + Number(magnification) / 2 + 4),
    [magnification, dockHeight]
  );
  
  const heightRow = useTransform(isHovered, [0, 1], [Number(panelHeight), maxHeight]);
  
  // Smoother height animation
  const height = useSpring(heightRow, { mass: 0.1, stiffness: 150, damping: 20 });

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="dock-outer"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: Number(panelHeight) }}
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
