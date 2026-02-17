import { useRef } from "react";
import { Card } from "@/components/ui/card";

function SpotlightBorderCard({ children }: { children: React.ReactNode }) {
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
      className="relative rounded-2xl group"
    >
      {/* Spotlight Border Layer */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100 transition duration-300
          p-px
          [background:radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.9),transparent_70%)]
          [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
          mask-exclude
        "
      />

      {/* Real Card */}
      <Card
        className="
          relative rounded-2xl
          border border-gray-200/50 dark:border-gray-700/50
          bg-white/60 dark:bg-gray-800/60
          backdrop-blur-xl
          shadow-md
          transition-all duration-500
          hover:shadow-2xl
        "
      >
        {children}
      </Card>
    </div>
  );
}

export default SpotlightBorderCard;
