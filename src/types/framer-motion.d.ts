
declare module "framer-motion" {
  export const motion: {
    [key: string]: any;
  };
  export type Variants = {
    [key: string]: any;
  };
  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: Variants;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileInView?: any;
    viewport?: any;
  }
}
