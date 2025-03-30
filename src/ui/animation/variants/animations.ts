import type { Variants } from 'framer-motion';

// Hero section animations
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

export const heroTitleVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30,
    scale: 0.5,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
};

export const heroDescriptionVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    }
  }
};

// Background pattern animation
export const backgroundPatternVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    opacity: 0.1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    }
  }
};

// Icon animations
export const floatingIconVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    scale: 0.5,
    y: 20,
    rotate: -30,
  }),
  visible: (i: number) => ({
    opacity: [0, 0.2, 0.1],
    scale: [0.5, 1.2, 1],
    y: [20, -10, 0],
    rotate: [-30, 10, 0],
    transition: {
      duration: 2,
      delay: i * 0.2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeOut",
    }
  })
};

// Grid animations
export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

export const gridItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
};

// Header animations
export const headerVariants: Variants = {
  top: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(0px)",
    boxShadow: "none",
    borderBottomColor: "rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  scrolled: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Card hover animations
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    }
  },
};

// Layout animation for shared elements
export const sharedLayoutTransition = {
  type: "spring",
  stiffness: 350,
  damping: 25,
  mass: 1,
  duration: 0.35,
};

// Common transitions
export const springTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

export const easeTransition = {
  type: "ease",
  duration: 0.5,
};

export const springTransitionProps = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// Text hover animations for home page
export const textCharacterVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: (i: number) => ({
    scale: [1, 1.15, 1.05],
    y: [0, -8, -4],
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 12,
      mass: 0.2,
      delay: i * 0.025,
      duration: 0.4,
      times: [0, 0.4, 1],
    }
  }),
};

// Text container animations for home page
export const textContainerVariants: Variants = {
  initial: {
    opacity: 1,
  },
  hover: {
    opacity: 1,
    transition: {
      staggerChildren: 0.015,
    }
  },
};