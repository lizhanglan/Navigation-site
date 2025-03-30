import { motion } from 'framer-motion';
import { ReactNode, cloneElement, isValidElement, ReactElement } from 'react';

interface WaveWrapperProps {
  children: ReactNode;
  className?: string;
  // Animation parameters
  scale?: number;
  yOffset?: number;
  duration?: number;
  // Whether to play on mount
  playOnMount?: boolean;
  // Whether to play on mouse enter
  playOnHover?: boolean;
  // Transform origin
  transformOrigin?: string;
  // Custom animation timing
  ease?: string;
  // Whether to use GPU acceleration
  useGpu?: boolean;
}

export function WaveWrapper({
  children,
  className = "",
  scale = 1.2,
  yOffset = -8,
  duration = 800,
  playOnMount = true,
  playOnHover = true,
  transformOrigin = 'center',
  ease = "easeInOut",
  useGpu = true
}: WaveWrapperProps) {
  // If children is a valid React element, clone it to preserve its props
  if (isValidElement(children)) {
    const childElement = children as ReactElement<{ className?: string }>;
    const childClassName = childElement.props.className || '';
    const combinedClassName = `${childClassName} ${className}`.trim();

    return (
      <motion.div
        initial={{ scale: 1, y: 0 }}
        animate={playOnMount ? {
          scale: [1, scale, 1],
          y: [0, yOffset, 0],
        } : undefined}
        transition={{
          duration: duration / 1000,
          ease,
          times: [0, 0.5, 1]
        }}
        onMouseEnter={playOnHover ? (e) => {
          const target = e.currentTarget;
          target.style.animation = 'none';
          target.offsetHeight; // Trigger reflow
          target.style.animation = '';
          target.animate([
            { transform: 'scale(1) translateY(0)' },
            { transform: `scale(${scale}) translateY(${yOffset}px)` },
            { transform: 'scale(1) translateY(0)' }
          ], {
            duration,
            easing: ease
          });
        } : undefined}
        className={`inline-block ${useGpu ? 'transform-gpu' : ''}`}
        style={{ 
          transformOrigin,
          willChange: useGpu ? 'transform' : 'auto'
        }}
      >
        {cloneElement(childElement, {
          className: combinedClassName
        } as { className: string })}
      </motion.div>
    );
  }

  // If children is not a valid React element, wrap it in a div
  return (
    <motion.div
      initial={{ scale: 1, y: 0 }}
      animate={playOnMount ? {
        scale: [1, scale, 1],
        y: [0, yOffset, 0],
      } : undefined}
      transition={{
        duration: duration / 1000,
        ease,
        times: [0, 0.5, 1]
      }}
      onMouseEnter={playOnHover ? (e) => {
        const target = e.currentTarget;
        target.style.animation = 'none';
        target.offsetHeight; // Trigger reflow
        target.style.animation = '';
        target.animate([
          { transform: 'scale(1) translateY(0)' },
          { transform: `scale(${scale}) translateY(${yOffset}px)` },
          { transform: 'scale(1) translateY(0)' }
        ], {
          duration,
          easing: ease
        });
      } : undefined}
      className={`inline-block ${className} ${useGpu ? 'transform-gpu' : ''}`}
      style={{ 
        transformOrigin,
        willChange: useGpu ? 'transform' : 'auto'
      }}
    >
      {children}
    </motion.div>
  );
} 