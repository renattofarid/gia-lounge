"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DynamicAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export function DynamicAvatar({
  image,
  name,
  className = "",
}: DynamicAvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    const updateGradient = () => {
      const rect = avatar.getBoundingClientRect();
      const size = rect.width;
      const angle = size % 360;
      avatar.style.setProperty(
        "--gradient-background",
        `linear-gradient(${angle}deg, #EFEAFE, #C4B5FD, #9A7FFF, #DA79C0)`
      );
    };

    // Initial update
    updateGradient();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateGradient);
    resizeObserver.observe(avatar);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={avatarRef}
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--gradient-background)",
        transition: "all 0.3s ease",
      }}
    >
      <Avatar className={`w-full h-full ${className}`}>
        <AvatarImage
          src={image}
          alt={name}
          className="w-full h-full object-cove rounded-fullr"
        />
        <AvatarFallback
          className="w-full h-full flex items-center justify-center text-white font-semibold"
          style={{
            background: "transparent",
          }}
        ></AvatarFallback>
      </Avatar>
    </div>
  );
}
