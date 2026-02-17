import { useRef } from "react";

function GlowCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="
        relative overflow-hidden rounded-2xl
        border border-gray-200/40 dark:border-gray-700/40
        bg-white/70 dark:bg-gray-800/70
        backdrop-blur-xl
        shadow-md
        transition-all duration-500
        hover:shadow-2xl hover:-translate-y-2
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 hover:opacity-100
          transition duration-300
          [background:radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(163,22,46,0.15),transparent_60%)]
        "
      />
      {children}
    </div>
  );
}

export default GlowCard;
