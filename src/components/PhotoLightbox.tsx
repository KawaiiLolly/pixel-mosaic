import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface PhotoLightboxProps {
  src: string;
  onClose: () => void;
}

const PhotoLightbox = ({ src, onClose }: PhotoLightboxProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(5, Math.max(1, s - e.deltaY * 0.002)));
  }, []);

  useEffect(() => {
    if (scale <= 1) setPosition({ x: 0, y: 0 });
  }, [scale]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      posStart.current = { ...position };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: posStart.current.x + (e.clientX - dragStart.current.x),
        y: posStart.current.y + (e.clientY - dragStart.current.y),
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && scale <= 1 && onClose()}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-secondary/80 p-2 text-foreground transition-colors hover:bg-accent"
      >
        <X className="h-6 w-6" />
      </button>

      <img
        src={src}
        alt=""
        className="max-h-[95vh] max-w-[95vw] object-contain transition-transform duration-150"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        draggable={false}
      />
    </div>
  );
};

export default PhotoLightbox;
