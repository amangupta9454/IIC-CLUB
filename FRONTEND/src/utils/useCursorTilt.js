import { useRef, useState, useEffect } from 'react';

export function useCursorTilt() {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setRotateY((x - 0.5) * 8);
      setRotateX((y - 0.5) * -8);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, style: { transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` } };
}
