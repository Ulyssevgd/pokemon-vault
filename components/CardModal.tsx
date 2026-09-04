"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Card = {
  id: string;
  name: string;
  set: string;
  number: string;
  image: string;
};

export default function CardModal({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
  );
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // trigger the entrance animation on next frame
    const id = requestAnimationFrame(() => setEntered(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    const rotateY = (px - 0.5) * 26; // left/right tilt
    const rotateX = (0.5 - py) * 26; // up/down tilt

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    );
    setGlare({ x: px * 100, y: py * 100, opacity: 0.35 });
  }

  function handleMouseLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlare((g) => ({ ...g, opacity: 0 }));
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={`flex flex-col items-center gap-4 transition-all duration-300 ${
          entered ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-[70vh] max-h-[640px] w-auto cursor-grab select-none [aspect-ratio:5/7] rounded-2xl transition-transform duration-150 ease-out will-change-transform active:cursor-grabbing"
          style={{ transform }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 90vw, 500px"
              className="object-contain"
              unoptimized
              priority
            />
            {/* holographic glare that follows the cursor */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-150"
              style={{
                opacity: glare.opacity,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.9), transparent 45%)`,
                mixBlendMode: "overlay",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-150"
              style={{
                opacity: glare.opacity * 0.6,
                background: `linear-gradient(115deg, transparent 20%, rgba(120,200,255,0.5) 40%, rgba(255,120,220,0.5) 50%, rgba(255,230,120,0.5) 60%, transparent 80%)`,
                backgroundPosition: `${glare.x}% ${glare.y}%`,
                backgroundSize: "250% 250%",
                mixBlendMode: "color-dodge",
              }}
            />
          </div>
        </div>

        <div className="text-center text-white">
          <div className="text-lg font-semibold">{card.name}</div>
          <div className="text-sm text-white/50">
            {card.set} · #{card.number}
          </div>
        </div>
      </div>
    </div>
  );
}
