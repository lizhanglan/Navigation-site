import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface WaveTextProps {
  children: ReactNode;
  className?: string;
  // Animation parameters
  scale?: number;
  yOffset?: number;
  duration?: number;
  charDelay?: number;
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
  // Text specific options
  gap?: string;
  hoverColor?: string;
}

const convertEase = (ease: string): string => {
  // Convert Framer Motion ease to Web Animations API format
  switch (ease) {
    case 'easeInOut':
      return 'ease-in-out';
    case 'easeOut':
      return 'ease-out';
    case 'easeIn':
      return 'ease-in';
    case 'linear':
      return 'linear';
    default:
      return 'ease-in-out'; // fallback
  }
};

export function WaveText({
  children,
  className = "",
  scale = 1.2,
  yOffset = -8,
  duration = 800,
  charDelay = 0.08,
  playOnMount = true,
  playOnHover = true,
  transformOrigin = 'bottom',
  ease = "easeInOut",
  useGpu = true,
  gap = "0.25rem",
  hoverColor
}: WaveTextProps) {
  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`inline-flex flex-wrap items-center ${gap ? `gap-x-[${gap}]` : ''}`}>
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ scale: 1, y: 0 }}
          animate={playOnMount ? {
            scale: [1, scale, 1],
            y: [0, yOffset, 0],
          } : undefined}
          transition={{
            duration: duration / 1000,
            delay: index * charDelay,
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
              easing: convertEase(ease)
            });
          } : undefined}
          className={`
            inline-block relative cursor-pointer select-none
            ${useGpu ? 'transform-gpu' : ''}
            ${className}
            ${hoverColor ? `hover:text-${hoverColor}` : ''}
          `.trim()}
          style={{ 
            transformOrigin,
            willChange: useGpu ? 'transform' : 'auto'
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
} 