declare module 'next/navigation' {
  export const useRouter: () => {
    push: (url: string) => void;
    replace: (url: string) => void;
    refresh: () => void;
    back: () => void;
  };
}

declare module 'next/image' {
  const Image: React.FC<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }>;
  export default Image;
} 