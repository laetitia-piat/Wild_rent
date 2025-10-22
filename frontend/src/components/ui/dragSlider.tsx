import { useEffect, useRef, useState } from "react";

type DragSliderProps = {
  trackColor?: string;
  fillColor?: string;
  knobColor?: string;
  width?: number;
  height?: number;
  onSuccess?: () => void;
  onChange?: (value: boolean) => void;
  message?: string;
};

export function DragSlider({
  trackColor = "#e5e7eb",
  fillColor = "#10b981",
  knobColor = "#ffffff",
  width = 300,
  height = 50,
  onSuccess,
  onChange,
  message = "Glisser pour confirmer",
}: DragSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(0);

  const knobWidth = height;
  const maxPosition = width - knobWidth;
  const successThreshold = 0.95;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    moveKnob(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    moveKnob(e.clientX);
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);

    const percent = position / maxPosition;

    if (percent >= successThreshold) {
      setPosition(maxPosition);
      onSuccess?.();
      onChange?.(true);
    } else {
      setPosition(0);
      onChange?.(false);
    }
  };

  const moveKnob = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const newX = Math.min(Math.max(0, clientX - rect.left), maxPosition);
    setPosition(newX);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, position]);

  const opacity = 1 - position / maxPosition;

  return (
    <div
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      className="relative rounded-full overflow-hidden select-none"
      style={{
        width,
        height,
        backgroundColor: trackColor,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Barre de progression */}
      <div
        className="absolute top-0 left-0 transition-all duration-100"
        style={{
          width: position + knobWidth,
          height,
          backgroundColor: fillColor,
          borderRadius: "9999px",
          zIndex: 0,
        }}
      />

      {/* Label centré */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none transition-opacity duration-200 font-semibold text-sm"
        style={{
          opacity: opacity,
          color: "#444",
          zIndex: 1,
        }}
      >
        {message}
      </div>

      {/* Curseur (knob) */}
      <div
        className="absolute top-0 transition-all duration-100"
        style={{
          left: position,
          width: knobWidth,
          height,
          backgroundColor: knobColor,
          borderRadius: "9999px",
          border: `2px solid ${fillColor}`,
          zIndex: 2,
        }}
      />
    </div>
  );
}
