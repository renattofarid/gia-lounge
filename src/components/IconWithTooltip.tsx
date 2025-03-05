"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface IconWithTooltipProps {
  icon?: LucideIcon; // Icono opcional
  label: string;
  children?: ReactNode; // Para personalización
}

export function IconWithTooltip({
  icon: Icon,
  label,
  children,
}: IconWithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <span className="flex items-center justify-center w-full h-full">
            {Icon ? <Icon className="w-5 h-5" /> : children}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
