import { useRef } from "react";
import { useMediaQuery } from "./use-media-query";

interface TiltOptions {
  maxTiltDegree?: number;
  scale?: number;
  perspective?: number;
  transitionZ?: number;
}

export function useCardTilt(options: TiltOptions = {}) {
  const {
    maxTiltDegree = 10,
    scale = 1.01,
    perspective = 1000,
    transitionZ = 20,
  } = options;

  const cardRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(hover: hover)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = ((mouseY - height / 2) / height) * -maxTiltDegree;
    const rotateY = ((mouseX - width / 2) / width) * maxTiltDegree;

    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(${perspective}px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale3d(${scale}, ${scale}, ${scale})
          translateZ(${transitionZ}px)
        `;
      }
    });
  };

  const handleMouseLeave = () => {
    if (!isDesktop || !cardRef.current) return;
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(${perspective}px) 
          rotateX(0deg) 
          rotateY(0deg) 
          scale3d(1, 1, 1) 
          translateZ(0)
        `;
        cardRef.current.style.transition =
          "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      }
    });
  };

  const handleMouseEnter = () => {
    if (!isDesktop || !cardRef.current) return;
    cardRef.current.style.transition = "transform 0.2s ease-out";
  };

  return {
    cardRef,
    tiltProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onMouseEnter: handleMouseEnter,
      style: {
        transformStyle: "preserve-3d" as const,
        willChange: "transform",
      },
    },
  };
}
